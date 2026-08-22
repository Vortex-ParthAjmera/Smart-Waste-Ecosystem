// POST /api/v1/device/sync
// Edge sends one durable device message per request.
// Cloud validates, persists event/sensors/ML, runs rules, awards points or opens review.

import { verifyGatewayAuth } from '@/lib/auth/gateway';
import { getDeviceByCode } from '@/lib/supabase/devices';
import { getActiveSessionForDevice } from '@/lib/supabase/disposal';
import {
  createDisposalEvent,
  createSensorReadings,
  createMlDetection,
} from '@/lib/supabase/disposal';
import {
  claimIngestMessage,
  getIngestMessage,
  completeIngestMessage,
  getPublishedRuleset,
} from '@/lib/supabase/ingest';
import { createSegregationResult } from '@/lib/supabase/reviews';
import { createReviewCase } from '@/lib/supabase/reviews';
import { createPointTransaction, hasAwardForEvent } from '@/lib/supabase/points';
import { auditLog } from '@/lib/domain/audit';
import { claimKey, completeKey, hashBody } from '@/lib/domain/idempotency';
import { evaluate, RULESET_VERSION } from '@sgv/rules-engine';
import type { EvaluationInput } from '@sgv/rules-engine';
import { DeviceSyncSchema } from '@/lib/validation/requests';
import {
  generateRequestId,
  successResponse,
  validationError,
  conflictError,
  errorResponse,
} from '@/lib/validation/responses';

