-- Migration 010: Seed and Verification Helper Functions
-- Supabase PostgreSQL — forward-only migration

-- ============================================================
-- Verification helpers for seed reconciliation and testing
-- ============================================================

-- Count events by source for a citizen
create or replace function public.verify_event_count_by_source(
  p_citizen_id uuid
)
returns table(source text, count bigint)
language sql
security definer
stable
as $$
  select event_source, count(*)
  from public.disposal_events
  where citizen_id = p_citizen_id
  group by event_source;
$$;

-- Verify all accepted events have exactly one +10 award
create or replace function public.verify_accepted_awards()
returns table(event_id uuid, has_award boolean, award_count bigint)
language sql
security definer
stable
as $$
  select de.id,
    exists(select 1 from public.point_transactions pt where pt.event_id = de.id and pt.entry_kind = 'AWARD'),
    coalesce((select count(*) from public.point_transactions pt where pt.event_id = de.id and pt.entry_kind = 'AWARD'), 0)
  from public.disposal_events de
  where de.decision_state in ('ACCEPTED', 'REVIEW_ACCEPTED');
$$;

-- Verify no automated violations exist (invariant: automation never creates -10/-20)
create or replace function public.verify_no_auto_violations()
returns boolean
language sql
security definer
stable
as $$
  select not exists (
    select 1 from public.point_transactions
    where entry_kind = 'VIOLATION'
      and review_decision_id is null
  );
$$;

-- Get citizen point balance from ledger sum
create or replace function public.get_citizen_balance(p_citizen_id uuid)
returns bigint
language sql
security definer
stable
as $$
  select coalesce(sum(points_delta), 0)::bigint
  from public.point_transactions
  where citizen_id = p_citizen_id;
$$;

-- Verify a citizen's displayed balance matches ledger sum
create or replace function public.verify_balance_consistency(p_citizen_id uuid)
returns boolean
language sql
security definer
stable
as $$
  select (
    select points_balance from public.citizen_point_balances
    where citizen_id = p_citizen_id
  ) = public.get_citizen_balance(p_citizen_id);
$$;

-- Verify no flagged events have automatic point effects
create or replace function public.verify_flagged_no_points()
returns boolean
language sql
security definer
stable
as $$
  select not exists (
    select 1 from public.disposal_events de
    join public.point_transactions pt on pt.event_id = de.id
    where de.decision_state = 'FLAGGED'
      and pt.entry_kind in ('AWARD', 'VIOLATION')
  );
$$;

-- Get full reconciliation report
create or replace function public.verify_seed_reconciliation()
returns jsonb
language sql
security definer
stable
as $$
  select jsonb_build_object(
    'total_events', (select count(*) from public.disposal_events),
    'total_citizens', (select count(*) from public.citizens),
    'total_point_transactions', (select count(*) from public.point_transactions),
    'total_review_cases', (select count(*) from public.review_cases),
    'accepted_events', (select count(*) from public.disposal_events where decision_state in ('ACCEPTED', 'REVIEW_ACCEPTED')),
    'flagged_events', (select count(*) from public.disposal_events where decision_state = 'FLAGGED'),
    'no_auto_violations', public.verify_no_auto_violations(),
    'flagged_no_points', public.verify_flagged_no_points(),
    'citizens_with_balances', (
      select jsonb_agg(jsonb_build_object(
        'citizen_id', cpb.citizen_id,
        'balance', cpb.points_balance,
        'consistent', public.verify_balance_consistency(cpb.citizen_id)
      ))
      from public.citizen_point_balances cpb
    )
  );
$$;

comment on function public.verify_seed_reconciliation is 'Full seed reconciliation report for QA verification.';

-- Verify all review decisions reference valid reviewer roles
create or replace function public.verify_reviewer_roles()
returns boolean
language sql
security definer
stable
as $$
  select not exists (
    select 1 from public.review_decisions rd
    join public.profiles p on p.id = rd.reviewer_id
    where p.app_role not in ('MUNICIPAL_REVIEWER', 'MUNICIPAL_ADMIN', 'SYSTEM_ADMIN')
  );
$$;

-- Verify dispute reversal is compensating (reversal delta = -original)
create or replace function public.verify_reversal_compensation()
returns boolean
language sql
security definer
stable
as $$
  select not exists (
    select 1 from public.point_transactions reversal
    join public.point_transactions original
      on original.id = reversal.reversed_transaction_id
    where reversal.entry_kind = 'REVERSAL'
      and reversal.points_delta <> -original.points_delta
  );
$$;
