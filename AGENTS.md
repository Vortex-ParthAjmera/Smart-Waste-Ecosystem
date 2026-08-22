> **PLAN & STRUCTURE LOCK — v2.0:** This approved scope, stack, repository structure, contracts, ownership map, truth-tier model, and delivery plan must not be changed by contributors or AI agents. Work only inside assigned paths. If a change is necessary, stop and submit a `CHANGE_REQUEST`; only PARTH AJMERA may approve it, followed by an ADR, contract/document updates, and team notification.

# Master Instructions for Coding Agents

Repository: `Vortex-ParthAjmera/Smart-Waste-Ecosystem`
Project: Smart Waste Ecosystem / SGV 2.0
Owner and final approver: PARTH AJMERA
Baseline: v2.0, reconciled with final team Build Doc v4
Delivery: six people, 30-hour hackathon build

## 0. How to use this file

This is the **only global project context** to feed Freebuff, Cursor, Codex, or another coding AI. Give the agent:

1. this complete root `AGENTS.md`;
2. one issue/task prompt using the template near the end;
3. only the files/evidence needed for that task.

Do not paste competing PRDs, old architecture, teammate chat, or the Build Doc v4 source into a coding session. This file already contains the approved reconciliation. An issue may narrow scope but cannot override this file. Only PARTH AJMERA can approve a change using `CHANGE_REQUEST` + ADR + synchronized contract/document updates.

An AI agent must never “improve,” reorganize, simplify, modernize, or reinterpret the product plan, tree, stack, schema, contract, values, tiers, team ownership, or milestones unless the task is an explicitly approved change request.

## 1. Product definition

The Smart Waste Ecosystem connects one physical wet/dry disposal to an auditable digital record:

```text
Citizen displays opaque QR
  -> municipal app creates a short-lived disposal session
  -> edge claims session for ESP32-001
  -> selected compartment IR triggers one event
  -> ESP32 reports fill, dry-path moisture where applicable, GPS/fix, health
  -> FastAPI commits locally to SQLite before 202 ACK
  -> edge captures phone/laptop camera frames and runs pinned local inference
  -> edge freezes one event-correlated cloud message
  -> Next.js validates and transacts in Supabase
  -> rules-2.0.0 returns ACCEPTED (+10 exactly once) or FLAGGED (0 + review)
  -> only human VERIFIED_VIOLATION can append -10 or -20
  -> citizen, municipal, and developer views update safely
```

The project is not an autonomous sorter, legal enforcement system, production billing system, real payment system, or arbitrary-waste AI. The judged proof is one narrow, real, reliable, honest vertical slice.

## 2. Truth tiers — mandatory

Every feature has exactly one tier.

### Tier 1 — `REAL`

Implemented end to end, tested, and honestly demonstrable:

- one ESP32 and wet/dry compartments;
- one independently debounced IR per compartment;
- one ultrasonic fill sensor per compartment;
- one calibrated moisture sensor in the dry path;
- GPS/fix quality and component heartbeat;
- opaque QR/session flow;
- signed LAN HTTP/JSON, FastAPI/Pydantic, SQLite WAL durable ACK/outbox;
- event-correlated phone/laptop capture and pinned local inference;
- versioned authenticated idempotent cloud sync;
- one Next.js app with citizen, municipal, developer role experiences;
- Supabase Auth/Postgres/RLS/Realtime;
- immutable event/result/review/point/audit records;
- `+10`, reviewed `-10/-20`, dispute/compensating reversal;
- 15–25 primary fictional-citizen events, four to six peers, reconciled seed, badge/tier;
- guarded developer simulation and full health/failure handling.

### Tier 2 — `PREVIEW`

Frontend-only, static/seeded, permanently labelled `PREVIEW/SEEDED`:

- animated truck map/distance/ETA not backed by live GPS;
- multiple truck/zone cards beyond the real prototype;
- bill-discount preview;
- full municipal report/analytics charts;
- static route/geofence collection stepper.

Tier 2 creates **no** dedicated database table, API route, worker, query, service, or scheduled job. Data lives only in `apps/web/src/fixtures/tier2-preview/**`. Server/edge/firmware/rules/migrations must never import it. Tier 2 starts only after Tier 1 feature freeze.

### Tier 3 — `ROADMAP`

Documentation only; do not build or show a fake implementation:

- dedicated edge-AI camera;
- autonomous sorting/compactor control;
- MQTT/broker fleet transport;
- scalable multi-truck/multi-zone database, routing/geofencing;
- real billing, discounts, UPI, rewards marketplace, government/Aadhaar identity;
- native apps or multi-city production claims.

### Truth/provenance vocabulary

- Event `eventSource`: `HARDWARE`, `RECORDED_HARDWARE`, `SIMULATED`, `SEEDED`.
- ML `evidenceSource`: `LOCAL_LIVE`, `RECORDED_ML`, `SIMULATED`, `SEEDED`.
- UI truth badge: `REAL`, `RECORDED`, `SIMULATED`, or `PREVIEW/SEEDED`.
- Tier 2 never enters the database; its UI badge is presentation metadata.

