// Disposal sessions, events, sensor readings, and ML detection adapters.

import { getSupabaseServerClient } from './index';

// ── Types ───────────────────────────────────
export interface DisposalSession {
  id: string;
  event_id: string;
  citizen_id: string;
  qr_token_id: string;
  expected_device_code: string;
  selected_compartment: string;
  status: string;
  created_by: string;
  binding_nonce: string;
  issued_at: string;
  expires_at: string;
  bound_at: string | null;
  consumed_at: string | null;
}

export interface DisposalEvent {
  id: string;
  source_message_id: string | null;
  session_id: string | null;
  citizen_id: string;
  qr_token_id: string | null;
  device_id: string;
  event_source: string;
  selected_compartment: string;
  processing_state: string;
  decision_state: string;
  latitude: number | null;
  longitude: number | null;
  location_accuracy_m: number | null;
  location_quality: string;
  occurred_at: string | null;
  edge_received_at: string;
  cloud_received_at: string;
  completed_at: string | null;
  failure_code: string | null;
  created_at: string;
  updated_at: string;
}

export interface SensorReading {
  id: string;
  event_id: string;
  component_code: string;
  sensor_code: string;
  numeric_value: number | null;
  boolean_value: boolean | null;
  unit: string;
  quality: string;
  calibration_version: string | null;
  captured_at: string | null;
  created_at: string;
}

export interface MlDetection {
  id: string;
  event_id: string;
  evidence_source: string;
  status: string;
  model_family: string;
  model_version: string;
  weights_sha256: string;
  class_map_version: string;
  input_sha256: string | null;
  detected_label: string | null;
  friendly_label: string | null;
  predicted_category: string | null;
  score: number | null;
  confidence_band: string | null;
  inference_ms: number | null;
  observed_at: string;
  created_at: string;
}

// ── Session queries ─────────────────────────
export async function getActiveSessionForDevice(
  deviceCode: string,
): Promise<DisposalSession | null> {
  const supabase = getSupabaseServerClient();
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from('disposal_sessions')
    .select('*')
    .eq('expected_device_code', deviceCode)
    .in('status', ['PENDING', 'BOUND_TO_EDGE'])
    .gt('expires_at', now)
    .order('issued_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error || !data) return null;
  return data as DisposalSession;
}

export async function claimSession(
  sessionId: string,
  gatewayId: string,
): Promise<DisposalSession | null> {
  const supabase = getSupabaseServerClient();
  const now = new Date().toISOString();
  // Atomic update — only succeeds if status is still PENDING
  const { data, error } = await supabase
    .from('disposal_sessions')
    .update({
      status: 'BOUND_TO_EDGE',
      binding_nonce: gatewayId,
      bound_at: now,
    })
    .eq('id', sessionId)
    .eq('status', 'PENDING')
    .select()
    .single();
  if (error || !data) return null;
  return data as DisposalSession;
}

export async function getSessionById(sessionId: string): Promise<DisposalSession | null> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from('disposal_sessions')
    .select('*')
    .eq('id', sessionId)
    .single();
  if (error || !data) return null;
  return data as DisposalSession;
}

export async function createDisposalSession(opts: {
  sessionId: string;
  eventId: string;
  citizenId: string;
  qrTokenId: string;
  deviceCode: string;
  selectedCompartment: string;
  createdBy: string;
  expiresAt: string;
}): Promise<DisposalSession> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from('disposal_sessions')
    .insert({
      id: opts.sessionId,
      event_id: opts.eventId,
      citizen_id: opts.citizenId,
      qr_token_id: opts.qrTokenId,
      expected_device_code: opts.deviceCode,
      selected_compartment: opts.selectedCompartment,
      status: 'PENDING',
      created_by: opts.createdBy,
      binding_nonce: crypto.randomUUID(),
      expires_at: opts.expiresAt,
    })
    .select()
    .single();
  if (error) throw error;
  return data as DisposalSession;
}

// ── Event queries ───────────────────────────
export async function getEventById(eventId: string): Promise<DisposalEvent | null> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from('disposal_events')
    .select('*')
    .eq('id', eventId)
    .single();
  if (error || !data) return null;
  return data as DisposalEvent;
}

export async function createDisposalEvent(opts: {
  eventId: string;
  sourceMessageId?: string;
  sessionId?: string;
  citizenId: string;
  deviceId: string;
  eventSource: string;
  selectedCompartment: string;
  processingState: string;
  decisionState: string;
  latitude?: number;
  longitude?: number;
  locationQuality: string;
  occurredAt?: string;
  edgeReceivedAt: string;
}): Promise<DisposalEvent> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from('disposal_events')
    .insert({
      id: opts.eventId,
      source_message_id: opts.sourceMessageId ?? null,
      session_id: opts.sessionId ?? null,
      citizen_id: opts.citizenId,
      device_id: opts.deviceId,
      event_source: opts.eventSource,
      selected_compartment: opts.selectedCompartment,
      processing_state: opts.processingState,
      decision_state: opts.decisionState,
      latitude: opts.latitude ?? null,
      longitude: opts.longitude ?? null,
      location_quality: opts.locationQuality,
      occurred_at: opts.occurredAt ?? null,
      edge_received_at: opts.edgeReceivedAt,
      cloud_received_at: new Date().toISOString(),
    })
    .select()
    .single();
  if (error) throw error;
  return data as DisposalEvent;
}

