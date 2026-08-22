// Gateway HMAC authentication for edge-to-cloud device routes.
// Validates X-SGV-* headers, timestamp window, and constant-time signature.

import { getGatewayByCode } from '@/lib/supabase/devices';
import { unauthorizedError } from '@/lib/validation/responses';

const TIMESTAMP_SKEW_SECONDS = 300;

export interface GatewayAuthResult {
  gatewayId: string;
  gatewayCode: string;
}

/**
 * Verify gateway HMAC signature and return authenticated gateway identity.
 * Throws Response on failure.
 */
export async function verifyGatewayAuth(request: Request): Promise<GatewayAuthResult> {
  const gatewayCode = request.headers.get('x-sgv-gateway-id');
  const timestamp = request.headers.get('x-sgv-timestamp');
  const nonce = request.headers.get('x-sgv-nonce');
  const signature = request.headers.get('x-sgv-signature');

  if (!gatewayCode || !timestamp || !nonce || !signature) {
    throw unauthorizedError();
  }

  // Validate timestamp window
  const requestTime = parseInt(timestamp, 10);
  if (isNaN(requestTime)) throw unauthorizedError();
  const nowSec = Math.floor(Date.now() / 1000);
  if (Math.abs(nowSec - requestTime) > TIMESTAMP_SKEW_SECONDS) {
    throw unauthorizedError();
  }

  // Look up gateway and its secret
  const gateway = await getGatewayByCode(gatewayCode);
  if (!gateway || gateway.status !== 'ACTIVE') {
    throw unauthorizedError();
  }

  const gatewaySecret = process.env.SGV_GATEWAY_SECRET;
  if (!gatewaySecret) throw unauthorizedError();

  // Compute expected signature: HMAC-SHA256 over canonical bytes
  const rawBody = await request.clone().arrayBuffer();
  const bodyHash = await sha256Hex(rawBody);
  const idempotencyKey = request.headers.get('idempotency-key') ?? '';

  const method = request.method.toUpperCase();
  const url = new URL(request.url);
  const pathAndQuery = url.pathname + url.search;

  const canonical = [
    method,
    pathAndQuery,
    gatewayCode,
    timestamp,
    nonce,
    idempotencyKey,
    bodyHash,
  ].join('\n');

  const expectedSignature = await hmacSha256Hex(gatewaySecret, canonical);

  // Constant-time comparison
  if (!timingSafeEqual(expectedSignature, signature)) {
    throw unauthorizedError();
  }

  return { gatewayId: gateway.id, gatewayCode: gateway.gateway_code };
}

async function sha256Hex(data: ArrayBuffer): Promise<string> {
  const hash = await crypto.subtle.digest('SHA-256', data);
  return bufToHex(hash);
}

async function hmacSha256Hex(secret: string, message: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message));
  return bufToHex(sig);
}

function bufToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}