Never relabel one source as another.

## 3. Non-negotiable invariants

1. ESP32 talks only to the local edge. It never calls Vercel or Supabase.
2. Edge writes valid local custody to SQLite WAL before `202 QUEUED_LOCALLY`.
3. `202` does not mean cloud-complete, model-complete, or points-awarded.
4. One intent has one stable `eventId`, `messageId`, and idempotency key across retries.
5. Same ID/key + same body replays the stored result; changed body returns `409 IDEMPOTENCY_CONFLICT`.
6. A timeout is an unknown outcome; retry the same exact body/key, never create a new intent.
7. Sensor/model output is evidence. The pure rules engine returns `ACCEPTED` or `FLAGGED`.
8. `ACCEPTED` may append exactly one `+10`.
9. `FLAGGED` has immediate value effect `0` and opens human review.
10. `REVIEW_ACCEPTED` may append `+10` if absent; `REVIEW_NO_ACTION` closes with `0`; only `VERIFIED_VIOLATION` may append `-10/-20`.
11. Balance is the sum of append-only point transactions. Never edit a balance or delete history.
12. Fill and GPS are operational, not segregation-decision inputs.
13. Moisture is dry-path evidence only and never standalone proof.
14. Unsupported/no/multiple/low/late/failed model output becomes uncertainty, not a forced category.
15. Raw QR values, camera frames, secrets, credentials, and real PII are not stored/logged/committed.
16. User identity, role, ownership, point amount, result, and source are derived server-side; never trust browser/device assertions.
17. Realtime is an invalidation hint; initial authorized REST read and refetch/poll fallback are required.
18. `SIMULATED`, `RECORDED`, `SEEDED`, stale, and degraded states remain visible.
19. Tier 2 has no backend/schema and is never called live.
20. Only PARTH AJMERA merges to `integration`/`main` and approves plan/contract/tree changes.

## 4. Fixed architecture

```text
ESP32 + wet/dry sensors
  -> private LAN signed HTTP/JSON /v1
  -> FastAPI edge
       -> SQLite WAL local_events + ML result + outbox + replay cache
       -> configured phone/laptop camera
       -> pinned local model/class map
  -> outbound authenticated HTTPS /api/v1/device/*
  -> one Next.js server/application
  -> Supabase Auth + Postgres + RLS + Realtime
  -> citizen / municipal / developer UI
```

### Runtime boundaries

| Runtime | Owns | Must not own |
|---|---|---|
| ESP32 | pins, calibration application, compartment debounce, readings, health, IDs, LAN HMAC | QR/citizen data, cloud secrets, camera/model, points/review |
| Edge | device auth/validation, durable custody, session cache, camera/model orchestration, exact body/outbox, sync/health | final citizen auth/review, direct Supabase, point policy |
| Local ML adapter | configured capture, pinned model, class map, result/provenance/latency | arbitrary URL/path/model, cloud key, direct database, point write |
| Next.js server | user/gateway auth, validation, idempotency, domain transaction, typed reads | trusting client-supplied role/value/ownership |
| Rules engine | deterministic rules/result/reasons/severity suggestion | I/O, DB, network, React, camera/model runtime |
| Supabase | source-of-truth tables, constraints, RLS, Realtime | local buffering/device retry |
| Browser | accessible role UI and typed API calls | privileged key, direct authoritative mutation, Tier 1 logic |

### Offline truth

With WAN disabled, ESP32, camera, local inference, and SQLite edge custody can continue on the LAN. Vercel/Supabase/remote UI/managed auth/Realtime cannot update until WAN returns. Never claim the entire platform is internet-independent.

## 5. Frozen repository tree

```text
Smart-Waste-Ecosystem/
├── apps/
│   └── web/
│       ├── public/
│       ├── src/
│       │   ├── app/
│       │   │   ├── (auth)/
│       │   │   ├── (citizen)/
│       │   │   ├── (municipal)/
│       │   │   │   ├── operator/
│       │   │   │   └── review/
│       │   │   ├── (developer)/
│       │   │   └── api/v1/
│       │   ├── components/
│       │   ├── fixtures/tier2-preview/
│       │   ├── lib/
│       │   │   ├── api-client/
│       │   │   ├── auth/
│       │   │   ├── domain/
│       │   │   ├── supabase/
│       │   │   └── validation/
│       │   └── styles/
│       ├── package.json
│       └── tsconfig.json
├── services/
│   └── edge-gateway/
│       ├── app/
│       │   ├── api/
│       │   ├── auth/
│       │   ├── contracts/
│       │   ├── domain/
│       │   ├── ml/
│       │   │   ├── capture.py
│       │   │   ├── inference.py
│       │   │   ├── class_map.py
│       │   │   └── manifest.py
│       │   ├── persistence/
│       │   ├── services/
│       │   ├── settings.py
│       │   └── main.py
│       ├── models/README.md
│       ├── tests/
│       ├── pyproject.toml
│       └── README.md
├── firmware/
│   └── esp32/
│       ├── include/{config,contracts,network,sensors}/
│       ├── src/{config,network,sensors}/
│       ├── src/main.cpp
│       ├── test/
│       └── platformio.ini
├── packages/
│   ├── contracts/{openapi,schemas,fixtures,src/generated}/
│   └── rules-engine/{src,test}/
├── supabase/{migrations,tests,config.toml,seed.sql}
├── tests/{contract,integration,e2e,hardware-in-loop,fixtures}/
├── scripts/
│   ├── setup/
│   ├── demo/{ml,fixtures,reset,seed}/
│   └── verification/
├── DOCUMENTATION/
├── .github/{ISSUE_TEMPLATE,workflows,CODEOWNERS,PULL_REQUEST_TEMPLATE.md}
├── .env.example
├── .gitignore
├── AGENTS.md
├── README.md
├── package.json
└── package-lock.json
```

