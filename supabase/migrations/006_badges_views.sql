-- Migration 006: Badges, Citizen Badges, Point Balance/Tier/Leaderboard Views
-- Supabase PostgreSQL — forward-only migration

-- ============================================================
-- 19. badges — frozen demo badge/tier definitions
-- ============================================================
create table public.badges (
  id              uuid primary key default gen_random_uuid(),
  code            text not null unique,
  name            text not null,
  description     text not null,
  minimum_points  integer not null check (minimum_points >= 0),
  is_demo_enabled boolean not null default true,
  created_at      timestamptz not null default now()
);

comment on table public.badges is 'Frozen demo badge/tier definitions.';

-- ============================================================
-- 20. citizen_badges — auditable earned badge projection
-- ============================================================
create table public.citizen_badges (
  id                 uuid primary key default gen_random_uuid(),
  citizen_id         uuid not null references public.citizens(id) on delete restrict,
  badge_id           uuid not null references public.badges(id) on delete restrict,
  awarded_at         timestamptz not null default now(),
  award_reason       text not null,
  source_balance     integer not null,
  revoked_at         timestamptz,
  revocation_reason  text,
  unique (citizen_id, badge_id)
);

comment on table public.citizen_badges is 'Auditable earned badge projection per citizen.';

-- ============================================================
-- 21. citizen_point_balances — derived ledger balance view
-- ============================================================
create view public.citizen_point_balances
with (security_invoker = true) as
select
  c.id as citizen_id,
  coalesce(sum(pt.points_delta), 0)::bigint as points_balance
from public.citizens c
left join public.point_transactions pt on pt.citizen_id = c.id
group by c.id;

comment on view public.citizen_point_balances is 'Derived append-only ledger balance per citizen.';

-- ============================================================
-- 22. citizen_tiers — derived tier projection view
-- ============================================================
create view public.citizen_tiers
with (security_invoker = true) as
select
  b.citizen_id,
  b.points_balance,
  case
    when b.points_balance >= 2000 then 'PLATINUM'
    when b.points_balance >= 1000 then 'GOLD'
    when b.points_balance >= 500  then 'SILVER'
    else 'BRONZE'
  end as tier
from public.citizen_point_balances b;

comment on view public.citizen_tiers is 'Derived Bronze/Silver/Gold/Platinum tier per citizen.';

-- ============================================================
-- 23. leaderboard_public — opt-in fictional alias aggregate
-- ============================================================
create view public.leaderboard_public
with (security_barrier = true, security_invoker = true) as
select
  c.leaderboard_alias,
  b.points_balance,
  dense_rank() over (
    order by b.points_balance desc, c.leaderboard_alias asc
  ) as rank
from public.citizens c
join public.citizen_point_balances b on b.citizen_id = c.id
where c.leaderboard_opt_in and c.status = 'ACTIVE';

comment on view public.leaderboard_public is 'Privacy-safe leaderboard of opt-in fictional aliases.';

-- Grant service_role access to views
revoke all on public.citizen_point_balances from anon, authenticated;
revoke all on public.citizen_tiers from anon, authenticated;
revoke all on public.leaderboard_public from anon, authenticated;
grant select on public.citizen_point_balances to service_role;
grant select on public.citizen_tiers to service_role;
grant select on public.leaderboard_public to service_role;
