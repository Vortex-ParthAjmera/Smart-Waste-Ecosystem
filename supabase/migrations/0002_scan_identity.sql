-- =========================================================================
-- 0002_scan_identity.sql
--
-- THIS IS THE MIGRATION THAT FIXES THE "always shows Priya Sharma" BUG.
--
-- Why 0001 alone can't fix it:
--   0001's RLS policy on `profiles` is "Users can view their own profile"
--   (auth.uid() = id). That is correct for a citizen reading their own data,
--   but the municipal scanner needs to read a DIFFERENT user's row - the
--   citizen standing in front of it. Under that policy the lookup returns
--   zero rows, which is exactly why the old code fell back to a hardcoded
--   mock fixture and printed "Priya Sharma" for everybody.
--
-- The fix is NOT to loosen RLS (that would expose every profile to anyone).
-- It's a SECURITY DEFINER function that returns a deliberately minimal
-- "scan card" - display name, locality, tier, points - and nothing else.
-- No email, no phone, no username, no auth data.
-- =========================================================================

-- ---- extra profile columns the citizen surface + scan card need ----------

alter table public.profiles add column if not exists locality       text;
alter table public.profiles add column if not exists points_balance integer not null default 0;
alter table public.profiles add column if not exists avatar_url     text;

-- Tier is derived from points, so store it as a generated column - it can
-- never drift out of sync with the balance.
alter table public.profiles drop column if exists tier;
alter table public.profiles add column tier text
  generated always as (
    case
      when points_balance >= 2000 then 'PLATINUM'
      when points_balance >= 1000 then 'GOLD'
      when points_balance >=  500 then 'SILVER'
      else 'BRONZE'
    end
  ) stored;

-- ---- keep username lowercase + unique -----------------------------------
-- get_email_for_username() in 0001 does `where username = lower(uname)`, so
-- anything stored with capitals could never be matched. Normalise on write.

create or replace function public.normalize_username()
returns trigger
language plpgsql
as $$
begin
  new.username := lower(trim(new.username));
  return new;
end;
$$;

drop trigger if exists profiles_normalize_username on public.profiles;
create trigger profiles_normalize_username
  before insert or update of username on public.profiles
  for each row execute function public.normalize_username();

-- ---- richer signup trigger ----------------------------------------------
-- Replaces the 0001 version so that locality is captured at register time
-- and Google sign-ins get a sensible username + full name.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  derived_username text;
  derived_name     text;
begin
  derived_name := coalesce(
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'name',
    split_part(new.email, '@', 1)
  );

  -- Username from signup metadata; for Google sign-ins fall back to the
  -- email local-part, de-duplicated with a short suffix if taken.
  derived_username := lower(trim(coalesce(
    new.raw_user_meta_data ->> 'username',
    split_part(new.email, '@', 1)
  )));

  if exists (select 1 from public.profiles where username = derived_username) then
    derived_username := derived_username || '_' || substr(new.id::text, 1, 4);
  end if;

  insert into public.profiles (id, username, full_name, email, locality)
  values (
    new.id,
    derived_username,
    derived_name,
    new.email,
    nullif(trim(coalesce(new.raw_user_meta_data ->> 'locality', '')), '')
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---- THE SCAN CARD -------------------------------------------------------
-- Given a citizen's auth user id (the value encoded in their QR code),
-- return only what an operator standing at the bin legitimately needs to
-- see. SECURITY DEFINER means it bypasses the profiles RLS policy, so the
-- exposure surface is exactly these four columns and nothing more.

create or replace function public.get_scan_card(citizen_id uuid)
returns table (
  id             uuid,
  full_name      text,
  locality       text,
  tier           text,
  points_balance integer
)
language sql
security definer set search_path = public
stable
as $$
  select p.id,
         coalesce(p.full_name, 'Unnamed citizen') as full_name,
         coalesce(p.locality, 'Locality not set') as locality,
         p.tier,
         p.points_balance
  from public.profiles p
  where p.id = citizen_id;
$$;

revoke all on function public.get_scan_card(uuid) from public;
grant execute on function public.get_scan_card(uuid) to anon, authenticated;

-- ---- award points when a disposal is logged ------------------------------
-- Keeps profiles.points_balance (and therefore tier) in sync so the scan
-- card shows a real, live number instead of a mock constant.

create or replace function public.apply_disposal_points()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    update public.profiles
       set points_balance = greatest(0, points_balance + new.points_earned)
     where id = new.user_id;
  elsif tg_op = 'DELETE' then
    update public.profiles
       set points_balance = greatest(0, points_balance - old.points_earned)
     where id = old.user_id;
  end if;
  return null;
end;
$$;

drop trigger if exists disposal_records_points on public.disposal_records;
create trigger disposal_records_points
  after insert or delete on public.disposal_records
  for each row execute function public.apply_disposal_points();

-- ---- backfill any rows created before this migration ---------------------

update public.profiles p
   set points_balance = coalesce((
         select sum(d.points_earned)
         from public.disposal_records d
         where d.user_id = p.id
       ), 0)
 where p.points_balance = 0;
