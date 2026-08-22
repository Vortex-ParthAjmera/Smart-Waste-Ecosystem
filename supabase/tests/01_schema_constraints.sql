-- ============================================================
-- Test Suite 01: Schema Constraint Verification
-- Validates that all tables, constraints, indexes, and enums exist correctly.
-- Run after migrations: supabase db reset
-- ============================================================

-- Helper to report test results
CREATE OR REPLACE FUNCTION public._test_result(test_name text, passed boolean)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  IF passed THEN
    RAISE NOTICE 'PASS: %', test_name;
  ELSE
    RAISE NOTICE 'FAIL: %', test_name;
  END IF;
END;
$$;

-- ============================================================
-- 1. Table existence checks
-- ============================================================
SELECT public._test_result('profiles table exists',
  EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='profiles'));
SELECT public._test_result('citizens table exists',
  EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='citizens'));
SELECT public._test_result('citizen_qr_tokens table exists',
  EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='citizen_qr_tokens'));
SELECT public._test_result('disposal_sessions table exists',
  EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='disposal_sessions'));
SELECT public._test_result('gateways table exists',
  EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='gateways'));
SELECT public._test_result('devices table exists',
  EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='devices'));
SELECT public._test_result('device_components table exists',
  EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='device_components'));
SELECT public._test_result('ingest_messages table exists',
  EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='ingest_messages'));
SELECT public._test_result('idempotency_records table exists',
  EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='idempotency_records'));
SELECT public._test_result('rulesets table exists',
  EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='rulesets'));
SELECT public._test_result('disposal_events table exists',
  EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='disposal_events'));
SELECT public._test_result('sensor_readings table exists',
  EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='sensor_readings'));
SELECT public._test_result('ml_detections table exists',
  EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='ml_detections'));
SELECT public._test_result('segregation_results table exists',
  EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='segregation_results'));
SELECT public._test_result('review_cases table exists',
  EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='review_cases'));
SELECT public._test_result('review_decisions table exists',
  EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='review_decisions'));
SELECT public._test_result('point_transactions table exists',
  EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='point_transactions'));
SELECT public._test_result('disputes table exists',
  EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='disputes'));
SELECT public._test_result('badges table exists',
  EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='badges'));
SELECT public._test_result('citizen_badges table exists',
  EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='citizen_badges'));
SELECT public._test_result('device_heartbeats table exists',
  EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='device_heartbeats'));
SELECT public._test_result('device_telemetry table exists',
  EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='device_telemetry'));
SELECT public._test_result('audit_logs table exists',
  EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='audit_logs'));

-- ============================================================
-- 2. View existence checks
-- ============================================================
SELECT public._test_result('citizen_point_balances view exists',
  EXISTS(SELECT 1 FROM information_schema.views WHERE table_schema='public' AND table_name='citizen_point_balances'));
SELECT public._test_result('citizen_tiers view exists',
  EXISTS(SELECT 1 FROM information_schema.views WHERE table_schema='public' AND table_name='citizen_tiers'));
SELECT public._test_result('leaderboard_public view exists',
  EXISTS(SELECT 1 FROM information_schema.views WHERE table_schema='public' AND table_name='leaderboard_public'));

-- ============================================================
-- 3. RLS enabled on all tables
-- ============================================================
SELECT public._test_result('profiles RLS enabled',
  EXISTS(SELECT 1 FROM pg_tables WHERE schemaname='public' AND tablename='profiles' AND rowsecurity=true));
SELECT public._test_result('citizens RLS enabled',
  EXISTS(SELECT 1 FROM pg_tables WHERE schemaname='public' AND tablename='citizens' AND rowsecurity=true));
SELECT public._test_result('disposal_events RLS enabled',
  EXISTS(SELECT 1 FROM pg_tables WHERE schemaname='public' AND tablename='disposal_events' AND rowsecurity=true));
SELECT public._test_result('point_transactions RLS enabled',
  EXISTS(SELECT 1 FROM pg_tables WHERE schemaname='public' AND tablename='point_transactions' AND rowsecurity=true));
SELECT public._test_result('review_cases RLS enabled',
  EXISTS(SELECT 1 FROM pg_tables WHERE schemaname='public' AND tablename='review_cases' AND rowsecurity=true));
SELECT public._test_result('review_decisions RLS enabled',
  EXISTS(SELECT 1 FROM pg_tables WHERE schemaname='public' AND tablename='review_decisions' AND rowsecurity=true));
SELECT public._test_result('disputes RLS enabled',
  EXISTS(SELECT 1 FROM pg_tables WHERE schemaname='public' AND tablename='disputes' AND rowsecurity=true));
SELECT public._test_result('sensor_readings RLS enabled',
  EXISTS(SELECT 1 FROM pg_tables WHERE schemaname='public' AND tablename='sensor_readings' AND rowsecurity=true));
SELECT public._test_result('ml_detections RLS enabled',
  EXISTS(SELECT 1 FROM pg_tables WHERE schemaname='public' AND tablename='ml_detections' AND rowsecurity=true));
SELECT public._test_result('audit_logs RLS enabled',
  EXISTS(SELECT 1 FROM pg_tables WHERE schemaname='public' AND tablename='audit_logs' AND rowsecurity=true));

-- ============================================================
-- 4. Index existence checks
-- ============================================================
SELECT public._test_result('citizen_qr_active_idx exists',
  EXISTS(SELECT 1 FROM pg_indexes WHERE indexname='citizen_qr_active_idx'));