Do not create another top-level folder, second frontend app, `backend/`, `ml/`, `esp32/`, `utils/`, `helpers/`, `misc/`, or `temp/`. Do not move/rename listed paths. Runtime weights under `services/edge-gateway/models/` are ignored unless redistribution is explicitly approved.

### Dependency direction

```text
UI / API routes / firmware adapters
  -> application orchestration
  -> contract types + pure domain rules
  -> database/network/camera/hardware adapters
```

- UI calls typed API client, never service-role operations.
- API validates/authorizes before domain logic.
- Domain accesses Postgres only through approved adapters/RPCs.
- Firmware calls edge only.
- Edge calls its SQLite and approved Next.js device API only.
- Tier 2 fixtures are client presentation only.

## 6. Team, branches, and allowed paths

| Member | Git email | Branch | Primary scope |
|---|---|---|---|
| PARTH AJMERA | `ajmeraparth.official@gmail.com` | `team/parth-ajmera-governance` | docs, contracts, governance, integration, release/demo |
| YASHVARDHAN DOBHAL | `yashvardhandobhal944@gmail.com` | `team/yashvardhan-dobhal-web-ui` | all web roles/components/API client/Tier2 fixtures |
| AASHU JOSHI | `aashujoshisbps@gmail.com` | `team/aashu-joshi-cloud-api` | cloud routes/auth/domain/adapters/rules |
| KRISHNA PANWAR | `krishnapanwar464@gmail.com` | `team/krishna-panwar-esp32` | hardware and firmware/HIL |
| ADITYA SILSWAL | `adiisilswal@gmail.com` | `team/aditya-silswal-edge-gateway` | edge, SQLite, camera/model, sync/health |
| BHUMIKA SINGH RAWAT | `bhumika282007@gmail.com` | `team/bhumika-singh-rawat-data-qa` | schema/RLS/seed/tests/CI/release evidence |

Integration branches:

- `main`: reviewed milestone/release truth only.
- `integration`: team PR target and integrated candidate.

### Allowed paths

PARTH:

```text
DOCUMENTATION/**
README.md
AGENTS.md
.github/CODEOWNERS
.github/PULL_REQUEST_TEMPLATE.md
approved packages/contracts/** and root config
```

YASHVARDHAN:

```text
apps/web/src/app/(auth)/**
apps/web/src/app/(citizen)/**
apps/web/src/app/(municipal)/**
apps/web/src/app/(developer)/**
apps/web/src/components/**
apps/web/src/lib/api-client/**
apps/web/src/fixtures/tier2-preview/**
apps/web/src/styles/**
apps/web/public/**
```

AASHU:

```text
apps/web/src/app/api/v1/**
apps/web/src/lib/auth/**
apps/web/src/lib/domain/**
apps/web/src/lib/supabase/**
apps/web/src/lib/validation/**
packages/rules-engine/**
```

KRISHNA:

```text
firmware/esp32/**
explicitly assigned tests/hardware-in-loop/**
```

ADITYA:

```text
services/edge-gateway/**
scripts/demo/ml/**
explicitly assigned edge/model fixtures
```

BHUMIKA:

```text
supabase/**
tests/**
.github/workflows/**
scripts/demo/{fixtures,seed,reset}/**
scripts/verification/**
```

`packages/contracts/**`, root manifests/lockfiles, `.env.example`, `.gitignore`, RLS policies, model/class manifest, and this `AGENTS.md` are controlled files. An owner does not change them without Parth approval and affected-owner review.

## 7. Git workflow

The repo is currently a private personal GitHub repository. GitHub warns that rulesets are not enforced without an eligible organization/plan, so protection is manual until that changes.

Mandatory workflow:

1. Accept collaborator invitation.
2. Open repository folder, not its parent.
3. Confirm branch and clean/understood status.
4. Fetch and merge `origin/integration` into the assigned persistent branch; no rebase/force.
5. Read this file and the scoped issue.
6. Edit only allowed paths.
7. Run required checks and inspect `git diff` for secrets/scope.
8. Push only the assigned branch.
9. Open PR with base `integration`.
10. Parth reviews/merges using a normal merge commit.
11. Milestone PR goes `integration` -> `main` only after release gates.

Never push directly to `main` or `integration`, delete shared branches, force-push, bypass red checks, or merge your own unreviewed scope.

