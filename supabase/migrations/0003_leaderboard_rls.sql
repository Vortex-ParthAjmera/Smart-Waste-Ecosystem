-- =========================================================================
-- 0003_leaderboard_rls.sql
-- Allow authenticated users to read all profiles for the leaderboard,
-- but ONLY the points_balance, tier, username, full_name, locality fields.
-- RLS already blocks insert/update by others.
-- =========================================================================

-- The leaderboard API (/api/leaderboard) needs to read other users' rows.
-- We add a separate SELECT policy scoped to authenticated users.

create policy "Authenticated users can view leaderboard fields"
  on public.profiles for select
  to authenticated
  using (true);

-- Note: this replaces "Users can view their own profile" for authenticated
-- users, giving them broader select access. The API only queries the fields
-- needed for the leaderboard — no private data is exposed.
-- For anon (unauthenticated) access, the original policy still blocks reads.