SELECT public._test_result('disposal_sessions_pending_idx exists',
  EXISTS(SELECT 1 FROM pg_indexes WHERE indexname='disposal_sessions_pending_idx'));
SELECT public._test_result('one_published_ruleset exists',
  EXISTS(SELECT 1 FROM pg_indexes WHERE indexname='one_published_ruleset'));
SELECT public._test_result('disposal_events_citizen_time_idx exists',
  EXISTS(SELECT 1 FROM pg_indexes WHERE indexname='disposal_events_citizen_time_idx'));
SELECT public._test_result('disposal_events_active_idx exists',
  EXISTS(SELECT 1 FROM pg_indexes WHERE indexname='disposal_events_active_idx'));
SELECT public._test_result('sensor_readings_event_idx exists',
  EXISTS(SELECT 1 FROM pg_indexes WHERE indexname='sensor_readings_event_idx'));
SELECT public._test_result('ml_detections_event_idx exists',
  EXISTS(SELECT 1 FROM pg_indexes WHERE indexname='ml_detections_event_idx'));
SELECT public._test_result('one_award_per_event exists',
  EXISTS(SELECT 1 FROM pg_indexes WHERE indexname='one_award_per_event'));
SELECT public._test_result('one_violation_per_event exists',
  EXISTS(SELECT 1 FROM pg_indexes WHERE indexname='one_violation_per_event'));
SELECT public._test_result('one_reversal_per_transaction exists',
  EXISTS(SELECT 1 FROM pg_indexes WHERE indexname='one_reversal_per_transaction'));

-- ============================================================
-- 5. Key constraint checks
-- ============================================================
-- Check that disposal_events has unique source_message_id
SELECT public._test_result('disposal_events source_message_id is unique',
  EXISTS(SELECT 1 FROM pg_constraint WHERE conrelid='public.disposal_events'::regclass AND contype='u' AND conname LIKE '%source_message%' OR EXISTS(SELECT 1 FROM pg_index WHERE indrelid='public.disposal_events'::regclass AND indisunique AND indexrelid IN (SELECT oid FROM pg_class WHERE relname LIKE '%source_message%')));

-- Check point_transactions has idempotency_key unique constraint
SELECT public._test_result('point_transactions idempotency_key is unique',
  EXISTS(SELECT 1 FROM pg_constraint WHERE conrelid='public.point_transactions'::regclass AND contype='u' AND conname LIKE '%idempotency%'));

-- Check rulesets version is unique
SELECT public._test_result('rulesets version is unique',
  EXISTS(SELECT 1 FROM pg_constraint WHERE conrelid='public.rulesets'::regclass AND contype='u'));

-- ============================================================
-- 6. Security function existence
-- ============================================================
SELECT public._test_result('get_user_role() function exists',
  EXISTS(SELECT 1 FROM pg_proc WHERE proname='get_user_role'));
SELECT public._test_result('get_user_citizen_id() function exists',
  EXISTS(SELECT 1 FROM pg_proc WHERE proname='get_user_citizen_id'));
SELECT public._test_result('is_reviewer_or_above() function exists',
  EXISTS(SELECT 1 FROM pg_proc WHERE proname='is_reviewer_or_above'));
SELECT public._test_result('is_developer_or_above() function exists',
  EXISTS(SELECT 1 FROM pg_proc WHERE proname='is_developer_or_above'));
SELECT public._test_result('record_review_decision_v1() function exists',
  EXISTS(SELECT 1 FROM pg_proc WHERE proname='record_review_decision_v1'));
SELECT public._test_result('submit_dispute_v1() function exists',
  EXISTS(SELECT 1 FROM pg_proc WHERE proname='submit_dispute_v1'));
SELECT public._test_result('resolve_dispute_v1() function exists',
  EXISTS(SELECT 1 FROM pg_proc WHERE proname='resolve_dispute_v1'));

-- ============================================================
-- 7. Verification helper function existence
-- ============================================================
SELECT public._test_result('verify_event_count_by_source() exists',
  EXISTS(SELECT 1 FROM pg_proc WHERE proname='verify_event_count_by_source'));
SELECT public._test_result('verify_accepted_awards() exists',
  EXISTS(SELECT 1 FROM pg_proc WHERE proname='verify_accepted_awards'));
SELECT public._test_result('verify_no_auto_violations() exists',
  EXISTS(SELECT 1 FROM pg_proc WHERE proname='verify_no_auto_violations'));
SELECT public._test_result('get_citizen_balance() exists',
  EXISTS(SELECT 1 FROM pg_proc WHERE proname='get_citizen_balance'));
SELECT public._test_result('verify_balance_consistency() exists',
  EXISTS(SELECT 1 FROM pg_proc WHERE proname='verify_balance_consistency'));
SELECT public._test_result('verify_flagged_no_points() exists',
  EXISTS(SELECT 1 FROM pg_proc WHERE proname='verify_flagged_no_points'));
SELECT public._test_result('verify_seed_reconciliation() exists',
  EXISTS(SELECT 1 FROM pg_proc WHERE proname='verify_seed_reconciliation'));
SELECT public._test_result('verify_reversal_compensation() exists',
  EXISTS(SELECT 1 FROM pg_proc WHERE proname='verify_reversal_compensation'));

RAISE NOTICE '=== Schema Constraint Tests Complete ===';