### Krishna and Aditya shared GitHub account

Krishna and Aditya currently authenticate through Aditya's GitHub account. This weakens principal-level attribution and independent approval; separate GitHub accounts are recommended before final review. Until then:

- Krishna uses only `team/krishna-panwar-esp32` and configures local author:

```bash
git config --local user.name "KRISHNA PANWAR"
git config --local user.email "krishnapanwar464@gmail.com"
```

- Aditya uses only `team/aditya-silswal-edge-gateway` and configures:

```bash
git config --local user.name "ADITYA SILSWAL"
git config --local user.email "adiisilswal@gmail.com"
```

- PR title/body must state the human author and owned path.
- One may not approve the other's PR as an independent GitHub reviewer while using the same account.

### Yashvardhan Cursor rule

Before every Cursor prompt, Yashvardhan must confirm the status bar/terminal branch is `team/yashvardhan-dobhal-web-ui`, include allowed paths in the prompt, and reject any suggested schema/API/tree change outside the task.

### Exact existing-clone setup

Run only the matching block from inside the cloned repository. If the branch already exists locally, replace the `git switch --track origin/<branch>` line with `git switch <branch>`. Never use `--global` for these identities.

```bash
# PARTH AJMERA
git fetch --prune origin
git switch --track origin/team/parth-ajmera-governance
git config --local user.name "PARTH AJMERA"
git config --local user.email "ajmeraparth.official@gmail.com"

# YASHVARDHAN DOBHAL
git fetch --prune origin
git switch --track origin/team/yashvardhan-dobhal-web-ui
git config --local user.name "YASHVARDHAN DOBHAL"
git config --local user.email "yashvardhandobhal944@gmail.com"

# AASHU JOSHI
git fetch --prune origin
git switch --track origin/team/aashu-joshi-cloud-api
git config --local user.name "AASHU JOSHI"
git config --local user.email "aashujoshisbps@gmail.com"

# KRISHNA PANWAR
git fetch --prune origin
git switch --track origin/team/krishna-panwar-esp32
git config --local user.name "KRISHNA PANWAR"
git config --local user.email "krishnapanwar464@gmail.com"

# ADITYA SILSWAL
git fetch --prune origin
git switch --track origin/team/aditya-silswal-edge-gateway
git config --local user.name "ADITYA SILSWAL"
git config --local user.email "adiisilswal@gmail.com"

# BHUMIKA SINGH RAWAT
git fetch --prune origin
git switch --track origin/team/bhumika-singh-rawat-data-qa
git config --local user.name "BHUMIKA SINGH RAWAT"
git config --local user.email "bhumika282007@gmail.com"
```

After the matching block, verify `git branch --show-current`, `git config --local --get user.name`, `git config --local --get user.email`, and `git status --short --branch`. Yashvardhan also verifies Cursor's branch indicator before prompting its agent. Krishna and Aditya keep separate local identities/branches even while the GitHub push actor is Aditya's account.

## 8. Canonical state machines

### Local processing

```text
DISPOSAL_STARTED
 -> SENSOR_CAPTURED
 -> ML_PENDING
 -> ML_RECEIVED | ML_UNAVAILABLE
 -> PROCESSING
 -> SEGREGATION_DECIDED
 -> POINTS_CALCULATED | REVIEW_REQUIRED
 -> COMPLETED

terminal unrecoverable local path: PROCESSING_FAILED
```

### Decision/review

```text
CAPTURED -> EVALUATING -> ACCEPTED | FLAGGED
FLAGGED -> REVIEW_ACCEPTED | REVIEW_NO_ACTION | VERIFIED_VIOLATION
VERIFIED_VIOLATION -> PENALIZED
ACCEPTED | REVIEW_ACCEPTED | REVIEW_NO_ACTION | PENALIZED -> CLOSED
```

### Edge transport

```text
PENDING -> IN_FLIGHT -> ACKED
IN_FLIGHT -> PENDING | DEAD_LETTER | AUTH_BLOCKED
AUTH_BLOCKED -> PENDING after credential repair
```

Never collapse these dimensions into one `status`.

## 9. Canonical LAN/cloud contract summary

Path/revision:

- LAN: `/v1`, `schemaVersion: "1.1"`.
- Cloud: `/api/v1`.
- Rules: `rules-2.0.0`.

### Device endpoints

```text
GET  /healthz
GET  /v1/device/active-session
POST /v1/disposal-events
POST /v1/heartbeats
POST /v1/telemetry
GET  /v1/messages/{messageId}
```

All device calls except safe local health use `X-SGV-Device-Id`, timestamp, nonce, and HMAC of exact method/path/device/time/nonce/body hash. Validate limits, device, timestamp, HMAC, replay, and strict schema before committing.

### Disposal event essentials

