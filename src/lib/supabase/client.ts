import { createBrowserClient } from "@supabase/ssr";

// Used from "use client" components (e.g. the login/register forms, the
// disposal log form). Reads the public anon key — safe to expose, since
// every table is locked down with row-level security policies.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
