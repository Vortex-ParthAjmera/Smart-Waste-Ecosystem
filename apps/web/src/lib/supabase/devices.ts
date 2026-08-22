// Gateways, devices, components, heartbeats, and telemetry adapters.

import { getSupabaseServerClient } from './index';

// ── Types ───────────────────────────────────
export interface Gateway {
  id: string;
  gateway_code: string;
  credential_version: number;
  status: string;
  last_seen_at: string | null;
  created_at: string;
}

export interface Device {
  id: string;
  gateway_id: string;
  device_code: string;
  firmware_version: string | null;
  status: string;
  last_seen_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface DeviceComponent {
  id: string;
  device_id: string;
  component_code: string;
  component_type: string;
  compartment: string | null;
  calibration_version: string | null;
  is_enabled: boolean;
  created_at: string;
}

export interface DeviceHeartbeat {
  id: string;
  device_id: string;
  component_code: string;
  health: string;
  reported_at: string;
  created_at: string;
}

export interface DeviceTelemetry {
  id: string;
  device_id: string;
  event_id: string | null;
  metric_code: string;
  numeric_value: number | null;
  unit: string;
  quality: string;
  reported_at: string;
  created_at: string;
}

export interface DeviceWithHealth extends Device {
  device_components: DeviceComponent[];
}

// ── Gateway queries ─────────────────────────
export async function getGatewayByCode(gatewayCode: string): Promise<Gateway | null> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from('gateways')
    .select('*')
    .eq('gateway_code', gatewayCode)
    .eq('status', 'ACTIVE')
    .single();
  if (error || !data) return null;
  return data as Gateway;
}

// ── Device queries ──────────────────────────
export async function getDeviceByCode(deviceCode: string): Promise<Device | null> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from('devices')
    .select('*')
    .eq('device_code', deviceCode)
    .single();
  if (error || !data) return null;
  return data as Device;
}

export async function getDeviceById(deviceId: string): Promise<DeviceWithHealth | null> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from('devices')
    .select('*, device_components(*)')
    .eq('id', deviceId)
    .single();
  if (error || !data) return null;
  return data as DeviceWithHealth;
}

export async function getAllDevices(): Promise<Device[]> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from('devices')
    .select('*')
    .order('created_at', { ascending: false });
  if (error || !data) return [];
  return data as Device[];
}

export async function updateDeviceLastSeen(deviceId: string): Promise<void> {
  const supabase = getSupabaseServerClient();
  await supabase
    .from('devices')
    .update({ last_seen_at: new Date().toISOString() })
    .eq('id', deviceId);
}

// ── Component queries ───────────────────────
export async function getDeviceComponents(deviceId: string): Promise<DeviceComponent[]> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from('device_components')
    .select('*')
    .eq('device_id', deviceId)
    .order('component_code');
  if (error || !data) return [];
  return data as DeviceComponent[];
}

// ── Heartbeat queries ───────────────────────
export async function createHeartbeat(heartbeat: {
  deviceId: string;
  componentCode: string;
  health: string;
  reportedAt: string;
}): Promise<void> {
  const supabase = getSupabaseServerClient();
  await supabase.from('device_heartbeats').insert({
    device_id: heartbeat.deviceId,
    component_code: heartbeat.componentCode,
    health: heartbeat.health,
    reported_at: heartbeat.reportedAt,
  });
}

export async function getDeviceHeartbeats(
  deviceId: string,
  limit: number = 50,
): Promise<DeviceHeartbeat[]> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from('device_heartbeats')
    .select('*')
    .eq('device_id', deviceId)
    .order('reported_at', { ascending: false })
    .limit(limit);
  if (error || !data) return [];
  return data as DeviceHeartbeat[];
}

// ── Telemetry queries ───────────────────────
export async function createTelemetry(telemetry: {
  deviceId: string;
  eventId?: string;
  metricCode: string;
  numericValue: number;
  unit: string;
  quality: string;
  reportedAt: string;
}): Promise<void> {
  const supabase = getSupabaseServerClient();
  await supabase.from('device_telemetry').insert({
    device_id: telemetry.deviceId,
    event_id: telemetry.eventId ?? null,
    metric_code: telemetry.metricCode,
    numeric_value: telemetry.numericValue,
    unit: telemetry.unit,
    quality: telemetry.quality,
    reported_at: telemetry.reportedAt,
  });
}

export async function getDeviceTelemetry(
  deviceId: string,
  limit: number = 100,
): Promise<DeviceTelemetry[]> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from('device_telemetry')
    .select('*')
    .eq('device_id', deviceId)
    .order('reported_at', { ascending: false })
    .limit(limit);
  if (error || !data) return [];
  return data as DeviceTelemetry[];
}
