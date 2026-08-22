-- Migration 008: Row-Level Security Policies and Security Helper Functions
-- Supabase PostgreSQL — forward-only migration

-- ============================================================
-- Helper functions
-- ============================================================

-- Get current user's app_role from profiles
create or replace function public.get_user_role()
returns text
language sql
security definer
stable
as $$
  select app_role from public.profiles where id = auth.uid();
$$;

-- Get current user's citizen_id (if role is CITIZEN)
create or replace function public.get_user_citizen_id()
returns uuid
language sql
security definer
stable
as $$
  select c.id from public.citizens c
  join public.profiles p on p.id = c.profile_id
  where p.id = auth.uid() and p.app_role = 'CITIZEN';
$$;

-- Check if user is a municipal reviewer or above
create or replace function public.is_reviewer_or_above()
returns boolean
language sql
security definer
stable
as $$
  select public.get_user_role() in (
    'MUNICIPAL_REVIEWER', 'MUNICIPAL_ADMIN', 'SYSTEM_ADMIN'
  );
$$;

-- Check if user is developer or system admin
create or replace function public.is_developer_or_above()
returns boolean
language sql
security definer
stable
as $$
  select public.get_user_role() in ('DEVELOPER', 'SYSTEM_ADMIN');
$$;

-- ============================================================
-- Enable RLS on all tables
-- ============================================================
alter table public.profiles enable row level security;
alter table public.citizens enable row level security;
alter table public.citizen_qr_tokens enable row level security;
alter table public.disposal_sessions enable row level security;
alter table public.gateways enable row level security;
alter table public.devices enable row level security;
alter table public.device_components enable row level security;
alter table public.ingest_messages enable row level security;
alter table public.idempotency_records enable row level security;
alter table public.rulesets enable row level security;
alter table public.disposal_events enable row level security;
alter table public.sensor_readings enable row level security;
alter table public.ml_detections enable row level security;
alter table public.segregation_results enable row level security;
alter table public.review_cases enable row level security;
alter table public.review_decisions enable row level security;
alter table public.point_transactions enable row level security;
alter table public.disputes enable row level security;
alter table public.badges enable row level security;
alter table public.citizen_badges enable row level security;
alter table public.device_heartbeats enable row level security;
alter table public.device_telemetry enable row level security;
alter table public.audit_logs enable row level security;

-- ============================================================
-- profiles policies
-- ============================================================
-- Users can read their own profile
create policy "profiles_select_own"
  on public.profiles for select
  using (id = auth.uid());

-- Users can update their own safe profile fields (not role)
create policy "profiles_update_own"
  on public.profiles for update
  using (id = auth.uid())
  with check (id = auth.uid());

-- Municipal/developer/system_admin can read profiles for authorized operations
create policy "profiles_select_municipal"
  on public.profiles for select
  using (public.get_user_role() in (
    'MUNICIPAL_OPERATOR', 'MUNICIPAL_REVIEWER',
    'MUNICIPAL_ADMIN', 'DEVELOPER', 'SYSTEM_ADMIN'
  ));

-- ============================================================
-- citizens policies
-- ============================================================
-- Citizens can read their own citizen record
create policy "citizens_select_own"
  on public.citizens for select
  using (
    public.get_user_role() = 'CITIZEN'
    and id = public.get_user_citizen_id()
  );

-- Municipal can read citizens for session/event operations
create policy "citizens_select_municipal"
  on public.citizens for select
  using (public.get_user_role() in (
    'MUNICIPAL_OPERATOR', 'MUNICIPAL_REVIEWER',
    'MUNICIPAL_ADMIN', 'SYSTEM_ADMIN'
  ));

-- Developer can read citizens for technical context
create policy "citizens_select_developer"
  on public.citizens for select
  using (public.is_developer_or_above());

-- ============================================================
-- citizen_qr_tokens policies
-- ============================================================
-- Citizens can read their own QR tokens
create policy "qr_tokens_select_own"
  on public.citizen_qr_tokens for select
  using (
    public.get_user_role() = 'CITIZEN'
    and citizen_id = public.get_user_citizen_id()
  );

-- ============================================================
-- disposal_sessions policies
-- ============================================================
-- Citizens can read their own sessions
create policy "sessions_select_own_citizen"
  on public.disposal_sessions for select
  using (
    public.get_user_role() = 'CITIZEN'
    and citizen_id = public.get_user_citizen_id()
  );

