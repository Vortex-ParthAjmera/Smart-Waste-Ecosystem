// Profiles, citizens, and QR token adapters.

import type { PostgrestResponse } from '@supabase/supabase-js';
import { getSupabaseServerClient } from './index';

// ── Types ───────────────────────────────────
export interface Profile {
  id: string;
  app_role: string;
  display_name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Citizen {
  id: string;
  profile_id: string;
  citizen_code: string;
  leaderboard_alias: string;
  leaderboard_opt_in: boolean;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface CitizenWithProfile extends Citizen {
  profiles: Profile;
}

export interface QrToken {
  id: string;
  citizen_id: string;
  lookup_hash: string;
  display_suffix: string;
  session_nonce: string;
  status: string;
  issued_at: string;
  expires_at: string;
  used_at: string | null;
  revoked_at: string | null;
}

// ── Profile queries ─────────────────────────
export async function getProfileById(userId: string): Promise<Profile | null> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error || !data) return null;
  return data as Profile;
}

export async function getProfileByCitizenId(citizenId: string): Promise<Profile | null> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from('citizens')
    .select('profiles(*)')
    .eq('id', citizenId)
    .single();
  if (error || !data) return null;
  const row = data as unknown as { profiles: Profile };
  return row.profiles;
}

// ── Citizen queries ─────────────────────────
export async function getCitizenByProfileId(profileId: string): Promise<Citizen | null> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from('citizens')
    .select('*')
    .eq('profile_id', profileId)
    .single();
  if (error || !data) return null;
  return data as Citizen;
}

export async function getCitizenWithProfile(citizenId: string): Promise<CitizenWithProfile | null> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from('citizens')
    .select('*, profiles(*)')
    .eq('id', citizenId)
    .single();
  if (error || !data) return null;
  return data as CitizenWithProfile;
}

// ── QR Token queries ────────────────────────
export async function createQrToken(
  citizenId: string,
  lookupHash: string,
  displaySuffix: string,
  expiresAt: string,
): Promise<QrToken> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from('citizen_qr_tokens')
    .insert({
      citizen_id: citizenId,
      lookup_hash: lookupHash,
      display_suffix: displaySuffix,
      session_nonce: crypto.randomUUID(),
      status: 'ACTIVE',
      expires_at: expiresAt,
    })
    .select()
    .single();
  if (error) throw error;
  return data as QrToken;
}

export async function getActiveQrToken(citizenId: string): Promise<QrToken | null> {
  const supabase = getSupabaseServerClient();
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from('citizen_qr_tokens')
    .select('*')
    .eq('citizen_id', citizenId)
    .eq('status', 'ACTIVE')
    .gt('expires_at', now)
    .order('issued_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error || !data) return null;
  return data as QrToken;
}

export async function markQrTokenUsed(tokenId: string): Promise<void> {
  const supabase = getSupabaseServerClient();
  await supabase
    .from('citizen_qr_tokens')
    .update({ status: 'USED', used_at: new Date().toISOString() })
    .eq('id', tokenId);
}

export async function revokeQrToken(tokenId: string): Promise<void> {
  const supabase = getSupabaseServerClient();
  await supabase
    .from('citizen_qr_tokens')
    .update({ status: 'REVOKED', revoked_at: new Date().toISOString() })
    .eq('id', tokenId);
}
