> **PLAN & STRUCTURE LOCK — v2.0:** This approved scope, stack, repository structure, contracts, ownership map, truth-tier model, and delivery plan must not be changed by contributors or AI agents. Work only inside assigned paths. If a change is necessary, stop and submit a `CHANGE_REQUEST`; only PARTH AJMERA may approve it, followed by an ADR, contract/document updates, and team notification.

# Deployment and Demo Operations Runbook

Status: approved operations baseline v2.0

Release/data/CI owner: BHUMIKA SINGH RAWAT

Edge, camera, and local-ML owner: ADITYA SILSWAL

Firmware/hardware owner: KRISHNA PANWAR

Web/cloud owner: AASHU JOSHI and YASHVARDHAN DOBHAL

Final go/no-go and rollback authority: PARTH AJMERA

## 1. Deployment topology

```text
GitHub main -> Vercel -> one Next.js web app + /api/v1
                         -> Supabase Auth/Postgres/RLS/Realtime

private demo LAN
  phone/laptop camera ----+
                          v
ESP32 -> FastAPI edge -> SQLite WAL/outbox -> authenticated HTTPS -> Vercel
             |
             +-> pinned local model + class map + recorded fallback
```

The physical/local path—QR/session context, ESP32 sensing, camera capture, local inference, FastAPI validation, and SQLite custody—must work without WAN. Cloud synchronization, hosted portals, and Realtime wait for WAN and recover idempotently. The ESP32 never contacts Vercel or Supabase directly, and the cloud never opens an inbound connection to the private vehicle LAN.

## 2. Environment profiles

| Profile | Purpose | Data/source policy |
|---|---|---|
| Local development | individual implementation and automated tests | fictional fixtures; local Supabase/SQLite; simulation may be enabled explicitly |
| Integration preview | merged team validation | deterministic fictional seed; hosted preview; registered demo gateway/device only |
| Demo release | judged build from `main` tag | frozen seed, model, contract, ruleset, schema, firmware, edge, and web versions |

Never connect a local experiment or unreviewed branch to the shared demo database. Only BHUMIKA SINGH RAWAT applies migrations or resets the shared hosted demo project.

Canonical provenance is deployment configuration, not display copy: event `eventSource` is `HARDWARE`, `RECORDED_HARDWARE`, `SIMULATED`, or `SEEDED`; ML/evidence source is `LOCAL_LIVE`, `RECORDED_ML`, `SIMULATED`, or `SEEDED`. The web renders only `REAL`, `RECORDED`, `SIMULATED`, or `PREVIEW/SEEDED`. Tier 2 preview fixtures remain frontend-only and are never stored.

## 3. Secrets and configuration

### 3.1 Storage rules

- Commit `.env.example`, model manifest, class-map schema, and safe placeholders only.
- Web local secrets use `.env.local`; edge secrets use a gitignored service environment file or OS secret store.
- Firmware Wi-Fi/device secrets use the approved gitignored local header/config.
- Vercel and Supabase secrets live in platform secret stores.
- Camera URLs containing credentials are secrets. Never show them on the projector, in screenshots, or in logs.
- Model weights may be stored only in the approved artifact location. Record their hash and license; do not silently download or replace them at startup.
- Never share service-role, gateway/device, camera, Wi-Fi, auth-provider, or demo-password secrets in Git, issues, group chat, or AI prompts.

### 3.2 Required configuration groups

Exact names and validation are canonical in `.env.example` and the service settings modules. The release must provide these groups:

| Group | Examples/purpose | Failure behavior |
|---|---|---|
| Public web | Supabase project URL and publishable key | web fails closed; RLS remains authority |
| Server cloud | Supabase server credential, identifier pepper, auth callback origins | server refuses privileged startup/route |
| Edge cloud sync | cloud API base URL, gateway identity/secret, timeouts | local ingest remains available; sync shows `AUTH_BLOCKED`/offline |
| Edge storage | absolute SQLite path, WAL/sync mode, disk thresholds | no durable `202` when DB is unwritable |
| LAN/device | edge host/port, device identity/secret, Wi-Fi SSID/password | firmware retries without fabricating success |
| Camera | source URL/device index, resolution, capture timeout, frame-retention disabled | event becomes camera/model unavailable and is reviewed/fallback-labelled |
| Local model | model path, expected SHA-256, runtime, class map/allowlist, inference timeout | hash/class mismatch fails model readiness; no unsupported inference |
| Demo simulation | `DEMO_SIMULATION_ENABLED`, fixed fictional identity/device, rate limits | disabled by default and outside approved demo profile unless explicitly armed |
| Auth providers | Supabase redirect origins; optional phone/Google provider settings | mandatory pre-created fictional accounts remain available |

