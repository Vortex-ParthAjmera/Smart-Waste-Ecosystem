-- Migration 004: Disposal Events, Sensor Readings, ML Detections
-- Supabase PostgreSQL — forward-only migration

-- ============================================================
-- 11. disposal_events — central normalized disposal record
-- ============================================================
create table public.disposal_events (
  id                    uuid primary key,
  source_message_id     uuid unique references public.ingest_messages(message_id),
  session_id            uuid unique references public.disposal_sessions(id),
  citizen_id            uuid not null references public.citizens(id),
  qr_token_id           uuid references public.citizen_qr_tokens(id),
  device_id             uuid not null references public.devices(id),
  event_source          text not null check (event_source in (
    'HARDWARE', 'RECORDED_HARDWARE', 'SIMULATED', 'SEEDED'
  )),
  selected_compartment  text not null check (selected_compartment in ('WET', 'DRY')),
  processing_state      text not null check (processing_state in (
    'DISPOSAL_STARTED', 'SENSOR_CAPTURED', 'ML_PENDING', 'ML_RECEIVED',
    'ML_UNAVAILABLE', 'PROCESSING', 'SEGREGATION_DECIDED',
    'POINTS_CALCULATED', 'REVIEW_REQUIRED', 'COMPLETED', 'PROCESSING_FAILED'
  )),
  decision_state        text not null check (decision_state in (
    'CAPTURED', 'EVALUATING', 'ACCEPTED', 'FLAGGED',
    'REVIEW_ACCEPTED', 'REVIEW_NO_ACTION', 'VERIFIED_VIOLATION',
    'PENALIZED', 'CLOSED'
  )),
  latitude              numeric(9,6)
    check (latitude is null or latitude between -90 and 90),
  longitude             numeric(9,6)
    check (longitude is null or longitude between -180 and 180),
  location_accuracy_m   numeric(10,2)
    check (location_accuracy_m is null or location_accuracy_m >= 0),
  location_quality      text not null default 'NO_FIX'
    check (location_quality in ('GPS_2D', 'GPS_3D', 'NO_FIX', 'SIMULATED')),
  occurred_at           timestamptz,
  edge_received_at      timestamptz not null,
  cloud_received_at     timestamptz not null default now(),
  completed_at          timestamptz,
  failure_code          text,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),
  check (
    (location_quality in ('NO_FIX', 'SIMULATED')) or
    (latitude is not null and longitude is not null)
  ),
  check ((latitude is null) = (longitude is null))
);

comment on table public.disposal_events is 'Central normalized disposal event record.';

-- ============================================================
-- 12. sensor_readings — event-linked sensor evidence (append-only)
-- ============================================================
create table public.sensor_readings (
  id                  uuid primary key default gen_random_uuid(),
  event_id            uuid not null references public.disposal_events(id) on delete restrict,
  component_code      text not null,
  sensor_code         text not null check (sensor_code in (
    'IR_TRIGGERED', 'FILL_WET_PERCENT', 'FILL_DRY_PERCENT', 'MOISTURE_DRY_PERCENT'
  )),
  numeric_value       numeric,
  boolean_value       boolean,
  unit                text not null check (unit in ('BOOLEAN', 'PERCENT')),
  quality             text not null check (quality in (
    'GOOD', 'DEGRADED', 'MISSING', 'FAILED', 'OUT_OF_RANGE', 'NOT_APPLICABLE'
  )),
  calibration_version text,
  captured_at         timestamptz,
  created_at          timestamptz not null default now(),
  check (num_nonnulls(numeric_value, boolean_value) <= 1),
  check (
    quality not in ('GOOD', 'DEGRADED')
    or num_nonnulls(numeric_value, boolean_value) = 1
  ),
  unique (event_id, sensor_code, component_code)
);

comment on table public.sensor_readings is 'Event-linked sensor evidence. Append-only.';

-- ============================================================
-- 13. ml_detections — event-linked model metadata/result (append-only)
-- ============================================================
create table public.ml_detections (
  id                   uuid primary key,
  event_id             uuid not null unique references public.disposal_events(id) on delete restrict,
  evidence_source      text not null check (evidence_source in (
    'LOCAL_LIVE', 'RECORDED_ML', 'SIMULATED', 'SEEDED'
  )),
  status               text not null check (status in (
    'DETECTED', 'NO_DETECTION', 'MULTIPLE_CONFLICTING',
    'UNAVAILABLE', 'TIMED_OUT', 'FAILED'
  )),
  model_family         text not null,
  model_version        text not null,
  weights_sha256       text not null check (weights_sha256 ~ '^[0-9a-f]{64}$'),
  class_map_version    text not null,
  input_sha256         text
    check (input_sha256 is null or input_sha256 ~ '^[0-9a-f]{64}$'),
  detected_label       text,
  friendly_label       text,
  predicted_category   text check (predicted_category in ('WET', 'DRY', 'UNKNOWN')),
  score                numeric(6,5)
    check (score is null or score between 0 and 1),
  confidence_band      text check (confidence_band in ('LOW', 'MEDIUM', 'HIGH')),
  inference_ms         integer
    check (inference_ms is null or inference_ms between 0 and 600000),
  observed_at          timestamptz not null,
  created_at           timestamptz not null default now(),
  check (
    (status = 'DETECTED' and detected_label is not null and score is not null)
    or
    (status <> 'DETECTED' and detected_label is null and score is null)
  )
);

comment on table public.ml_detections is 'Event-linked ML detection metadata. Append-only.';

-- Indexes
create index disposal_events_citizen_time_idx
  on public.disposal_events (citizen_id, occurred_at desc);

create index disposal_events_active_idx
  on public.disposal_events (created_at desc)
  where processing_state not in ('COMPLETED', 'PROCESSING_FAILED');

create index sensor_readings_event_idx
  on public.sensor_readings (event_id);

create index ml_detections_event_idx
  on public.ml_detections (event_id, created_at desc);
