# Swachh Saathi — Supabase + Vercel setup guide

Your app is hosted on Vercel, so `.env.local` is **not** how you configure production.
Environment variables go in the Vercel dashboard, and every URL reference in Google and
Supabase points at your `*.vercel.app` domain (or custom domain), not `localhost`.

Project path for local work: `C:\Users\HP\Desktop\smart-waste-prototype-qr-camera`

---

## 0. What was actually broken

The scanner always showed **Priya Sharma** because of two things, not one:

1. **The QR encoded a mock id.** The citizen QR page built the code from
   `apiClient.getDemoCitizen()`, hardcoded to `cit_priya_sharma` in
   `src/lib/mock/citizens.ts`. Every citizen's QR carried that same fixture id.

2. **The scanner resolved names from the same mock array.** So it faithfully reported
   whatever fixture matched — always Priya.

There was a name override reading `demoStore.citizenProfile`, but `demoStore` is an
in-memory module singleton. It resets on page reload and never leaves the browser tab
that set it. The operator scans from a **different device**, so that override could
never fire.

**The fix:** the QR now encodes the real Supabase `auth.users.id`, signed server-side
with HMAC-SHA256 and an expiry. The scanner posts the decoded string to the server,
which verifies the signature and resolves the name from Postgres via the
`get_scan_card` RPC.

> ⚠️ **Any QR from the current build stops working.** The old format carries no expiry
> field and no valid HMAC, so it is rejected as `malformed`. Citizens just reopen
> **My QR** and it regenerates. Nothing to migrate.

---

## 1. Find your Vercel URL

Your production URL is one of:
- A custom domain you've added, e.g. `https://smartwaste.yourdomain.in`
- The Vercel-assigned URL, e.g. `https://smart-waste-xyz.vercel.app`

Find it in the Vercel dashboard → your project → **Domains**.

**Use this URL everywhere** in the steps below — referred to as `YOUR_APP_URL`.

---

## 2. Create the Supabase project

1. <https://supabase.com/dashboard> → **New project**
2. Name: `smart-waste` · Region: **Mumbai (ap-south-1)** — lowest latency from India
3. Set a database password and **save it** (needed for step 5B)
4. Wait ~2 minutes for provisioning

Then grab your keys: **Project Settings → API**

| Field | Variable name |
|---|---|
| Project URL | `NEXT_PUBLIC_SUPABASE_URL` |
| `anon` / `public` key | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |

The `service_role` key is **not** used by this app. Don't add it anywhere —
it bypasses row-level security.

---

## 3. Apply the database migrations

### Option A — SQL Editor (no CLI required, fastest)

Dashboard → **SQL Editor** → **New query**. Run these **in order**:

1. Paste the entire contents of `supabase/migrations/0001_init.sql` → **Run**
2. Paste the entire contents of `supabase/migrations/0002_scan_identity.sql` → **Run**

Both are idempotent — safe to re-run if something errors midway.

### Option B — Supabase CLI (PowerShell)

```powershell
cd C:\Users\HP\Desktop\smart-waste-prototype-qr-camera
npm install -g supabase
# if supabase isn't recognised after install, use:  npx supabase <command>

supabase login          # opens a browser
supabase projects list  # find YOUR_PROJECT_REF (e.g. abcdefghijklmnop)
supabase link --project-ref YOUR_PROJECT_REF   # prompts for db password
supabase db push        # applies 0001 then 0002
```

Useful follow-ups:

```powershell
supabase migration list          # see what's applied vs pending
supabase db diff -f my_change    # capture a dashboard edit as a migration file
```

### Why `0002` is required

`0001`'s RLS policy on `profiles` is `auth.uid() = id` — correct for a citizen reading
their own row, but the operator scanner needs to read a *different* user's row. Under
that policy the lookup returns zero rows, which is exactly what made the old code fall
back to the mock fixture. `0002` adds `get_scan_card(uuid)` — a `SECURITY DEFINER`
function returning only four fields: name, locality, tier, points. No email, no phone,
no auth data. RLS stays intact.

---

## 4. Set environment variables in Vercel

Go to **Vercel dashboard → your project → Settings → Environment Variables**.

Add these three variables. **Select all three environments** (Production, Preview, Development):

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | your Supabase Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | your Supabase anon public key |
| `QR_SIGNING_SECRET` | a random 32+ char string (generate below) |

