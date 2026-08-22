-- Migration 007: Device Heartbeats, Telemetry, Audit Logs
-- Supabase PostgreSQL — forward-only migration

-- ============================================================
-- 24. device_heartbeats — component-level health history
-- ============================================================
create table public.device_heartbeats (
  id                 uuid primary key default gen_random_uuid(),
  device_id          uuid not null references public.devices(id) on delete restrict,
  firmware_version   text not null,
  uptime_seconds     bigint not null check (uptime_seconds >= 0),
  free_heap_bytes    bigint
    check (free_heap_bytes is null or free_heap_bytes >= 0),
  wifi_rssi_dbm      integer,
  edge_reachable     boolean not null,
  component_health   jsonb not null,
  occurred_at        timestamptz,
  received_at        timestamptz not null default now()
);

comment on table public.device_heartbeats is 'Component-level health heartbeat history. Append-only.';

-- ============================================================
-- 25. device_telemetry — non-decisional fill/GPS/operational readings
-- ============================================================
create table public.device_telemetry (
  id              uuid primary key default gen_random_uuid(),
  device_id       uuid not null references public.devices(id) on delete restrict,
  telemetry_code  text not null check (telemetry_code in (
    'FILL_WET_PERCENT', 'FILL_DRY_PERCENT', 'GPS_LOCATION'
  )),
  numeric_value   numeric,
  location        jsonb,
  quality         text not null check (quality in (
    'GOOD', 'DEGRADED', 'MISSING', 'FAILED', 'OUT_OF_RANGE', 'NO_FIX'
  )),
  occurred_at     timestamptz,
  received_at     timestamptz not null default now(),
  check (num_nonnulls(numeric_value, location) <= 1)
);

comment on table public.device_telemetry is 'Non-decisional operational telemetry. Append-only.';

-- ============================================================
-- 26. audit_logs — security/administrative/source audit
-- ============================================================
create table public.audit_logs (
  id                 uuid primary key default gen_random_uuid(),
  actor_profile_id   uuid references public.profiles(id),
  actor_type         text not null check (actor_type in (
    'USER', 'GATEWAY', 'DEVICE', 'SYSTEM', 'SIMULATOR', 'SEED'
  )),
  action             text not null,
  target_type        text not null,
  target_id          uuid,
  request_id         uuid,
  source_label       text,
  safe_metadata      jsonb not null default '{}',
  occurred_at        timestamptz not null default now()
);

comment on table public.audit_logs is 'Security and administrative audit trail. Append-only.';
