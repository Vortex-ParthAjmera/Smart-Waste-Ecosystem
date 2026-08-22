-- ============================================================
-- Test Suite 02: Seed Data Reconciliation
-- Verifies deterministic seed data meets all documented invariants.
-- Run after: supabase db reset (which applies seed.sql)
-- ============================================================

-- ============================================================
-- 1. Citizen counts
-- ============================================================
SELECT public._test_result('6 citizens seeded',
  (SELECT count(*) FROM public.citizens) = 6);

SELECT public._test_result('primary citizen has leaderboard_alias EcoWarrior_A',
  EXISTS(SELECT 1 FROM public.citizens WHERE leaderboard_alias = 'EcoWarrior_A'));

SELECT public._test_result('5 peer citizens are opt-in',
  (SELECT count(*) FROM public.citizens WHERE leaderboard_opt_in = true) = 5);

SELECT public._test_result('Raj Mehta is not opt-in',
  EXISTS(SELECT 1 FROM public.citizens WHERE leaderboard_alias = 'SegregateNow_E' AND leaderboard_opt_in = false));

-- ============================================================
-- 2. Event counts by source
-- ============================================================
SELECT public._test_result('primary citizen has 20 events',
  (SELECT count(*) FROM public.disposal_events
   WHERE citizen_id = 'b0000000-0000-0000-0000-000000000001') = 20);

SELECT public._test_result('all primary events are HARDWARE source',
  NOT EXISTS(SELECT 1 FROM public.disposal_events
             WHERE citizen_id = 'b0000000-0000-0000-0000-000000000001'
               AND event_source <> 'HARDWARE'));

SELECT public._test_result('total events >= 30 (primary + peers)',
  (SELECT count(*) FROM public.disposal_events) >= 30);

-- ============================================================
-- 3. Accepted events have exactly one +10 award
-- ============================================================
SELECT public._test_result('all accepted events have exactly one AWARD',
  NOT EXISTS (
    SELECT 1 FROM public.disposal_events de
    WHERE de.decision_state IN ('ACCEPTED', 'REVIEW_ACCEPTED')
      AND NOT EXISTS (
        SELECT 1 FROM public.point_transactions pt
        WHERE pt.event_id = de.id AND pt.entry_kind = 'AWARD' AND pt.points_delta = 10
      )
  ));

SELECT public._test_result('no event has more than one AWARD',
  NOT EXISTS (
    SELECT event_id, count(*) as cnt
    FROM public.point_transactions
    WHERE entry_kind = 'AWARD'
    GROUP BY event_id
    HAVING count(*) > 1
  ));

-- ============================================================
-- 4. Flagged events have no automatic points
-- ============================================================
SELECT public._test_result('FLAGGED events have zero point effects',
  NOT EXISTS (
    SELECT 1 FROM public.disposal_events de
    JOIN public.point_transactions pt ON pt.event_id = de.id
    WHERE de.decision_state = 'FLAGGED'
      AND pt.entry_kind IN ('AWARD', 'VIOLATION')
  ));

-- ============================================================
-- 5. Violation invariants
-- ============================================================
SELECT public._test_result('no automated violations exist',
  public.verify_no_auto_violations());

SELECT public._test_result('violation transactions reference review_decision_id',
  NOT EXISTS (
    SELECT 1 FROM public.point_transactions
    WHERE entry_kind = 'VIOLATION' AND review_decision_id IS NULL
  ));

SELECT public._test_result('violation -10 exists for normal mismatch',
  EXISTS (
    SELECT 1 FROM public.point_transactions
    WHERE entry_kind = 'VIOLATION' AND points_delta = -10
  ));

SELECT public._test_result('violation -20 exists for severe wet-in-dry',
  EXISTS (
    SELECT 1 FROM public.point_transactions
    WHERE entry_kind = 'VIOLATION' and points_delta = -20
  ));

-- ============================================================
-- 6. Reversal compensation
-- ============================================================
SELECT public._test_result('reversal compensates exactly',
  public.verify_reversal_compensation());

SELECT public._test_result('reversal exists for the dispute',
  EXISTS (
    SELECT 1 FROM public.point_transactions
    WHERE entry_kind = 'REVERSAL'
      AND reversed_transaction_id IS NOT NULL
  ));

-- ============================================================
-- 7. Ledger balance consistency
-- ============================================================
-- Primary citizen: 20 events total
--   - 15 accepted = 15 * 10 = +150 (events 1-10, 14, 18-20 = 14 accepted, plus event 14 review_accepted)
--   - Wait, let me recount:
--   Events 1-10: ACCEPTED = 10 awards = +100
--   Event 11-13: FLAGGED = 0 points
--   Event 14: REVIEW_ACCEPTED = +10 (AWARD)
--   Event 15: VERIFIED_VIOLATION NORMAL = -10
--   Event 16: VERIFIED_VIOLATION SEVERE = -20
--   Event 17: DISPUTE REVERSED for event 16 = +20 (REVERSAL of -20)
--   Events 18-20: ACCEPTED = 3 awards = +30
--   Total: 100 + 10 - 10 - 20 + 20 + 30 = 130
SELECT public._test_result('primary citizen balance is 130',
  public.get_citizen_balance('b0000000-0000-0000-0000-000000000001') = 130);

