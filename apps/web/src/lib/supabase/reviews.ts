// Segregation results, review cases, and review decisions adapters.

import { getSupabaseServerClient } from './index';

// ── Types ───────────────────────────────────
export interface SegregationResult {
  id: string;
  event_id: string;
  ruleset_id: string;
  outcome: string;
  suggested_severity: string;
  reason_codes: string[];
  input_hash: string;
  evaluated_at: string;
}

export interface ReviewCase {
  id: string;
  event_id: string;
  status: string;
  reason_codes: string[];
  suggested_severity: string;
  assigned_to: string | null;
  opened_at: string;
  decided_at: string | null;
}

export interface ReviewDecision {
  id: string;
  case_id: string;
  reviewer_id: string;
  decision: string;
  violation_severity: string | null;
  reason_code: string;
  notes: string | null;
  decided_at: string;
}

// ── Segregation result queries ──────────────
export async function createSegregationResult(opts: {
  eventId: string;
  rulesetId: string;
  outcome: string;
  suggestedSeverity: string;
  reasonCodes: string[];
  inputHash: string;
}): Promise<SegregationResult> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from('segregation_results')
    .insert({
      event_id: opts.eventId,
      ruleset_id: opts.rulesetId,
      outcome: opts.outcome,
      suggested_severity: opts.suggestedSeverity,
      reason_codes: opts.reasonCodes,
      input_hash: opts.inputHash,
    })
    .select()
    .single();
  if (error) throw error;
  return data as SegregationResult;
}

export async function getEventSegregationResult(
  eventId: string,
): Promise<SegregationResult | null> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from('segregation_results')
    .select('*')
    .eq('event_id', eventId)
    .maybeSingle();
  if (error || !data) return null;
  return data as SegregationResult;
}

// ── Review case queries ─────────────────────
export async function createReviewCase(opts: {
  eventId: string;
  reasonCodes: string[];
  suggestedSeverity: string;
}): Promise<ReviewCase> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from('review_cases')
    .insert({
      event_id: opts.eventId,
      status: 'OPEN',
      reason_codes: opts.reasonCodes,
      suggested_severity: opts.suggestedSeverity,
    })
    .select()
    .single();
  if (error) throw error;
  return data as ReviewCase;
}

export async function getReviewCaseById(caseId: string): Promise<ReviewCase | null> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from('review_cases')
    .select('*')
    .eq('id', caseId)
    .single();
  if (error || !data) return null;
  return data as ReviewCase;
}

export async function getReviewCases(
  status?: string,
  limit: number = 50,
): Promise<ReviewCase[]> {
  const supabase = getSupabaseServerClient();
  let query = supabase
    .from('review_cases')
    .select('*')
    .order('opened_at', { ascending: false })
    .limit(limit);
  if (status) query = query.eq('status', status);
  const { data, error } = await query;
  if (error || !data) return [];
  return data as ReviewCase[];
}

// ── Review decision queries ─────────────────
export async function createReviewDecision(opts: {
  caseId: string;
  reviewerId: string;
  decision: string;
  violationSeverity?: string;
  reasonCode: string;
  notes?: string;
}): Promise<ReviewDecision> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from('review_decisions')
    .insert({
      case_id: opts.caseId,
      reviewer_id: opts.reviewerId,
      decision: opts.decision,
      violation_severity: opts.violationSeverity ?? null,
      reason_code: opts.reasonCode,
      notes: opts.notes ?? null,
    })
    .select()
    .single();
  if (error) throw error;
  return data as ReviewDecision;
}

export async function updateReviewCaseStatus(
  caseId: string,
  status: string,
): Promise<void> {
  const supabase = getSupabaseServerClient();
  const update: Record<string, unknown> = { status };
  if (status === 'DECIDED') update.decided_at = new Date().toISOString();
  await supabase
    .from('review_cases')
    .update(update)
    .eq('id', caseId);
}

export async function getReviewDecisionForCase(
  caseId: string,
): Promise<ReviewDecision | null> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from('review_decisions')
    .select('*')
    .eq('case_id', caseId)
    .maybeSingle();
  if (error || !data) return null;
  return data as ReviewDecision;
}
