// Supabase client factory and adapter barrel export.

import { createClient } from '@supabase/supabase-js';

export function getSupabaseServerClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

export function getSupabaseBrowserClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

// Re-export all typed adapters
export * from './profiles';
export * from './disposal';
export * from './devices';
export * from './ingest';
export * from './reviews';
export * from './points';
export * from './audit';
