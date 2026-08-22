create extension if not exists pgcrypto;

create type event_source as enum ('HARDWARE', 'RECORDED_HARDWARE', 'SIMULATED', 'SEEDED');
create type evidence_source as enum ('LOCAL_LIVE', 'RECORDED_ML', 'SIMULATED', 'SEEDED');
create type compartment as enum ('WET', 'DRY');
create type decision_state as enum ('CAPTURED', 'EVALUATING', 'ACCEPTED', 'FLAGGED', 'REVIEW_ACCEPTED', 'REVIEW_NO_ACTION', 'VERIFIED_VIOLATION', 'PENALIZED', 'CLOSED');
create type transport_state as enum ('PENDING', 'IN_FLIGHT', 'ACKED', 'DEAD_LETTER', 'AUTH_BLOCKED');

create table profiles (
  id uuid primary key default gen_random_uuid(),
  role text not null check (role in ('CITIZEN', 'MUNICIPAL_OPERATOR', 'VERIFICATION_OFFICER', 'DEVELOPER', 'SYSTEM_ADMIN')),
  display_alias text not null,
  created_at timestamptz not null default now()
);

create table citizens (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id),
  household_suffix text not null unique,
  fictional boolean not null default true
);

create table citizen_qr_tokens (
  id uuid primary key default gen_random_uuid(),
  citizen_id uuid not null references citizens(id),
  token_hash text not null unique,
  display_suffix text not null,
  expires_at timestamptz not null,
  revoked_at timestamptz
);

create table gateways (
  id uuid primary key default gen_random_uuid(),
  gateway_code text not null unique,
  hmac_key_version integer not null default 1
);

create table devices (
  id uuid primary key default gen_random_uuid(),
  gateway_id uuid not null references gateways(id),
  device_code text not null unique,
  firmware_version text not null
);

create table device_components (
  id uuid primary key default gen_random_uuid(),
  device_id uuid not null references devices(id),
  component_code text not null,
  state text not null check (state in ('OK', 'DEGRADED', 'MISSING', 'FAILED', 'UNKNOWN')),
  unique (device_id, component_code)
);