No variable prefixed for browser exposure may contain a server, gateway, device, camera, model-store, or service-role secret.

## 4. First-time bootstrap

PARTH AJMERA assigns and records each step; operators do not improvise replacements.

1. Clone the repository and check out the approved branch/commit.
2. Install only versions pinned by the repository manifests and lockfiles.
3. Create the Supabase project in an appropriate nearby region and configure allowed origins/redirects.
4. Create the Vercel project from GitHub; configure preview and production variables separately.
5. Start/reset local Supabase, apply forward-only migrations, and run the deterministic seed.
6. Create fictional citizen, municipal, reviewer, and system-admin accounts through the approved setup. Configure phone OTP/Google OAuth only if provider preflight passes; retain pre-created account fallback.
7. Register the demo vehicle, gateway, ESP32, fixed simulation identity, and credential versions without writing secrets into seed SQL.
8. Place the pinned model artifact at the approved local path; verify SHA-256, class map, allowlist, runtime version, provenance, and license manifest.
9. Place the disclosed recorded ML fallback offline and verify its source label.
10. Configure camera source on the private LAN; capture one synthetic/non-personal test frame and verify frame retention is disabled.
11. Start edge against a known writable SQLite location and check readiness, queue counts, model/camera health, disk, and cloud status.
12. Flash the confirmed ESP32 board with matching device/LAN configuration after human confirmation of board and port.
13. Run contract, database, edge, model, firmware, integration, and web smoke checks.
14. Deploy `integration` preview and complete one golden physical event before the release PR.

Representative commands are defined by repository scripts and must remain consistent with `AGENTS.md`:

```bash
npm ci
npm run format:check
npm run lint
npm run typecheck
npm test
npm run build
npm run test:integration
```

Use the documented Python, PlatformIO, and Supabase commands for their owned modules. Do not invent a second package manager or ad-hoc global dependency install during demo setup.

## 5. Local demo LAN and camera

Use a dedicated hotspot or isolated travel router, not venue Wi-Fi, for the vehicle LAN.

1. Power the router/hotspot from a stable source and disable client isolation.
2. Connect edge laptop, ESP32, and phone camera to the same SSID.
3. Reserve or record the edge laptop address; configure firmware to use `http://<edge-ip>:8080` and approved `/v1/ingest/*` paths.
4. Reserve or record the camera source address; verify the edge can capture at the frozen resolution.
5. Permit only the required edge/camera ports on the private network. Never port-forward them publicly.
6. Disable phone/laptop sleep, camera notifications, cloud photo sync, OS updates, and network switching.
7. Keep the laptop, router, phone, and ESP32 powered; carry spare cables and a power bank.
8. Run a 15-minute heartbeat/camera/model soak and confirm no IP change, brownout, stale frame, or memory/disk growth.

The camera view must exclude faces, badges, QR contents, screens, addresses, and bystanders. Use only prepared waste objects and a controlled background.

## 6. Model artifact deployment gate

ADITYA SILSWAL and PARTH AJMERA sign the model manifest before the model is allowed in Tier 1:

- exact model filename and SHA-256;
- framework/runtime and dependency lock versions;
- supported-class allowlist and class-to-`WET`/`DRY` mapping;
- unsupported-class behavior (`UNKNOWN`);
- dataset/model provenance and written license decision;
- measured p50/p95/max capture-plus-inference latency on the demo laptop;
- camera source/resolution and privacy/retention setting;
- path and hash of the `RECORDED_ML` fallback;
- known limitations and approved presenter language.

Startup must verify the model and class-map hashes. A mismatch sets model health to failed and prevents the live-model claim. Do not download weights, change a model, retrain, or edit the class map after the Tier 1 freeze.

## 7. Release flow

1. Every owner merges reviewed, green PRs from their persistent branch to `integration` using normal merge commits.
2. BHUMIKA SINGH RAWAT runs a fresh database reset/seed, full automated gates, HIL, model/camera tests, WAN/restart tests, and evidence reconciliation.
3. PARTH AJMERA declares Tier 1 frozen only when G6 in `10_IMPLEMENTATION_PLAN.md` passes.
4. Tier 2 may then be merged only if it is frontend-fixture-only, permanently labelled, and the Tier 1 regression suite remains green.
5. PARTH AJMERA opens the reviewed `integration -> main` release PR; BHUMIKA SINGH RAWAT independently reviews the release evidence.
6. Vercel deploys the approved `main` commit. Smoke-test the exact production deployment with fictional accounts and one approved non-destructive event/replay.
7. Record commit SHA, tag, deployment URL, schema/migration, contract, ruleset, seed, firmware, edge, model/runtime, weights hash, and class-map hash together.
8. Tag `v1.0.0-hackathon-demo` only after the release smoke passes.

