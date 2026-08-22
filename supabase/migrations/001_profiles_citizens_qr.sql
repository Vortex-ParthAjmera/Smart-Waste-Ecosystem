-- Migration 001: Identity, Citizens, QR Tokens, Disposal Sessions
-- Supabase PostgreSQL — forward-only migration
-- Schema baseline: 2.0

create extension if not exists "pgcrypto";

-- ============================================================
-- 1. profiles — Supabase Auth extension and trusted app role
-- ============================================================
create table public.profiles (
  id         uuid primary key references auth.users(id) on delete restrict,
  app_role   text not null check (app_role in (
    'CITIZEN',
    'MUNICIPAL_OPERATOR',
    'MUNICIPAL_REVIEWER',
    'MUNICIPAL_ADMIN',
    'DEVELOPER',
    'SYSTEM_ADMIN'
  )),
  display_name text not null check (char_length(display_name) between 1 and 80),
  is_active  boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is 'Supabase Auth user extension with application role.';

-- ============================================================
-- 2. citizens — fictional citizen application profile
-- ============================================================
create table public.citizens (
  id                   uuid primary key default gen_random_uuid(),
  profile_id           uuid not null unique references public.profiles(id) on delete restrict,
  citizen_code         text not null unique,
  leaderboard_alias    text not null unique
    check (char_length(leaderboard_alias) between 3 and 24),
  leaderboard_opt_in   boolean not null default false,
  status               text not null default 'ACTIVE'
    check (status in ('ACTIVE', 'SUSPENDED', 'INACTIVE')),
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

comment on table public.citizens is 'Fictional citizen profiles linked to Supabase Auth.';

-- ============================================================
-- 3. citizen_qr_tokens — opaque, expiring/rotatable QR lookup
-- ============================================================
create table public.citizen_qr_tokens (
  id              uuid primary key default gen_random_uuid(),
  citizen_id      uuid not null references public.citizens(id) on delete restrict,
  lookup_hash     text not null unique
    check (lookup_hash ~ '^[0-9a-f]{64}$'),
  display_suffix  text not null
    check (char_length(display_suffix) between 4 and 8),
  session_nonce   uuid not null,
  status          text not null default 'ACTIVE'
    check (status in ('ACTIVE', 'USED', 'EXPIRED', 'REVOKED')),
  issued_at       timestamptz not null default now(),
  expires_at      timestamptz not null,
  used_at         timestamptz,
  revoked_at      timestamptz,
  check (expires_at > issued_at),
  check ((status = 'USED') = (used_at is not null)),
  check ((status = 'REVOKED') = (revoked_at is not null))
);

comment on table public.citizen_qr_tokens is 'Opaque QR tokens with peppered HMAC lookup hash.';

create index citizen_qr_active_idx
  on public.citizen_qr_tokens (citizen_id, expires_at)
  where status = 'ACTIVE';

-- ============================================================
-- 4. disposal_sessions — short-lived QR-to-device binding
-- ============================================================
create table public.disposal_sessions (
  id                     uuid primary key,
  event_id               uuid not null unique,
  citizen_id             uuid not null references public.citizens(id) on delete restrict,
  qr_token_id            uuid not null references public.citizen_qr_tokens(id) on delete restrict,
  expected_device_code   text not null,
  selected_compartment   text not null check (selected_compartment in ('WET', 'DRY')),
  status                 text not null default 'PENDING'
    check (status in ('PENDING', 'BOUND_TO_EDGE', 'CONSUMED', 'EXPIRED', 'CANCELLED')),
  created_by             uuid not null references public.profiles(id),
  binding_nonce          uuid not null unique,
  issued_at              timestamptz not null default now(),
  expires_at             timestamptz not null,
  bound_at               timestamptz,
  consumed_at            timestamptz,
  check (expires_at > issued_at),
  check (
    (status = 'PENDING' and bound_at is null) or
    (status in ('BOUND_TO_EDGE', 'CONSUMED') and bound_at is not null) or
    status in ('EXPIRED', 'CANCELLED')
  ),
  check ((status = 'CONSUMED') = (consumed_at is not null))
);

comment on table public.disposal_sessions is 'Short-lived QR-to-device/compartment binding.';

create index disposal_sessions_pending_idx
  on public.disposal_sessions (expected_device_code, expires_at)
  where status in ('PENDING', 'BOUND_TO_EDGE');
