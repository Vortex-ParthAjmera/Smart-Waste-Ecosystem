-- Migration 002: Gateways, Devices, Device Components
-- Supabase PostgreSQL — forward-only migration

-- ============================================================
-- 5. gateways — provisioned local edge identity
-- ============================================================
create table public.gateways (
  id                  uuid primary key default gen_random_uuid(),
  gateway_code        text not null unique,
  credential_version  integer not null default 1
    check (credential_version > 0),
  status              text not null default 'ACTIVE'
    check (status in ('ACTIVE', 'SUSPENDED', 'REVOKED')),
  last_seen_at        timestamptz,
  created_at          timestamptz not null default now()
);

comment on table public.gateways is 'Provisioned local edge gateway identities.';

-- ============================================================
-- 6. devices — ESP32 identity, firmware, and status
-- ============================================================
create table public.devices (
  id                uuid primary key default gen_random_uuid(),
  gateway_id        uuid not null references public.gateways(id) on delete restrict,
  device_code       text not null unique,
  firmware_version  text,
  status            text not null default 'ACTIVE'
    check (status in ('PROVISIONING', 'ACTIVE', 'DEGRADED', 'SUSPENDED', 'REVOKED')),
  last_seen_at      timestamptz,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

comment on table public.devices is 'ESP32 device identity and status.';

-- ============================================================
-- 7. device_components — sensor/component inventory
-- ============================================================
create table public.device_components (
  id                   uuid primary key default gen_random_uuid(),
  device_id            uuid not null references public.devices(id) on delete restrict,
  component_code       text not null,
  component_type       text not null check (component_type in (
    'IR', 'ULTRASONIC', 'MOISTURE', 'GPS', 'CAMERA', 'EDGE', 'MODEL'
  )),
  compartment          text check (compartment in ('WET', 'DRY')),
  calibration_version  text,
  is_enabled           boolean not null default true,
  created_at           timestamptz not null default now(),
  unique (device_id, component_code)
);

comment on table public.device_components is 'Configured sensor/component inventory per device.';
