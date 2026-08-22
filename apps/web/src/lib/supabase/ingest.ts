// Ingest messages, idempotency records, and rulesets adapters.

import { getSupabaseServerClient } from './index';

// ── Types ───────────────────────────────────
export interface IngestMessage {
  message_id: string;
  gateway_id: string;
  device_id: string;
  schema_version: string;
  message_type: string;
  boot_id: string;
  sequence_no: number;
  payload_hash: string;
  processing_status: string;
  result_code: string | null;
  result_json: Record<string, unknown> | null;
  occurred_at: string | null;
  received_at: string;
  processed_at: string | null;
}

export interface IdempotencyRecord {
  scope: string;
  actor_id: string;
  idempotency_key: string;
  request_hash: string;
  status: string;
  response_status: number | null;
  response_json: Record<string, unknown> | null;
  created_at: string;
  completed_at: string | null;
}

export interface Ruleset {
  id: string;
  version: string;
  status: string;
  config: Record<string, unknown>;
  config_hash: string;
  created_by: string;
  created_at: string;
  published_at: string | null;
}

// ── Ingest message queries ──────────────────
export async function claimIngestMessage(opts: {
  messageId: string;
  gatewayId: string;
  deviceId: string;
  schemaVersion: string;
  messageType: string;
  bootId: string;
  sequenceNo: number;
  payloadHash: string;
  occurredAt?: string;
}): Promise<IngestMessage> {
  const supabase = getSupabaseServerClient();
  // Atomic insert — unique constraint on (device_id, boot_id, sequence_no) prevents duplicates
  const { data, error } = await supabase
    .from('ingest_messages')
    .insert({
      message_id: opts.messageId,
      gateway_id: opts.gatewayId,
      device_id: opts.deviceId,
      schema_version: opts.schemaVersion,
      message_type: opts.messageType,
      boot_id: opts.bootId,
      sequence_no: opts.sequenceNo,
      payload_hash: opts.payloadHash,
      processing_status: 'RECEIVED',
      occurred_at: opts.occurredAt ?? null,
    })
    .select()
    .single();
  if (error) throw error;
  return data as IngestMessage;
}

export async function getIngestMessage(messageId: string): Promise<IngestMessage | null> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from('ingest_messages')
    .select('*')
    .eq('message_id', messageId)
    .maybeSingle();
  if (error || !data) return null;
  return data as IngestMessage;
}

export async function completeIngestMessage(
  messageId: string,
  processingStatus: string,
  resultCode: string | null,
  resultJson: Record<string, unknown> | null,
): Promise<void> {
  const supabase = getSupabaseServerClient();
  await supabase
    .from('ingest_messages')
    .update({
      processing_status: processingStatus,
      result_code: resultCode,
      result_json: resultJson,
      processed_at: new Date().toISOString(),
    })
    .eq('message_id', messageId);
}

// ── Idempotency queries ─────────────────────
export async function claimIdempotencyKey(opts: {
  scope: string;
  actorId: string;
  idempotencyKey: string;
  requestHash: string;
}): Promise<{ claim: boolean; existing?: IdempotencyRecord }> {
  const supabase = getSupabaseServerClient();
  const now = new Date().toISOString();

  // Atomic insert — unique constraint on (scope, actor_id, idempotency_key)
  const { data: insertData, error: insertError } = await supabase
    .from('idempotency_records')
    .insert({
      scope: opts.scope,
      actor_id: opts.actorId,
      idempotency_key: opts.idempotencyKey,
      request_hash: opts.requestHash,
      status: 'IN_PROGRESS',
      created_at: now,
    })
    .select()
    .single();

  if (insertError) {
    // Duplicate key — fetch existing record
    const { data: existing } = await supabase
      .from('idempotency_records')
      .select('*')
      .eq('scope', opts.scope)
      .eq('actor_id', opts.actorId)
      .eq('idempotency_key', opts.idempotencyKey)
      .single();

    return {
      claim: false,
      existing: existing as IdempotencyRecord,
    };
  }

  return { claim: true, existing: insertData as IdempotencyRecord };
}

export async function completeIdempotencyKey(
  scope: string,
  actorId: string,
  idempotencyKey: string,
  status: 'SUCCEEDED' | 'FAILED',
  responseStatus: number,
  responseJson: Record<string, unknown>,
): Promise<void> {
  const supabase = getSupabaseServerClient();
  await supabase
    .from('idempotency_records')
    .update({
      status,
      response_status: responseStatus,
      response_json: responseJson,
      completed_at: new Date().toISOString(),
    })
    .eq('scope', scope)
    .eq('actor_id', actorId)
    .eq('idempotency_key', idempotencyKey);
}

// ── Ruleset queries ─────────────────────────
export async function getPublishedRuleset(): Promise<Ruleset | null> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from('rulesets')
    .select('*')
    .eq('status', 'PUBLISHED')
    .single();
  if (error || !data) return null;
  return data as Ruleset;
}

export async function getRulesetByVersion(version: string): Promise<Ruleset | null> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from('rulesets')
    .select('*')
    .eq('version', version)
    .single();
  if (error || !data) return null;
  return data as Ruleset;
}