create table disposal_sessions (
  id uuid primary key default gen_random_uuid(),
  citizen_id uuid not null references citizens(id),
  device_id uuid references devices(id),
  selected_compartment compartment not null,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table ingest_messages (
  id uuid primary key default gen_random_uuid(),
  message_id uuid not null unique,
  idempotency_key text not null unique,
  payload_hash text not null,
  created_at timestamptz not null default now()
);

create table idempotency_records (
  key text primary key,
  body_hash text not null,
  response jsonb not null,
  created_at timestamptz not null default now()
);

create table rulesets (
  version text primary key,
  config jsonb not null,
  active boolean not null default false
);

create table disposal_events (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null unique,
  citizen_id uuid not null references citizens(id),
  session_id uuid not null references disposal_sessions(id),
  device_id uuid not null references devices(id),
  event_source event_source not null,
  selected_compartment compartment not null,
  triggered_compartment compartment,
  decision_state decision_state not null default 'CAPTURED',
  transport_state transport_state not null default 'PENDING',
  occurred_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table sensor_readings (
  id uuid primary key default gen_random_uuid(),
  disposal_event_id uuid not null references disposal_events(id),
  component_code text not null,
  value numeric,
  unit text,
  quality text not null
);

create table ml_detections (
  id uuid primary key default gen_random_uuid(),
  disposal_event_id uuid not null references disposal_events(id),
  evidence_source evidence_source not null,
  status text not null,
  label text,
  category text not null check (category in ('WET', 'DRY', 'UNKNOWN')),
  score numeric check (score is null or (score >= 0 and score <= 1)),
  model_version text not null,
  weights_hash_suffix text not null,
  created_at timestamptz not null default now(),
  unique (disposal_event_id, model_version)
);

create table segregation_results (
  id uuid primary key default gen_random_uuid(),
  disposal_event_id uuid not null unique references disposal_events(id),
  ruleset_version text not null references rulesets(version),
  automated_result text not null check (automated_result in ('ACCEPTED', 'FLAGGED')),
  reason_codes text[] not null,
  immediate_point_delta integer not null check (immediate_point_delta in (0, 10)),
  created_at timestamptz not null default now()
);

create table review_cases (
  id uuid primary key default gen_random_uuid(),
  disposal_event_id uuid not null unique references disposal_events(id),
  status text not null check (status in ('OPEN', 'REVIEW_ACCEPTED', 'REVIEW_NO_ACTION', 'VERIFIED_VIOLATION')),
  reason_code text not null,
  created_at timestamptz not null default now()
);

create table review_decisions (
  id uuid primary key default gen_random_uuid(),
  review_case_id uuid not null unique references review_cases(id),
  actor_profile_id uuid not null references profiles(id),
  outcome text not null check (outcome in ('REVIEW_ACCEPTED', 'REVIEW_NO_ACTION', 'VERIFIED_VIOLATION')),
  point_delta integer not null check (point_delta in (0, 10, -10, -20)),
  reason text not null,
  created_at timestamptz not null default now()
);

create table point_transactions (
  id uuid primary key default gen_random_uuid(),
  disposal_event_id uuid not null references disposal_events(id),
  citizen_id uuid not null references citizens(id),
  review_decision_id uuid references review_decisions(id),
  amount integer not null check (amount in (10, -10, -20)),
  reason text not null check (reason in ('AWARD', 'VIOLATION', 'REVERSAL')),
  created_at timestamptz not null default now(),
  unique (disposal_event_id, reason)
);

create table disputes (
  id uuid primary key default gen_random_uuid(),
  citizen_id uuid not null references citizens(id),
  disposal_event_id uuid not null references disposal_events(id),
  status text not null default 'OPEN',
  reason text not null,
  created_at timestamptz not null default now()
);

create table badges (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null
);

create table citizen_badges (
  citizen_id uuid not null references citizens(id),
  badge_id uuid not null references badges(id),
  awarded_at timestamptz not null default now(),
  primary key (citizen_id, badge_id)
);

create table device_heartbeats (
  id uuid primary key default gen_random_uuid(),
  device_id uuid not null references devices(id),
  state text not null,
  received_at timestamptz not null default now()
);

create table device_telemetry (
  id uuid primary key default gen_random_uuid(),
  device_id uuid not null references devices(id),
  component_code text not null,
  value numeric,
  unit text,
  quality text not null,
  received_at timestamptz not null default now()
);

create table audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_profile_id uuid references profiles(id),
  action text not null,
  target_id uuid,
  safe_details jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create view citizen_point_balances as
select citizen_id, coalesce(sum(amount), 0)::integer as balance
from point_transactions
group by citizen_id;

create view citizen_tiers as
select citizen_id,
  case
    when balance >= 2000 then 'PLATINUM'
    when balance >= 1000 then 'GOLD'
    when balance >= 500 then 'SILVER'
    else 'BRONZE'
  end as tier
from citizen_point_balances;

create view leaderboard_public as
select p.display_alias, b.balance
from citizen_point_balances b
join citizens c on c.id = b.citizen_id
join profiles p on p.id = c.profile_id
where c.fictional = true
order by b.balance desc;

alter table profiles enable row level security;
alter table citizens enable row level security;
alter table disposal_events enable row level security;
alter table point_transactions enable row level security;
alter table disputes enable row level security;

create policy "fictional demo profiles readable" on profiles for select using (true);
create policy "fictional demo citizens readable" on citizens for select using (fictional = true);
create policy "demo events readable" on disposal_events for select using (true);
create policy "demo ledger readable" on point_transactions for select using (true);
create policy "demo disputes readable" on disputes for select using (true);
