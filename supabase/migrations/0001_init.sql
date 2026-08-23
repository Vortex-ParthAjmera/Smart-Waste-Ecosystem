-- =========================================================================
-- Run this in Supabase Studio → SQL Editor (or `supabase db push` if you use
-- the CLI). Sets up:
--   1. profiles          — one row per auth.users row (username, name, email)
--   2. disposal_records  — a citizen's real disposal log, RLS-scoped to them
--   3. a trigger that auto-creates a profile row on signup
--   4. an RPC so the app can look up "which email belongs to this username"
--      at login time, without exposing the whole profiles table publicly
-- =========================================================================

-- ---- profiles -------------------------------------------------------------

create table if not exists public.profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  username   text unique,
  full_name  text,
  email      text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- ---- disposal_records -----------------------------------------------------

create table if not exists public.disposal_records (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users (id) on delete cascade,
  waste_type    text not null,
  compartment   text not null check (compartment in ('WET', 'DRY')),
  weight_grams  integer check (weight_grams is null or weight_grams > 0),
  notes         text,
  points_earned integer not null default 10,
  created_at    timestamptz not null default now()
);

create index if not exists disposal_records_user_id_idx on public.disposal_records (user_id);
create index if not exists disposal_records_created_at_idx on public.disposal_records (created_at desc);

alter table public.disposal_records enable row level security;

create policy "Users can view their own disposal records"
  on public.disposal_records for select
  using (auth.uid() = user_id);

create policy "Users can insert their own disposal records"
  on public.disposal_records for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own disposal records"
  on public.disposal_records for delete
  using (auth.uid() = user_id);

-- ---- auto-create a profile row whenever someone signs up ------------------
-- Works for both Google sign-ins and username/password sign-ups. Username +
-- full_name come from the metadata passed to supabase.auth.signUp(); Google
-- sign-ins populate full_name/email automatically from the Google profile.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, username, full_name, email)
  values (
    new.id,
    new.raw_user_meta_data ->> 'username',
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.email
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---- username -> email lookup for "sign in with username" -----------------
-- Supabase Auth signs in by email, not username. This function lets the
-- server look up the email for a given username WITHOUT giving anonymous
-- clients read access to the profiles table (it only ever returns an email
-- string, nothing else, and only for the given username).

create or replace function public.get_email_for_username(uname text)
returns text
language sql
security definer set search_path = public
stable
as $$
  select email from public.profiles where username = lower(uname) limit 1;
$$;

revoke all on function public.get_email_for_username(text) from public;
grant execute on function public.get_email_for_username(text) to anon, authenticated;