Personal-private GitHub rulesets may not be enforced by the current plan. PARTH AJMERA therefore manually enforces no direct pushes to `main`/`integration`, human diff review, required checks, and merge ownership.

## 8. Demo reset and deterministic seed

The reset command/script must require explicit demo-environment confirmation and must never target an unknown project.

It must:

1. verify project identity and release commit;
2. archive the prior run's evidence IDs before changing disposable demo state;
3. recreate or reconcile 15–25 historical events for the main fictional citizen and four to six additional fictional citizens;
4. reconcile every balance to the append-only ledger;
5. restore accepted, environmental-wetting, pending-review, reviewed negative, dispute, degraded, offline, and `SIMULATED` cases;
6. restore the fixed vehicle/device/gateway and one badge/tier display;
7. keep `SIMULATED` source labels and exclude those rows from real-hardware proof metrics;
8. reset only designated edge demo rows with a separate explicit confirmation;
9. print expected row counts, IDs, and hashes for comparison.

Never hand-edit balances, decisions, audit rows, or source labels immediately before judging.

## 9. Runtime startup order

Follow this order at every rehearsal and demo:

1. Power laptop, isolated router/hotspot, camera phone, and stable ESP32 supply.
2. Verify the frozen commit/tag and manifest hashes.
3. Verify Vercel/Supabase health and all separate role browser profiles.
4. Start the FastAPI edge service; confirm SQLite writable and migrations current.
5. Confirm model hash/class map, camera freshness, fallback availability, and frame retention off.
6. Confirm cloud sync authentication, time, pending/dead-letter/auth-blocked counts, disk headroom, and last sync.
7. Power/flash the already confirmed ESP32; wait for heartbeat and each component health state.
8. Run one disposable physical smoke event and reconcile it once in cloud/UI.
9. Reset the documented demo state if the smoke consumed a staged record.
10. Open the exact presentation tabs and lock the selected fallback level.

Do not open a secret-bearing terminal, Supabase service dashboard, camera configuration page, or environment file on the projected display.

## 10. Pre-demo checkpoints

### T-24 hours — release freeze

- [ ] Tier 1 G6 and optional Tier 2 G7 evidence pass on the frozen commit.
- [ ] Model/runtime, weights/class-map hashes, firmware, edge, schema, ruleset, seed, and web versions are recorded.
- [ ] Hardware/camera/network complete a 30-minute end-to-end soak.
- [ ] WAN-off ingest/inference/queue/restart/reconcile and duplicate replay pass on the actual demo laptop.
- [ ] Seed/reset passes twice with matching counts and balances.
- [ ] Source/tier labels and claims have been visually reviewed at mobile/projector widths.
- [ ] Full fallback recording, static evidence, and release artifacts exist on two offline devices.

### T-2 hours — venue rehearsal

- [ ] Private LAN works without venue internet and all addresses remain stable.
- [ ] Camera view is controlled and privacy-safe; model/fallback load offline.
- [ ] Supabase/Vercel, clock, auth redirects/providers, and fallback accounts work.
- [ ] One full timed script and one forced-failure recovery finish within budget.
- [ ] Hardware is secured; prepared dry/wet/environmental-wetting items are available.
- [ ] No new code, migration, model, class map, dependency, or seed edit is pending.

### T-30 minutes — startup

- [ ] Reset manifest matches expected seed counts and ledger sum.
- [ ] Edge SQLite is writable; `pending=0`, `in_flight=0`, `auth_blocked=0`, `dead_letter=0` unless a staged case explicitly says otherwise.
- [ ] ESP32 and confirmed sensors report current health; GPS no-fix is acceptable when labelled.
- [ ] Camera frame is fresh; model hash matches; measured warm-up succeeds; recorded fallback opens locally.
- [ ] Citizen, municipal, reviewer, and system-admin sessions are ready in separate browser profiles.
- [ ] `DEMO_SIMULATION_ENABLED` is off until its exact scene, then armed only by the authorized operator.
- [ ] Tier 2 surfaces, if present, visibly say `PREVIEW/SEEDED`.

### T-10 minutes — go/no-go

PARTH AJMERA records one choice: `GO LIVE`, `GO WITH F1/F2/F3 FALLBACK`, or `NO-GO LIVE — VERIFIED RECORDING`. Do not spend more than 20 seconds silently debugging on stage.

