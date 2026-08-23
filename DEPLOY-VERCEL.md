# Swachh Saathi — Vercel Deployment Guide

## What changed in this update

| Area | Before | Now |
|---|---|---|
| QR for email users | No QR generated | Full signed QR — works for any auth method |
| Municipal login | Fake redirect after 1.4s | Real Google OAuth → Supabase → `/municipal/scan` |
| Google new user | Dumped to `/citizen` with no locality | Onboarding screen asks locality + GPS detect |
| Profile page | Read-only mock data | Editable — name, username, locality + GPS button |
| Citizen home | Mock 1240 pts (Priya Sharma) | Real `points_balance` from Supabase |
| History page | Mock seeded events | Real `disposal_records` from Supabase |
| Credits page | Mock ledger | Real Supabase points |
| Badges | Hardcoded to demo citizen | Computed from your actual disposal count |
| Leaderboard | Hardcoded 6 entries | Live from Supabase — all registered users |
| Reviews | Mock violations | Real negative-points disposals |
| Prototype text | Everywhere | Removed throughout |
| GPS | Not wired | Register, Profile, and Onboarding all have GPS detect button |
| Municipal sign-out | None | Real Supabase sign-out in header |

---

## 1. Run the new database migration

In **Supabase Dashboard → SQL Editor**, paste and run:

```sql
-- supabase/migrations/0003_leaderboard_rls.sql
create policy "Authenticated users can view leaderboard fields"
  on public.profiles for select
  to authenticated
  using (true);
```

This is needed for the leaderboard to work. Without it, the `/api/leaderboard` query returns zero rows.

> If you get "policy already exists", you can skip this.

Also confirm `0001` and `0002` are applied (run them again — both are idempotent if they are).

---

## 2. Vercel environment variables

These must already be set from before. Verify in **Settings → Environment Variables**:

| Name | Required |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ |
| `QR_SIGNING_SECRET` | ✅ |

**New optional variable — `NEXT_PUBLIC_GOOGLE_MAPS_KEY`** — only needed if you enable the Google Maps view later. Not required now.

---

## 3. Supabase Auth settings

For the **municipal login** Google OAuth to work:

**Authentication → URL Configuration → Redirect URLs** must include:
```
https://YOUR_APP_URL/auth/callback
```
(It should already be there from your previous setup.)

The `next` parameter is now used to route users correctly:
- Citizen Google sign-in → `/auth/callback?next=/citizen`
- Municipal Google sign-in → `/auth/callback?next=/municipal/scan`

---

## 4. Deploy to Vercel (no git)

Since you're using Vercel without git, deploy via the Vercel CLI:

```powershell
cd C:\Users\HP\Desktop\smart-waste-prototype-qr-camera
npx vercel --prod
```

It will ask to confirm the project — select your existing `smart-waste` project. This deploys directly without needing git.

If the CLI isn't linked yet:
```powershell
npx vercel link
npx vercel --prod
```

---

## 5. Google Maps (future, optional)

To add real map views for the truck location and bin map:

1. Enable **Maps JavaScript API** and **Geocoding API** in Google Cloud Console
2. Create an API key, restrict it to your Vercel domain
3. Add `NEXT_PUBLIC_GOOGLE_MAPS_KEY="your-key"` in Vercel environment variables
4. Redeploy

The app is wired to use `NEXT_PUBLIC_GOOGLE_MAPS_KEY` whenever it's present. Currently it falls back to the static ETA display.

---

## 6. Disable email confirmation (recommended for testing)

By default Supabase requires email confirmation for username/password signups. During testing this blocks immediate access.

**Supabase Dashboard → Authentication → Settings → Email** → turn off **"Enable email confirmations"**.

With confirmation off, users who register with a real email get a session immediately after signup (same as username-only accounts).

---

## 7. Verify after deploy

1. Go to `/citizen-register` → register with a username + GPS locality
2. You land on `/citizen` — balance shows **0**, history empty ✅
3. Open **My QR** — your name appears, QR generates ✅
4. Go to `/municipal-login` → **Continue with Google** → real OAuth flow → lands on `/municipal/scan` ✅
5. Scan the citizen QR → operator sees your real name and locality ✅
6. Go to `/citizen/profile` → tap Edit → change name/locality/username → GPS button fills locality ✅
7. Sign in as a second user → scan their QR → operator sees the second user, not the first ✅

---

## Troubleshooting

| Symptom | Fix |
|---|---|
| Municipal Google login redirects to citizen | The `next` param wasn't passed — clear browser cookies and try again |
| Leaderboard empty | Run `0003_leaderboard_rls.sql` in SQL Editor |
| New Google user skips onboarding | `locality` already set in their profile — expected |
| Profile save fails "username taken" | Choose a different username |
| QR shows "Sign in to see your QR" | Session expired — sign in again |
| GPS returns coordinates not address | Nominatim API is rate-limited — try again in a few seconds |
| Badges all locked | You have 0 real disposals — expected for a fresh account |
| History empty | No disposals logged yet — expected |
