// Standard API response/error helpers per the contract envelope spec.
// Every response has a requestId for correlation.

import type { ApiResponse, ApiError, PaginatedResponse } from './schemas';

export function generateRequestId(): string {
  return crypto.randomUUID();
}

export function successResponse<T>(data: T, requestId?: string): Response {
  const body: ApiResponse<T> = {
    data,
    meta: { requestId: requestId ?? generateRequestId() },
  };
  return Response.json(body, { status: 200 });
}

export function createdResponse<T>(data: T, requestId?: string): Response {
  const body: ApiResponse<T> = {
    data,
    meta: { requestId: requestId ?? generateRequestId() },
  };
  return Response.json(body, { status: 201 });
}

export function noContentResponse(): Response {
  return new Response(null, { status: 204 });
}

export function errorResponse(
  httpStatus: number,
  code: string,
  message: string,
  details?: unknown,
  retryable?: boolean,
  requestId?: string,
): Response {
  const error: ApiError['error'] = { code, message };
  if (details !== undefined) {
    error.details = details;
  }
  if (retryable !== undefined) {
    error.retryable = retryable;
  }
  const body: ApiError = {
    error,
    meta: { requestId: requestId ?? generateRequestId() },
  };
  return Response.json(body, { status: httpStatus });
}

export function paginatedResponse<T>(
  data: T[],
  opts: {
    nextCursor?: string | null;
    hasMore: boolean;
    limit: number;
  },
  requestId?: string,
): Response {
  const meta: PaginatedResponse<T>['meta'] = {
    requestId: requestId ?? generateRequestId(),
    limit: opts.limit,
    hasMore: opts.hasMore,
  };
  if (opts.nextCursor) {
    meta.cursor = opts.nextCursor;
  }
  const body: PaginatedResponse<T> = {
    data,
    meta,
  };
  return Response.json(body, { status: 200 });
}

export function validationError(
  details: unknown,
  requestId?: string,
): Response {
  return errorResponse(400, 'VALIDATION_ERROR', 'The request could not be accepted.', details, false, requestId);
}

export function unauthorizedError(requestId?: string): Response {
  return errorResponse(401, 'UNAUTHORIZED', 'Authentication required.', undefined, false, requestId);
}

export function forbiddenError(requestId?: string): Response {
  return errorResponse(403, 'FORBIDDEN', 'Insufficient permissions.', undefined, false, requestId);
}

export function notFoundError(requestId?: string): Response {
  return errorResponse(404, 'NOT_FOUND', 'The requested resource was not found.', undefined, false, requestId);
}

export function conflictError(message: string, retryable?: boolean, requestId?: string): Response {
  return errorResponse(409, 'IDEMPOTENCY_CONFLICT', message, undefined, retryable, requestId);
}

export function requestInProgressError(retryAfter: number, requestId?: string): Response {
  const res = errorResponse(409, 'REQUEST_IN_PROGRESS', 'Request is already in progress.', undefined, true, requestId);
  res.headers.set('Retry-After', String(retryAfter));
  return res;
}
