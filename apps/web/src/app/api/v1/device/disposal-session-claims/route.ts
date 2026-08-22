// POST /api/v1/device/disposal-session-claims
// Edge gateway claims the next pending disposal session for a device.
// Returns 201 with session details, 204 if none pending, or replays exact idempotent result.

import { verifyGatewayAuth } from '@/lib/auth/gateway';
import { getDeviceByCode } from '@/lib/supabase/devices';
import { getActiveSessionForDevice, claimSession } from '@/lib/supabase/disposal';
import { claimKey, completeKey, hashBody } from '@/lib/domain/idempotency';
import { auditLog } from '@/lib/domain/audit';
import { SessionClaimSchema } from '@/lib/validation/requests';
import {
  generateRequestId,
  createdResponse,
  noContentResponse,
  validationError,
  errorResponse,
} from '@/lib/validation/responses';

export async function POST(request: Request): Promise<Response> {
  const requestId = generateRequestId();
  try {
    // 1. Gateway HMAC authentication
    const gateway = await verifyGatewayAuth(request);

    // 2. Validate request body
    const body = await request.json();
    const parsed = SessionClaimSchema.safeParse(body);
    if (!parsed.success) {
      return validationError(parsed.error.flatten().fieldErrors, requestId);
    }
    const { deviceCode } = parsed.data;

    // 3. Resolve device
    const device = await getDeviceByCode(deviceCode);
    if (!device) {
      return errorResponse(404, 'DEVICE_NOT_FOUND', 'Device not registered.', undefined, false, requestId);
    }

    // 4. Idempotency claim (key from header, or generate from deviceCode+timestamp)
    const idempotencyKey = request.headers.get('idempotency-key');
    if (idempotencyKey) {
      const requestHash = await hashBody(body);
      const result = await claimKey('device:session-claim', device.id, idempotencyKey, requestHash);
      if (result.status === 'replayed') return result.response;
      if (result.status === 'conflict') return result.response;
    }

    // 5. Find and claim the next active session for this device
    const session = await getActiveSessionForDevice(deviceCode);
    if (!session) {
      return noContentResponse();
    }

    const claimed = await claimSession(session.id, gateway.gatewayCode);
    if (!claimed) {
      // Another gateway claimed it — treat as no pending session
      return noContentResponse();
    }

    // 6. Audit
    await auditLog({
      action: 'SESSION_CLAIMED',
      resourceType: 'disposal_session',
      resourceId: session.id,
      requestId,
      details: { deviceCode, gatewayCode: gateway.gatewayCode },
    });

    // 7. Return claimed session
    const responseData = {
      sessionId: claimed.id,
      eventId: claimed.event_id,
      selectedCompartment: claimed.selected_compartment,
      expiresAt: claimed.expires_at,
    };

    // 8. Complete idempotency
    if (idempotencyKey) {
      await completeKey('device:session-claim', device.id, idempotencyKey, 201, { data: responseData });
    }

    return createdResponse(responseData, requestId);
  } catch (err) {
    if (err instanceof Response) return err;
    return errorResponse(500, 'INTERNAL_ERROR', 'An unexpected error occurred.', undefined, false, requestId);
  }
}
