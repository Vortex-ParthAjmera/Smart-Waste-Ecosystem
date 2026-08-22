/**
 * apps/web/src/lib/supabase/client.ts
 * Supabase client configuration.
 *
 * Owner: AASHU JOSHI
 * This is a scaffold stub. Full implementation by Aashu.
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
