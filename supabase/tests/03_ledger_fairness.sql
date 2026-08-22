-- ============================================================
-- Test Suite 03: Ledger Invariant and Fairness Tests
-- Verifies non-negotiable fairness properties of the point system.
-- ============================================================

-- ============================================================
-- 1. Balance is always sum of point_transactions (never editable)
-- ============================================================
SELECT public._test_result('all balances match ledger sum',
  NOT EXISTS (
    SELECT 1 FROM public.citizens c
    WHERE public.get_citizen_balance(c.id) <> (
      SELECT coalesce(sum(points_delta), 0)
      FROM public.point_transactions pt
      WHERE pt.citizen_id = c.id
    )
  ));

-- ============================================================
-- 2. AWARD invariants
-- ============================================================
-- Every AWARD is exactly +10
SELECT public._test_result('all AWARDS are exactly +10',
  NOT EXISTS (
    SELECT 1 FROM public.point_transactions
    WHERE entry_kind = 'AWARD' AND points_delta <> 10
  ));

-- Every AWARD references an event
SELECT public._test_result('all AWARDS reference an event',
  NOT EXISTS (
    SELECT 1 FROM public.point_transactions
    WHERE entry_kind = 'AWARD' AND event_id IS NULL
  ));

-- At most one AWARD per event (unique partial index)
SELECT public._test_result('at most one AWARD per event',
  NOT EXISTS (
    SELECT event_id, count(*)
    FROM public.point_transactions
    WHERE entry_kind = 'AWARD'
    GROUP BY event_id
    HAVING count(*) > 1
  ));

-- ============================================================
-- 3. VIOLATION invariants
-- ============================================================
-- Every VIOLATION references a review_decision
SELECT public._test_result('all VIOLATIONS reference a review_decision',
  NOT EXISTS (
    SELECT 1 FROM public.point_transactions
    WHERE entry_kind = 'VIOLATION' AND review_decision_id IS NULL
  ));

-- VIOLATION is either -10 or -20
SELECT public._test_result('all VIOLATIONS are -10 or -20',
  NOT EXISTS (
    SELECT 1 FROM public.point_transactions
    WHERE entry_kind = 'VIOLATION' AND points_delta NOT IN (-10, -20)
  ));

-- No automated violations (review_decision_id required)
SELECT public._test_result('no automated violations exist',
  public.verify_no_auto_violations());

-- At most one VIOLATION per event
SELECT public._test_result('at most one VIOLATION per event',
  NOT EXISTS (
    SELECT event_id, count(*)
    FROM public.point_transactions
    WHERE entry_kind = 'VIOLATION'
    GROUP BY event_id
    HAVING count(*) > 1
  ));

-- -10 requires NORMAL severity
SELECT public._test_result('-10 violations reference NORMAL review',
  NOT EXISTS (
    SELECT 1 FROM public.point_transactions pt
    JOIN public.review_decisions rd ON rd.id = pt.review_decision_id
    WHERE pt.entry_kind = 'VIOLATION'
      AND pt.points_delta = -10
      AND rd.violation_severity <> 'NORMAL'
  ));

-- -20 requires SEVERE severity
SELECT public._test_result('-20 violations reference SEVERE review',
  NOT EXISTS (
    SELECT 1 FROM public.point_transactions pt
    JOIN public.review_decisions rd ON rd.id = pt.review_decision_id
    WHERE pt.entry_kind = 'VIOLATION'
      AND pt.points_delta = -20
      AND rd.violation_severity <> 'SEVERE'
  ));

-- ============================================================
-- 4. REVERSAL invariants
-- ============================================================
-- Every REVERSAL references a reversed transaction
SELECT public._test_result('all REVERSALS reference a transaction',
  NOT EXISTS (
    SELECT 1 FROM public.point_transactions
    WHERE entry_kind = 'REVERSAL' AND reversed_transaction_id IS NULL
  ));

-- Reversal is compensating (delta = -original)
SELECT public._test_result('reversal delta negates original',
  public.verify_reversal_compensation());

-- At most one reversal per transaction
SELECT public._test_result('at most one reversal per transaction',
  NOT EXISTS (
    SELECT reversed_transaction_id, count(*)
    FROM public.point_transactions
    WHERE entry_kind = 'REVERSAL'
      AND reversed_transaction_id IS NOT NULL
    GROUP BY reversed_transaction_id
    HAVING count(*) > 1
  ));

-- ============================================================
-- 5. FLAGGED events never auto-penalize
-- ============================================================
SELECT public._test_result('flagged events have no automatic point effects',
  public.verify_flagged_no_points());

-- ============================================================
-- 6. Review decision constraints
-- ============================================================
-- REVIEW_ACCEPTED or REVIEW_NO_ACTION must have null violation_severity
SELECT public._test_result('REVIEW_ACCEPTED has null violation_severity',
  NOT EXISTS (
    SELECT 1 FROM public.review_decisions
    WHERE decision = 'REVIEW_ACCEPTED' AND violation_severity IS NOT NULL
  ));

SELECT public._test_result('REVIEW_NO_ACTION has null violation_severity',
  NOT EXISTS (
    SELECT 1 FROM public.review_decisions
    WHERE decision = 'REVIEW_NO_ACTION' AND violation_severity IS NOT NULL
  ));