export async function POST(request: Request): Promise<Response> {
  const requestId = generateRequestId();
  try {
    // 1. Gateway HMAC auth
    const gateway = await verifyGatewayAuth(request);

    // 2. Validate body
    const body = await request.json();
    const parsed = DeviceSyncSchema.safeParse(body);
    if (!parsed.success) {
      return validationError(parsed.error.flatten().fieldErrors, requestId);
    }
    const input = parsed.data;
    const deviceMsg = input.deviceMessage;

    // 3. Resolve device
    const device = await getDeviceByCode(deviceMsg.deviceCode);
    if (!device) {
      return errorResponse(404, 'DEVICE_NOT_FOUND', 'Device not registered.', undefined, false, requestId);
    }

    // 4. Check existing ingest message (exact replay or conflict)
    const existing = await getIngestMessage(deviceMsg.messageId);
    if (existing) {
      if (existing.processing_status === 'PROCESSED' && existing.result_json) {
        return successResponse(
          { ...existing.result_json as object, duplicate: true },
          requestId,
        );
      }
      // In-progress or rejected — return conflict with Retry-After
      return conflictError('Request is being processed.', true, requestId);
    }

    // 5. Check gateway idempotency key
    const idempotencyKey = request.headers.get('idempotency-key');
    if (idempotencyKey) {
      const requestHash = await hashBody(body);
      const idResult = await claimKey('device:sync', device.id, idempotencyKey, requestHash);
      if (idResult.status === 'replayed') return idResult.response;
      if (idResult.status === 'conflict') return idResult.response;
    }

    // 6. Claim ingest message (atomic — prevents duplicate processing)
    let ingestMsg;
    try {
      ingestMsg = await claimIngestMessage({
        messageId: deviceMsg.messageId,
        gatewayId: gateway.gatewayId,
        deviceId: device.id,
        schemaVersion: deviceMsg.schemaVersion,
        messageType: deviceMsg.messageType,
        bootId: deviceMsg.bootId,
        sequenceNo: deviceMsg.sequence,
        payloadHash: await hashBody(deviceMsg),
        occurredAt: deviceMsg.occurredAt,
      });
    } catch {
      // Unique constraint violation — concurrent claim
      return conflictError('Request is being processed.', true, requestId);
    }

    // 7. Find active session and resolve citizen
    const session = await getActiveSessionForDevice(deviceMsg.deviceCode);
    const citizenId = session?.citizen_id ?? device.id; // fallback to device ID for orphaned messages
    const sessionId = session?.id ?? null;

    // 8. Extract sensor data from payload
    const payload = deviceMsg.payload as Record<string, unknown>;
    const measurements = (payload.measurements ?? []) as Array<Record<string, unknown>>;
    const trigger = (payload.trigger ?? {}) as Record<string, unknown>;
    const location = (payload.location ?? {}) as Record<string, unknown>;

    // 9. Create disposal event
    const event = await createDisposalEvent({
      eventId: payload.eventId as string,
      sourceMessageId: deviceMsg.messageId,
      sessionId: sessionId ?? undefined,
      citizenId,
      deviceId: device.id,
      eventSource: (payload.eventSource as string) || 'HARDWARE',
      selectedCompartment: (payload.selectedCompartment as string) || 'DRY',
      processingState: input.edgeProcessing.processingState,
      decisionState: 'CAPTURED',
      latitude: location.latitude as number | undefined,
      longitude: location.longitude as number | undefined,
      locationQuality: (location.fixQuality as string) || 'NO_FIX',
      occurredAt: deviceMsg.occurredAt,
      edgeReceivedAt: input.edgeReceivedAt,
    });

    // 10. Persist sensor readings
    const sensorReadings = measurements.map((m) => ({
      eventId: event.id,
      componentCode: (m.componentCode as string) || 'unknown',
      sensorCode: m.code as string,
      numericValue: m.value as number | undefined,
      booleanValue: m.code === 'IR_TRIGGERED' ? (m.value as boolean) : undefined,
      unit: (m.unit as string) || 'PERCENT',
      quality: (m.quality as string) || 'GOOD',
      calibrationVersion: m.calibrationVersion as string | undefined,
      capturedAt: m.capturedAt as string | undefined,
    }));
    await createSensorReadings(sensorReadings);

    // 11. Persist ML detection (if provided)
    const mlDetectionInput = input.edgeProcessing.mlDetection ?? null;
    if (mlDetectionInput) {
      await createMlDetection({
        eventId: event.id,
        evidenceSource: mlDetectionInput.evidenceSource,
        status: mlDetectionInput.status,
        modelFamily: mlDetectionInput.modelFamily,
        modelVersion: mlDetectionInput.modelVersion,
        weightsSha256: mlDetectionInput.weightsSha256,
        classMapVersion: mlDetectionInput.classMapVersion,
        detectedLabel: mlDetectionInput.detectedLabel ?? undefined,
        friendlyLabel: mlDetectionInput.friendlyLabel ?? undefined,
        predictedCategory: mlDetectionInput.predictedCategory ?? undefined,
        score: mlDetectionInput.score ?? undefined,
        confidenceBand: mlDetectionInput.confidenceBand ?? undefined,
        inferenceMs: mlDetectionInput.inferenceMs ?? undefined,
        observedAt: mlDetectionInput.observedAt,
      });
    }

    // 12. Run rules engine
    const ruleset = await getPublishedRuleset();
    const rulesInput = buildRulesInput(
      (payload.selectedCompartment as string) || 'DRY',
      trigger,
      mlDetectionInput as { status: string; predictedCategory?: string | null; score?: number | null; evidenceSource: string } | null,
      measurements,
    );
    const result = evaluate(rulesInput);

    // 13. Persist segregation result
    await createSegregationResult({
      eventId: event.id,
      rulesetId: ruleset?.id ?? '00000000-0000-0000-0000-000000000000',
      outcome: result.outcome,
      suggestedSeverity: result.immediatePoints < 0 ? 'NORMAL' : 'NONE',
      reasonCodes: result.reasons,
      inputHash: await hashBody(rulesInput),
    });

    // 14. Points or review
    if (result.outcome === 'ACCEPTED' && result.immediatePoints > 0) {
      const alreadyAwarded = await hasAwardForEvent(event.id);
      if (!alreadyAwarded) {
        await createPointTransaction({
          citizenId,
          eventId: event.id,
          entryKind: 'AWARD',
          pointsDelta: result.immediatePoints,
          reasonCode: 'SUPPORTED_MATCH',
          idempotencyKey: crypto.randomUUID(),
        });
      }
    } else if (result.outcome === 'FLAGGED') {
      await createReviewCase({
        eventId: event.id,
        reasonCodes: result.reasons,
        suggestedSeverity: 'NONE',
      });
    }

    // 15. Update event state
    const { updateEventState } = await import('@/lib/supabase/disposal');
    await updateEventState(
      event.id,
      'SEGREGATION_DECIDED',
      result.outcome,
    );

    // 16. Build response
    const responseData = {
      messageId: deviceMsg.messageId,
      processingStatus: 'PROCESSED',
      duplicate: false,
      result: {
        eventId: event.id,
        processingState: 'SEGREGATION_DECIDED',
        decisionState: result.outcome,
        pointsDelta: result.outcome === 'ACCEPTED' ? result.immediatePoints : 0,
        verificationCaseId: null,
        rulesetVersion: RULESET_VERSION,
        reasonCodes: result.reasons,
      },
    };

    // 17. Complete ingest message
    await completeIngestMessage(
      deviceMsg.messageId,
      'PROCESSED',
      result.outcome,
      responseData as unknown as Record<string, unknown>,
    );

    // 18. Audit
    await auditLog({
      action: 'DEVICE_SYNC_PROCESSED',
      resourceType: 'disposal_event',
      resourceId: event.id,
      requestId,
      details: {
        messageId: deviceMsg.messageId,
        outcome: result.outcome,
        pointsDelta: result.outcome === 'ACCEPTED' ? result.immediatePoints : 0,
      },
    });

    // 19. Complete idempotency
    if (idempotencyKey) {
      await completeKey('device:sync', device.id, idempotencyKey, 200, responseData);
    }

    return successResponse(responseData, requestId);
  } catch (err) {
    if (err instanceof Response) return err;
    return errorResponse(500, 'INTERNAL_ERROR', 'An unexpected error occurred.', undefined, false, requestId);
  }
}

