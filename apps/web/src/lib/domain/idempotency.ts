// Idempotency service — atomic claim, replay, conflict detection.
// Every state-changing route uses this to enforce exactly-once semantics.

import { claimIdempotencyKey, completeIdempotencyKey } from '@/lib/supabase/ingest';
import { conflictError, requestInProgressError } from '@/lib/validation/responses';

export type IdempotencyResult<T> =
  | { status: 'claimed' }
  | { status: 'replayed'; response: Response }
  | { status: 'conflict'; response: Response };

/**
 * Atomically claim an idempotency key.
 * Returns 'claimed' if the key was newly inserted (caller should process).
 * Returns 'replayed' with the stored response if same key + same hash exists.
 * Returns 'conflict' if same key + different hash, or if in-flight.
 */
export async function claimKey<T>(
  scope: string,
  actorId: string,
  idempotencyKey: string,
  requestHash: string,
): Promise<IdempotencyResult<T>> {
  const { claim, existing } = await claimIdempotencyKey({
    scope,
    actorId,
    idempotencyKey,
    requestHash,
  });

  if (claim) {
    // We own the lock — caller should process
    return { status: 'claimed' };
  }

  if (!existing) {
    return { status: 'conflict', response: conflictError('Unexpected idempotency state.') };
  }

  // Key already existed — check why
  if (existing.status === 'IN_PROGRESS') {
    const elapsedMs = Date.now() - new Date(existing.created_at).getTime();
    const retryAfter = Math.max(1, Math.ceil((30_000 - elapsedMs) / 1000));
    return { status: 'conflict', response: requestInProgressError(retryAfter) };
  }

  if (existing.request_hash !== requestHash) {
    return {
      status: 'conflict',
      response: conflictError('Idempotency key used with different request body.'),
    };
  }

  // Same key + same hash — replay stored response
  return {
    status: 'replayed',
    response: new Response(JSON.stringify(existing.response_json), {
      status: existing.response_status ?? 200,
      headers: { 'Content-Type': 'application/json' },
    }),
  };
}

/**
 * Mark an idempotency key as completed with the result.
 */
export async function completeKey(
  scope: string,
  actorId: string,
  idempotencyKey: string,
  httpStatus: number,
  responseBody: Record<string, unknown>,
): Promise<void> {
  await completeIdempotencyKey(
    scope,
    actorId,
    idempotencyKey,
    httpStatus >= 200 && httpStatus < 400 ? 'SUCCEEDED' : 'FAILED',
    httpStatus,
    responseBody,
  );
}

/**
 * Compute a deterministic hash of a request body for idempotency comparison.
 */
export async function hashBody(body: unknown): Promise<string> {
  const encoded = new TextEncoder().encode(JSON.stringify(body));
  const hashBuffer = await crypto.subtle.digest('SHA-256', encoded);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}
