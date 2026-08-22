// Higher-order wrapper for Next.js App Router Route Handlers.
// Handles session extraction, role guards, error mapping, and requestId injection.

import type { AppRole, AuthSession } from './index';
import { getAuthSession, requireRole } from './index';
import { generateRequestId, unauthorizedError, forbiddenError } from '@/lib/validation/responses';

type RouteContext = { params: Promise<Record<string, string>> };

type AuthenticatedHandler = (
  request: Request,
  context: RouteContext & { session: AuthSession; requestId: string },
) => Promise<Response>;

/**
 * Wrap a route handler with authentication and optional role enforcement.
 *
 * Usage:
 *   export const GET = withAuth(async (req, { session, requestId }) => { ... });
 *   export const POST = withAuth(['MUNICIPAL_OPERATOR', 'MUNICIPAL_ADMIN'])(async (req, { session, requestId }) => { ... });
 */
export function withAuth(handler: AuthenticatedHandler): (request: Request, context: RouteContext) => Promise<Response>;
export function withAuth(
  roles: AppRole[],
): (handler: AuthenticatedHandler) => (request: Request, context: RouteContext) => Promise<Response>;
export function withAuth(
  rolesOrHandler: AppRole[] | AuthenticatedHandler,
): any {
  if (typeof rolesOrHandler === 'function') {
    // Called as withAuth(handler) — no role restriction
    return wrapHandler([], rolesOrHandler);
  }
  // Called as withAuth(roles)(handler)
  return (handler: AuthenticatedHandler) => wrapHandler(rolesOrHandler, handler);
}

function wrapHandler(
  roles: AppRole[],
  handler: AuthenticatedHandler,
): (request: Request, context: RouteContext) => Promise<Response> {
  return async (request: Request, context: RouteContext) => {
    const requestId = generateRequestId();
    try {
      const session = roles.length > 0
        ? await requireRole(...roles)
        : await getAuthSession();
      return await handler(request, { ...context, session, requestId });
    } catch (err) {
      if (err instanceof Response) return err;
      return unauthorizedError(requestId);
    }
  };
}
