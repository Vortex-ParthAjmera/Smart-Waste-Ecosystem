-- Migration 005: Segregation Results, Review Cases, Review Decisions, Point Transactions, Disputes
-- Supabase PostgreSQL — forward-only migration

-- ============================================================
-- 14. segregation_results — immutable automated evaluation
-- ============================================================
create table public.segregation_results (
  id                  uuid primary key default gen_random_uuid(),
  event_id            uuid not null unique references public.disposal_events(id) on delete restrict,
  ruleset_id          uuid not null references public.rulesets(id),
  outcome             text not null check (outcome in ('ACCEPTED', 'FLAGGED')),
  suggested_severity  text not null check (suggested_severity in ('NONE', 'NORMAL', 'SEVERE')),
  reason_codes        text[] not null,
  input_hash          text not null check (input_hash ~ '^[0-9a-f]{64}$'),
  evaluated_at        timestamptz not null default now()
);

comment on table public.segregation_results is 'Immutable automated ACCEPTED/FLAGGED evaluation result per event.';

-- ============================================================
-- 15. review_cases — human review queue for flagged events
-- ============================================================
create table public.review_cases (
  id                  uuid primary key default gen_random_uuid(),
  event_id            uuid not null unique references public.disposal_events(id) on delete restrict,
  status              text not null default 'OPEN'
    check (status in ('OPEN', 'ASSIGNED', 'DECIDED', 'CANCELLED')),
  reason_codes        text[] not null,
  suggested_severity  text not null check (suggested_severity in ('NONE', 'NORMAL', 'SEVERE')),
  assigned_to         uuid references public.profiles(id),
  opened_at           timestamptz not null default now(),
  decided_at          timestamptz
);

comment on table public.review_cases is 'Human review queue for flagged disposal events.';

-- ============================================================
-- 16. review_decisions — authorized final review (append-only)
-- ============================================================
create table public.review_decisions (
  id                   uuid primary key default gen_random_uuid(),
  case_id              uuid not null unique references public.review_cases(id) on delete restrict,
  reviewer_id          uuid not null references public.profiles(id),
  decision             text not null check (decision in (
    'REVIEW_ACCEPTED', 'REVIEW_NO_ACTION', 'VERIFIED_VIOLATION'
  )),
  violation_severity   text check (violation_severity in ('NORMAL', 'SEVERE')),
  reason_code          text not null,
  notes                text check (notes is null or char_length(notes) <= 500),
  decided_at           timestamptz not null default now(),
  check (
    (decision = 'VERIFIED_VIOLATION' and violation_severity is not null)
    or
    (decision in ('REVIEW_ACCEPTED', 'REVIEW_NO_ACTION') and violation_severity is null)
  )
);

comment on table public.review_decisions is 'Authorized final review decisions. Append-only.';

-- ============================================================
-- 17. point_transactions — award, violation, reversal (append-only ledger)
-- ============================================================
create table public.point_transactions (
  id                       uuid primary key default gen_random_uuid(),
  citizen_id               uuid not null references public.citizens(id) on delete restrict,
  event_id                 uuid references public.disposal_events(id) on delete restrict,
  review_decision_id       uuid references public.review_decisions(id) on delete restrict,
  entry_kind               text not null check (entry_kind in ('AWARD', 'VIOLATION', 'REVERSAL')),
  points_delta             integer not null,
  reason_code              text not null,
  reversed_transaction_id  uuid references public.point_transactions(id) on delete restrict,
  created_by               uuid references public.profiles(id),
  idempotency_key          uuid not null unique,
  created_at               timestamptz not null default now(),
  metadata                 jsonb not null default '{}',
  check (
    (entry_kind = 'AWARD' and points_delta = 10 and event_id is not null)
    or
    (entry_kind = 'VIOLATION' and points_delta in (-10, -20)
      and event_id is not null and review_decision_id is not null)
    or
    (entry_kind = 'REVERSAL' and points_delta <> 0 and reversed_transaction_id is not null)
  )
);

comment on table public.point_transactions is 'Append-only point ledger: award, violation, reversal.';

create unique index one_award_per_event
  on public.point_transactions (event_id)
  where entry_kind = 'AWARD';

create unique index one_violation_per_event
  on public.point_transactions (event_id)
  where entry_kind = 'VIOLATION';

create unique index one_reversal_per_transaction
  on public.point_transactions (reversed_transaction_id)
  where entry_kind = 'REVERSAL';

-- ============================================================
-- 18. disputes — citizen challenge to a negative transaction
-- ============================================================
create table public.disputes (
  id                       uuid primary key default gen_random_uuid(),
  citizen_id               uuid not null references public.citizens(id) on delete restrict,
  negative_transaction_id  uuid not null unique references public.point_transactions(id) on delete restrict,
  status                   text not null default 'OPEN'
    check (status in ('OPEN', 'UNDER_REVIEW', 'UPHELD', 'REVERSED', 'CLOSED')),
  citizen_reason           text not null
    check (char_length(citizen_reason) between 5 and 500),
  resolution_reason        text,
  resolved_by              uuid references public.profiles(id),
  created_at               timestamptz not null default now(),
  resolved_at              timestamptz
);

comment on table public.disputes is 'Citizen challenges to negative point transactions.';