```json
{
  "schemaVersion": "1.1",
  "messageId": "<uuid>",
  "messageType": "DISPOSAL_EVENT_V1",
  "deviceCode": "ESP32-001",
  "bootId": "<uuid>",
  "sequence": 184,
  "occurredAt": "<UTC RFC3339>",
  "timeQuality": "DEVICE_SYNCED",
  "firmwareVersion": "smart-waste-esp32-1.0.0",
  "payload": {
    "eventId": "<uuid>",
    "sessionId": "<uuid>",
    "eventSource": "HARDWARE",
    "selectedCompartment": "DRY",
    "trigger": {
      "componentCode": "ir-dry-1",
      "triggered": true,
      "quality": "GOOD",
      "capturedAt": "<UTC RFC3339>"
    },
    "measurements": [],
    "location": { "fixQuality": "NO_FIX" }
  },
  "extensions": {}
}
```

Device/edge never receive citizen name/PII. Municipal scan creates a short-lived cloud session; edge claims it outbound and ESP32 receives only session/event/compartment/expiry.

### Edge cloud auth and sync

Gateway requests use HTTPS plus gateway ID, timestamp, nonce, idempotency key, and HMAC. Edge freezes exact body bytes before first attempt.

```text
POST /api/v1/device/disposal-session-claims
POST /api/v1/device/sync
```

Cloud sync contains the original device message plus `edgeProcessing.mlDetection` with status, `evidenceSource`, model/version/weights hash, class map, supported label/friendly label/category, score/band, latency, input hash, and timestamp. Failure omits label/category/score and uses a typed status; it still syncs safely.

### Cloud role endpoints

Citizen:

```text
GET  /api/v1/me
GET  /api/v1/me/dashboard
POST /api/v1/me/qr-tokens
GET  /api/v1/me/qr-token
GET  /api/v1/me/disposal-events
GET  /api/v1/me/disposal-events/{eventId}
GET  /api/v1/me/points
GET  /api/v1/me/badges
GET  /api/v1/leaderboard
POST /api/v1/me/disputes
GET  /api/v1/me/disputes
```

Municipal:

```text
POST /api/v1/municipal/disposal-sessions
GET  /api/v1/municipal/disposal-sessions/{sessionId}
GET  /api/v1/municipal/disposal-events
GET  /api/v1/municipal/disposal-events/{eventId}
GET  /api/v1/municipal/review-cases
POST /api/v1/municipal/review-cases/{caseId}/decisions
GET  /api/v1/municipal/disputes
POST /api/v1/municipal/disputes/{disputeId}/decisions
```

Developer:

```text
GET  /api/v1/developer/devices
GET  /api/v1/developer/devices/{deviceId}/health
GET  /api/v1/developer/devices/{deviceId}/telemetry
GET  /api/v1/developer/ml-detections
GET  /api/v1/developer/log-events
POST /api/v1/developer/simulations
```

No Tier 2 truck/location/route/metrics/billing/discount API exists.

### Standard API behavior

- Success: `{ data, meta: { requestId } }`.
- Error: `{ error: { code, message, details?, retryable }, meta: { requestId } }`.
- Lists: cursor pagination, `limit 1..100`, stable order.
- State-changing actions require `Idempotency-Key` where contract specifies.
- Same key/different body is `409`, in-progress duplicate is `409` plus `Retry-After`.
- Auth comes from Supabase sessions; no custom `/auth/*` API.

## 10. Canonical cloud schema

Tier 1 tables/views only:

```text
profiles
citizens
citizen_qr_tokens
disposal_sessions
gateways
devices
device_components
ingest_messages
idempotency_records
rulesets
disposal_events
sensor_readings
ml_detections
segregation_results
review_cases
review_decisions
point_transactions
disputes
badges
citizen_badges
device_heartbeats
device_telemetry
audit_logs
citizen_point_balances (view)
citizen_tiers (view)
leaderboard_public (safe server projection/view)
```

Do not create Tier 2 fleet/route/location/billing/discount/report tables.

### Persistence invariants

- Raw QR is hashed immediately; only peppered hash/suffix/lifecycle persists.
- Event links session, citizen, device, source, compartment, three state dimensions and timestamps.
- Sensor and ML rows are normalized append-only evidence.
- Automated result is one immutable `ACCEPTED`/`FLAGGED` row per event.
- Review case/decision is one authorized append-only outcome per flagged event.
- Point transactions are signed integer append-only rows with unique award/violation per event.
- `AWARD=+10`; `VIOLATION=-10|-20` and must reference verified review.
- Reversal references and compensates a prior row.
- Simulation uses fixed fictional IDs and permanent source.
- RLS blocks citizen cross-account access; server role checks still apply.

### Edge SQLite tables

```text
local_events
local_ml_results
outbox_messages
device_replay_keys
```

`local_events` and outbox use atomic leases with expiry for crash recovery. Exact cloud body/hash is immutable after freeze. SQLite stores no final balance, Supabase service-role secret, raw frames, or raw QR.

## 11. Frozen rules-2.0.0

### Inputs

- selected compartment `WET|DRY`;
- selected-compartment IR confirmation and quality;
- ML status/category/score/band/class-map/model provenance;
- dry-path moisture value/quality/calibration only for dry events;
- required component/data-quality flags;
- event source and simulation/recorded labels.

Fill and GPS do not enter segregation logic.

### Thresholds