**`QR_TTL_SECONDS`** is optional — defaults to `86400` (24 hours). Add it only if you
want a different rotation window.

### Generate `QR_SIGNING_SECRET` (PowerShell)

```powershell
-join ((1..48) | ForEach-Object { '{0:x}' -f (Get-Random -Max 16) })
```

Copy the output and paste it as the value in Vercel. Do **not** put quotes around it.

> **Important:** `QR_SIGNING_SECRET` must **not** be prefixed with `NEXT_PUBLIC_`.
> Without the prefix, Next.js keeps it server-only, so it never ships to the browser.
> If you change this secret after citizens have registered, all issued QR codes become
> invalid — the intended emergency lever if the secret leaks.
>
> If you have multiple Vercel deployments (e.g. a Preview branch that different people
> use), use the **same secret across all of them** or a code minted on one deployment
> won't verify on another.

### Local development

For running `npm run dev` locally, create `.env.local` in your project root:

```powershell
cd C:\Users\HP\Desktop\smart-waste-prototype-qr-camera
Copy-Item .env.example .env.local
notepad .env.local
```

Paste the same three values. Vercel also lets you pull them automatically:

```powershell
npx vercel env pull .env.local
```

This downloads your Vercel environment variables into `.env.local` in one step.
**Don't commit `.env.local` to git** — it's already in `.gitignore` by default.

---

## 5. Install dependencies

If you haven't already:

```powershell
cd C:\Users\HP\Desktop\smart-waste-prototype-qr-camera
npm install @supabase/ssr @supabase/supabase-js server-only
```

Then push — Vercel picks up `package.json` changes automatically.

---

## 6. Copy the patch files in

Unzip `smart-waste-supabase-patch.zip` and copy its contents over your project root.

```powershell
cd C:\Users\HP\Desktop\smart-waste-prototype-qr-camera

# back up first
Copy-Item src src-backup -Recurse

# copy patch (adjust source path to where you unzipped it)
Copy-Item -Path "$env:USERPROFILE\Downloads\smart-waste-supabase-patch\*" `
           -Destination . -Recurse -Force
```

Files that overwrite existing ones:
`src/lib/qrToken.ts`, `src/lib/demoStore.ts`, `src/app/citizen/qr/page.tsx`,
`src/app/citizen/layout.tsx`, `src/app/municipal/scan/page.tsx`,
`src/app/municipal/disposal/page.tsx`, `src/app/(auth)/citizen-login/page.tsx`

Then push to git — Vercel deploys automatically.

---

## 7. Configure Google OAuth

Three places must agree on URLs. A mismatch causes `redirect_uri_mismatch` or a
silent bounce back to the login page.

### 7a. Google Cloud Console

1. <https://console.cloud.google.com> → create or select a project
2. **APIs & Services → OAuth consent screen**
   - User type: **External**
   - App name, support email, developer contact — fill these in
   - Scopes: `userinfo.email` and `userinfo.profile` are sufficient
   - While in **Testing** mode, add every Google account that needs to sign in under
     **Test users** — without this, sign-in fails with `access_blocked`
3. **APIs & Services → Credentials → Create Credentials → OAuth client ID**
   - Application type: **Web application**
   - **Authorised JavaScript origins** — your Vercel app URL:
     ```
     https://YOUR_APP_URL
     ```
   - **Authorised redirect URIs** — this must be the **Supabase** callback,
     *not* your app's:
     ```
     https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback
     ```
4. Copy the **Client ID** and **Client secret**

### 7b. Supabase Dashboard

**Authentication → Providers → Google**
- Enable the provider
- Paste the Client ID and Client secret → **Save**

**Authentication → URL Configuration**
- **Site URL:** `https://YOUR_APP_URL`
- **Redirect URLs** (click **Add URL** for each):
  ```
  https://YOUR_APP_URL/auth/callback
  http://localhost:3000/auth/callback
  ```
  The second entry lets local `npm run dev` work without changing these settings
  each time you switch between local and production.

### 7c. The flow, so the callbacks make sense

```
User clicks "Continue with Google"
  → Google consent screen
  → redirects to  https://<ref>.supabase.co/auth/v1/callback   (Google Console)
  → Supabase mints a code and redirects to
                  https://YOUR_APP_URL/auth/callback            (Supabase Dashboard)
  → src/app/auth/callback/route.ts exchanges it for a session cookie
  → user lands on /citizen
```

