> **PLAN & STRUCTURE LOCK — v1.0:** This approved scope, stack, repository structure, contracts, ownership map, and delivery plan must not be changed by contributors or AI agents. Work only inside the assigned paths. If a change is necessary, stop and submit a `CHANGE_REQUEST`; only PARTH AJMERA may approve it, followed by an ADR and team notification.

# Deployment and Demo Operations Runbook

Owners: BHUMIKA SINGH RAWAT (data/CI/release), ADITYA SILSWAL (edge), KRISHNA PANWAR (device), PARTH AJMERA (go/no-go).

## Deployment topology

```text
GitHub main ──> Vercel ──> Next.js web + /api/v1
                         └─> Supabase Auth/Postgres/Realtime

ESP32 ──same LAN──> FastAPI edge gateway ──outbound HTTPS──> Vercel API
                         └─> local SQLite outbox
```

The browser never needs inbound access to the ESP32. In the normal demo, it reads cloud state. Local edge health may be shown from a local-only operator page.

## Environment files

- Commit `.env.example` with safe placeholders.
- Web local secrets: `.env.local`.
- Edge secrets: `services/edge-gateway/.env` or OS environment, gitignored.
- Firmware secrets: `firmware/esp32/include/secrets.local.h`, gitignored, with a committed example.
- Vercel/Supabase secrets: platform secret stores.
- Never share a service-role/device secret in team chat; use a password manager or in-person entry.

Required variables:

| Variable | Consumer | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | web | Public project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | web | Public key; RLS remains mandatory |
| `SUPABASE_SERVICE_ROLE_KEY` | server | Server only; avoid when user-scoped client/RPC is enough |
| `CLOUD_API_BASE_URL` | edge | Vercel preview/prod URL |
| `CLOUD_DEVICE_SYNC_TOKEN` | edge/cloud | Gateway identity; rotate for release |
| `EDGE_GATEWAY_SHARED_SECRET` | firmware/edge | Per-demo-device local secret |
| `EDGE_DATABASE_PATH` | edge | Absolute/validated writable SQLite path |
| `EDGE_HOST` / `EDGE_PORT` | edge | MVP default `0.0.0.0:8080` on trusted demo LAN |
| `DEVICE_ID` | firmware | Must match registered seeded device |
| `WIFI_SSID` / `WIFI_PASSWORD` | firmware local | Never committed |

## First-time bootstrap

1. Create Supabase project in the nearest suitable region.
2. Add Vercel project from GitHub and configure preview/production variables.
3. Run migrations against a fresh database, then deterministic seed.
4. Create fictional users/roles through the approved seed/setup route; do not hardcode passwords in SQL.
5. Deploy `integration` preview and pass smoke tests.
6. Register gateway/device IDs and secrets.
7. Start edge with an empty/known queue; confirm `/healthz` reports the expected readiness details.
8. Flash firmware with matching device/edge settings.
9. Run golden vertical slice before promoting `main`.

Exact commands become root npm scripts during H1-H4:

```bash
npm ci
npm run db:reset
npm run dev:web
npm run dev:edge
npm run firmware:build
npm run test:contracts
npm run test:integration
```

## Local demo network

Use a dedicated phone hotspot or travel router to reduce venue Wi-Fi uncertainty.

1. Connect laptop and ESP32 to the same SSID.
2. Find the laptop LAN IP; set firmware edge origin to `http://<LAN-IP>:8080`; firmware uses the approved `/v1/ingest/*` paths.
3. Allow only the required port on the trusted network; close it after the demo.
4. Confirm device heartbeat and keep the laptop awake/plugged in.
5. Do not switch networks after firmware configuration unless the fallback is rehearsed.

## Release flow

1. Every member merges an approved PR to `integration` with green CI.
2. BHUMIKA SINGH RAWAT creates the release-candidate checklist and runs database reset/seed, automated gates, hardware-in-loop, and manual journeys.
3. PARTH AJMERA opens `integration -> main` milestone PR; BHUMIKA SINGH RAWAT reviews PARTH AJMERA's changes.
4. After green `main`, Vercel production deploys.
5. Smoke-test production with fictional accounts and one approved replay fixture.
6. Tag `v0.1.0-hackathon` only after proof is collected.
7. Record the commit SHA, deployment URL, schema migration version, contract version, firmware version, and edge version together.

## Demo startup checklist (T-30 minutes)

- [ ] Laptop charged/plugged in; hotspot powered; notifications and auto-update disabled.
- [ ] Production and local fallback URLs open.
- [ ] Database reset/seed completed and row counts verified.
- [ ] Edge queue has expected pending count (normally zero) and disk is writable.
- [ ] ESP32 online, sensors calibrated, physical wiring secured.
- [ ] One rehearsal event succeeds end-to-end.
- [ ] Offline event/reconnect is ready but not already consumed.
- [ ] Demo accounts logged in in separate browser profiles/tabs.
- [ ] Map and table fallback both visible.
- [ ] Backup recording available offline.
- [ ] No secrets or private dashboards visible on projected screen.

## Backup modes

| Failure | Immediate fallback | Still prove |
|---|---|---|
| Venue internet | Keep ESP32 → local edge; show queued event and local status | Real sensing and offline resilience |
| ESP32/wiring | Replay the versioned hardware-captured fixture, clearly labelled recorded | Same contract and cloud behavior |
| Realtime | Refresh/poll | Correct durable state |
| Map tiles | Coordinates/fleet table | GPS ingestion and freshness |
| Vercel | Run web locally against Supabase or deterministic local fixture mode | Full user journey |
| Supabase | Local backup video + schema/test evidence | Intended transaction/integrity behavior |

Never pretend a fallback is live hardware.

## Rollback and recovery

### Web

Promote the last known-good Vercel deployment and record the rollback. Do not attempt a risky fix directly on `main`.

### Database

Migrations are forward-only. Add a corrective migration; never edit an applied file. Near demo time, avoid destructive changes. Maintain an export or deterministic rebuild path for fictional seed data.

### Edge

Stop the sync worker, copy the SQLite DB to a dated backup, restart with the last tagged edge version, inspect dead-letter/error rows, and resume only after readiness passes. Never delete pending rows to make the counter look clean.

### Firmware

Keep the last known-good compiled artifact/version and flashing command. A rollback must preserve the v1 contract/device ID or be accompanied by an approved registration/config change.

## Post-demo shutdown

- Stop edge service and close LAN port.
- Revoke temporary demo/device tokens.
- Remove any local exports/screenshots containing personal-like data.
- Preserve only approved fictional evidence and logs.
- Record known issues and exact release versions.