```text
ML score < 0.60        LOW
0.60 <= score < 0.85  MEDIUM
score >= 0.85          HIGH

dry moisture < 30%     NORMAL
30% to 45%             ELEVATED
>45%                   HIGH
```

Score is not called calibrated probability. Thresholds live in immutable ruleset config, not hard-coded separately in route/UI/firmware.

### Evaluation matrix

| Situation | Automated result | Immediate points | Review outcome |
|---|---|---:|---|
| supported match, score >=0.60, required quality good, dry moisture normal if dry | `ACCEPTED` | `+10` exactly once | none |
| no/unsupported/multiple/score <0.60/model unavailable/late | `FLAGGED` | `0` | `REVIEW_ACCEPTED +10`, `REVIEW_NO_ACTION 0`, or verified violation only with separate evidence |
| dry supported label but dry moisture >45 | `FLAGGED`, `ENVIRONMENTAL_WETTING_SUSPECTED` | `0` | normally accept/no-action; never automatic adverse |
| opposite supported category | `FLAGGED`, mismatch | `0` | verified normal may append `-10` |
| wet evidence in dry, score >=0.85, dry moisture >45 | `FLAGGED`, severe suspected | `0` | verified severe may append `-20` |
| missing/wrong IR/session/component quality | `FLAGGED` or processing failure by contract | `0` | no automatic adverse |

Badge/tier projection:

```text
0–499      BRONZE
500–999    SILVER
1000–1999  GOLD
2000+      PLATINUM
```

## 12. Local ML and camera rules

Live local ML is Tier 1 only under these gates:

1. runtime/model/weights/class map/test set/provenance/license are recorded;
2. weights SHA-256 matches and dependencies are installed before demo;
3. supported class allowlist is explicit; arbitrary labels are forbidden;
4. WAN-disabled capture/inference works on actual laptop;
5. p50/p95 capture-plus-inference is measured;
6. event correlation survives duplicate trigger, timeout, late result, and restart;
7. camera source/model path are local configuration, never public request input;
8. raw frames are memory-only by default;
9. no/multiple/low/failure maps to uncertainty;
10. `RECORDED_ML` fallback is permanently labelled and never presented as live.

Do not assume a general pretrained model detects `plastic_wrapper` or generic `food_waste`. Use only frozen tested classes or an approved waste-specific artifact.

## 13. Simulation rules

Developer “Inject Test Event”:

- only `DEVELOPER`/`SYSTEM_ADMIN`;
- only when `DEMO_SIMULATION_ENABLED=true`;
- request accepts allowlisted `fixtureId` only;
- server derives fixed fictional citizen/device/sensors/ML/source and expected constraints;
- idempotent, rate-limited and audited;
- permanent event/ML/UI `SIMULATED` label;
- shares validation, rules, persistence, ledger safeguards, Realtime, and UI after physical ingress;
- does not claim/execute ESP32, IR, sensors, or live camera;
- excluded from real-hardware proof and unlabelled leaderboard counts.

## 14. Security, privacy, and fairness

- Use synthetic people/data only.
- Supabase Auth is the only auth system; phone OTP/Google are provider targets with fictional-account fallback.
- Validate session and trusted role on every server action; enforce RLS too.
- Gateway/device HMAC secrets are separate, scoped, rotatable, redacted.
- Never expose service role or privileged credentials in `NEXT_PUBLIC_*` or browser bundles.
- Edge camera source is allowlisted/configured to prevent SSRF; no request-supplied URL/path.
- Hash/model/class manifests are controlled files; checksum mismatch is failure.
- No raw frames stored by default and no full raw logs exposed through developer API.
- QR carries no PII; raw token is accepted only by the municipal session route, hashed immediately, not logged/stored/returned.
- Negative points require human review and reason; citizen can dispute.
- Realtime topics and REST reads are role-scoped.
- UI labels source, confidence band, stale/degraded state and preview truth in text, not color alone.

## 15. Coding standards

### TypeScript/Next.js

- `strict: true`; no unexplained `any`, unsafe casts, or duplicated handwritten API shapes.
- Server/client modules are explicit; privileged code never enters client bundles.
- Validate boundary input with canonical schemas; internal typed functions trust validated values.
- Use small domain use cases and typed result/error objects.
- UI never computes authoritative points/result/role/ownership.
- Accessible semantic markup, keyboard behavior, visible focus, loading/empty/error/stale states.
- Tier/source labels are persistent and tested.

### Python/FastAPI

- typed public functions and strict Pydantic boundary models;
- bounded body/array/frame sizes, timeouts and concurrency;
- SQLite transaction before ACK; `BEGIN IMMEDIATE`/leases where required;
- camera/inference behind interfaces with deterministic test fakes;
- exact cloud bytes persisted/retried unchanged;
- structured redacted logs; never log raw body/QR/frame/secret;
- no broad exception swallowing or silent fallback.

### ESP32/C++

- nonblocking state machine; avoid long delays;
- bounded ArduinoJson/buffers; no dynamic unbounded payload;
- stable UUID/message/boot/sequence behavior across retry/restart;
- independent compartment IR debounce and incomplete-cycle timeout;
- explicit units/quality/calibration; no fabricated zero;
- credentials in ignored provisioning, not source;
- serial logs use safe IDs/states only.