Google only needs to know the Supabase URL. Your app URL is configured in Supabase,
not in Google. This is the most common point of confusion.

### Preview deployments

Vercel creates a unique URL for every PR/branch (e.g.
`https://smart-waste-git-feature-xyz.vercel.app`). Google OAuth won't work on those
unless you add each one to both Google's origins list and Supabase's Redirect URLs.

Two options:
1. Add `https://*.vercel.app` as a wildcard redirect URL in Supabase (works for
   Supabase; Google doesn't support wildcards so you'd still need to add each
   preview URL individually in Cloud Console).
2. Use a custom domain, which stays stable across deploys and is simpler overall.

---

## 8. Trigger a redeploy

After setting the Vercel environment variables, **redeploy** — Vercel bakes env vars
into the build at deploy time, so a change doesn't take effect until the next deploy.

```powershell
# Option A: push a commit
git add .
git commit -m "add supabase integration and qr identity fix"
git push

# Option B: redeploy from the Vercel dashboard
# Deployments → your latest deployment → ⋯ → Redeploy
```

---

## 9. Verify the fix

1. Register citizen A (username `alice`, name "Alice Kumar", locality "Indore, Ward 4")
2. Open **My QR** — caption reads *Alice Kumar · Indore, Ward 4 · Tier BRONZE*
3. Sign out. Register citizen B (`bob`, "Bob Singh", "Indore, Ward 9")
4. Open **My QR** — reads *Bob Singh*, QR image is **visibly different from Alice's**
5. From a second browser (or incognito), go to `/municipal/scan`
6. Scan Alice's code → operator sees *Alice Kumar · Indore, Ward 4*
7. Scan Bob's code → operator sees *Bob Singh · Indore, Ward 9*

Sanity checks that must **fail** (all should show red "Not a Swachh Saathi QR"):
- Any QR from the old build
- A random Wi-Fi or product barcode
- A screenshot of another citizen's code

The camera works on Vercel's HTTPS domain by default — no tunnel needed.

---

## 10. Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| Scanner still shows Priya Sharma | Old `municipal/scan/page.tsx` | Confirm the file imports `looksLikeSwachhSaathiQr`, not `parseCitizenQrPayload` |
| `QR_SIGNING_SECRET is missing or too short` | Not set in Vercel, or under 16 chars | Add it in Vercel → Settings → Environment Variables → redeploy |
| My QR shows "Sign in to see your QR" | No Supabase session | Sign in via `/citizen-login`; confirm `src/middleware.ts` exists in the deployed build |
| Scan returns `lookup_failed` | `0002` migration not applied | Re-run `0002_scan_identity.sql` in the SQL Editor |
| Name shows as email prefix | Signed up before `0002` ran | Update `full_name` in Supabase → Table Editor → profiles |
| Google: `redirect_uri_mismatch` | Wrong URL in Google Console | Authorised redirect URI must be `https://<ref>.supabase.co/auth/v1/callback` |
| Google: `access_blocked` | Consent screen in Testing, account not listed | Add your email under **Test users** in Cloud Console |
| Google succeeds then bounces to login | App URL not in Supabase Redirect URLs | Add `https://YOUR_APP_URL/auth/callback` |
| Works on Vercel, fails locally | `.env.local` missing or stale | Run `npx vercel env pull .env.local` |
| Preview deployment: auth fails | Preview URL not in Supabase Redirect URLs | Add `https://YOUR_PREVIEW_URL/auth/callback` or enable wildcard redirects |
| Points always 0 | Trigger missing | Re-run `0002`; it also backfills existing rows |

Server-side errors (including the RPC failure log) appear in **Vercel → your deployment
→ Functions → Logs**, filterable by route (`/api/scan/resolve`, `/api/qr/token`).

---

## 11. Command reference

```powershell
# install deps
npm install @supabase/ssr @supabase/supabase-js server-only

# pull Vercel env vars to local
npx vercel env pull .env.local

# generate QR_SIGNING_SECRET
-join ((1..48) | ForEach-Object { '{0:x}' -f (Get-Random -Max 16) })

# supabase CLI
npm install -g supabase
supabase login
supabase projects list
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
supabase migration list

# local dev
npm run dev

# type check before pushing
npx tsc --noEmit

# deploy via git
git add .
git commit -m "your message"
git push
```
