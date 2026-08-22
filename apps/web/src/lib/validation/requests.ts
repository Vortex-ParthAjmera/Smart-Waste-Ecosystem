// Remaining Zod request schemas for cloud API endpoints.
// These validate incoming request bodies at the boundary.

import { z } from 'zod';
import { CompartmentSchema, ReviewOutcomeSchema } from './schemas';

// ── Device Sync (Section 14 of API contract) ──
const MeasurementSchema = z.object({
  componentCode: z.string(),
  code: z.enum(['FILL_WET_PERCENT', 'FILL_DRY_PERCENT', 'MOISTURE_DRY_PERCENT']),
  value: z.number().min(0).max(100),
  unit: z.literal('PERCENT'),
  quality: z.enum(['GOOD', 'DEGRADED', 'MISSING', 'FAILED', 'OUT_OF_RANGE', 'NOT_APPLICABLE']),
  capturedAt: z.string().datetime(),
  calibrationVersion: z.string().optional(),
});

const LocationSchema = z.object({
  fixQuality: z.enum(['GPS_2D', 'GPS_3D', 'NO_FIX', 'SIMULATED']),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  accuracyM: z.number().min(0).optional(),
}).refine(
  (loc) => {
    if (loc.fixQuality === 'GPS_2D' || loc.fixQuality === 'GPS_3D') {
      return loc.latitude !== undefined && loc.longitude !== undefined;
    }
    return true;
  },
  { message: 'GPS coordinates required for GPS_2D/GPS_3D fix quality' },
);

const DeviceMessageEnvelopeSchema = z.object({
  schemaVersion: z.literal('1.1'),
  messageId: z.string().uuid(),
  messageType: z.enum(['DISPOSAL_EVENT_V1', 'HEARTBEAT_V1', 'TELEMETRY_V1']),
  deviceCode: z.string(),
  bootId: z.string().uuid(),
  sequence: z.number().int().min(0),
  occurredAt: z.string().datetime(),
  timeQuality: z.enum(['GPS', 'DEVICE_SYNCED', 'EDGE_ASSIGNED', 'UNKNOWN']),
  firmwareVersion: z.string(),
  payload: z.record(z.unknown()),
  extensions: z.record(z.unknown()).default({}),
});

const MlDetectionSchema = z.object({
  detectionId: z.string().uuid(),
  evidenceSource: z.enum(['LOCAL_LIVE', 'RECORDED_ML', 'SIMULATED', 'SEEDED']),
  status: z.enum(['DETECTED', 'NO_DETECTION', 'MULTIPLE_CONFLICTING', 'UNAVAILABLE', 'TIMED_OUT', 'FAILED']),
  modelFamily: z.string(),
  modelVersion: z.string(),
  weightsSha256: z.string().regex(/^[0-9a-f]{64}$/),
  classMapVersion: z.string(),
  detectedLabel: z.string().nullable().optional(),
  friendlyLabel: z.string().nullable().optional(),
  predictedCategory: z.enum(['WET', 'DRY', 'UNKNOWN']).nullable().optional(),
  score: z.number().min(0).max(1).nullable().optional(),
  confidenceBand: z.enum(['LOW', 'MEDIUM', 'HIGH']).nullable().optional(),
  inferenceMs: z.number().int().min(0).max(600000).nullable().optional(),
  observedAt: z.string().datetime(),
});

export const DeviceSyncSchema = z.object({
  schemaVersion: z.literal('1.1'),
  gatewayCode: z.string(),
  edgeReceivedAt: z.string().datetime(),
  lanPayloadHash: z.string().regex(/^[0-9a-f]{64}$/),
  edgeProcessing: z.object({
    processingState: z.enum([
      'DISPOSAL_STARTED', 'SENSOR_CAPTURED', 'ML_PENDING', 'ML_RECEIVED',
      'ML_UNAVAILABLE', 'PROCESSING', 'SEGREGATION_DECIDED', 'POINTS_CALCULATED',
      'REVIEW_REQUIRED', 'COMPLETED', 'PROCESSING_FAILED',
    ]),
    capture: z.object({
      sourceKind: z.string(),
      inputSha256: z.string().regex(/^[0-9a-f]{64}$/).nullable().optional(),
      capturedAt: z.string().datetime(),
    }).optional(),
    mlDetection: MlDetectionSchema.nullable().optional(),
  }),
  deviceMessage: DeviceMessageEnvelopeSchema,
});
export type DeviceSyncInput = z.infer<typeof DeviceSyncSchema>;

// ── Device Session Claim (Section 13) ──
export const SessionClaimSchema = z.object({
  schemaVersion: z.literal('1.1'),
  deviceCode: z.string(),
});
export type SessionClaimInput = z.infer<typeof SessionClaimSchema>;

// ── Municipal Disposal Session Create ──
export const DisposalSessionCreateSchema = z.object({
  qrToken: z.string().min(1),
  deviceCode: z.string(),
  selectedCompartment: CompartmentSchema,
});
export type DisposalSessionCreateInput = z.infer<typeof DisposalSessionCreateSchema>;

// ── Review Decision (Section 17) ──
export const ReviewDecisionRequestSchema = z.discriminatedUnion('decision', [
  z.object({
    decision: z.literal('REVIEW_ACCEPTED'),
    reasonCode: z.string().min(1).max(100),
    notes: z.string().max(500).optional(),
  }),
  z.object({
    decision: z.literal('REVIEW_NO_ACTION'),
    reasonCode: z.string().min(1).max(100),
    notes: z.string().max(500).optional(),
  }),
  z.object({
    decision: z.literal('VERIFIED_VIOLATION'),
    violationSeverity: z.enum(['NORMAL', 'SEVERE']),
    reasonCode: z.string().min(1).max(100),
    notes: z.string().max(500).optional(),
  }),
]);
export type ReviewDecisionRequest = z.infer<typeof ReviewDecisionRequestSchema>;

// ── Dispute Create ──
export const DisputeCreateSchema = z.object({
  negativeTransactionId: z.string().uuid(),
  reason: z.string().min(10).max(1000),
});
export type DisputeCreateInput = z.infer<typeof DisputeCreateSchema>;

// ── Dispute Decision (Municipal) ──
export const DisputeDecisionSchema = z.object({
  decision: z.enum(['UPHELD', 'REVERSED']),
  reason: z.string().min(10).max(1000),
});
export type DisputeDecisionInput = z.infer<typeof DisputeDecisionSchema>;

// ── Simulation ──
export const SimulationCreateSchema = z.object({
  fixtureId: z.string(),
});
export type SimulationCreateInput = z.infer<typeof SimulationCreateSchema>;

// ── QR Token Issue ──
export const QrTokenIssueSchema = z.object({
  compartment: CompartmentSchema,
});

// ── Cursor Pagination Params ──
export const PaginationParamsSchema = z.object({
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});
export type PaginationParams = z.infer<typeof PaginationParamsSchema>;

// ── HMAC signature headers ──
export const GatewayHmacHeadersSchema = z.object({
  'x-sgv-gateway-id': z.string(),
  'x-sgv-timestamp': z.string(),
  'x-sgv-nonce': z.string().uuid(),
  'x-sgv-signature': z.string().regex(/^[0-9a-f]{64}$/),
  'idempotency-key': z.string().uuid().optional(),
});