### SQL

- forward-only migrations; never edit an applied migration;
- constraints/indexes/RLS/functions/tests land together;
- append-only tables protected from client update/delete;
- use unique constraints and atomic transactions for idempotency/ledger;
- never trust seed success as RLS proof; test with role sessions;
- no Tier 2 migration.

## 16. Required command contract

At G0, root scripts must wrap canonical checks. Do not add a second package manager or alternate command family.

Expected root commands after scaffold:

```bash
npm ci
npm run lint
npm run typecheck
npm test
npm run test:contract
npm run test:edge
npm run test:firmware
npm run test:db
npm run test:e2e
npm run build
npm run verify
```

Module-level diagnostic commands may include:

```bash
python -m pytest services/edge-gateway/tests
pio run -d firmware/esp32
pio test -d firmware/esp32
supabase db reset
```

`supabase db reset` is for the explicitly selected local demo database only. Never run destructive data commands against an unknown/production project.

If a listed script does not exist because scaffold is not merged, the task is blocked on G0; do not invent a parallel setup.

## 17. Testing obligations

Every PR tests its own layer plus affected contracts.

### Contract/API

- valid golden fixture across firmware/Pydantic/Zod/OpenAPI/SQL;
- missing/extra/invalid/boundary/oversized/malformed cases;
- HMAC canonical vectors, clock, nonce, replay;
- same body replay and changed body `409` under concurrency;
- standard envelope/error/request ID;
- cursor pagination and stable order;
- every role allow/deny and cross-citizen RLS.

### Rules/ledger/review

- all confidence boundaries: just below/at `0.60` and `0.85`;
- moisture just below/at/above `30` and `45`;
- correct wet/dry, mismatch, severe wet-in-dry, environmental wetting;
- unsupported/no/multiple/model failure/sensor degraded/incomplete;
- accepted `+10` once under concurrent replay;
- automated negative count always zero;
- review accepted/no-action/normal/severe and duplicate decision;
- dispute ownership and compensating reversal;
- tier boundaries `499/500/999/1000/1999/2000`.

### Edge/ML/firmware

- kill immediately after `202`; recover event;
- processing/sync lease expiry and restart;
- WAN outage, timeout-after-cloud-commit, `AUTH_BLOCKED`, dead letter;
- wrong session/device/compartment, expired session, duplicate IR, incomplete cycle;
- fill calibration/clamp, dry moisture placement/quality, GPS `NO_FIX`;
- camera unreachable/stale, weights missing/hash mismatch, no/multiple/unsupported/low, inference timeout/CPU pressure;
- wrong/late detection event ID and immutable cloud-body freeze;
- WAN-disabled local capture/inference.

### UI/E2E

- citizen QR/history/balance/tier/badge/live result/dispute;
- municipal scan/active event/review;
- developer health/telemetry/ML/log/simulation;
- auth fallback in separate browser profiles;
- Realtime disconnect/refetch/poll;
- keyboard/focus/contrast/text labels;
- source badges and friendly labels;
- Tier 2 pages make no forbidden API calls/imports and always show preview label.

### Seed/simulation

- deterministic 15–25 primary events and four to six peers;
- every balance/result/badge reconciles to source rows;
- repeated reset is deterministic;
- all identities fictional;
- simulation role/env/fixture/rate/idempotency/source restrictions;
- simulation excluded from real-hardware counts.

## 18. AI execution protocol

### Before editing

The agent must:

1. read this complete file;
2. restate task, tier, owner, branch, allowed paths, acceptance tests, and non-goals;
3. inspect `git status --short --branch` and relevant existing code/tests/contracts;
4. preserve unrelated/user changes;
5. identify whether a controlled file/public contract is touched;
6. stop for `CHANGE_REQUEST` if the task cannot fit the frozen plan.

Do not ask to redesign unless there is a concrete contradiction that cannot be resolved inside the task.

### While editing

- Make the smallest coherent implementation for the issue.
- Stay in allowed paths.
- Use existing types/components/patterns and canonical fixtures.
- Do not add packages/services/tables/routes/folders “just in case.”
- Do not implement Tier 2 backend or Tier 3 code.
- Do not weaken validation, auth, RLS, idempotency, fairness, source labels, or tests to make a check pass.
- Do not overwrite unrelated edits.
- Add/update tests with behavior, including failure paths.
- Never commit secrets, generated runtime databases, raw frames, real PII, or unapproved weights.

### Before handoff

The agent must:

1. run the smallest relevant checks, then broader affected checks;
2. inspect `git diff --check`, `git diff --stat`, and full diff;
3. scan changed files for secrets/PII/stale paths/forbidden terms;
4. confirm no uncontrolled contract/tree/tier change;
5. report exact files changed, outcome, tests run/results, assumptions, remaining risk/blocker;
6. never claim a test passed if it was not run.

An AI agent does not merge, force-push, or modify GitHub settings unless Parth explicitly authorizes that action.

## 19. Forbidden changes

Without an approved change request, do not:

