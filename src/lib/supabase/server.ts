import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

// Used from Server Components, Route Handlers (src/app/api/**/route.ts),
// and Server Actions. Reads the signed-in user's session from cookies so
// row-level security (`auth.uid() = user_id`) applies automatically —
// there's no separate "get current user id" step needed in your queries.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
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
              cookieStore.set(name, value, options)
            );
          } catch {
            // `setAll` is called from a Server Component in some cases,
            // where cookies can't be written — safe to ignore as long as
            // middleware.ts is refreshing the session (see below).
          }
        },
      },
    }
  );
}
