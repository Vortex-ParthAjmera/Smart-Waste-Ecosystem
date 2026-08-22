-- Migration 009: Transaction RPCs — Idempotent Atomic Operations
-- Supabase PostgreSQL — forward-only migration

-- ============================================================
-- record_review_decision_v1
-- Atomic: claim idempotency, lock case, enforce role/state,
--   append decision, create point effect if applicable,
--   transition event/case, audit, store response.
-- ============================================================
create or replace function public.record_review_decision_v1(
  p_case_id          uuid,
  p_decision         text,
  p_violation_severity text,
  p_reason_code      text,
  p_notes            text,
  p_idempotency_key  uuid
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_actor_id       uuid;
  v_actor_role     text;
  v_case           record;
  v_event          record;
  v_decision_id    uuid;
  v_points_delta   integer;
  v_point_tx_id    uuid;
  v_request_hash   text;
  v_existing       record;
begin
  v_actor_id := auth.uid();

  -- 1. Enforce reviewer role
  v_actor_role := public.get_user_role();
  if v_actor_role not in ('MUNICIPAL_REVIEWER', 'MUNICIPAL_ADMIN', 'SYSTEM_ADMIN') then
    raise exception 'FORBIDDEN: only reviewers/admins may decide review cases'
      using errcode = '42501';
  end if;

  -- 2. Atomic idempotency claim
  v_request_hash := encode(
    sha256(
      (p_case_id::text || p_decision || coalesce(p_violation_severity, '') ||
       coalesce(p_reason_code, '') || coalesce(p_notes, ''))::bytea
    ), 'hex'
  );

  insert into public.idempotency_records
    (scope, actor_id, idempotency_key, request_hash, status)
  values
    ('REVIEW_DECISION', v_actor_id, p_idempotency_key, v_request_hash, 'IN_PROGRESS')
  on conflict (scope, actor_id, idempotency_key) do update
    set status = case
      when idempotency_records.status = 'IN_PROGRESS' then
        raise exception '409 REQUEST_IN_PROGRESS' using errcode = '409'
      when idempotency_records.request_hash = excluded.request_hash then
        'SUCCEEDED'
      else
        raise exception '409 IDEMPOTENCY_CONFLICT' using errcode = '409'
    end
  returning id into v_point_tx_id; -- reuse temp variable

  -- Check if already succeeded (exact replay)
  select * into v_existing
  from public.idempotency_records
  where scope = 'REVIEW_DECISION'
    and actor_id = v_actor_id
    and idempotency_key = p_idempotency_key
    and status = 'SUCCEEDED';

  if v_existing is not null then
    return jsonb_build_object(
      'idempotent', true,
      'case_id', p_case_id,
      'decision', p_decision
    );
  end if;

  -- 3. Lock and validate the case
  select * into v_case
  from public.review_cases
  where id = p_case_id
    for update;

  if v_case is null then
    raise exception 'NOT_FOUND: review case not found';
  end if;

  if v_case.status not in ('OPEN', 'ASSIGNED') then
    raise exception 'CONFLICT: review case is not open for decision (status: %)', v_case.status;
  end if;

  -- 4. Get the linked event
  select * into v_event
  from public.disposal_events
  where id = v_case.event_id;

  if v_event.decision_state <> 'FLAGGED' then
    raise exception 'CONFLICT: event is not in FLAGGED state';
  end if;

  -- 5. Enforce decision validity
  if p_decision not in ('REVIEW_ACCEPTED', 'REVIEW_NO_ACTION', 'VERIFIED_VIOLATION') then
    raise exception 'VALIDATION_ERROR: invalid decision';
  end if;

  if p_decision = 'VERIFIED_VIOLATION' and p_violation_severity not in ('NORMAL', 'SEVERE') then
    raise exception 'VALIDATION_ERROR: violation_severity must be NORMAL or SEVERE for VERIFIED_VIOLATION';
  end if;

  if p_decision in ('REVIEW_ACCEPTED', 'REVIEW_NO_ACTION') and p_violation_severity is not null then
    raise exception 'VALIDATION_ERROR: violation_severity must be null for REVIEW_ACCEPTED/REVIEW_NO_ACTION';
  end if;

  -- 6. Append the review decision
  v_decision_id := gen_random_uuid();

  insert into public.review_decisions (
    id, case_id, reviewer_id, decision, violation_severity, reason_code, notes
  ) values (
    v_decision_id, p_case_id, v_actor_id, p_decision, p_violation_severity,
    p_reason_code, p_notes
  );

  -- 7. Create point effect
  v_points_delta := 0;

  if p_decision = 'REVIEW_ACCEPTED' then
    -- Append +10 only if no award exists for this event
    if not exists (
      select 1 from public.point_transactions
      where event_id = v_event.id and entry_kind = 'AWARD'
    ) then
      v_point_tx_id := gen_random_uuid();
      insert into public.point_transactions (
        id, citizen_id, event_id, review_decision_id, entry_kind,
        points_delta, reason_code, created_by, idempotency_key
      ) values (
        v_point_tx_id, v_event.citizen_id, v_event.id, v_decision_id,
        'AWARD', 10, 'REVIEW_ACCEPTED', v_actor_id, gen_random_uuid()
      );
      v_points_delta := 10;
    end if;

  elsif p_decision = 'VERIFIED_VIOLATION' then
    if p_violation_severity = 'NORMAL' then
      v_points_delta := -10;
    elsif p_violation_severity = 'SEVERE' then
      v_points_delta := -20;
    end if;

    v_point_tx_id := gen_random_uuid();
    insert into public.point_transactions (
      id, citizen_id, event_id, review_decision_id, entry_kind,
      points_delta, reason_code, created_by, idempotency_key
    ) values (
      v_point_tx_id, v_event.citizen_id, v_event.id, v_decision_id,
      'VIOLATION', v_points_delta, p_reason_code, v_actor_id, gen_random_uuid()
    );
  end if;
  -- REVIEW_NO_ACTION: no ledger row, case just closes

  -- 8. Transition event and case states
  update public.disposal_events
  set decision_state = case
    when p_decision = 'REVIEW_ACCEPTED' then 'REVIEW_ACCEPTED'
    when p_decision = 'REVIEW_NO_ACTION' then 'REVIEW_NO_ACTION'
    when p_decision = 'VERIFIED_VIOLATION' then 'VERIFIED_VIOLATION'
  end,
  processing_state = case
    when p_decision in ('REVIEW_ACCEPTED', 'REVIEW_NO_ACTION') then 'COMPLETED'
    when p_decision = 'VERIFIED_VIOLATION' then 'COMPLETED'
  end,
  updated_at = now()
  where id = v_event.id;

  update public.review_cases
  set status = 'DECIDED',
      decided_at = now()
  where id = p_case_id;

  -- 9. Mark idempotency succeeded
  update public.idempotency_records
  set status = 'SUCCEEDED',
      response_status = 200,
      response_json = jsonb_build_object(
        'case_id', p_case_id,
        'decision', p_decision,
        'points_delta', v_points_delta
      ),
      completed_at = now()
  where scope = 'REVIEW_DECISION'
    and actor_id = v_actor_id
    and idempotency_key = p_idempotency_key;

  -- 10. Audit
  insert into public.audit_logs (
    actor_profile_id, actor_type, action, target_type, target_id,
    request_id, source_label, safe_metadata
  ) values (
    v_actor_id, 'USER', 'REVIEW_DECISION', 'review_case', p_case_id,
    p_idempotency_key, 'CLOUD', jsonb_build_object(
      'decision', p_decision,
      'violation_severity', p_violation_severity,
      'reason_code', p_reason_code,
      'points_delta', v_points_delta
    )
  );

  return jsonb_build_object(
    'idempotent', false,
    'case_id', p_case_id,
    'decision', p_decision,
    'points_delta', v_points_delta
  );
end;
$$;

comment on function public.record_review_decision_v1 is 'Atomically record a review decision with idempotency.';

-- ============================================================
-- submit_dispute_v1
-- ============================================================
create or replace function public.submit_dispute_v1(
  p_negative_transaction_id  uuid,
  p_citizen_reason           text,
  p_idempotency_key          uuid
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_citizen_id  uuid;
  v_tx          record;
  v_dispute_id  uuid;
  v_request_hash text;
  v_existing    record;
begin
  v_citizen_id := public.get_user_citizen_id();

  if v_citizen_id is null then
    raise exception 'FORBIDDEN: only citizens may file disputes'
      using errcode = '42501';
  end if;

  -- Idempotency claim
  v_request_hash := encode(
    sha256(
      (p_negative_transaction_id::text || p_citizen_reason)::bytea
    ), 'hex'
  );

  insert into public.idempotency_records
    (scope, actor_id, idempotency_key, request_hash, status)
  values
    ('DISPUTE', (select profile_id from public.citizens where id = v_citizen_id),
     p_idempotency_key, v_request_hash, 'IN_PROGRESS')
  on conflict (scope, actor_id, idempotency_key) do update
    set status = case
      when idempotency_records.request_hash = excluded.request_hash then 'SUCCEEDED'
      else raise exception '409 IDEMPOTENCY_CONFLICT' using errcode = '409'
    end
  returning 1 into v_dispute_id;

  -- Check replay
  select * into v_existing
  from public.idempotency_records
  where scope = 'DISPUTE'
    and actor_id = (select profile_id from public.citizens where id = v_citizen_id)
    and idempotency_key = p_idempotency_key
    and status = 'SUCCEEDED';

  if v_existing is not null then
    select id into v_dispute_id from public.disputes
    where citizen_id = v_citizen_id
      and negative_transaction_id = p_negative_transaction_id;
    return jsonb_build_object('idempotent', true, 'dispute_id', v_dispute_id);
  end if;

  -- Validate the negative transaction exists and belongs to citizen
  select * into v_tx
  from public.point_transactions
  where id = p_negative_transaction_id
    and entry_kind = 'VIOLATION'
    and citizen_id = v_citizen_id;

  if v_tx is null then
    raise exception 'NOT_FOUND: eligible negative transaction not found';
  end if;

  -- Check no active dispute exists
  if exists (
    select 1 from public.disputes
    where negative_transaction_id = p_negative_transaction_id
      and status in ('OPEN', 'UNDER_REVIEW')
  ) then
    raise exception 'CONFLICT: active dispute already exists for this transaction';
  end if;

  -- Create dispute
  v_dispute_id := gen_random_uuid();
  insert into public.disputes (
    id, citizen_id, negative_transaction_id, citizen_reason
  ) values (
    v_dispute_id, v_citizen_id, p_negative_transaction_id, p_citizen_reason
  );

  -- Audit
  insert into public.audit_logs (
    actor_profile_id, actor_type, action, target_type, target_id,
    request_id, source_label, safe_metadata
  ) values (
    (select profile_id from public.citizens where id = v_citizen_id),
    'USER', 'DISPUTE_SUBMITTED', 'dispute', v_dispute_id,
    p_idempotency_key, 'CLOUD', jsonb_build_object(
      'negative_transaction_id', p_negative_transaction_id
    )
  );

  return jsonb_build_object('idempotent', false, 'dispute_id', v_dispute_id);
end;
$$;

comment on function public.submit_dispute_v1 is 'Citizen submits a dispute on a negative transaction. Idempotent.';

-- ============================================================
-- resolve_dispute_v1 — compensating reversal
-- ============================================================
create or replace function public.resolve_dispute_v1(
  p_dispute_id     uuid,
  p_resolution     text,  -- 'UPHELD' or 'REVERSED'
  p_resolution_reason text,
  p_idempotency_key   uuid
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_actor_id    uuid;
  v_dispute     record;
  v_tx          record;
  v_reversal_id uuid;
begin
  v_actor_id := auth.uid();

  if not public.is_reviewer_or_above() then
    raise exception 'FORBIDDEN: only reviewers/admins may resolve disputes'
      using errcode = '42501';
  end if;

  select * into v_dispute
  from public.disputes
  where id = p_dispute_id for update;

  if v_dispute is null then
    raise exception 'NOT_FOUND: dispute not found';
  end if;

  if v_dispute.status not in ('OPEN', 'UNDER_REVIEW') then
    raise exception 'CONFLICT: dispute is not open for resolution';
  end if;

  if p_resolution not in ('UPHELD', 'REVERSED') then
    raise exception 'VALIDATION_ERROR: resolution must be UPHELD or REVERSED';
  end if;

  -- Update dispute
  update public.disputes
  set status = p_resolution,
      resolution_reason = p_resolution_reason,
      resolved_by = v_actor_id,
      resolved_at = now()
  where id = p_dispute_id;

  -- If REVERSED, create compensating reversal transaction
  if p_resolution = 'REVERSED' then
    select * into v_tx
    from public.point_transactions
    where id = v_dispute.negative_transaction_id;

    v_reversal_id := gen_random_uuid();
    insert into public.point_transactions (
      id, citizen_id, event_id, review_decision_id, entry_kind,
      points_delta, reason_code, reversed_transaction_id,
      created_by, idempotency_key
    ) values (
      v_reversal_id, v_dispute.citizen_id, v_tx.event_id, v_tx.review_decision_id,
      'REVERSAL', -v_tx.points_delta, 'DISPUTE_REVERSED',
      v_dispute.negative_transaction_id, v_actor_id, gen_random_uuid()
    );
  end if;

  -- Audit
  insert into public.audit_logs (
    actor_profile_id, actor_type, action, target_type, target_id,
    request_id, source_label, safe_metadata
  ) values (
    v_actor_id, 'USER', 'DISPUTE_RESOLVED', 'dispute', p_dispute_id,
    p_idempotency_key, 'CLOUD', jsonb_build_object(
      'resolution', p_resolution,
      'reason', p_resolution_reason
    )
  );

  return jsonb_build_object(
    'dispute_id', p_dispute_id,
    'resolution', p_resolution,
    'reversal_created', p_resolution = 'REVERSED'
  );
end;
$$;

comment on function public.resolve_dispute_v1 is 'Admin resolves a dispute with compensating reversal.';