export async function updateEventState(
  eventId: string,
  processingState: string,
  decisionState: string,
): Promise<void> {
  const supabase = getSupabaseServerClient();
  await supabase
    .from('disposal_events')
    .update({
      processing_state: processingState,
      decision_state: decisionState,
      updated_at: new Date().toISOString(),
    })
    .eq('id', eventId);
}

export async function getCitizenEvents(
  citizenId: string,
  limit: number,
  cursor?: string,
): Promise<{ data: DisposalEvent[]; nextCursor: string | null }> {
  const supabase = getSupabaseServerClient();
  let query = supabase
    .from('disposal_events')
    .select('*')
    .eq('citizen_id', citizenId)
    .order('occurred_at', { ascending: false })
    .limit(limit + 1);

  if (cursor) {
    query = query.lt('occurred_at', cursor);
  }

  const { data, error } = await query;
  if (error || !data) return { data: [], nextCursor: null };

  const events = data as DisposalEvent[];
  const hasMore = events.length > limit;
  const trimmed = hasMore ? events.slice(0, limit) : events;
  const nextCursor = hasMore && trimmed.length > 0 ? trimmed[trimmed.length - 1]!.occurred_at : null;

  return { data: trimmed, nextCursor };
}

export async function getMunicipalEvents(
  limit: number,
  cursor?: string,
): Promise<{ data: DisposalEvent[]; nextCursor: string | null }> {
  const supabase = getSupabaseServerClient();
  let query = supabase
    .from('disposal_events')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit + 1);

  if (cursor) {
    query = query.lt('created_at', cursor);
  }

  const { data, error } = await query;
  if (error || !data) return { data: [], nextCursor: null };

  const events = data as DisposalEvent[];
  const hasMore = events.length > limit;
  const trimmed = hasMore ? events.slice(0, limit) : events;
  const nextCursor = hasMore && trimmed.length > 0 ? trimmed[trimmed.length - 1]!.created_at : null;

  return { data: trimmed, nextCursor };
}

// ── Sensor readings ─────────────────────────
export async function createSensorReadings(
  readings: Array<{
    eventId: string;
    componentCode: string;
    sensorCode: string;
    numericValue?: number;
    booleanValue?: boolean;
    unit: string;
    quality: string;
    calibrationVersion?: string;
    capturedAt?: string;
  }>,
): Promise<void> {
  const supabase = getSupabaseServerClient();
  if (readings.length === 0) return;
  await supabase.from('sensor_readings').insert(
    readings.map((r) => ({
      event_id: r.eventId,
      component_code: r.componentCode,
      sensor_code: r.sensorCode,
      numeric_value: r.numericValue ?? null,
      boolean_value: r.booleanValue ?? null,
      unit: r.unit,
      quality: r.quality,
      calibration_version: r.calibrationVersion ?? null,
      captured_at: r.capturedAt ?? null,
    })),
  );
}

export async function getEventSensorReadings(eventId: string): Promise<SensorReading[]> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from('sensor_readings')
    .select('*')
    .eq('event_id', eventId)
    .order('created_at', { ascending: true });
  if (error || !data) return [];
  return data as SensorReading[];
}

// ── ML detections ───────────────────────────
export async function createMlDetection(detection: {
  eventId: string;
  evidenceSource: string;
  status: string;
  modelFamily: string;
  modelVersion: string;
  weightsSha256: string;
  classMapVersion: string;
  inputSha256?: string;
  detectedLabel?: string;
  friendlyLabel?: string;
  predictedCategory?: string;
  score?: number;
  confidenceBand?: string;
  inferenceMs?: number;
  observedAt: string;
}): Promise<MlDetection> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from('ml_detections')
    .insert({
      id: crypto.randomUUID(),
      event_id: detection.eventId,
      evidence_source: detection.evidenceSource,
      status: detection.status,
      model_family: detection.modelFamily,
      model_version: detection.modelVersion,
      weights_sha256: detection.weightsSha256,
      class_map_version: detection.classMapVersion,
      input_sha256: detection.inputSha256 ?? null,
      detected_label: detection.detectedLabel ?? null,
      friendly_label: detection.friendlyLabel ?? null,
      predicted_category: detection.predictedCategory ?? null,
      score: detection.score ?? null,
      confidence_band: detection.confidenceBand ?? null,
      inference_ms: detection.inferenceMs ?? null,
      observed_at: detection.observedAt,
    })
    .select()
    .single();
  if (error) throw error;
  return data as MlDetection;
}

export async function getEventMlDetection(eventId: string): Promise<MlDetection | null> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from('ml_detections')
    .select('*')
    .eq('event_id', eventId)
    .single();
  if (error || !data) return null;
  return data as MlDetection;
}
