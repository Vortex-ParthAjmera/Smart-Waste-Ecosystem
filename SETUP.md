# Smart Waste Management Platform — UI Prototype

A UI-only Next.js (App Router, TypeScript, Tailwind v4) prototype of the three-role
Smart Waste Management platform: **Citizen**, **Municipal Staff**, and **Developer / IoT**.
All data is mocked and lives in memory for the browser session — nothing is persisted,
and there is no real backend, auth, or hardware behind any screen.

## Running it

```bash
npm install
npm run dev
```

Then open http://localhost:3000 — you'll land on the role picker.

## How to explore

- **Role picker** (`/`) → each role has its own mocked sign-in (phone OTP for Citizen,
  Google OAuth button for Municipal, username/password for Developer). Any input succeeds
  after a short simulated delay.
- **Dev nav bar** (dashed amber strip pinned to the bottom of every screen) lets you jump
  between roles instantly without re-authenticating. It's intentionally styled as
  "remove before launch" scaffolding — see `src/components/DevRoleSwitcher.tsx`.
- **Inject Test Event** (`/developer/inject`) is the centerpiece demo flow: pick a fixture
  (correct wet/dry disposal, a wrong-compartment violation, or a low-confidence flag) and
  watch it propagate live to Citizen → Live Disposal and Municipal → Live Events, all
  three role surfaces reading from the same in-memory event.

## Project structure

```
src/
  app/
    page.tsx                 # role picker landing page
    (auth)/                  # mocked sign-in flows (grouped, no path prefix)
      citizen-login/
      municipal-login/
      developer-login/
    citizen/                 # Citizen experience (mobile-first, bottom nav)
    municipal/                # Municipal experience (desktop-first, sidebar)
    developer/                # Developer/IoT console (dark theme, sidebar)
  components/
    ui/                       # hand-rolled shadcn-style primitives (Button, Card, Badge, Tabs, Dialog)
    TruthBadge.tsx             # REAL / RECORDED / SIMULATED / PREVIEW-SEEDED provenance pill
    StatusPill.tsx             # OK / DEGRADED / MISSING / FAILED / UNKNOWN health pill
    PreviewBanner.tsx           # permanent banner for Tier-2 preview screens
    StateViews.tsx              # LoadingSkeleton / EmptyState / ErrorState / OfflineBanner
    ScreenChrome.tsx             # per-screen loading/error/offline demo toggle
    DevRoleSwitcher.tsx           # the dashed dev nav bar
  lib/
    mock/                      # all seed data + types (the "frozen contract")
    api-client/                 # the ONE seam every component reads through
    demoStore.ts                  # dependency-free shared client store (useSyncExternalStore)
                                   # — powers "Inject Test Event" propagating across roles
```

## Wiring up the real backend later

Every screen reads data through `src/lib/api-client/index.ts`, never directly from
`src/lib/mock/*`. When a real backend (e.g. Supabase) is ready:

1. Keep the function names and return shapes in `api-client/index.ts` identical.
2. Swap each function body for a real fetch/query.
3. Delete `src/lib/mock/*` and `src/lib/demoStore.ts` once nothing references them.

No component code should need to change.

## Design tokens

Defined in `src/app/globals.css`: deep green primary (`--color-primary`), warm gold for
EcoCredits/rewards (`--color-gold*`), teal for wet waste, amber/brown for dry waste, and
red reserved only for genuine danger/violations. Provenance and health are always
communicated with an icon + text label, never color alone.

## Known simplifications (by design, for a UI-only pass)

- One demo citizen (`Priya Sharma`) is used throughout; search/lookup always resolves to her,
  *unless* the municipal camera scanner decodes a QR that matches the other seeded citizen
  (`cit_arjun_mehta`) — see below.
- "Inject Test Event" simulates the pipeline with `setTimeout` stages, not a real event bus.
- Tier-2 previews (Fleet Map, Zone Management, Reports, Collection Journey, Truck & ETA)
  are static/seeded and carry a permanent PREVIEW/SEEDED banner — they are not meant to
  look production-ready.
- Maps are placeholders (no live map SDK wired in).

## Real camera + QR scanning (not simulated)

Citizen → **My QR** (`/citizen/qr`) and Municipal → **Scan Citizen** (`/municipal/scan`) are
genuinely wired to the browser, not mocked:

- The citizen's QR is a real, camera-scannable code generated client-side with the `qrcode`
  package, encoding an opaque `smartwaste://citizen/<id>` payload (never name/phone/address).
- The municipal scanner requests real camera access via `getUserMedia` and decodes frames
  live with `jsQR` — there's no "Simulate scan" button anymore. It handles permission-denied,
  no-camera, and unsupported-browser cases explicitly.
- A decoded ID that matches a seeded citizen resolves to that citizen; anything else
  (a stray real-world QR code, an unseeded ID) falls back to the demo citizen, with a note
  that the code wasn't recognized — same "always resolves" spirit as the lookup page, just honest about when it didn't actually match.
- **Camera access requires a secure context** — `https://` in production/staging, or
  `http://localhost` in local dev. It will silently fail (or the browser will refuse the
  permission prompt) over plain `http://` on a LAN IP, which is how most phones will reach a
  dev machine on the same Wi-Fi — use a tunnel (e.g. `ngrok`) or a real HTTPS deployment to
  test scanning from an actual phone.
