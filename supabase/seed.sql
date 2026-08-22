-- ============================================================
-- Smart Waste Ecosystem — Deterministic Seed Data
-- Schema baseline: 2.0
-- Rules version: rules-2.0.0
--
-- Contains ONLY fictional synthetic data.
-- No real PII, QR values, credentials, or camera URLs.
-- ============================================================

-- ============================================================
-- 1. Auth Users (Supabase Auth)
-- Note: In local dev, use supabase auth helpers or mock these.
-- These IDs are fixed and deterministic for seed consistency.
-- ============================================================
-- We insert into profiles directly for seed; in production these
-- come through Supabase Auth signup flows.

-- ============================================================
-- 2. Profiles (6 users)
-- ============================================================
INSERT INTO public.profiles (id, app_role, display_name, is_active) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'SYSTEM_ADMIN',         'System Administrator', true),
  ('a0000000-0000-0000-0000-000000000002', 'MUNICIPAL_REVIEWER',   'Priya Verma',         true),
  ('a0000000-0000-0000-0000-000000000003', 'MUNICIPAL_OPERATOR',   'Rohan Gupta',         true),
  ('a0000000-0000-0000-0000-000000000004', 'DEVELOPER',            'Dev Engineer',        true),
  ('a0000000-0000-0000-0000-000000000005', 'CITIZEN',              'Aarav Sharma',        true),
  ('a0000000-0000-0000-0000-000000000006', 'CITIZEN',              'Neha Kapoor',         true),
  ('a0000000-0000-0000-0000-000000000007', 'CITIZEN',              'Vikram Singh',        true),
  ('a0000000-0000-0000-0000-000000000008', 'CITIZEN',              'Ananya Patel',        true),
  ('a0000000-0000-0000-0000-000000000009', 'CITIZEN',              'Raj Mehta',           true),
  ('a0000000-0000-0000-0000-00000000000a', 'CITIZEN',              'Kavya Iyer',          true);

-- ============================================================
-- 3. Citizens (6 citizens — 1 primary + 5 peers)
-- ============================================================
INSERT INTO public.citizens (id, profile_id, citizen_code, leaderboard_alias, leaderboard_opt_in, status) VALUES
  ('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000005', 'CIT-0001', 'EcoWarrior_A',     true, 'ACTIVE'),
  ('b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000006', 'CIT-0002', 'GreenHero_B',      true, 'ACTIVE'),
  ('b0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000007', 'CIT-0003', 'WasteNot_C',       true, 'ACTIVE'),
  ('b0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000008', 'CIT-0004', 'RecyclePro_D',     true, 'ACTIVE'),
  ('b0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000009', 'CIT-0005', 'SegregateNow_E',   false, 'ACTIVE'),
  ('b0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-00000000000a', 'CIT-0006', 'CleanCity_F',      true, 'ACTIVE');

-- ============================================================
-- 4. QR Tokens (1 per citizen, 1 active for primary)
-- ============================================================
INSERT INTO public.citizen_qr_tokens (id, citizen_id, lookup_hash, display_suffix, session_nonce, status, issued_at, expires_at, used_at, revoked_at) VALUES
  ('c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f60001', 'QR-a7f2', '11111111-0000-0000-0000-000000000001', 'ACTIVE', now() - interval '1 hour', now() + interval '23 hours', null, null),
  ('c0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000001', 'b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a10002', 'QR-b8e3', '22222222-0000-0000-0000-000000000002', 'USED',   now() - interval '2 days', now() - interval '22 hours', now() - interval '23 hours', null),
  ('c0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000002', 'c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b20003', 'QR-c9f4', '33333333-0000-0000-0000-000000000003', 'ACTIVE', now() - interval '30 minutes', now() + interval '23 hours', null, null),
  ('c0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000003', 'd4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c30004', 'QR-d1a5', '44444444-0000-0000-0000-000000000004', 'ACTIVE', now() - interval '45 minutes', now() + interval '23 hours', null, null),
  ('c0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000004', 'e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d40005', 'QR-e2b6', '55555555-0000-0000-0000-000000000005', 'ACTIVE', now() - interval '15 minutes', now() + interval '23 hours', null, null),
  ('c0000000-0000-0000-0000-000000000006', 'b0000000-0000-0000-0000-000000000005', 'f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e50006', 'QR-f3c7', '66666666-0000-0000-0000-000000000006', 'ACTIVE', now() - interval '10 minutes', now() + interval '23 hours', null, null),
  ('c0000000-0000-0000-0000-000000000007', 'b0000000-0000-0000-0000-000000000006', 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f60007', 'QR-a4d8', '77777777-0000-0000-0000-000000000007', 'ACTIVE', now() - interval '20 minutes', now() + interval '23 hours', null, null);

-- ============================================================
-- 5. Gateway and Device
-- ============================================================
INSERT INTO public.gateways (id, gateway_code, credential_version, status, last_seen_at) VALUES
  ('d0000000-0000-0000-0000-000000000001', 'EDGE-001', 1, 'ACTIVE', now());

INSERT INTO public.devices (id, gateway_id, device_code, firmware_version, status, last_seen_at) VALUES
  ('d0000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000001', 'ESP32-001', 'smart-waste-esp32-1.0.0', 'ACTIVE', now());

-- Device components (per compartment)
INSERT INTO public.device_components (device_id, component_code, component_type, compartment, calibration_version, is_enabled) VALUES
  ('d0000000-0000-0000-0000-000000000002', 'ir-wet-1',          'IR',         'WET', 'ir-wet-2026-08-a',  true),
  ('d0000000-0000-0000-0000-000000000002', 'ir-dry-1',          'IR',         'DRY', 'ir-dry-2026-08-a',  true),
  ('d0000000-0000-0000-0000-000000000002', 'ultrasonic-wet-1',  'ULTRASONIC', 'WET', 'fill-wet-2026-08-a', true),
  ('d0000000-0000-0000-0000-000000000002', 'ultrasonic-dry-1',  'ULTRASONIC', 'DRY', 'fill-dry-2026-08-a',  true),
  ('d0000000-0000-0000-0000-000000000002', 'moisture-dry-1',    'MOISTURE',   'DRY', 'moisture-2026-08-a', true),
  ('d0000000-0000-0000-0000-000000000002', 'gps-1',             'GPS',        null,  'gps-2026-08-a',      true),
  ('d0000000-0000-0000-0000-000000000002', 'camera-edge-1',     'CAMERA',     null,  null,                 true),
  ('d0000000-0000-0000-0000-000000000002', 'model-yolov8n-1',   'MODEL',      null,  'yolov8n-demo-1.0.0', true);

-- ============================================================
-- 6. Ruleset (rules-2.0.0 — PUBLISHED)
-- ============================================================
INSERT INTO public.rulesets (id, version, status, config, config_hash, created_by, published_at) VALUES
  ('e0000000-0000-0000-0000-000000000001', 'rules-2.0.0', 'PUBLISHED',
   '{
     "version": "rules-2.0.0",
     "confidence": { "low_max": 0.59999, "medium_max": 0.84999, "high_min": 0.85 },
     "moisture": { "normal_max": 29.99, "elevated_max": 45.0, "high_min": 45.01 },
     "award": { "points": 10 },
     "violation": { "normal": -10, "severe": -20 },
     "supported_categories": ["WET", "DRY"],
     "unknown_category": "UNKNOWN"
   }'::jsonb,
   'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2',
   'a0000000-0000-0000-0000-000000000001',
   now() - interval '1 day');

-- ============================================================
-- 7. Badges (5 tier badges)
-- ============================================================
INSERT INTO public.badges (code, name, description, minimum_points, is_demo_enabled) VALUES
  ('BRONZE',   'Bronze Eco-Citizen',   'Awarded for starting your sustainability journey', 0,     true),
  ('SILVER',   'Silver Eco-Champion',  'Recognized for consistent responsible disposal',    500,   true),
  ('GOLD',     'Gold Green Guardian',  'Dedicated citizen with outstanding segregation',   1000,  true),
  ('PLATINUM', 'Platinum Planet Hero', 'Elite sustainability leader in the community',     2000,  true),
  ('FIRST',    'First Disposal',       'Awarded for your first verified disposal event',   0,     true);

-- ============================================================
-- 8. Disposal Events (20 events for primary citizen)
--    Events span 2 weeks for realistic distribution.
--    Primary citizen: b0000000-0000-0000-0000-000000000001
-- ============================================================

-- --- Event 1: ACCEPTED DRY (bottle, score 0.96, moisture 22.8%) ---
INSERT INTO public.disposal_events (id, session_id, citizen_id, device_id, event_source, selected_compartment, processing_state, decision_state, location_quality, occurred_at, edge_received_at) VALUES
  ('f0000000-0000-0000-0000-000000000001', null, 'b0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000002', 'HARDWARE', 'DRY', 'COMPLETED', 'ACCEPTED', 'NO_FIX', now() - interval '13 days', now() - interval '13 days' - interval '2 minutes');

INSERT INTO public.sensor_readings (event_id, component_code, sensor_code, boolean_value, unit, quality, captured_at) VALUES
  ('f0000000-0000-0000-0000-000000000001', 'ir-dry-1', 'IR_TRIGGERED', true, 'BOOLEAN', 'GOOD', now() - interval '13 days' - interval '1 seconds');

INSERT INTO public.sensor_readings (event_id, component_code, sensor_code, numeric_value, unit, quality, calibration_version, captured_at) VALUES
  ('f0000000-0000-0000-0000-000000000001', 'ultrasonic-dry-1', 'FILL_DRY_PERCENT', 41.2, 'PERCENT', 'GOOD', 'fill-dry-2026-08-a', now() - interval '13 days' - interval '1 seconds'),
  ('f0000000-0000-0000-0000-000000000001', 'moisture-dry-1', 'MOISTURE_DRY_PERCENT', 22.8, 'PERCENT', 'GOOD', 'moisture-2026-08-a', now() - interval '13 days' - interval '1 seconds');

INSERT INTO public.ml_detections (id, event_id, evidence_source, status, model_family, model_version, weights_sha256, class_map_version, detected_label, friendly_label, predicted_category, score, confidence_band, inference_ms, observed_at) VALUES
  ('m0000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000001', 'LOCAL_LIVE', 'DETECTED', 'yolov8n-compatible', 'demo-1.0.0', 'abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789', 'waste-map-1.0.0', 'bottle', 'Plastic Bottle', 'DRY', 0.96, 'HIGH', 612, now() - interval '13 days' - interval '1 seconds');