-- Municipal can read active/disposed sessions
create policy "sessions_select_municipal"
  on public.disposal_sessions for select
  using (public.get_user_role() in (
    'MUNICIPAL_OPERATOR', 'MUNICIPAL_REVIEWER',
    'MUNICIPAL_ADMIN', 'SYSTEM_ADMIN'
  ));

-- ============================================================
-- disposal_events policies
-- ============================================================
-- Citizens can read their own events
create policy "events_select_own_citizen"
  on public.disposal_events for select
  using (
    public.get_user_role() = 'CITIZEN'
    and citizen_id = public.get_user_citizen_id()
  );

-- Municipal can read events for review/management
create policy "events_select_municipal"
  on public.disposal_events for select
  using (public.get_user_role() in (
    'MUNICIPAL_OPERATOR', 'MUNICIPAL_REVIEWER',
    'MUNICIPAL_ADMIN', 'SYSTEM_ADMIN'
  ));

-- Developer can read events for technical monitoring
create policy "events_select_developer"
  on public.disposal_events for select
  using (public.is_developer_or_above());

-- ============================================================
-- sensor_readings policies
-- ============================================================
-- Citizens can read sensor readings for their own events
create policy "sensor_readings_select_own_citizen"
  on public.sensor_readings for select
  using (
    public.get_user_role() = 'CITIZEN'
    and event_id in (
      select id from public.disposal_events
      where citizen_id = public.get_user_citizen_id()
    )
  );

-- Municipal/reviewer can read sensor evidence for relevant cases
create policy "sensor_readings_select_municipal"
  on public.sensor_readings for select
  using (public.get_user_role() in (
    'MUNICIPAL_OPERATOR', 'MUNICIPAL_REVIEWER',
    'MUNICIPAL_ADMIN', 'SYSTEM_ADMIN'
  ));

-- Developer can read sensor data for technical detail
create policy "sensor_readings_select_developer"
  on public.sensor_readings for select
  using (public.is_developer_or_above());

-- ============================================================
-- ml_detections policies
-- ============================================================
-- Citizens can read ML detections for their own events
create policy "ml_detections_select_own_citizen"
  on public.ml_detections for select
  using (
    public.get_user_role() = 'CITIZEN'
    and event_id in (
      select id from public.disposal_events
      where citizen_id = public.get_user_citizen_id()
    )
  );

-- Municipal/reviewer can read ML evidence
create policy "ml_detections_select_municipal"
  on public.ml_detections for select
  using (public.get_user_role() in (
    'MUNICIPAL_OPERATOR', 'MUNICIPAL_REVIEWER',
    'MUNICIPAL_ADMIN', 'SYSTEM_ADMIN'
  ));

-- Developer can read ML detections for monitoring
create policy "ml_detections_select_developer"
  on public.ml_detections for select
  using (public.is_developer_or_above());

-- ============================================================
-- segregation_results policies
-- ============================================================
-- Citizens can read segregation results for their own events
create policy "results_select_own_citizen"
  on public.segregation_results for select
  using (
    public.get_user_role() = 'CITIZEN'
    and event_id in (
      select id from public.disposal_events
      where citizen_id = public.get_user_citizen_id()
    )
  );

-- Municipal/reviewer can read all results
create policy "results_select_municipal"
  on public.segregation_results for select
  using (public.get_user_role() in (
    'MUNICIPAL_OPERATOR', 'MUNICIPAL_REVIEWER',
    'MUNICIPAL_ADMIN', 'SYSTEM_ADMIN'
  ));

-- ============================================================
-- review_cases policies
-- ============================================================
-- Citizens can see review case status for their own events
create policy "review_cases_select_own_citizen"
  on public.review_cases for select
  using (
    public.get_user_role() = 'CITIZEN'
    and event_id in (
      select id from public.disposal_events
      where citizen_id = public.get_user_citizen_id()
    )
  );

-- Reviewers/admins can see review cases
create policy "review_cases_select_reviewer"
  on public.review_cases for select
  using (public.is_reviewer_or_above());

