// Server-side session and role guard utilities.
// Auth comes from Supabase sessions — no custom /auth/* API.

import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

export type AppRole = 'CITIZEN' | 'MUNICIPAL_OPERATOR' | 'MUNICIPAL_ADMIN' | 'DEVELOPER' | 'SYSTEM_ADMIN';

export interface AuthSession {
  userId: string;
  role: AppRole;
  email?: string;
}

/**
 * Get the current authenticated session from the server.
 * Reads the Supabase session from cookies, then fetches the profile role.
 * Throws Response 401 if unauthenticated or profile inactive.
 */
export async function getAuthSession(): Promise<AuthSession> {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Server Component — cannot set cookies here, ignore
          }
        },
      },
    },
  );

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Response(JSON.stringify({
      error: { code: 'UNAUTHORIZED', message: 'Authentication required.' },
      meta: { requestId: crypto.randomUUID() },
    }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('app_role, is_active')
    .eq('id', user.id)
    .single();

  if (!profile || !profile.is_active) {
    throw new Response(JSON.stringify({
      error: { code: 'UNAUTHORIZED', message: 'Account is inactive.' },
      meta: { requestId: crypto.randomUUID() },
    }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }

  const session: AuthSession = {
    userId: user.id,
    role: profile.app_role as AppRole,
  };
  if (user.email) {
    session.email = user.email;
  }
  return session;
}

/**
 * Require one of the specified roles. Throws 403 on mismatch.
 */
export async function requireRole(...roles: AppRole[]): Promise<AuthSession> {
  const session = await getAuthSession();
  if (!roles.includes(session.role)) {
    throw new Response(JSON.stringify({
      error: { code: 'FORBIDDEN', message: 'Insufficient permissions.' },
      meta: { requestId: crypto.randomUUID() },
    }), { status: 403, headers: { 'Content-Type': 'application/json' } });
  }
  return session;
}

/**
 * Synchronous role check on an already-fetched session.
 */
export function hasRole(session: AuthSession, ...roles: AppRole[]): boolean {
  return roles.includes(session.role);
}