-- VERIFIED_VIOLATION must have violation_severity
SELECT public._test_result('VERIFIED_VIOLATION has violation_severity',
  NOT EXISTS (
    SELECT 1 FROM public.review_decisions
    WHERE decision = 'VERIFIED_VIOLATION' AND violation_severity IS NULL
  ));

-- All reviewers have valid roles
SELECT public._test_result('all reviewers have valid roles',
  public.verify_reviewer_roles());

-- ============================================================
-- 7. Every event has valid source labels
-- ============================================================
SELECT public._test_result('all event sources are valid',
  NOT EXISTS (
    SELECT 1 FROM public.disposal_events
    WHERE event_source NOT IN ('HARDWARE', 'RECORDED_HARDWARE', 'SIMULATED', 'SEEDED')
  ));

-- ============================================================
-- 8. Every ML detection has valid evidence source
-- ============================================================
SELECT public._test_result('all ML evidence sources are valid',
  NOT EXISTS (
    SELECT 1 FROM public.ml_detections
    WHERE evidence_source NOT IN ('LOCAL_LIVE', 'RECORDED_ML', 'SIMULATED', 'SEEDED')
  ));

-- ============================================================
-- 9. ML detection score constraints
-- ============================================================
SELECT public._test_result('DETECTED ML has score and label',
  NOT EXISTS (
    SELECT 1 FROM public.ml_detections
    WHERE status = 'DETECTED'
      AND (score IS NULL OR detected_label IS NULL)
  ));

SELECT public._test_result('non-DETECTED ML has no score/label',
  NOT EXISTS (
    SELECT 1 FROM public.ml_detections
    WHERE status <> 'DETECTED'
      AND (score IS NOT NULL OR detected_label IS NOT NULL)
  ));

-- ============================================================
-- 10. GPS location consistency
-- ============================================================
SELECT public._test_result('GPS_NO_FIX has no coordinates',
  NOT EXISTS (
    SELECT 1 FROM public.disposal_events
    WHERE location_quality IN ('NO_FIX', 'SIMULATED')
      AND (latitude IS NOT NULL OR longitude IS NOT NULL)
  ));

SELECT public._test_result('GPS with coordinates has both lat and lon',
  NOT EXISTS (
    SELECT 1 FROM public.disposal_events
    WHERE location_quality IN ('GPS_2D', 'GPS_3D')
      AND (latitude IS NULL OR longitude IS NULL)
  ));

-- ============================================================
-- 11. No negative point effects without review
-- ============================================================
SELECT public._test_result('no VIOLATION without review_decision_id',
  NOT EXISTS (
    SELECT 1 FROM public.point_transactions
    WHERE entry_kind = 'VIOLATION' AND review_decision_id IS NULL
  ));

-- ============================================================
-- 12. Event processing state progression
-- ============================================================
SELECT public._test_result('all events have valid processing_state',
  NOT EXISTS (
    SELECT 1 FROM public.disposal_events
    WHERE processing_state NOT IN (
      'DISPOSAL_STARTED', 'SENSOR_CAPTURED', 'ML_PENDING', 'ML_RECEIVED',
      'ML_UNAVAILABLE', 'PROCESSING', 'SEGREGATION_DECIDED',
      'POINTS_CALCULATED', 'REVIEW_REQUIRED', 'COMPLETED', 'PROCESSING_FAILED'
    )
  ));

SELECT public._test_result('all events have valid decision_state',
  NOT EXISTS (
    SELECT 1 FROM public.disposal_events
    WHERE decision_state NOT IN (
      'CAPTURED', 'EVALUATING', 'ACCEPTED', 'FLAGGED',
      'REVIEW_ACCEPTED', 'REVIEW_NO_ACTION', 'VERIFIED_VIOLATION',
      'PENALIZED', 'CLOSED'
    )
  ));

-- ============================================================
-- 13. QR token lifecycle consistency
-- ============================================================
SELECT public._test_result('ACTIVE tokens have no used_at',
  NOT EXISTS (
    SELECT 1 FROM public.citizen_qr_tokens
    WHERE status = 'ACTIVE' AND used_at IS NOT NULL
  ));

SELECT public._test_result('USED tokens have used_at',
  NOT EXISTS (
    SELECT 1 FROM public.citizen_qr_tokens
    WHERE status = 'USED' AND used_at IS NULL
  ));

SELECT public._test_result('REVOKED tokens have revoked_at',
  NOT EXISTS (
    SELECT 1 FROM public.citizen_qr_tokens
    WHERE status = 'REVOKED' AND revoked_at IS NULL
  ));

-- ============================================================
-- 14. No Tier 2 tables exist
-- ============================================================
SELECT public._test_result('no trucks table',
  NOT EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='trucks'));
SELECT public._test_result('no truck_locations table',
  NOT EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='truck_locations'));
SELECT public._test_result('no collection_routes table',
  NOT EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='collection_routes'));
SELECT public._test_result('no municipal_zones table',
  NOT EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='municipal_zones'));

RAISE NOTICE '=== Ledger and Fairness Tests Complete ===';