-- ============================================================
-- review_decisions policies
-- ============================================================
-- Citizens can see review decisions for their own events
create policy "review_decisions_select_own_citizen"
  on public.review_decisions for select
  using (
    public.get_user_role() = 'CITIZEN'
    and case_id in (
      select rc.id from public.review_cases rc
      join public.disposal_events de on de.id = rc.event_id
      where de.citizen_id = public.get_user_citizen_id()
    )
  );

-- Reviewers/admins can see all review decisions
create policy "review_decisions_select_reviewer"
  on public.review_decisions for select
  using (public.is_reviewer_or_above());

-- ============================================================
-- point_transactions policies
-- ============================================================
-- Citizens can read their own point transactions
create policy "point_tx_select_own_citizen"
  on public.point_transactions for select
  using (
    public.get_user_role() = 'CITIZEN'
    and citizen_id = public.get_user_citizen_id()
  );

-- Municipal/reviewer can read all point transactions for audit
create policy "point_tx_select_municipal"
  on public.point_transactions for select
  using (public.get_user_role() in (
    'MUNICIPAL_REVIEWER', 'MUNICIPAL_ADMIN', 'SYSTEM_ADMIN'
  ));

-- ============================================================
-- disputes policies
-- ============================================================
-- Citizens can read their own disputes
create policy "disputes_select_own_citizen"
  on public.disputes for select
  using (
    public.get_user_role() = 'CITIZEN'
    and citizen_id = public.get_user_citizen_id()
  );

-- Reviewers/admins can read disputes for resolution
create policy "disputes_select_reviewer"
  on public.disputes for select
  using (public.is_reviewer_or_above());

-- ============================================================
-- badges policies
-- ============================================================
-- All authenticated users can read badge definitions
create policy "badges_select_authenticated"
  on public.badges for select
  using (auth.uid() is not null);

-- ============================================================
-- citizen_badges policies
-- ============================================================
-- Citizens can read their own badges
create policy "citizen_badges_select_own"
  on public.citizen_badges for select
  using (
    public.get_user_role() = 'CITIZEN'
    and citizen_id = public.get_user_citizen_id()
  );

-- ============================================================
-- gateways, devices, device_components policies
-- ============================================================
-- Developer/system_admin can read gateways/devices/components
create policy "gateways_select_developer"
  on public.gateways for select
  using (public.is_developer_or_above());

create policy "devices_select_developer"
  on public.devices for select
  using (public.is_developer_or_above());

create policy "device_components_select_developer"
  on public.device_components for select
  using (public.is_developer_or_above());

-- ============================================================
-- ingest_messages policies
-- ============================================================
-- Developer/system_admin can read ingest messages
create policy "ingest_messages_select_developer"
  on public.ingest_messages for select
  using (public.is_developer_or_above());

-- ============================================================
-- device_heartbeats policies
-- ============================================================
-- Developer/system_admin can read heartbeats
create policy "heartbeats_select_developer"
  on public.device_heartbeats for select
  using (public.is_developer_or_above());

-- ============================================================
-- device_telemetry policies
-- ============================================================
-- Developer/system_admin can read telemetry
create policy "telemetry_select_developer"
  on public.device_telemetry for select
  using (public.is_developer_or_above());

-- ============================================================
-- audit_logs policies
-- ============================================================
-- Municipal admin/system admin can read audit logs
create policy "audit_logs_select_admin"
  on public.audit_logs for select
  using (public.get_user_role() in ('MUNICIPAL_ADMIN', 'SYSTEM_ADMIN'));

-- Developer can read a safe technical subset
create policy "audit_logs_select_developer"
  on public.audit_logs for select
  using (
    public.get_user_role() = 'DEVELOPER'
    and actor_type in ('DEVICE', 'GATEWAY', 'SYSTEM', 'SEED', 'SIMULATOR')
  );

-- ============================================================
-- rulesets policies
-- ============================================================
-- All authenticated users can read published rulesets
create policy "rulesets_select_authenticated"
  on public.rulesets for select
  using (auth.uid() is not null and status = 'PUBLISHED');

-- System admin can read all rulesets
create policy "rulesets_select_system_admin"
  on public.rulesets for select
  using (public.get_user_role() = 'SYSTEM_ADMIN');

-- ============================================================
-- idempotency_records policies
-- ============================================================
-- Users can read their own idempotency records
create policy "idempotency_select_own"
  on public.idempotency_records for select
  using (actor_id = auth.uid());
