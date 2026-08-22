-- Migration 003: Idempotency Records and Rulesets
-- Supabase PostgreSQL — forward-only migration

-- ============================================================
-- 8. ingest_messages — cloud idempotency claim for device messages
-- ============================================================
create table public.ingest_messages (
  message_id          uuid primary key,
  gateway_id          uuid not null references public.gateways(id),
  device_id           uuid not null references public.devices(id),
  schema_version      text not null check (schema_version = '1.1'),
  message_type        text not null check (message_type in (
    'DISPOSAL_EVENT_V1', 'HEARTBEAT_V1', 'TELEMETRY_V1'
  )),
  boot_id             uuid not null,
  sequence_no         bigint not null check (sequence_no >= 0),
  payload_hash        text not null check (payload_hash ~ '^[0-9a-f]{64}$'),
  processing_status   text not null default 'RECEIVED'
    check (processing_status in ('RECEIVED', 'PROCESSED', 'REJECTED')),
  result_code         text,
  result_json         jsonb,
  occurred_at         timestamptz,
  received_at         timestamptz not null default now(),
  processed_at        timestamptz,
  unique (device_id, boot_id, sequence_no)
);

comment on table public.ingest_messages is 'Atomic cloud idempotency claim and stored result for device messages.';

-- ============================================================
-- 9. idempotency_records — user/admin/mutation idempotency
-- ============================================================
create table public.idempotency_records (
  scope            text not null,
  actor_id         uuid not null references public.profiles(id),
  idempotency_key  uuid not null,
  request_hash     text not null check (request_hash ~ '^[0-9a-f]{64}$'),
  status           text not null check (status in ('IN_PROGRESS', 'SUCCEEDED', 'FAILED')),
  response_status  integer,
  response_json    jsonb,
  created_at       timestamptz not null default now(),
  completed_at     timestamptz,
  primary key (scope, actor_id, idempotency_key)
);

comment on table public.idempotency_records is 'Idempotency records for user/admin/mutation operations.';

-- ============================================================
-- 10. rulesets — immutable decision/point configuration
-- ============================================================
create table public.rulesets (
  id              uuid primary key default gen_random_uuid(),
  version         text not null unique,
  status          text not null check (status in ('DRAFT', 'PUBLISHED', 'RETIRED')),
  config          jsonb not null,
  config_hash     text not null check (config_hash ~ '^[0-9a-f]{64}$'),
  created_by      uuid not null references public.profiles(id),
  created_at      timestamptz not null default now(),
  published_at    timestamptz,
  check (
    (status = 'DRAFT' and published_at is null) or
    (status in ('PUBLISHED', 'RETIRED') and published_at is not null)
  )
);

comment on table public.rulesets is 'Immutable ruleset configuration for rules-2.0.0.';

create unique index one_published_ruleset
  on public.rulesets ((status)) where status = 'PUBLISHED';