SELECT public._test_result('primary citizen balance is consistent',
  public.verify_balance_consistency('b0000000-0000-0000-0000-000000000001'));

-- ============================================================
-- 8. Peer balances
-- ============================================================
SELECT public._test_result('Neha Kapoor balance is 20',
  public.get_citizen_balance('b0000000-0000-0000-0000-000000000002') = 20);

SELECT public._test_result('Vikram Singh balance is 20',
  public.get_citizen_balance('b0000000-0000-0000-0000-000000000003') = 20);

SELECT public._test_result('Ananya Patel balance is 30',
  public.get_citizen_balance('b0000000-0000-0000-0000-000000000004') = 30);

SELECT public._test_result('Kavya Iyer balance is 20',
  public.get_citizen_balance('b0000000-0000-0000-0000-000000000006') = 20);

SELECT public._test_result('Raj Mehta balance is 10',
  public.get_citizen_balance('b0000000-0000-0000-0000-000000000005') = 10);

-- ============================================================
-- 9. Ruleset configuration
-- ============================================================
SELECT public._test_result('rules-2.0.0 is published',
  EXISTS(SELECT 1 FROM public.rulesets WHERE version='rules-2.0.0' AND status='PUBLISHED'));

SELECT public._test_result('only one published ruleset',
  (SELECT count(*) FROM public.rulesets WHERE status='PUBLISHED') = 1);

-- ============================================================
-- 10. Badge awards
-- ============================================================
SELECT public._test_result('primary citizen has FIRST badge',
  EXISTS (
    SELECT 1 FROM public.citizen_badges cb
    JOIN public.badges b ON b.id = cb.badge_id
    WHERE cb.citizen_id = 'b0000000-0000-0000-0000-000000000001'
      AND b.code = 'FIRST'
  ));

SELECT public._test_result('primary citizen has BRONZE badge',
  EXISTS (
    SELECT 1 FROM public.citizen_badges cb
    JOIN public.badges b ON b.id = cb.badge_id
    WHERE cb.citizen_id = 'b0000000-0000-0000-0000-000000000001'
      AND b.code = 'BRONZE'
  ));

-- ============================================================
-- 11. Device and components
-- ============================================================
SELECT public._test_result('ESP32-001 device exists',
  EXISTS(SELECT 1 FROM public.devices WHERE device_code='ESP32-001'));

SELECT public._test_result('EDGE-001 gateway exists',
  EXISTS(SELECT 1 FROM public.gateways WHERE gateway_code='EDGE-001'));

SELECT public._test_result('8 device components configured',
  (SELECT count(*) FROM public.device_components
   WHERE device_id = 'd0000000-0000-0000-0000-000000000002') = 8);

-- ============================================================
-- 12. Heartbeat and telemetry
-- ============================================================
SELECT public._test_result('at least 6 heartbeat records',
  (SELECT count(*) FROM public.device_heartbeats) >= 6);

SELECT public._test_result('at least 10 fill telemetry records',
  (SELECT count(*) FROM public.device_telemetry
   WHERE telemetry_code LIKE 'FILL_%') >= 10);

SELECT public._test_result('at least 3 GPS telemetry records',
  (SELECT count(*) FROM public.device_telemetry
   WHERE telemetry_code = 'GPS_LOCATION') >= 3);

-- ============================================================
-- 13. Dispute record
-- ============================================================
SELECT public._test_result('one dispute exists with REVERSED status',
  EXISTS (
    SELECT 1 FROM public.disputes WHERE status = 'REVERSED'
  ));

SELECT public._test_result('dispute resolution reason is present',
  EXISTS (
    SELECT 1 FROM public.disputes
    WHERE status = 'REVERSED'
      AND resolution_reason IS NOT NULL
      AND char_length(resolution_reason) > 0
  ));

-- ============================================================
-- 14. Tier projection
-- ============================================================
SELECT public._test_result('citizen_tiers view returns tiers',
  EXISTS(SELECT 1 FROM public.citizen_tiers));

SELECT public._test_result('primary citizen is BRONZE tier (balance 130)',
  (SELECT tier FROM public.citizen_tiers
   WHERE citizen_id = 'b0000000-0000-0000-0000-000000000001') = 'BRONZE');

-- ============================================================
-- 15. Leaderboard view
-- ============================================================
SELECT public._test_result('leaderboard_public returns opted-in aliases',
  (SELECT count(*) FROM public.leaderboard_public) = 5);

SELECT public._test_result('Raj Mehta not in leaderboard (not opt-in)',
  NOT EXISTS(SELECT 1 FROM public.leaderboard_public
             WHERE leaderboard_alias = 'SegregateNow_E'));

-- ============================================================
-- 16. Full reconciliation report
-- ============================================================
SELECT public._test_result('full seed reconciliation passes',
  (SELECT (verify_seed_reconciliation()->>'no_auto_violations')::boolean) = true);

SELECT public._test_result('full seed reconciliation flagged_no_points',
  (SELECT (verify_seed_reconciliation()->>'flagged_no_points')::boolean) = true);

RAISE NOTICE '=== Seed Reconciliation Tests Complete ===';
