// Point transactions, disputes, badges, citizen badges, and leaderboard adapters.

import { getSupabaseServerClient } from './index';

// ── Types ───────────────────────────────────
export interface PointTransaction {
  id: string;
  citizen_id: string;
  event_id: string | null;
  review_decision_id: string | null;
  entry_kind: string;
  points_delta: number;
  reason_code: string;
  reversed_transaction_id: string | null;
  created_by: string | null;
  idempotency_key: string;
  created_at: string;
  metadata: Record<string, unknown>;
}

export interface Dispute {
  id: string;
  citizen_id: string;
  negative_transaction_id: string;
  status: string;
  reason: string;
  decision_reason: string | null;
  created_at: string;
  decided_at: string | null;
}

export interface Badge {
  id: string;
  code: string;
  name: string;
  description: string;
  tier: string;
  icon: string | null;
  created_at: string;
}

export interface CitizenBadge {
  id: string;
  citizen_id: string;
  badge_id: string;
  earned_at: string;
  badges: Badge;
}

// ── Point transaction queries ───────────────
export async function createPointTransaction(opts: {
  citizenId: string;
  eventId?: string;
  reviewDecisionId?: string;
  entryKind: string;
  pointsDelta: number;
  reasonCode: string;
  reversedTransactionId?: string;
  createdBy?: string;
  idempotencyKey: string;
  metadata?: Record<string, unknown>;
}): Promise<PointTransaction> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from('point_transactions')
    .insert({
      citizen_id: opts.citizenId,
      event_id: opts.eventId ?? null,
      review_decision_id: opts.reviewDecisionId ?? null,
      entry_kind: opts.entryKind,
      points_delta: opts.pointsDelta,
      reason_code: opts.reasonCode,
      reversed_transaction_id: opts.reversedTransactionId ?? null,
      created_by: opts.createdBy ?? null,
      idempotency_key: opts.idempotencyKey,
      metadata: opts.metadata ?? {},
    })
    .select()
    .single();
  if (error) throw error;
  return data as PointTransaction;
}

export async function getEventAward(eventId: string): Promise<PointTransaction | null> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from('point_transactions')
    .select('*')
    .eq('event_id', eventId)
    .eq('entry_kind', 'AWARD')
    .maybeSingle();
  if (error || !data) return null;
  return data as PointTransaction;
}

export async function getCitizenBalance(citizenId: string): Promise<number> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from('point_transactions')
    .select('points_delta')
    .eq('citizen_id', citizenId);
  if (error || !data) return 0;
  return (data as Array<{ points_delta: number }>).reduce(
    (sum, row) => sum + row.points_delta,
    0,
  );
}

export async function getCitizenTransactions(
  citizenId: string,
  limit: number = 50,
): Promise<PointTransaction[]> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from('point_transactions')
    .select('*')
    .eq('citizen_id', citizenId)
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error || !data) return [];
  return data as PointTransaction[];
}

export async function hasAwardForEvent(eventId: string): Promise<boolean> {
  const supabase = getSupabaseServerClient();
  const { count } = await supabase
    .from('point_transactions')
    .select('*', { count: 'exact', head: true })
    .eq('event_id', eventId)
    .eq('entry_kind', 'AWARD');
  return (count ?? 0) > 0;
}

export async function getTransactionById(transactionId: string): Promise<PointTransaction | null> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from('point_transactions')
    .select('*')
    .eq('id', transactionId)
    .single();
  if (error || !data) return null;
  return data as PointTransaction;
}

// ── Dispute queries ─────────────────────────
export async function createDispute(opts: {
  citizenId: string;
  negativeTransactionId: string;
  reason: string;
}): Promise<Dispute> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from('disputes')
    .insert({
      citizen_id: opts.citizenId,
      negative_transaction_id: opts.negativeTransactionId,
      status: 'OPEN',
      reason: opts.reason,
    })
    .select()
    .single();
  if (error) throw error;
  return data as Dispute;
}

export async function getCitizenDisputes(citizenId: string): Promise<Dispute[]> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from('disputes')
    .select('*')
    .eq('citizen_id', citizenId)
    .order('created_at', { ascending: false });
  if (error || !data) return [];
  return data as Dispute[];
}

export async function getDisputeById(disputeId: string): Promise<Dispute | null> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from('disputes')
    .select('*')
    .eq('id', disputeId)
    .single();
  if (error || !data) return null;
  return data as Dispute;
}

export async function updateDisputeStatus(
  disputeId: string,
  status: string,
  decisionReason: string,
): Promise<void> {
  const supabase = getSupabaseServerClient();
  await supabase
    .from('disputes')
    .update({
      status,
      decision_reason: decisionReason,
      decided_at: new Date().toISOString(),
    })
    .eq('id', disputeId);
}

// ── Badge queries ───────────────────────────
export async function getCitizenBadges(citizenId: string): Promise<CitizenBadge[]> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from('citizen_badges')
    .select('*, badges(*)')
    .eq('citizen_id', citizenId)
    .order('earned_at', { ascending: false });
  if (error || !data) return [];
  return data as CitizenBadge[];
}

export async function awardBadge(citizenId: string, badgeId: string): Promise<void> {
  const supabase = getSupabaseServerClient();
  await supabase.from('citizen_badges').insert({
    citizen_id: citizenId,
    badge_id: badgeId,
  });
}

// ── Leaderboard ─────────────────────────────
export interface LeaderboardEntry {
  leaderboard_alias: string;
  points_balance: number;
  tier: string;
}

export async function getLeaderboard(limit: number = 50): Promise<LeaderboardEntry[]> {
  const supabase = getSupabaseServerClient();
  // Uses the leaderboard_public view which filters opted-in citizens
  const { data, error } = await supabase
    .from('leaderboard_public')
    .select('*')
    .order('points_balance', { ascending: false })
    .limit(limit);
  if (error || !data) return [];
  return data as LeaderboardEntry[];
}