INSERT INTO public.segregation_results (event_id, ruleset_id, outcome, suggested_severity, reason_codes, input_hash) VALUES
  ('f0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'ACCEPTED', 'NONE', ARRAY['SUPPORTED_CATEGORY_MATCH', 'DRY_MOISTURE_NORMAL'], '1111111111111111111111111111111111111111111111111111111111111111');

INSERT INTO public.point_transactions (citizen_id, event_id, entry_kind, points_delta, reason_code, created_by, idempotency_key) VALUES
  ('b0000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000001', 'AWARD', 10, 'SUPPORTED_CATEGORY_MATCH', 'a0000000-0000-0000-0000-000000000001', 'p0000000-0000-0000-0000-000000000001');

-- --- Event 2: ACCEPTED WET (food scraps, score 0.89, wet compartment) ---
INSERT INTO public.disposal_events (id, session_id, citizen_id, device_id, event_source, selected_compartment, processing_state, decision_state, location_quality, occurred_at, edge_received_at) VALUES
  ('f0000000-0000-0000-0000-000000000002', null, 'b0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000002', 'HARDWARE', 'WET', 'COMPLETED', 'ACCEPTED', 'GPS_2D', now() - interval '13 days' + interval '3 hours', now() - interval '13 days' + interval '3 hours' - interval '2 minutes');

INSERT INTO public.sensor_readings (event_id, component_code, sensor_code, boolean_value, unit, quality, captured_at) VALUES
  ('f0000000-0000-0000-0000-000000000002', 'ir-wet-1', 'IR_TRIGGERED', true, 'BOOLEAN', 'GOOD', now() - interval '13 days' + interval '3 hours' - interval '1 seconds');

INSERT INTO public.sensor_readings (event_id, component_code, sensor_code, numeric_value, unit, quality, calibration_version, captured_at) VALUES
  ('f0000000-0000-0000-0000-000000000002', 'ultrasonic-wet-1', 'FILL_WET_PERCENT', 35.7, 'PERCENT', 'GOOD', 'fill-wet-2026-08-a', now() - interval '13 days' + interval '3 hours' - interval '1 seconds');

INSERT INTO public.ml_detections (id, event_id, evidence_source, status, model_family, model_version, weights_sha256, class_map_version, detected_label, friendly_label, predicted_category, score, confidence_band, inference_ms, observed_at) VALUES
  ('m0000000-0000-0000-0000-000000000002', 'f0000000-0000-0000-0000-000000000002', 'LOCAL_LIVE', 'DETECTED', 'yolov8n-compatible', 'demo-1.0.0', 'abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789', 'waste-map-1.0.0', 'food_waste', 'Food Scraps', 'WET', 0.89, 'HIGH', 589, now() - interval '13 days' + interval '3 hours' - interval '1 seconds');

INSERT INTO public.segregation_results (event_id, ruleset_id, outcome, suggested_severity, reason_codes, input_hash) VALUES
  ('f0000000-0000-0000-0000-000000000002', 'e0000000-0000-0000-0000-000000000001', 'ACCEPTED', 'NONE', ARRAY['SUPPORTED_CATEGORY_MATCH', 'WET_COMPARTMENT_MATCH'], '2222222222222222222222222222222222222222222222222222222222222222');

INSERT INTO public.point_transactions (citizen_id, event_id, entry_kind, points_delta, reason_code, created_by, idempotency_key) VALUES
  ('b0000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000002', 'AWARD', 10, 'SUPPORTED_CATEGORY_MATCH', 'a0000000-0000-0000-0000-000000000001', 'p0000000-0000-0000-0000-000000000002');

-- --- Event 3: ACCEPTED DRY (paper, score 0.78, moisture 15.3%) ---
INSERT INTO public.disposal_events (id, session_id, citizen_id, device_id, event_source, selected_compartment, processing_state, decision_state, location_quality, occurred_at, edge_received_at) VALUES
  ('f0000000-0000-0000-0000-000000000003', null, 'b0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000002', 'HARDWARE', 'DRY', 'COMPLETED', 'ACCEPTED', 'NO_FIX', now() - interval '12 days', now() - interval '12 days' - interval '2 minutes');

INSERT INTO public.sensor_readings (event_id, component_code, sensor_code, boolean_value, unit, quality, captured_at) VALUES
  ('f0000000-0000-0000-0000-000000000003', 'ir-dry-1', 'IR_TRIGGERED', true, 'BOOLEAN', 'GOOD', now() - interval '12 days' - interval '1 seconds');

INSERT INTO public.sensor_readings (event_id, component_code, sensor_code, numeric_value, unit, quality, calibration_version, captured_at) VALUES
  ('f0000000-0000-0000-0000-000000000003', 'ultrasonic-dry-1', 'FILL_DRY_PERCENT', 28.4, 'PERCENT', 'GOOD', 'fill-dry-2026-08-a', now() - interval '12 days' - interval '1 seconds'),
  ('f0000000-0000-0000-0000-000000000003', 'moisture-dry-1', 'MOISTURE_DRY_PERCENT', 15.3, 'PERCENT', 'GOOD', 'moisture-2026-08-a', now() - interval '12 days' - interval '1 seconds');

INSERT INTO public.ml_detections (id, event_id, evidence_source, status, model_family, model_version, weights_sha256, class_map_version, detected_label, friendly_label, predicted_category, score, confidence_band, inference_ms, observed_at) VALUES
  ('m0000000-0000-0000-0000-000000000003', 'f0000000-0000-0000-0000-000000000003', 'LOCAL_LIVE', 'DETECTED', 'yolov8n-compatible', 'demo-1.0.0', 'abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789', 'waste-map-1.0.0', 'paper', 'Paper', 'DRY', 0.78, 'MEDIUM', 645, now() - interval '12 days' - interval '1 seconds');

INSERT INTO public.segregation_results (event_id, ruleset_id, outcome, suggested_severity, reason_codes, input_hash) VALUES
  ('f0000000-0000-0000-0000-000000000003', 'e0000000-0000-0000-0000-000000000001', 'ACCEPTED', 'NONE', ARRAY['SUPPORTED_CATEGORY_MATCH', 'DRY_MOISTURE_NORMAL'], '3333333333333333333333333333333333333333333333333333333333333333');

INSERT INTO public.point_transactions (citizen_id, event_id, entry_kind, points_delta, reason_code, created_by, idempotency_key) VALUES
  ('b0000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000003', 'AWARD', 10, 'SUPPORTED_CATEGORY_MATCH', 'a0000000-0000-0000-0000-000000000001', 'p0000000-0000-0000-0000-000000000003');

-- --- Events 4-8: More accepted events (wet & dry mix) ---
-- Event 4: ACCEPTED WET (wet food, score 0.91)
INSERT INTO public.disposal_events (id, session_id, citizen_id, device_id, event_source, selected_compartment, processing_state, decision_state, location_quality, occurred_at, edge_received_at) VALUES
  ('f0000000-0000-0000-0000-000000000004', null, 'b0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000002', 'HARDWARE', 'WET', 'COMPLETED', 'ACCEPTED', 'NO_FIX', now() - interval '11 days', now() - interval '11 days' - interval '2 minutes');

INSERT INTO public.sensor_readings (event_id, component_code, sensor_code, boolean_value, unit, quality, captured_at) VALUES
  ('f0000000-0000-0000-0000-000000000004', 'ir-wet-1', 'IR_TRIGGERED', true, 'BOOLEAN', 'GOOD', now() - interval '11 days' - interval '1 seconds');

INSERT INTO public.ml_detections (id, event_id, evidence_source, status, model_family, model_version, weights_sha256, class_map_version, detected_label, friendly_label, predicted_category, score, confidence_band, inference_ms, observed_at) VALUES
  ('m0000000-0000-0000-0000-000000000004', 'f0000000-0000-0000-0000-000000000004', 'LOCAL_LIVE', 'DETECTED', 'yolov8n-compatible', 'demo-1.0.0', 'abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789', 'waste-map-1.0.0', 'food_waste', 'Food Scraps', 'WET', 0.91, 'HIGH', 578, now() - interval '11 days' - interval '1 seconds');

INSERT INTO public.segregation_results (event_id, ruleset_id, outcome, suggested_severity, reason_codes, input_hash) VALUES
  ('f0000000-0000-0000-0000-000000000004', 'e0000000-0000-0000-0000-000000000001', 'ACCEPTED', 'NONE', ARRAY['SUPPORTED_CATEGORY_MATCH', 'WET_COMPARTMENT_MATCH'], '4444444444444444444444444444444444444444444444444444444444444444');

INSERT INTO public.point_transactions (citizen_id, event_id, entry_kind, points_delta, reason_code, created_by, idempotency_key) VALUES
  ('b0000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000004', 'AWARD', 10, 'SUPPORTED_CATEGORY_MATCH', 'a0000000-0000-0000-0000-000000000001', 'p0000000-0000-0000-0000-000000000004');

-- Event 5: ACCEPTED DRY (cardboard, score 0.82, moisture 18.5%)
INSERT INTO public.disposal_events (id, session_id, citizen_id, device_id, event_source, selected_compartment, processing_state, decision_state, location_quality, occurred_at, edge_received_at) VALUES
  ('f0000000-0000-0000-0000-000000000005', null, 'b0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000002', 'HARDWARE', 'DRY', 'COMPLETED', 'ACCEPTED', 'GPS_2D', now() - interval '10 days', now() - interval '10 days' - interval '2 minutes');

INSERT INTO public.sensor_readings (event_id, component_code, sensor_code, boolean_value, unit, quality, captured_at) VALUES
  ('f0000000-0000-0000-0000-000000000005', 'ir-dry-1', 'IR_TRIGGERED', true, 'BOOLEAN', 'GOOD', now() - interval '10 days' - interval '1 seconds');

INSERT INTO public.sensor_readings (event_id, component_code, sensor_code, numeric_value, unit, quality, calibration_version, captured_at) VALUES
  ('f0000000-0000-0000-0000-000000000005', 'ultrasonic-dry-1', 'FILL_DRY_PERCENT', 33.1, 'PERCENT', 'GOOD', 'fill-dry-2026-08-a', now() - interval '10 days' - interval '1 seconds'),
  ('f0000000-0000-0000-0000-000000000005', 'moisture-dry-1', 'MOISTURE_DRY_PERCENT', 18.5, 'PERCENT', 'GOOD', 'moisture-2026-08-a', now() - interval '10 days' - interval '1 seconds');

INSERT INTO public.ml_detections (id, event_id, evidence_source, status, model_family, model_version, weights_sha256, class_map_version, detected_label, friendly_label, predicted_category, score, confidence_band, inference_ms, observed_at) VALUES
  ('m0000000-0000-0000-0000-000000000005', 'f0000000-0000-0000-0000-000000000005', 'LOCAL_LIVE', 'DETECTED', 'yolov8n-compatible', 'demo-1.0.0', 'abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789', 'waste-map-1.0.0', 'cardboard', 'Cardboard', 'DRY', 0.82, 'MEDIUM', 631, now() - interval '10 days' - interval '1 seconds');

INSERT INTO public.segregation_results (event_id, ruleset_id, outcome, suggested_severity, reason_codes, input_hash) VALUES
  ('f0000000-0000-0000-0000-000000000005', 'e0000000-0000-0000-0000-000000000001', 'ACCEPTED', 'NONE', ARRAY['SUPPORTED_CATEGORY_MATCH', 'DRY_MOISTURE_NORMAL'], '5555555555555555555555555555555555555555555555555555555555555555');

INSERT INTO public.point_transactions (citizen_id, event_id, entry_kind, points_delta, reason_code, created_by, idempotency_key) VALUES
  ('b0000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000005', 'AWARD', 10, 'SUPPORTED_CATEGORY_MATCH', 'a0000000-0000-0000-0000-000000000001', 'p0000000-0000-0000-0000-000000000005');

-- Event 6: ACCEPTED WET (leaf waste, score 0.87)
INSERT INTO public.disposal_events (id, session_id, citizen_id, device_id, event_source, selected_compartment, processing_state, decision_state, location_quality, occurred_at, edge_received_at) VALUES
  ('f0000000-0000-0000-0000-000000000006', null, 'b0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000002', 'HARDWARE', 'WET', 'COMPLETED', 'ACCEPTED', 'NO_FIX', now() - interval '10 days' + interval '4 hours', now() - interval '10 days' + interval '4 hours' - interval '2 minutes');

INSERT INTO public.sensor_readings (event_id, component_code, sensor_code, boolean_value, unit, quality, captured_at) VALUES
  ('f0000000-0000-0000-0000-000000000006', 'ir-wet-1', 'IR_TRIGGERED', true, 'BOOLEAN', 'GOOD', now() - interval '10 days' + interval '4 hours' - interval '1 seconds');

INSERT INTO public.ml_detections (id, event_id, evidence_source, status, model_family, model_version, weights_sha256, class_map_version, detected_label, friendly_label, predicted_category, score, confidence_band, inference_ms, observed_at) VALUES
  ('m0000000-0000-0000-0000-000000000006', 'f0000000-0000-0000-0000-000000000006', 'LOCAL_LIVE', 'DETECTED', 'yolov8n-compatible', 'demo-1.0.0', 'abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789', 'waste-map-1.0.0', 'organic', 'Leaf Waste', 'WET', 0.87, 'HIGH', 598, now() - interval '10 days' + interval '4 hours' - interval '1 seconds');

INSERT INTO public.segregation_results (event_id, ruleset_id, outcome, suggested_severity, reason_codes, input_hash) VALUES
  ('f0000000-0000-0000-0000-000000000006', 'e0000000-0000-0000-0000-000000000001', 'ACCEPTED', 'NONE', ARRAY['SUPPORTED_CATEGORY_MATCH', 'WET_COMPARTMENT_MATCH'], '6666666666666666666666666666666666666666666666666666666666666666');

INSERT INTO public.point_transactions (citizen_id, event_id, entry_kind, points_delta, reason_code, created_by, idempotency_key) VALUES
  ('b0000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000006', 'AWARD', 10, 'SUPPORTED_CATEGORY_MATCH', 'a0000000-0000-0000-0000-000000000001', 'p0000000-0000-0000-0000-000000000006');

-- Event 7: ACCEPTED DRY (plastic cap, score 0.72, moisture 12.1%)
INSERT INTO public.disposal_events (id, session_id, citizen_id, device_id, event_source, selected_compartment, processing_state, decision_state, location_quality, occurred_at, edge_received_at) VALUES
  ('f0000000-0000-0000-0000-000000000007', null, 'b0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000002', 'HARDWARE', 'DRY', 'COMPLETED', 'ACCEPTED', 'NO_FIX', now() - interval '9 days', now() - interval '9 days' - interval '2 minutes');

INSERT INTO public.sensor_readings (event_id, component_code, sensor_code, boolean_value, unit, quality, captured_at) VALUES
  ('f0000000-0000-0000-0000-000000000007', 'ir-dry-1', 'IR_TRIGGERED', true, 'BOOLEAN', 'GOOD', now() - interval '9 days' - interval '1 seconds');

INSERT INTO public.ml_detections (id, event_id, evidence_source, status, model_family, model_version, weights_sha256, class_map_version, detected_label, friendly_label, predicted_category, score, confidence_band, inference_ms, observed_at) VALUES
  ('m0000000-0000-0000-0000-000000000007', 'f0000000-0000-0000-0000-000000000007', 'LOCAL_LIVE', 'DETECTED', 'yolov8n-compatible', 'demo-1.0.0', 'abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789', 'waste-map-1.0.0', 'plastic', 'Plastic Cap', 'DRY', 0.72, 'MEDIUM', 667, now() - interval '9 days' - interval '1 seconds');

INSERT INTO public.segregation_results (event_id, ruleset_id, outcome, suggested_severity, reason_codes, input_hash) VALUES
  ('f0000000-0000-0000-0000-000000000007', 'e0000000-0000-0000-0000-000000000001', 'ACCEPTED', 'NONE', ARRAY['SUPPORTED_CATEGORY_MATCH', 'DRY_MOISTURE_NORMAL'], '7777777777777777777777777777777777777777777777777777777777777777');

INSERT INTO public.point_transactions (citizen_id, event_id, entry_kind, points_delta, reason_code, created_by, idempotency_key) VALUES
  ('b0000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000007', 'AWARD', 10, 'SUPPORTED_CATEGORY_MATCH', 'a0000000-0000-0000-0000-000000000001', 'p0000000-0000-0000-0000-000000000007');

-- Event 8: ACCEPTED WET (tea leaves, score 0.84)
INSERT INTO public.disposal_events (id, session_id, citizen_id, device_id, event_source, selected_compartment, processing_state, decision_state, location_quality, occurred_at, edge_received_at) VALUES
  ('f0000000-0000-0000-0000-000000000008', null, 'b0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000002', 'HARDWARE', 'WET', 'COMPLETED', 'ACCEPTED', 'NO_FIX', now() - interval '8 days', now() - interval '8 days' - interval '2 minutes');

INSERT INTO public.sensor_readings (event_id, component_code, sensor_code, boolean_value, unit, quality, captured_at) VALUES
  ('f0000000-0000-0000-0000-000000000008', 'ir-wet-1', 'IR_TRIGGERED', true, 'BOOLEAN', 'GOOD', now() - interval '8 days' - interval '1 seconds');

INSERT INTO public.ml_detections (id, event_id, evidence_source, status, model_family, model_version, weights_sha256, class_map_version, detected_label, friendly_label, predicted_category, score, confidence_band, inference_ms, observed_at) VALUES
  ('m0000000-0000-0000-0000-000000000008', 'f0000000-0000-0000-0000-000000000008', 'LOCAL_LIVE', 'DETECTED', 'yolov8n-compatible', 'demo-1.0.0', 'abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789', 'waste-map-1.0.0', 'organic', 'Tea Leaves', 'WET', 0.84, 'MEDIUM', 623, now() - interval '8 days' - interval '1 seconds');

INSERT INTO public.segregation_results (event_id, ruleset_id, outcome, suggested_severity, reason_codes, input_hash) VALUES
  ('f0000000-0000-0000-0000-000000000008', 'e0000000-0000-0000-0000-000000000001', 'ACCEPTED', 'NONE', ARRAY['SUPPORTED_CATEGORY_MATCH', 'WET_COMPARTMENT_MATCH'], '8888888888888888888888888888888888888888888888888888888888888888');

INSERT INTO public.point_transactions (citizen_id, event_id, entry_kind, points_delta, reason_code, created_by, idempotency_key) VALUES
  ('b0000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000008', 'AWARD', 10, 'SUPPORTED_CATEGORY_MATCH', 'a0000000-0000-0000-0000-000000000001', 'p0000000-0000-0000-0000-000000000008');

-- Event 9: ACCEPTED DRY (cloth, score 0.68, moisture 25.1%)
INSERT INTO public.disposal_events (id, session_id, citizen_id, device_id, event_source, selected_compartment, processing_state, decision_state, location_quality, occurred_at, edge_received_at) VALUES
  ('f0000000-0000-0000-0000-000000000009', null, 'b0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000002', 'HARDWARE', 'DRY', 'COMPLETED', 'ACCEPTED', 'GPS_2D', now() - interval '7 days', now() - interval '7 days' - interval '2 minutes');

INSERT INTO public.sensor_readings (event_id, component_code, sensor_code, boolean_value, unit, quality, captured_at) VALUES
  ('f0000000-0000-0000-0000-000000000009', 'ir-dry-1', 'IR_TRIGGERED', true, 'BOOLEAN', 'GOOD', now() - interval '7 days' - interval '1 seconds');

INSERT INTO public.sensor_readings (event_id, component_code, sensor_code, numeric_value, unit, quality, calibration_version, captured_at) VALUES
  ('f0000000-0000-0000-0000-000000000009', 'ultrasonic-dry-1', 'FILL_DRY_PERCENT', 29.8, 'PERCENT', 'GOOD', 'fill-dry-2026-08-a', now() - interval '7 days' - interval '1 seconds'),
  ('f0000000-0000-0000-0000-000000000009', 'moisture-dry-1', 'MOISTURE_DRY_PERCENT', 25.1, 'PERCENT', 'GOOD', 'moisture-2026-08-a', now() - interval '7 days' - interval '1 seconds');

INSERT INTO public.ml_detections (id, event_id, evidence_source, status, model_family, model_version, weights_sha256, class_map_version, detected_label, friendly_label, predicted_category, score, confidence_band, inference_ms, observed_at) VALUES
  ('m0000000-0000-0000-0000-000000000009', 'f0000000-0000-0000-0000-000000000009', 'LOCAL_LIVE', 'DETECTED', 'yolov8n-compatible', 'demo-1.0.0', 'abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789', 'waste-map-1.0.0', 'cloth', 'Cloth Rag', 'DRY', 0.68, 'MEDIUM', 701, now() - interval '7 days' - interval '1 seconds');

INSERT INTO public.segregation_results (event_id, ruleset_id, outcome, suggested_severity, reason_codes, input_hash) VALUES
  ('f0000000-0000-0000-0000-000000000009', 'e0000000-0000-0000-0000-000000000001', 'ACCEPTED', 'NONE', ARRAY['SUPPORTED_CATEGORY_MATCH', 'DRY_MOISTURE_NORMAL'], '9999999999999999999999999999999999999999999999999999999999999999');

INSERT INTO public.point_transactions (citizen_id, event_id, entry_kind, points_delta, reason_code, created_by, idempotency_key) VALUES
  ('b0000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000009', 'AWARD', 10, 'SUPPORTED_CATEGORY_MATCH', 'a0000000-0000-0000-0000-000000000001', 'p0000000-0000-0000-0000-000000000009');

-- Event 10: ACCEPTED WET (garden waste, score 0.93)
INSERT INTO public.disposal_events (id, session_id, citizen_id, device_id, event_source, selected_compartment, processing_state, decision_state, location_quality, occurred_at, edge_received_at) VALUES
  ('f0000000-0000-0000-0000-000000000010', null, 'b0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000002', 'HARDWARE', 'WET', 'COMPLETED', 'ACCEPTED', 'NO_FIX', now() - interval '6 days', now() - interval '6 days' - interval '2 minutes');

INSERT INTO public.sensor_readings (event_id, component_code, sensor_code, boolean_value, unit, quality, captured_at) VALUES
  ('f0000000-0000-0000-0000-000000000010', 'ir-wet-1', 'IR_TRIGGERED', true, 'BOOLEAN', 'GOOD', now() - interval '6 days' - interval '1 seconds');

INSERT INTO public.ml_detections (id, event_id, evidence_source, status, model_family, model_version, weights_sha256, class_map_version, detected_label, friendly_label, predicted_category, score, confidence_band, inference_ms, observed_at) VALUES
  ('m0000000-0000-0000-0000-000000000010', 'f0000000-0000-0000-0000-000000000010', 'LOCAL_LIVE', 'DETECTED', 'yolov8n-compatible', 'demo-1.0.0', 'abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789', 'waste-map-1.0.0', 'organic', 'Garden Waste', 'WET', 0.93, 'HIGH', 587, now() - interval '6 days' - interval '1 seconds');

INSERT INTO public.segregation_results (event_id, ruleset_id, outcome, suggested_severity, reason_codes, input_hash) VALUES
  ('f0000000-0000-0000-0000-000000000010', 'e0000000-0000-0000-0000-000000000001', 'ACCEPTED', 'NONE', ARRAY['SUPPORTED_CATEGORY_MATCH', 'WET_COMPARTMENT_MATCH'], 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');

INSERT INTO public.point_transactions (citizen_id, event_id, entry_kind, points_delta, reason_code, created_by, idempotency_key) VALUES
  ('b0000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000010', 'AWARD', 10, 'SUPPORTED_CATEGORY_MATCH', 'a0000000-0000-0000-0000-000000000001', 'p0000000-0000-0000-0000-000000000010');

-- ============================================================
-- Event 11: FLAGGED — LOW CONFIDENCE (score 0.45)
-- ============================================================
INSERT INTO public.disposal_events (id, session_id, citizen_id, device_id, event_source, selected_compartment, processing_state, decision_state, location_quality, occurred_at, edge_received_at) VALUES
  ('f0000000-0000-0000-0000-000000000011', null, 'b0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000002', 'HARDWARE', 'DRY', 'SEGREGATION_DECIDED', 'FLAGGED', 'NO_FIX', now() - interval '5 days', now() - interval '5 days' - interval '2 minutes');

INSERT INTO public.sensor_readings (event_id, component_code, sensor_code, boolean_value, unit, quality, captured_at) VALUES
  ('f0000000-0000-0000-0000-000000000011', 'ir-dry-1', 'IR_TRIGGERED', true, 'BOOLEAN', 'GOOD', now() - interval '5 days' - interval '1 seconds');

INSERT INTO public.sensor_readings (event_id, component_code, sensor_code, numeric_value, unit, quality, calibration_version, captured_at) VALUES
  ('f0000000-0000-0000-0000-000000000011', 'ultrasonic-dry-1', 'FILL_DRY_PERCENT', 38.5, 'PERCENT', 'GOOD', 'fill-dry-2026-08-a', now() - interval '5 days' - interval '1 seconds'),
  ('f0000000-0000-0000-0000-000000000011', 'moisture-dry-1', 'MOISTURE_DRY_PERCENT', 19.7, 'PERCENT', 'GOOD', 'moisture-2026-08-a', now() - interval '5 days' - interval '1 seconds');

INSERT INTO public.ml_detections (id, event_id, evidence_source, status, model_family, model_version, weights_sha256, class_map_version, detected_label, friendly_label, predicted_category, score, confidence_band, inference_ms, observed_at) VALUES
  ('m0000000-0000-0000-0000-000000000011', 'f0000000-0000-0000-0000-000000000011', 'LOCAL_LIVE', 'DETECTED', 'yolov8n-compatible', 'demo-1.0.0', 'abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789', 'waste-map-1.0.0', 'unknown_item', 'Unknown Item', 'DRY', 0.45, 'LOW', 745, now() - interval '5 days' - interval '1 seconds');

INSERT INTO public.segregation_results (event_id, ruleset_id, outcome, suggested_severity, reason_codes, input_hash) VALUES
  ('f0000000-0000-0000-0000-000000000011', 'e0000000-0000-0000-0000-000000000001', 'FLAGGED', 'NONE', ARRAY['LOW_CONFIDENCE'], 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb');

INSERT INTO public.review_cases (event_id, status, reason_codes, suggested_severity, opened_at) VALUES
  ('f0000000-0000-0000-0000-000000000011', 'OPEN', ARRAY['LOW_CONFIDENCE'], 'NONE', now() - interval '5 days');

-- ============================================================
-- Event 12: FLAGGED — ENVIRONMENTAL WETTING (dry moisture >45%)
-- ============================================================
INSERT INTO public.disposal_events (id, session_id, citizen_id, device_id, event_source, selected_compartment, processing_state, decision_state, location_quality, occurred_at, edge_received_at) VALUES
  ('f0000000-0000-0000-0000-000000000012', null, 'b0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000002', 'HARDWARE', 'DRY', 'SEGREGATION_DECIDED', 'FLAGGED', 'NO_FIX', now() - interval '4 days', now() - interval '4 days' - interval '2 minutes');

INSERT INTO public.sensor_readings (event_id, component_code, sensor_code, boolean_value, unit, quality, captured_at) VALUES
  ('f0000000-0000-0000-0000-000000000012', 'ir-dry-1', 'IR_TRIGGERED', true, 'BOOLEAN', 'GOOD', now() - interval '4 days' - interval '1 seconds');

INSERT INTO public.sensor_readings (event_id, component_code, sensor_code, numeric_value, unit, quality, calibration_version, captured_at) VALUES
  ('f0000000-0000-0000-0000-000000000012', 'ultrasonic-dry-1', 'FILL_DRY_PERCENT', 42.0, 'PERCENT', 'GOOD', 'fill-dry-2026-08-a', now() - interval '4 days' - interval '1 seconds'),
  ('f0000000-0000-0000-0000-000000000012', 'moisture-dry-1', 'MOISTURE_DRY_PERCENT', 52.3, 'PERCENT', 'GOOD', 'moisture-2026-08-a', now() - interval '4 days' - interval '1 seconds');

INSERT INTO public.ml_detections (id, event_id, evidence_source, status, model_family, model_version, weights_sha256, class_map_version, detected_label, friendly_label, predicted_category, score, confidence_band, inference_ms, observed_at) VALUES
  ('m0000000-0000-0000-0000-000000000012', 'f0000000-0000-0000-0000-000000000012', 'LOCAL_LIVE', 'DETECTED', 'yolov8n-compatible', 'demo-1.0.0', 'abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789', 'waste-map-1.0.0', 'paper', 'Paper', 'DRY', 0.82, 'MEDIUM', 614, now() - interval '4 days' - interval '1 seconds');

INSERT INTO public.segregation_results (event_id, ruleset_id, outcome, suggested_severity, reason_codes, input_hash) VALUES
  ('f0000000-0000-0000-0000-000000000012', 'e0000000-0000-0000-0000-000000000001', 'FLAGGED', 'NONE', ARRAY['ENVIRONMENTAL_WETTING_SUSPECTED'], 'cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc');

INSERT INTO public.review_cases (event_id, status, reason_codes, suggested_severity, opened_at) VALUES
  ('f0000000-0000-0000-0000-000000000012', 'OPEN', ARRAY['ENVIRONMENTAL_WETTING_SUSPECTED'], 'NONE', now() - interval '4 days');

-- ============================================================
-- Event 13: FLAGGED — CATEGORY MISMATCH (wet item in dry)
-- ============================================================
INSERT INTO public.disposal_events (id, session_id, citizen_id, device_id, event_source, selected_compartment, processing_state, decision_state, location_quality, occurred_at, edge_received_at) VALUES
  ('f0000000-0000-0000-0000-000000000013', null, 'b0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000002', 'HARDWARE', 'DRY', 'SEGREGATION_DECIDED', 'FLAGGED', 'GPS_2D', now() - interval '3 days', now() - interval '3 days' - interval '2 minutes');

INSERT INTO public.sensor_readings (event_id, component_code, sensor_code, boolean_value, unit, quality, captured_at) VALUES
  ('f0000000-0000-0000-0000-000000000013', 'ir-dry-1', 'IR_TRIGGERED', true, 'BOOLEAN', 'GOOD', now() - interval '3 days' - interval '1 seconds');

INSERT INTO public.sensor_readings (event_id, component_code, sensor_code, numeric_value, unit, quality, calibration_version, captured_at) VALUES
  ('f0000000-0000-0000-0000-000000000013', 'ultrasonic-dry-1', 'FILL_DRY_PERCENT', 36.8, 'PERCENT', 'GOOD', 'fill-dry-2026-08-a', now() - interval '3 days' - interval '1 seconds'),
  ('f0000000-0000-0000-0000-000000000013', 'moisture-dry-1', 'MOISTURE_DRY_PERCENT', 48.9, 'PERCENT', 'GOOD', 'moisture-2026-08-a', now() - interval '3 days' - interval '1 seconds');

INSERT INTO public.ml_detections (id, event_id, evidence_source, status, model_family, model_version, weights_sha256, class_map_version, detected_label, friendly_label, predicted_category, score, confidence_band, inference_ms, observed_at) VALUES
  ('m0000000-0000-0000-0000-000000000013', 'f0000000-0000-0000-0000-000000000013', 'LOCAL_LIVE', 'DETECTED', 'yolov8n-compatible', 'demo-1.0.0', 'abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789', 'waste-map-1.0.0', 'food_waste', 'Food Scraps', 'WET', 0.88, 'HIGH', 595, now() - interval '3 days' - interval '1 seconds');

INSERT INTO public.segregation_results (event_id, ruleset_id, outcome, suggested_severity, reason_codes, input_hash) VALUES
  ('f0000000-0000-0000-0000-000000000013', 'e0000000-0000-0000-0000-000000000001', 'FLAGGED', 'SEVERE', ARRAY['CATEGORY_MISMATCH', 'SEVERE_WET_IN_DRY'], 'dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd');

INSERT INTO public.review_cases (event_id, status, reason_codes, suggested_severity, assigned_to, opened_at) VALUES
  ('f0000000-0000-0000-0000-000000000013', 'ASSIGNED', ARRAY['CATEGORY_MISMATCH', 'SEVERE_WET_IN_DRY'], 'SEVERE', 'a0000000-0000-0000-0000-000000000002', now() - interval '3 days');

-- ============================================================
-- Event 14: REVIEW_ACCEPTED (flagged low score, reviewed +10)
-- ============================================================
INSERT INTO public.disposal_events (id, session_id, citizen_id, device_id, event_source, selected_compartment, processing_state, decision_state, location_quality, occurred_at, edge_received_at) VALUES
  ('f0000000-0000-0000-0000-000000000014', null, 'b0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000002', 'HARDWARE', 'DRY', 'COMPLETED', 'REVIEW_ACCEPTED', 'NO_FIX', now() - interval '3 days' + interval '5 hours', now() - interval '3 days' + interval '5 hours' - interval '2 minutes');

INSERT INTO public.sensor_readings (event_id, component_code, sensor_code, boolean_value, unit, quality, captured_at) VALUES
  ('f0000000-0000-0000-0000-000000000014', 'ir-dry-1', 'IR_TRIGGERED', true, 'BOOLEAN', 'GOOD', now() - interval '3 days' + interval '5 hours' - interval '1 seconds');

INSERT INTO public.ml_detections (id, event_id, evidence_source, status, model_family, model_version, weights_sha256, class_map_version, detected_label, friendly_label, predicted_category, score, confidence_band, inference_ms, observed_at) VALUES
  ('m0000000-0000-0000-0000-000000000014', 'f0000000-0000-0000-0000-000000000014', 'LOCAL_LIVE', 'DETECTED', 'yolov8n-compatible', 'demo-1.0.0', 'abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789', 'waste-map-1.0.0', 'wrappers', 'Wrapper', 'UNKNOWN', 0.52, 'LOW', 688, now() - interval '3 days' + interval '5 hours' - interval '1 seconds');

INSERT INTO public.segregation_results (event_id, ruleset_id, outcome, suggested_severity, reason_codes, input_hash) VALUES
  ('f0000000-0000-0000-0000-000000000014', 'e0000000-0000-0000-0000-000000000001', 'FLAGGED', 'NONE', ARRAY['LOW_CONFIDENCE', 'UNSUPPORTED_CATEGORY'], 'eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee');

INSERT INTO public.review_cases (event_id, status, reason_codes, suggested_severity, assigned_to, opened_at, decided_at) VALUES
  ('f0000000-0000-0000-0000-000000000014', 'DECIDED', ARRAY['LOW_CONFIDENCE', 'UNSUPPORTED_CATEGORY'], 'NONE', 'a0000000-0000-0000-0000-000000000002', now() - interval '3 days' + interval '5 hours', now() - interval '2 days');

INSERT INTO public.review_decisions (case_id, reviewer_id, decision, reason_code, notes, decided_at) VALUES
  ((SELECT id FROM public.review_cases WHERE event_id = 'f0000000-0000-0000-0000-000000000014'),
   'a0000000-0000-0000-0000-000000000002', 'REVIEW_ACCEPTED', 'CITIZEN_CLAIMS_CORRECT',
   'Officer visually confirmed dry item was correctly placed.', now() - interval '2 days');

INSERT INTO public.point_transactions (citizen_id, event_id, review_decision_id, entry_kind, points_delta, reason_code, created_by, idempotency_key) VALUES
  ('b0000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000014',
   (SELECT id FROM public.review_decisions WHERE case_id = (SELECT id FROM public.review_cases WHERE event_id = 'f0000000-0000-0000-0000-000000000014')),
   'AWARD', 10, 'REVIEW_ACCEPTED', 'a0000000-0000-0000-0000-000000000002', 'p0000000-0000-0000-0000-000000000014');

-- ============================================================
-- Event 15: VERIFIED_VIOLATION NORMAL (-10) — mismatch reviewed
-- ============================================================
INSERT INTO public.disposal_events (id, session_id, citizen_id, device_id, event_source, selected_compartment, processing_state, decision_state, location_quality, occurred_at, edge_received_at) VALUES
  ('f0000000-0000-0000-0000-000000000015', null, 'b0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000002', 'HARDWARE', 'DRY', 'COMPLETED', 'VERIFIED_VIOLATION', 'NO_FIX', now() - interval '2 days', now() - interval '2 days' - interval '2 minutes');

INSERT INTO public.sensor_readings (event_id, component_code, sensor_code, boolean_value, unit, quality, captured_at) VALUES
  ('f0000000-0000-0000-0000-000000000015', 'ir-dry-1', 'IR_TRIGGERED', true, 'BOOLEAN', 'GOOD', now() - interval '2 days' - interval '1 seconds');

INSERT INTO public.ml_detections (id, event_id, evidence_source, status, model_family, model_version, weights_sha256, class_map_version, detected_label, friendly_label, predicted_category, score, confidence_band, inference_ms, observed_at) VALUES
  ('m0000000-0000-0000-0000-000000000015', 'f0000000-0000-0000-0000-000000000015', 'LOCAL_LIVE', 'DETECTED', 'yolov8n-compatible', 'demo-1.0.0', 'abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789', 'waste-map-1.0.0', 'food_waste', 'Food Scraps', 'WET', 0.87, 'HIGH', 602, now() - interval '2 days' - interval '1 seconds');

INSERT INTO public.segregation_results (event_id, ruleset_id, outcome, suggested_severity, reason_codes, input_hash) VALUES
  ('f0000000-0000-0000-0000-000000000015', 'e0000000-0000-0000-0000-000000000001', 'FLAGGED', 'NORMAL', ARRAY['CATEGORY_MISMATCH'], 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');

INSERT INTO public.review_cases (event_id, status, reason_codes, suggested_severity, assigned_to, opened_at, decided_at) VALUES
  ('f0000000-0000-0000-0000-000000000015', 'DECIDED', ARRAY['CATEGORY_MISMATCH'], 'NORMAL', 'a0000000-0000-0000-0000-000000000002', now() - interval '2 days', now() - interval '1 days');

INSERT INTO public.review_decisions (case_id, reviewer_id, decision, violation_severity, reason_code, notes, decided_at) VALUES
  ((SELECT id FROM public.review_cases WHERE event_id = 'f0000000-0000-0000-0000-000000000015'),
   'a0000000-0000-0000-0000-000000000002', 'VERIFIED_VIOLATION', 'NORMAL', 'WET_IN_DRY_CONFIRMED',
   'Reviewer confirmed wet food was placed in the dry compartment.', now() - interval '1 days');

INSERT INTO public.point_transactions (citizen_id, event_id, review_decision_id, entry_kind, points_delta, reason_code, created_by, idempotency_key) VALUES
  ('b0000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000015',
   (SELECT id FROM public.review_decisions WHERE case_id = (SELECT id FROM public.review_cases WHERE event_id = 'f0000000-0000-0000-0000-000000000015')),
   'VIOLATION', -10, 'WET_IN_DRY_CONFIRMED', 'a0000000-0000-0000-0000-000000000002', 'p0000000-0000-0000-0000-000000000015');

-- ============================================================
-- Event 16: VERIFIED_VIOLATION SEVERE (-20) — severe wet-in-dry
-- ============================================================
INSERT INTO public.disposal_events (id, session_id, citizen_id, device_id, event_source, selected_compartment, processing_state, decision_state, location_quality, occurred_at, edge_received_at) VALUES
  ('f0000000-0000-0000-0000-000000000016', null, 'b0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000002', 'HARDWARE', 'DRY', 'COMPLETED', 'VERIFIED_VIOLATION', 'GPS_2D', now() - interval '1 days', now() - interval '1 days' - interval '2 minutes');

INSERT INTO public.sensor_readings (event_id, component_code, sensor_code, boolean_value, unit, quality, captured_at) VALUES
  ('f0000000-0000-0000-0000-000000000016', 'ir-dry-1', 'IR_TRIGGERED', true, 'BOOLEAN', 'GOOD', now() - interval '1 days' - interval '1 seconds');

INSERT INTO public.sensor_readings (event_id, component_code, sensor_code, numeric_value, unit, quality, calibration_version, captured_at) VALUES
  ('f0000000-0000-0000-0000-000000000016', 'ultrasonic-dry-1', 'FILL_DRY_PERCENT', 44.0, 'PERCENT', 'GOOD', 'fill-dry-2026-08-a', now() - interval '1 days' - interval '1 seconds'),
  ('f0000000-0000-0000-0000-000000000016', 'moisture-dry-1', 'MOISTURE_DRY_PERCENT', 61.2, 'PERCENT', 'GOOD', 'moisture-2026-08-a', now() - interval '1 days' - interval '1 seconds');

INSERT INTO public.ml_detections (id, event_id, evidence_source, status, model_family, model_version, weights_sha256, class_map_version, detected_label, friendly_label, predicted_category, score, confidence_band, inference_ms, observed_at) VALUES
  ('m0000000-0000-0000-0000-000000000016', 'f0000000-0000-0000-0000-000000000016', 'LOCAL_LIVE', 'DETECTED', 'yolov8n-compatible', 'demo-1.0.0', 'abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789', 'waste-map-1.0.0', 'food_waste', 'Food Scraps', 'WET', 0.94, 'HIGH', 571, now() - interval '1 days' - interval '1 seconds');

INSERT INTO public.segregation_results (event_id, ruleset_id, outcome, suggested_severity, reason_codes, input_hash) VALUES
  ('f0000000-0000-0000-0000-000000000016', 'e0000000-0000-0000-0000-000000000001', 'FLAGGED', 'SEVERE', ARRAY['SEVERE_WET_IN_DRY', 'HIGH_MOISTURE'], '1010101010101010101010101010101010101010101010101010101010101010');

INSERT INTO public.review_cases (event_id, status, reason_codes, suggested_severity, assigned_to, opened_at, decided_at) VALUES
  ('f0000000-0000-0000-0000-000000000016', 'DECIDED', ARRAY['SEVERE_WET_IN_DRY', 'HIGH_MOISTURE'], 'SEVERE', 'a0000000-0000-0000-0000-000000000002', now() - interval '1 days', now() - interval '12 hours');

INSERT INTO public.review_decisions (case_id, reviewer_id, decision, violation_severity, reason_code, notes, decided_at) VALUES
  ((SELECT id FROM public.review_cases WHERE event_id = 'f0000000-0000-0000-0000-000000000016'),
   'a0000000-0000-0000-0000-000000000002', 'VERIFIED_VIOLATION', 'SEVERE', 'WET_IN_DRY_SEVERE',
   'Large quantity of wet food placed in dry compartment. High moisture confirmed.', now() - interval '12 hours');

INSERT INTO public.point_transactions (citizen_id, event_id, review_decision_id, entry_kind, points_delta, reason_code, created_by, idempotency_key) VALUES
  ('b0000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000016',
   (SELECT id FROM public.review_decisions WHERE case_id = (SELECT id FROM public.review_cases WHERE event_id = 'f0000000-0000-0000-0000-000000000016')),
   'VIOLATION', -20, 'WET_IN_DRY_SEVERE', 'a0000000-0000-0000-0000-000000000002', 'p0000000-0000-0000-0000-000000000016');

-- ============================================================
-- Event 17: DISPUTE + REVERSAL (citizen disputed event 16, reversed)
-- ============================================================
INSERT INTO public.disputes (citizen_id, negative_transaction_id, status, citizen_reason, resolution_reason, resolved_by, resolved_at) VALUES
  ('b0000000-0000-0000-0000-000000000001',
   (SELECT id FROM public.point_transactions WHERE event_id = 'f0000000-0000-0000-0000-000000000016' AND entry_kind = 'VIOLATION'),
   'REVERSED',
   'The waste was actually dry packaging with residual moisture from washing. Not wet food waste.',
   'After re-examination, the item was dry packaging. Moisture was from washing, not food contamination.',
   'a0000000-0000-0000-0000-000000000002',
   now() - interval '6 hours');

-- Create the compensating reversal
INSERT INTO public.point_transactions (citizen_id, event_id, entry_kind, points_delta, reason_code, reversed_transaction_id, created_by, idempotency_key) VALUES
  ('b0000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000016', 'REVERSAL', 20, 'DISPUTE_REVERSED',
   (SELECT id FROM public.point_transactions WHERE event_id = 'f0000000-0000-0000-0000-000000000016' AND entry_kind = 'VIOLATION'),
   'a0000000-0000-0000-0000-000000000002', 'p0000000-0000-0000-0000-000000000017');

-- ============================================================
-- Events 18-20: More accepted events to reach 20 total
-- ============================================================

-- Event 18: ACCEPTED DRY (metal can, score 0.91, moisture 8.2%)
INSERT INTO public.disposal_events (id, session_id, citizen_id, device_id, event_source, selected_compartment, processing_state, decision_state, location_quality, occurred_at, edge_received_at) VALUES
  ('f0000000-0000-0000-0000-000000000018', null, 'b0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000002', 'HARDWARE', 'DRY', 'COMPLETED', 'ACCEPTED', 'NO_FIX', now() - interval '10 hours', now() - interval '10 hours' - interval '2 minutes');

INSERT INTO public.sensor_readings (event_id, component_code, sensor_code, boolean_value, unit, quality, captured_at) VALUES
  ('f0000000-0000-0000-0000-000000000018', 'ir-dry-1', 'IR_TRIGGERED', true, 'BOOLEAN', 'GOOD', now() - interval '10 hours' - interval '1 seconds');

INSERT INTO public.ml_detections (id, event_id, evidence_source, status, model_family, model_version, weights_sha256, class_map_version, detected_label, friendly_label, predicted_category, score, confidence_band, inference_ms, observed_at) VALUES
  ('m0000000-0000-0000-0000-000000000018', 'f0000000-0000-0000-0000-000000000018', 'LOCAL_LIVE', 'DETECTED', 'yolov8n-compatible', 'demo-1.0.0', 'abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789', 'waste-map-1.0.0', 'metal', 'Metal Can', 'DRY', 0.91, 'HIGH', 592, now() - interval '10 hours' - interval '1 seconds');

INSERT INTO public.segregation_results (event_id, ruleset_id, outcome, suggested_severity, reason_codes, input_hash) VALUES
  ('f0000000-0000-0000-0000-000000000018', 'e0000000-0000-0000-0000-000000000001', 'ACCEPTED', 'NONE', ARRAY['SUPPORTED_CATEGORY_MATCH', 'DRY_MOISTURE_NORMAL'], '2020202020202020202020202020202020202020202020202020202020202020');

INSERT INTO public.point_transactions (citizen_id, event_id, entry_kind, points_delta, reason_code, created_by, idempotency_key) VALUES
  ('b0000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000018', 'AWARD', 10, 'SUPPORTED_CATEGORY_MATCH', 'a0000000-0000-0000-0000-000000000001', 'p0000000-0000-0000-0000-000000000018');

-- Event 19: ACCEPTED WET (compost, score 0.88)
INSERT INTO public.disposal_events (id, session_id, citizen_id, device_id, event_source, selected_compartment, processing_state, decision_state, location_quality, occurred_at, edge_received_at) VALUES
  ('f0000000-0000-0000-0000-000000000019', null, 'b0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000002', 'HARDWARE', 'WET', 'COMPLETED', 'ACCEPTED', 'GPS_2D', now() - interval '5 hours', now() - interval '5 hours' - interval '2 minutes');

INSERT INTO public.sensor_readings (event_id, component_code, sensor_code, boolean_value, unit, quality, captured_at) VALUES
  ('f0000000-0000-0000-0000-000000000019', 'ir-wet-1', 'IR_TRIGGERED', true, 'BOOLEAN', 'GOOD', now() - interval '5 hours' - interval '1 seconds');

INSERT INTO public.ml_detections (id, event_id, evidence_source, status, model_family, model_version, weights_sha256, class_map_version, detected_label, friendly_label, predicted_category, score, confidence_band, inference_ms, observed_at) VALUES
  ('m0000000-0000-0000-0000-000000000019', 'f0000000-0000-0000-0000-000000000019', 'LOCAL_LIVE', 'DETECTED', 'yolov8n-compatible', 'demo-1.0.0', 'abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789', 'waste-map-1.0.0', 'organic', 'Compost', 'WET', 0.88, 'HIGH', 608, now() - interval '5 hours' - interval '1 seconds');

INSERT INTO public.segregation_results (event_id, ruleset_id, outcome, suggested_severity, reason_codes, input_hash) VALUES
  ('f0000000-0000-0000-0000-000000000019', 'e0000000-0000-0000-0000-000000000001', 'ACCEPTED', 'NONE', ARRAY['SUPPORTED_CATEGORY_MATCH', 'WET_COMPARTMENT_MATCH'], '3030303030303030303030303030303030303030303030303030303030303030');

INSERT INTO public.point_transactions (citizen_id, event_id, entry_kind, points_delta, reason_code, created_by, idempotency_key) VALUES
  ('b0000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000019', 'AWARD', 10, 'SUPPORTED_CATEGORY_MATCH', 'a0000000-0000-0000-0000-000000000001', 'p0000000-0000-0000-0000-000000000019');

-- Event 20: ACCEPTED DRY (glass, score 0.95, moisture 5.1%)
INSERT INTO public.disposal_events (id, session_id, citizen_id, device_id, event_source, selected_compartment, processing_state, decision_state, location_quality, occurred_at, edge_received_at) VALUES
  ('f0000000-0000-0000-0000-000000000020', null, 'b0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000002', 'HARDWARE', 'DRY', 'COMPLETED', 'ACCEPTED', 'NO_FIX', now() - interval '2 hours', now() - interval '2 hours' - interval '2 minutes');

INSERT INTO public.sensor_readings (event_id, component_code, sensor_code, boolean_value, unit, quality, captured_at) VALUES
  ('f0000000-0000-0000-0000-000000000020', 'ir-dry-1', 'IR_TRIGGERED', true, 'BOOLEAN', 'GOOD', now() - interval '2 hours' - interval '1 seconds');

INSERT INTO public.sensor_readings (event_id, component_code, sensor_code, numeric_value, unit, quality, calibration_version, captured_at) VALUES
  ('f0000000-0000-0000-0000-000000000020', 'ultrasonic-dry-1', 'FILL_DRY_PERCENT', 30.5, 'PERCENT', 'GOOD', 'fill-dry-2026-08-a', now() - interval '2 hours' - interval '1 seconds'),
  ('f0000000-0000-0000-0000-000000000020', 'moisture-dry-1', 'MOISTURE_DRY_PERCENT', 5.1, 'PERCENT', 'GOOD', 'moisture-2026-08-a', now() - interval '2 hours' - interval '1 seconds');

INSERT INTO public.ml_detections (id, event_id, evidence_source, status, model_family, model_version, weights_sha256, class_map_version, detected_label, friendly_label, predicted_category, score, confidence_band, inference_ms, observed_at) VALUES
  ('m0000000-0000-0000-0000-000000000020', 'f0000000-0000-0000-0000-000000000020', 'LOCAL_LIVE', 'DETECTED', 'yolov8n-compatible', 'demo-1.0.0', 'abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789', 'waste-map-1.0.0', 'glass', 'Glass Bottle', 'DRY', 0.95, 'HIGH', 583, now() - interval '2 hours' - interval '1 seconds');

INSERT INTO public.segregation_results (event_id, ruleset_id, outcome, suggested_severity, reason_codes, input_hash) VALUES
  ('f0000000-0000-0000-0000-000000000020', 'e0000000-0000-0000-0000-000000000001', 'ACCEPTED', 'NONE', ARRAY['SUPPORTED_CATEGORY_MATCH', 'DRY_MOISTURE_NORMAL'], '4040404040404040404040404040404040404040404040404040404040404040');

INSERT INTO public.point_transactions (citizen_id, event_id, entry_kind, points_delta, reason_code, created_by, idempotency_key) VALUES
  ('b0000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000020', 'AWARD', 10, 'SUPPORTED_CATEGORY_MATCH', 'a0000000-0000-0000-0000-000000000001', 'p0000000-0000-0000-0000-000000000020');

-- ============================================================
-- 9. Peer events (2-4 events each for 4 peers = ~10 peer events)
-- ============================================================

-- Peer 1: Neha Kapoor (2 accepted events)
INSERT INTO public.disposal_events (id, citizen_id, device_id, event_source, selected_compartment, processing_state, decision_state, location_quality, occurred_at, edge_received_at) VALUES
  ('f0000000-0000-0000-0000-000000000021', 'b0000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000002', 'HARDWARE', 'DRY', 'COMPLETED', 'ACCEPTED', 'NO_FIX', now() - interval '10 days', now() - interval '10 days' - interval '2 minutes');

INSERT INTO public.segregation_results (event_id, ruleset_id, outcome, suggested_severity, reason_codes, input_hash) VALUES
  ('f0000000-0000-0000-0000-000000000021', 'e0000000-0000-0000-0000-000000000001', 'ACCEPTED', 'NONE', ARRAY['SUPPORTED_CATEGORY_MATCH', 'DRY_MOISTURE_NORMAL'], '5050505050505050505050505050505050505050505050505050505050505050');

INSERT INTO public.point_transactions (citizen_id, event_id, entry_kind, points_delta, reason_code, idempotency_key) VALUES
  ('b0000000-0000-0000-0000-000000000002', 'f0000000-0000-0000-0000-000000000021', 'AWARD', 10, 'SUPPORTED_CATEGORY_MATCH', 'p0000000-0000-0000-0000-000000000021');

INSERT INTO public.disposal_events (id, citizen_id, device_id, event_source, selected_compartment, processing_state, decision_state, location_quality, occurred_at, edge_received_at) VALUES
  ('f0000000-0000-0000-0000-000000000022', 'b0000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000002', 'HARDWARE', 'WET', 'COMPLETED', 'ACCEPTED', 'NO_FIX', now() - interval '5 days', now() - interval '5 days' - interval '2 minutes');

INSERT INTO public.segregation_results (event_id, ruleset_id, outcome, suggested_severity, reason_codes, input_hash) VALUES
  ('f0000000-0000-0000-0000-000000000022', 'e0000000-0000-0000-0000-000000000001', 'ACCEPTED', 'NONE', ARRAY['SUPPORTED_CATEGORY_MATCH', 'WET_COMPARTMENT_MATCH'], '6060606060606060606060606060606060606060606060606060606060606060');

INSERT INTO public.point_transactions (citizen_id, event_id, entry_kind, points_delta, reason_code, idempotency_key) VALUES
  ('b0000000-0000-0000-0000-000000000002', 'f0000000-0000-0000-0000-000000000022', 'AWARD', 10, 'SUPPORTED_CATEGORY_MATCH', 'p0000000-0000-0000-0000-000000000022');

-- Peer 2: Vikram Singh (2 accepted events)
INSERT INTO public.disposal_events (id, citizen_id, device_id, event_source, selected_compartment, processing_state, decision_state, location_quality, occurred_at, edge_received_at) VALUES
  ('f0000000-0000-0000-0000-000000000023', 'b0000000-0000-0000-0000-000000000003', 'd0000000-0000-0000-0000-000000000002', 'HARDWARE', 'DRY', 'COMPLETED', 'ACCEPTED', 'GPS_2D', now() - interval '8 days', now() - interval '8 days' - interval '2 minutes');

INSERT INTO public.segregation_results (event_id, ruleset_id, outcome, suggested_severity, reason_codes, input_hash) VALUES
  ('f0000000-0000-0000-0000-000000000023', 'e0000000-0000-0000-0000-000000000001', 'ACCEPTED', 'NONE', ARRAY['SUPPORTED_CATEGORY_MATCH', 'DRY_MOISTURE_NORMAL'], '7070707070707070707070707070707070707070707070707070707070707070');

INSERT INTO public.point_transactions (citizen_id, event_id, entry_kind, points_delta, reason_code, idempotency_key) VALUES
  ('b0000000-0000-0000-0000-000000000003', 'f0000000-0000-0000-0000-000000000023', 'AWARD', 10, 'SUPPORTED_CATEGORY_MATCH', 'p0000000-0000-0000-0000-000000000023');

INSERT INTO public.disposal_events (id, citizen_id, device_id, event_source, selected_compartment, processing_state, decision_state, location_quality, occurred_at, edge_received_at) VALUES
  ('f0000000-0000-0000-0000-000000000024', 'b0000000-0000-0000-0000-000000000003', 'd0000000-0000-0000-0000-000000000002', 'HARDWARE', 'WET', 'COMPLETED', 'ACCEPTED', 'NO_FIX', now() - interval '4 days', now() - interval '4 days' - interval '2 minutes');

INSERT INTO public.segregation_results (event_id, ruleset_id, outcome, suggested_severity, reason_codes, input_hash) VALUES
  ('f0000000-0000-0000-0000-000000000024', 'e0000000-0000-0000-0000-000000000001', 'ACCEPTED', 'NONE', ARRAY['SUPPORTED_CATEGORY_MATCH', 'WET_COMPARTMENT_MATCH'], '8080808080808080808080808080808080808080808080808080808080808080');

INSERT INTO public.point_transactions (citizen_id, event_id, entry_kind, points_delta, reason_code, idempotency_key) VALUES
  ('b0000000-0000-0000-0000-000000000003', 'f0000000-0000-0000-0000-000000000024', 'AWARD', 10, 'SUPPORTED_CATEGORY_MATCH', 'p0000000-0000-0000-0000-000000000024');

-- Peer 3: Ananya Patel (3 accepted events — Gold tier at 60 pts)
INSERT INTO public.disposal_events (id, citizen_id, device_id, event_source, selected_compartment, processing_state, decision_state, location_quality, occurred_at, edge_received_at) VALUES
  ('f0000000-0000-0000-0000-000000000025', 'b0000000-0000-0000-0000-000000000004', 'd0000000-0000-0000-0000-000000000002', 'HARDWARE', 'DRY', 'COMPLETED', 'ACCEPTED', 'NO_FIX', now() - interval '11 days', now() - interval '11 days' - interval '2 minutes');

INSERT INTO public.segregation_results (event_id, ruleset_id, outcome, suggested_severity, reason_codes, input_hash) VALUES
  ('f0000000-0000-0000-0000-000000000025', 'e0000000-0000-0000-0000-000000000001', 'ACCEPTED', 'NONE', ARRAY['SUPPORTED_CATEGORY_MATCH', 'DRY_MOISTURE_NORMAL'], '9090909090909090909090909090909090909090909090909090909090909090');

INSERT INTO public.point_transactions (citizen_id, event_id, entry_kind, points_delta, reason_code, idempotency_key) VALUES
  ('b0000000-0000-0000-0000-000000000004', 'f0000000-0000-0000-0000-000000000025', 'AWARD', 10, 'SUPPORTED_CATEGORY_MATCH', 'p0000000-0000-0000-0000-000000000025');

INSERT INTO public.disposal_events (id, citizen_id, device_id, event_source, selected_compartment, processing_state, decision_state, location_quality, occurred_at, edge_received_at) VALUES
  ('f0000000-0000-0000-0000-000000000026', 'b0000000-0000-0000-0000-000000000004', 'd0000000-0000-0000-0000-000000000002', 'HARDWARE', 'WET', 'COMPLETED', 'ACCEPTED', 'GPS_2D', now() - interval '7 days', now() - interval '7 days' - interval '2 minutes');

INSERT INTO public.segregation_results (event_id, ruleset_id, outcome, suggested_severity, reason_codes, input_hash) VALUES
  ('f0000000-0000-0000-0000-000000000026', 'e0000000-0000-0000-0000-000000000001', 'ACCEPTED', 'NONE', ARRAY['SUPPORTED_CATEGORY_MATCH', 'WET_COMPARTMENT_MATCH'], 'a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0');

INSERT INTO public.point_transactions (citizen_id, event_id, entry_kind, points_delta, reason_code, idempotency_key) VALUES
  ('b0000000-0000-0000-0000-000000000004', 'f0000000-0000-0000-0000-000000000026', 'AWARD', 10, 'SUPPORTED_CATEGORY_MATCH', 'p0000000-0000-0000-0000-000000000026');

INSERT INTO public.disposal_events (id, citizen_id, device_id, event_source, selected_compartment, processing_state, decision_state, location_quality, occurred_at, edge_received_at) VALUES
  ('f0000000-0000-0000-0000-000000000027', 'b0000000-0000-0000-0000-000000000004', 'd0000000-0000-0000-0000-000000000002', 'HARDWARE', 'DRY', 'COMPLETED', 'ACCEPTED', 'NO_FIX', now() - interval '3 days', now() - interval '3 days' - interval '2 minutes');

INSERT INTO public.segregation_results (event_id, ruleset_id, outcome, suggested_severity, reason_codes, input_hash) VALUES
  ('f0000000-0000-0000-0000-000000000027', 'e0000000-0000-0000-0000-000000000001', 'ACCEPTED', 'NONE', ARRAY['SUPPORTED_CATEGORY_MATCH', 'DRY_MOISTURE_NORMAL'], 'b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0');

INSERT INTO public.point_transactions (citizen_id, event_id, entry_kind, points_delta, reason_code, idempotency_key) VALUES
  ('b0000000-0000-0000-0000-000000000004', 'f0000000-0000-0000-0000-000000000027', 'AWARD', 10, 'SUPPORTED_CATEGORY_MATCH', 'p0000000-0000-0000-0000-000000000027');

-- Peer 4: Kavya Iyer (2 accepted events)
INSERT INTO public.disposal_events (id, citizen_id, device_id, event_source, selected_compartment, processing_state, decision_state, location_quality, occurred_at, edge_received_at) VALUES
  ('f0000000-0000-0000-0000-000000000028', 'b0000000-0000-0000-0000-000000000006', 'd0000000-0000-0000-0000-000000000002', 'HARDWARE', 'DRY', 'COMPLETED', 'ACCEPTED', 'NO_FIX', now() - interval '6 days', now() - interval '6 days' - interval '2 minutes');

INSERT INTO public.segregation_results (event_id, ruleset_id, outcome, suggested_severity, reason_codes, input_hash) VALUES
  ('f0000000-0000-0000-0000-000000000028', 'e0000000-0000-0000-0000-000000000001', 'ACCEPTED', 'NONE', ARRAY['SUPPORTED_CATEGORY_MATCH', 'DRY_MOISTURE_NORMAL'], 'c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0');

INSERT INTO public.point_transactions (citizen_id, event_id, entry_kind, points_delta, reason_code, idempotency_key) VALUES
  ('b0000000-0000-0000-0000-000000000006', 'f0000000-0000-0000-0000-000000000028', 'AWARD', 10, 'SUPPORTED_CATEGORY_MATCH', 'p0000000-0000-0000-0000-000000000028');

INSERT INTO public.disposal_events (id, citizen_id, device_id, event_source, selected_compartment, processing_state, decision_state, location_quality, occurred_at, edge_received_at) VALUES
  ('f0000000-0000-0000-0000-000000000029', 'b0000000-0000-0000-0000-000000000006', 'd0000000-0000-0000-0000-000000000002', 'HARDWARE', 'WET', 'COMPLETED', 'ACCEPTED', 'GPS_2D', now() - interval '2 days', now() - interval '2 days' - interval '2 minutes');

INSERT INTO public.segregation_results (event_id, ruleset_id, outcome, suggested_severity, reason_codes, input_hash) VALUES
  ('f0000000-0000-0000-0000-000000000029', 'e0000000-0000-0000-0000-000000000001', 'ACCEPTED', 'NONE', ARRAY['SUPPORTED_CATEGORY_MATCH', 'WET_COMPARTMENT_MATCH'], 'd0d0d0d0d0d0d0d0d0d0d0d0d0d0d0d0d0d0d0d0d0d0d0d0d0d0d0d0d0d0d0d0');

INSERT INTO public.point_transactions (citizen_id, event_id, entry_kind, points_delta, reason_code, idempotency_key) VALUES
  ('b0000000-0000-0000-0000-000000000006', 'f0000000-0000-0000-0000-000000000029', 'AWARD', 10, 'SUPPORTED_CATEGORY_MATCH', 'p0000000-0000-0000-0000-000000000029');

-- Peer 5: Raj Mehta (1 event, leaderboard opt-in=false, still has events)
INSERT INTO public.disposal_events (id, citizen_id, device_id, event_source, selected_compartment, processing_state, decision_state, location_quality, occurred_at, edge_received_at) VALUES
  ('f0000000-0000-0000-0000-000000000030', 'b0000000-0000-0000-0000-000000000005', 'd0000000-0000-0000-0000-000000000002', 'HARDWARE', 'DRY', 'COMPLETED', 'ACCEPTED', 'NO_FIX', now() - interval '9 days', now() - interval '9 days' - interval '2 minutes');

INSERT INTO public.segregation_results (event_id, ruleset_id, outcome, suggested_severity, reason_codes, input_hash) VALUES
  ('f0000000-0000-0000-0000-000000000030', 'e0000000-0000-0000-0000-000000000001', 'ACCEPTED', 'NONE', ARRAY['SUPPORTED_CATEGORY_MATCH', 'DRY_MOISTURE_NORMAL'], 'e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0');

INSERT INTO public.point_transactions (citizen_id, event_id, entry_kind, points_delta, reason_code, idempotency_key) VALUES
  ('b0000000-0000-0000-0000-000000000005', 'f0000000-0000-0000-0000-000000000030', 'AWARD', 10, 'SUPPORTED_CATEGORY_MATCH', 'p0000000-0000-0000-0000-000000000030');

-- ============================================================
-- 10. Device Heartbeats (history for ESP32-001)
-- ============================================================
INSERT INTO public.device_heartbeats (device_id, firmware_version, uptime_seconds, free_heap_bytes, wifi_rssi_dbm, edge_reachable, component_health, occurred_at) VALUES
  ('d0000000-0000-0000-0000-000000000002', 'smart-waste-esp32-1.0.0', 3600,  115200, -52, true,
   '{"irWet":"OK","irDry":"OK","ultrasonicWet":"OK","ultrasonicDry":"OK","moistureDry":"OK","gps":"OK"}'::jsonb,
   now() - interval '13 days'),
  ('d0000000-0000-0000-0000-000000000002', 'smart-waste-esp32-1.0.0', 7200,  114800, -54, true,
   '{"irWet":"OK","irDry":"OK","ultrasonicWet":"OK","ultrasonicDry":"OK","moistureDry":"OK","gps":"OK"}'::jsonb,
   now() - interval '10 days'),
  ('d0000000-0000-0000-0000-000000000002', 'smart-waste-esp32-1.0.0', 10800, 113500, -56, true,
   '{"irWet":"OK","irDry":"OK","ultrasonicWet":"OK","ultrasonicDry":"OK","moistureDry":"OK","gps":"DEGRADED"}'::jsonb,
   now() - interval '7 days'),
  ('d0000000-0000-0000-0000-000000000002', 'smart-waste-esp32-1.0.0', 14400, 112100, -53, true,
   '{"irWet":"OK","irDry":"OK","ultrasonicWet":"OK","ultrasonicDry":"OK","moistureDry":"OK","gps":"OK"}'::jsonb,
   now() - interval '4 days'),
  ('d0000000-0000-0000-0000-000000000002', 'smart-waste-esp32-1.0.0', 18000, 111800, -51, true,
   '{"irWet":"OK","irDry":"OK","ultrasonicWet":"OK","ultrasonicDry":"OK","moistureDry":"OK","gps":"OK"}'::jsonb,
   now() - interval '1 days'),
  ('d0000000-0000-0000-0000-000000000002', 'smart-waste-esp32-1.0.0', 21600, 110500, -50, true,
   '{"irWet":"OK","irDry":"OK","ultrasonicWet":"OK","ultrasonicDry":"OK","moistureDry":"OK","gps":"OK"}'::jsonb,
   now() - interval '2 hours');

-- ============================================================
-- 11. Device Telemetry (fill/GPS samples)
-- ============================================================
INSERT INTO public.device_telemetry (device_id, telemetry_code, numeric_value, quality, occurred_at) VALUES
  ('d0000000-0000-0000-0000-000000000002', 'FILL_WET_PERCENT', 25.0, 'GOOD', now() - interval '13 days'),
  ('d0000000-0000-0000-0000-000000000002', 'FILL_DRY_PERCENT', 30.0, 'GOOD', now() - interval '13 days'),
  ('d0000000-0000-0000-0000-000000000002', 'FILL_WET_PERCENT', 32.5, 'GOOD', now() - interval '10 days'),
  ('d0000000-0000-0000-0000-000000000002', 'FILL_DRY_PERCENT', 38.2, 'GOOD', now() - interval '10 days'),
  ('d0000000-0000-0000-0000-000000000002', 'FILL_WET_PERCENT', 28.8, 'GOOD', now() - interval '7 days'),
  ('d0000000-0000-0000-0000-000000000002', 'FILL_DRY_PERCENT', 35.1, 'GOOD', now() - interval '7 days'),
  ('d0000000-0000-0000-0000-000000000002', 'FILL_WET_PERCENT', 30.2, 'GOOD', now() - interval '4 days'),
  ('d0000000-0000-0000-0000-000000000002', 'FILL_DRY_PERCENT', 40.5, 'GOOD', now() - interval '4 days'),
  ('d0000000-0000-0000-0000-000000000002', 'FILL_WET_PERCENT', 22.1, 'GOOD', now() - interval '1 days'),
  ('d0000000-0000-0000-0000-000000000002', 'FILL_DRY_PERCENT', 28.9, 'GOOD', now() - interval '2 hours');

INSERT INTO public.device_telemetry (device_id, telemetry_code, location, quality, occurred_at) VALUES
  ('d0000000-0000-0000-0000-000000000002', 'GPS_LOCATION', '{"latitude":28.6139,"longitude":77.2090}'::jsonb, 'GOOD', now() - interval '13 days'),
  ('d0000000-0000-0000-0000-000000000002', 'GPS_LOCATION', '{"latitude":28.6140,"longitude":77.2091}'::jsonb, 'GOOD', now() - interval '10 days'),
  ('d0000000-0000-0000-0000-000000000002', 'GPS_LOCATION', null, 'NO_FIX', now() - interval '7 days'),
  ('d0000000-0000-0000-0000-000000000002', 'GPS_LOCATION', '{"latitude":28.6142,"longitude":77.2093}'::jsonb, 'GOOD', now() - interval '4 days'),
  ('d0000000-0000-0000-0000-000000000002', 'GPS_LOCATION', '{"latitude":28.6143,"longitude":77.2094}'::jsonb, 'GOOD', now() - interval '2 hours');

-- ============================================================
-- 12. Audit logs for seed events
-- ============================================================
INSERT INTO public.audit_logs (actor_profile_id, actor_type, action, target_type, target_id, source_label, safe_metadata) VALUES
  ('a0000000-0000-0000-0000-000000000002', 'USER', 'REVIEW_DECISION', 'review_case',
   (SELECT id FROM public.review_cases WHERE event_id = 'f0000000-0000-0000-0000-000000000014'),
   'CLOUD', '{"decision":"REVIEW_ACCEPTED","reason":"CITIZEN_CLAIMS_CORRECT"}'),
  ('a0000000-0000-0000-0000-000000000002', 'USER', 'REVIEW_DECISION', 'review_case',
   (SELECT id FROM public.review_cases WHERE event_id = 'f0000000-0000-0000-0000-000000000015'),
   'CLOUD', '{"decision":"VERIFIED_VIOLATION","severity":"NORMAL"}'),
  ('a0000000-0000-0000-0000-000000000002', 'USER', 'REVIEW_DECISION', 'review_case',
   (SELECT id FROM public.review_cases WHERE event_id = 'f0000000-0000-0000-0000-000000000016'),
   'CLOUD', '{"decision":"VERIFIED_VIOLATION","severity":"SEVERE"}'),
  ('a0000000-0000-0000-0000-000000000002', 'USER', 'DISPUTE_RESOLVED', 'dispute',
   (SELECT id FROM public.disputes WHERE negative_transaction_id = (SELECT id FROM public.point_transactions WHERE event_id = 'f0000000-0000-0000-0000-000000000016' AND entry_kind = 'VIOLATION')),
   'CLOUD', '{"resolution":"REVERSED","reason":"Packaging not food waste"}');

-- ============================================================
-- Badge awards for primary citizen (balance = 150: 20 accepted*10 - 10 - 20 + 20 reversal = 150)
-- ============================================================
-- Note: The primary citizen gets BRONZE and FIRST badges
INSERT INTO public.citizen_badges (citizen_id, badge_id, award_reason, source_balance) VALUES
  ('b0000000-0000-0000-0000-000000000001',
   (SELECT id FROM public.badges WHERE code = 'FIRST'),
   'First verified disposal event', 10),
  ('b0000000-0000-0000-0000-000000000001',
   (SELECT id FROM public.badges WHERE code = 'BRONZE'),
   'Achieved Bronze tier', 150);

-- Ananya Patel gets BRONZE (balance = 30)
INSERT INTO public.citizen_badges (citizen_id, badge_id, award_reason, source_balance) VALUES
  ('b0000000-0000-0000-0000-000000000004',
   (SELECT id FROM public.badges WHERE code = 'FIRST'),
   'First verified disposal event', 10);