/**
 * Build rules engine input from device payload + ML detection.
 */
function buildRulesInput(
  compartment: string,
  trigger: Record<string, unknown>,
  mlDetection: {
    status: string;
    predictedCategory?: string | null;
    score?: number | null;
    evidenceSource: string;
  } | null,
  measurements: Array<Record<string, unknown>>,
): EvaluationInput {
  // Extract moisture for DRY compartment
  const moistureReading = measurements.find(
    (m) => m.code === 'MOISTURE_DRY_PERCENT',
  );

  return {
    selectedCompartment: compartment as 'WET' | 'DRY',
    irTriggered: (trigger.triggered as boolean) ?? false,
    irQuality: ((trigger.quality as string) ?? 'MISSING') as EvaluationInput['irQuality'],
    mlStatus: mapMlStatus(mlDetection),
    mlCategory: (mlDetection?.predictedCategory as EvaluationInput['mlCategory']) ?? 'UNKNOWN',
    mlScore: mlDetection?.score ?? 0,
    dryMoisturePercent: moistureReading?.value as number | undefined,
    dryMoistureQuality: (moistureReading?.quality as EvaluationInput['dryMoistureQuality']) ?? undefined,
    eventSource: 'HARDWARE',
    evidenceSource: (mlDetection?.evidenceSource as EvaluationInput['evidenceSource']) ?? 'LOCAL_LIVE',
  };
}

/**
 * Map cloud ML detection status to rules engine mlStatus.
 */
function mapMlStatus(ml: {
  status: string;
  score?: number | null;
} | null): EvaluationInput['mlStatus'] {
  if (!ml) return 'MODEL_UNAVAILABLE';
  switch (ml.status) {
    case 'DETECTED':
      return (ml.score ?? 0) >= 0.60 ? 'SUPPORTED_MATCH' : 'LOW_CONFIDENCE';
    case 'NO_DETECTION':
      return 'NO_DETECTION';
    case 'MULTIPLE_CONFLICTING':
      return 'MULTIPLE_DETECTIONS';
    case 'UNAVAILABLE':
      return 'MODEL_UNAVAILABLE';
    case 'TIMED_OUT':
      return 'TIMEOUT';
    case 'FAILED':
      return 'INFERENCE_ERROR';
    default:
      return 'MODEL_UNAVAILABLE';
  }
}