## 11. Health and readiness interpretation

| Component | Ready requirement | Degraded but honest | No-go trigger |
|---|---|---|---|
| SQLite edge | writable, schema current, disk headroom | cloud offline with queue operational | unwritable/corrupt or false `202` risk |
| Sync worker | running, credential valid | WAN unavailable, pending visible | auth storm, unknown duplicate behavior |
| ESP32 | current heartbeat and stable IDs | optional component explicitly missing | unstable power, unsigned/malformed event |
| Sensors | expected enabled components calibrated | exact component `DEGRADED/MISSING` | fabricated normal value or unsafe wiring |
| Camera | fresh controlled frame | recorded fallback selected and labelled | privacy exposure or cross-event/stale attachment |
| Model | correct hash/class map and warm inference | recorded fallback selected and labelled | wrong artifact/license unresolved/unsupported claim |
| Cloud/database | API/DB reachable and migrations match | local edge story plus recorded cloud proof | partial writes or RLS failure |
| Auth | separate least-privilege sessions | fictional pre-created account fallback | role isolation failure |

## 12. Demo fallback ladder

| Level | Trigger | Immediate action | Exact truth preserved |
|---|---|---|---|
| F0 — full live | all physical/local/cloud paths ready | run end to end | all live evidence labelled real |
| F1 — WAN/cloud unavailable | LAN, hardware, edge, camera/model work | show real local capture/inference/queue; use recorded cloud completion | local path is live; cloud screen is recorded |
| F2 — camera/model unavailable | physical sensors/edge/cloud work | show failed component health; use `RECORDED_ML` as `FLAGGED 0` pending review | recorded/model fallback is never called live or accepted automatically |
| F3 — ESP32/sensor unavailable | edge/cloud/UI work | show diagnostic; replay `RECORDED_HARDWARE` fixture or system-admin `SIMULATED` downstream flow | no simulated/recorded input is counted as hardware |
| F4 — hosted app/auth unavailable | physical/local path works | show local event/queue/model then timestamped full recording/evidence | hosted views are recorded |
| F5 — total live failure | power/display/network unsafe | stop hardware; use offline video, printed architecture, evidence manifest | only verified prior run is claimed |

The system-admin simulation is a downstream continuity tool, not a substitute for physical-ingress proof. It remains `SIMULATED`, requires a fixed fictional identity and audit record, and is excluded from live performance/leaderboard claims.

## 13. Recovery procedures

### Web/Vercel

Promote the last known-good deployment recorded in the manifest. Do not patch `main` on stage. Re-run role, source-label, and core API smoke checks after rollback.

### Supabase/database

Stop writes when a migration, RLS, or transaction invariant fails. Use a forward corrective migration or deterministic rebuild on the confirmed demo project; never edit an applied migration or directly repair a balance/ledger row.

### Edge/SQLite

Stop new sync leases, preserve/copy the queue using the documented safe operation, inspect health and dead letters, restart the last tagged edge build, and reconcile IDs/hashes before resuming. Never delete pending rows to make health appear green.

### Camera/model

Record the failure state, stop the capture/model worker, verify camera freshness and model/class-map hashes, restart the frozen runtime once, then switch to `RECORDED_ML` if readiness is not restored within the rehearsed limit. Never download or swap a model during the demo.

### Firmware/hardware

Only KRISHNA PANWAR may touch wiring/power. Use the last known-good compiled artifact and confirmed board/port. Do not rewire wet/exposed components live or flash an unconfirmed device.

### Authentication

If OTP/Google provider fails, use the pre-created fictional least-privilege accounts in separate browser profiles. Never weaken redirect, cookie, RLS, or role checks for convenience.

### Realtime/map/Tier 2

Use authorized REST refetch/polling for Realtime failure and a table/coordinates or labelled preview for map-tile failure. Remove a broken Tier 2 preview; never add a backend during recovery.

## 14. Post-demo shutdown

1. Disable `DEMO_SIMULATION_ENABLED`.
2. Stop firmware/edge/model/camera processes and close LAN firewall ports.
3. Revoke temporary gateway/device/auth-provider tokens and rotate anything exposed.
4. Remove temporary frames, debug captures, exports, browser downloads, and personal-like data according to retention policy.
5. Preserve only approved fictional evidence, hashes, manifests, and redacted logs.
6. Back up the edge queue only through the documented restricted process, then secure/delete it according to policy.
7. Record incidents, fallback level, exact versions, known defects, and whether every on-stage claim was live, recorded, simulated, preview, or roadmap.