- rename/add/delete top-level folders or change ownership;
- create separate citizen/municipal/developer frontend apps;
- connect firmware/edge directly to Supabase;
- add MQTT, another database/backend/auth provider, native app, payment/billing provider;
- create Tier 2 schema/API/worker/server logic;
- store raw QR/camera frame/real PII or expose secrets;
- change source labels or hide `SIMULATED`/`PREVIEW/SEEDED`/stale/degraded states;
- add unsupported model label mapping or silently swap/download weights;
- let ML/browser/firmware set final result/points/role/ownership;
- create automatic `-10/-20`;
- use `SELECT` then unprotected insert for idempotency;
- directly mutate balance or delete ledger/review/audit history;
- broaden RLS/CORS, disable tests/lint/type checks, or add ignore comments without reason;
- rewrite applied migration or rebase/force shared branches;
- claim production accuracy/security/legal/municipal integration.

## 20. 30-hour gate summary

The detailed plan is `DOCUMENTATION/10_IMPLEMENTATION_PLAN.md`; agents use issue scope, not self-assigned phases.

```text
G0  H0–H2    plan/tree/contracts/model/BOM/provider preflight
G1  H2–H8    independent foundations + local hardware/edge/capture proof
G2  H8–H14   one real event through ML + idempotent cloud + rules/ledger
G3  H14–H20  citizen/municipal/developer critical UI + Realtime/polling + seed
G4  H20–H25  review/negative/dispute + offline/restart/failure/simulation/security
G5  H25       Tier 1 feature freeze
G6  H25–H27  optional labelled Tier 2 preview only
RC  H27–H30  destructive testing, reset, three rehearsals, claims/release
```

Tier 2 cannot start before G5. A failed Tier 1 gate moves effort back to the blocker; it does not justify hiding failure with preview work.

## 21. Definition of done

A task is done only when:

- issue requirement/tier/allowed paths are satisfied;
- relevant happy, boundary, security, and failure tests pass;
- public/schema/model/rules changes have approved synchronized fixtures/docs/migrations;
- source/stale/degraded/preview labels remain honest;
- no duplicate/adverse/authorization invariant is weakened;
- accessibility and safe error/empty/loading states exist for UI;
- logs contain safe correlation IDs and no sensitive values;
- diff contains no unrelated changes;
- PR body includes outcome, verification output, evidence and reviewer focus.

Project demo is ready only after a real QR -> ESP32 -> durable edge -> local inference -> cloud -> accepted/flagged -> points/review -> role UI flow passes, three queued events survive restart/reconnect, negative values require review, simulation is labelled, seed reconciles, Tier 2 has no backend, and three full rehearsals succeed.

## 22. Change-request procedure

If the task cannot fit this plan, stop. Do not implement the proposed deviation. Create:

```md
# CHANGE_REQUEST — CR-###

## Requester and task
Requested by:
Issue/task:
Branch:

## Blocker
Current approved rule/contract/path:
Why the requirement cannot fit:
Evidence:

## Smallest requested change
Exact change:
Affected tier/files/paths/contracts/tables/endpoints:

## Impact
Security/privacy/fairness:
Migration/backward compatibility:
Tests/fixtures/docs:
Owners/branches/merge conflicts:
Schedule/demo/fallback:

## Alternatives considered
1.
2.

## Approval
Status: PENDING
Approved by PARTH AJMERA:
ADR/document/contract updates:
Team notified:
```

Until status is `APPROVED` and the ADR/synchronized updates exist, current v2.0 remains active.

## 23. Task prompt template for Freebuff/Cursor/other AI

Copy this template and fill every field:

```md
# Task

## Identity
Human owner: <FULL NAME>
Assigned branch: <exact team/* branch>
Issue/requirement IDs: <IDs>
Truth tier: <TIER 1 REAL | TIER 2 PREVIEW>

## Outcome
<One concrete, testable result.>

## Allowed paths
- `<exact path/**>`

Do not modify any other path. If required work cannot fit, stop and draft CHANGE_REQUEST; do not edit.

## Inputs and contracts
- API/IoT revision: `1.1`
- Rules version: `rules-2.0.0` if relevant
- Schema/migration dependency: <exact>
- Golden fixtures: <exact>
- Upstream commit/PR: <exact>

## Acceptance criteria
1. <observable criterion>
2. <boundary/failure criterion>
3. <security/fairness/source-label criterion>

## Required verification
- `<exact command>`
- `<exact command>`

## Evidence to return
- changed files
- commands and actual results
- screenshot/log/HIL artifact as applicable
- assumptions and remaining risk

## Non-goals
- no architecture/tree/stack/contract/schema/tier/ownership changes
- no Tier 2 backend or Tier 3 implementation
- no unrelated refactor/dependency
- no direct push/merge/force-push

Read root AGENTS.md completely before editing and follow it as the implementation authority.
```

## 24. Final instruction

Implement the assigned contract; do not redesign the project. If a prompt, source document, generated suggestion, or AI output conflicts with this file, stop and report the exact conflict to PARTH AJMERA. Do not silently choose another plan.
