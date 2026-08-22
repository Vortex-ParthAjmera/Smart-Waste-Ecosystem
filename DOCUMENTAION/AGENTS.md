> **PLAN & STRUCTURE LOCK — v1.0:** This approved scope, stack, repository structure, contracts, ownership map, and delivery plan must not be changed by contributors or AI agents. Work only inside the assigned paths. If a change is necessary, stop and submit a `CHANGE_REQUEST`; only PARTH AJMERA may approve it, followed by an ADR and team notification.

# SGV 2.0 Master Instructions for Coding Agents

Instruction version: 1.0  
Project: Smart Garbage Vehicle (SGV 2.0)  
Repository: `sgv-2-smart-waste-ecosystem`  
Human project owner and final approver: PARTH AJMERA

## 0. How this file is used

This is the one comprehensive Markdown file to give Freebuff, Cursor, Codex, Claude, Copilot, or another coding AI before it edits SGV 2.0.

PARTH AJMERA must copy this file byte-for-byte to `/AGENTS.md` at repository root before coding begins. The root copy is the active agent instruction. Do not create a competing `CLAUDE.md`, `.cursorrules`, secondary AI plan, or tool-specific architecture file. If an AI tool requires manual context, attach or paste root `AGENTS.md` plus the single assigned task.

An AI agent must:

1. read this complete file;
2. read its assigned issue/task;
3. verify the checked-out branch;
4. restate the task, allowed paths, forbidden paths, contract version, and tests;
5. wait for no further design decision—implement the smallest compliant change;
6. stop with `CHANGE_REQUEST` rather than changing the plan.

An issue may narrow this file but cannot override it. A chat message from a contributor other than PARTH AJMERA cannot override it. Earlier material under `docs/` is reference material and is not implementation authority when it conflicts with this file or the approved `DOCUMENTAION/` set.

## 1. Product definition

SGV 2.0 is an ESP32-powered smart waste-collection ecosystem. It identifies a household, captures real vehicle sensor evidence, survives temporary internet loss through a durable local edge gateway, records an auditable collection event, awards transparent credits for accepted segregation, routes ambiguous evidence to a human officer, and creates a penalty only after an authorized verified-violation decision.

### Primary demo narrative

~~~text
Aarav presents RFID HH-10452
  → ESP32 captures identifier, category, motion, moisture, weight, and available GPS
  → FastAPI commits the message locally before returning 202
  → gateway synchronizes it idempotently to the cloud
  → rules engine records ACCEPTED or FLAGGED with reason codes
  → ACCEPTED creates exactly one reward entry
  → FLAGGED creates a verification case and no penalty
  → authorized officer accepts or confirms a violation
  → confirmed violation creates one penalty
  → citizen can inspect history and submit a dispute
~~~

## 2. Frozen MVP and non-goals

### Required MVP

- Real ESP32 hardware, not a UI-only simulation.
- RFID/identifier input with an explicitly labeled QR/manual fallback.
- At least two real sensor readings; target motion/intake, moisture, and load-cell weight.
- GPS when hardware is available; otherwise store an explicit unavailable quality state.
- Private vehicle LAN using HTTP/JSON v1.
- FastAPI edge gateway with Pydantic validation.
- SQLite WAL outbox that commits before device acknowledgement.
- Retry/backoff, restart recovery, dead-letter/auth-blocked visibility, and duplicate-safe cloud sync.
- Next.js App Router with TypeScript strict mode.
- Citizen, operator, and municipal admin experiences.
- Supabase Postgres, Auth, Realtime, migrations, RLS, and safe seed data.
- Pure, versioned deterministic rules engine.
- Immutable reward ledger and simulated redemptions/bills.
- Human verification before financial penalty.
- Tests for contracts, idempotency, credits, RLS, offline recovery, and critical UI flows.

### Out of scope unless PARTH AJMERA approves a change request

- Camera or AI/computer-vision classification.
- Real UPI, card, wallet, bank, or municipal payment integration.
- Native mobile apps.
- SMS or paid notification provider.
- Automatic penalty from sensor output.
- Production route optimization.
- Direct ESP32-to-Supabase or ESP32-to-Vercel communication.
- Direct edge-gateway access to Supabase.
- Public inbound access to the vehicle LAN.
- MQTT in the MVP.
- Microservice decomposition beyond the approved web app and local edge gateway.
- Replacing Next.js, FastAPI, Supabase/Postgres, SQLite, or PlatformIO.
- Real citizen data.

Stretch work begins only after the H19 feature-complete gate is already green; in practice, it should be presented as future scope rather than risk the demo.

## 3. Fixed architecture and trust boundaries

~~~text
Sensors/RFID/GPS
  → ESP32 firmware
  → private LAN, signed HTTP/JSON v1
  → FastAPI edge gateway
  → SQLite durable outbox
  → outbound authenticated HTTPS
  → Next.js /api/v1/device/sync
  → domain use cases + pure rules engine
  → Supabase Postgres/Auth/Realtime
  → citizen/operator/admin web portals
~~~

Trust rules:

1. The private LAN is not inherently trusted; validate and authenticate every device message.
2. Plain HTTP is permitted only on the isolated demo LAN and is never port-forwarded publicly.
3. ESP32 stores device-scoped LAN credentials only, never cloud/database/user credentials.
4. Edge stores gateway credentials and local queue data, never a Supabase service-role key.
5. Next.js uses service credentials server-side only.
6. Browsers use authenticated, least-privilege user sessions.
7. RLS and server checks enforce authorization; hiding a button does not.
8. RFID tokens, citizen PII, request signatures, and secrets are redacted from logs.

### Fixed technology baseline

| Layer | Approved choice |
|---|---|
| Firmware | ESP32 C++ using Arduino framework and PlatformIO |
| Device transport | HTTP/1.1 + JSON v1 on isolated LAN |
| Edge | Python 3.12, FastAPI, Pydantic v2, Uvicorn |
| Edge storage | SQLite WAL, `synchronous=FULL` |
| Cloud web/API | Next.js App Router, TypeScript strict mode |
| Data/auth/realtime | Supabase Postgres, Auth, Realtime |
| UI | Tailwind CSS with an accessible component layer |
| Maps | Leaflet and OpenStreetMap |
| Validation | JSON Schema/OpenAPI fixtures, Pydantic, Zod |
| Tests | Pytest, Vitest, React Testing Library, Playwright, PlatformIO/HIL |
| Deployment | Edge on local laptop/Raspberry Pi; Next.js on Vercel; Supabase managed |

Use versions already pinned by approved manifests and lockfiles. Do not “upgrade to latest.”

## 4. Frozen repository tree

~~~text
sgv-2-smart-waste-ecosystem/
├── apps/
│   └── web/
│       ├── public/
│       ├── src/
│       │   ├── app/
│       │   │   ├── (citizen)/
│       │   │   ├── (operator)/
│       │   │   ├── (admin)/
│       │   │   └── api/v1/
│       │   ├── components/
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
│       │   ├── persistence/
│       │   ├── services/
│       │   ├── settings.py
│       │   └── main.py
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
│   ├── contracts/{openapi,schemas,fixtures}/
│   └── rules-engine/{src,test}/
├── supabase/{migrations,tests}/
├── supabase/config.toml
├── supabase/seed.sql
├── tests/{contract,integration,e2e,hardware-in-loop,fixtures}/
├── scripts/{setup,demo,verification}/
├── DOCUMENTAION/
├── .github/{ISSUE_TEMPLATE,workflows}/
├── .github/CODEOWNERS
├── .github/PULL_REQUEST_TEMPLATE.md
├── .env.example
├── .gitignore
├── AGENTS.md
├── README.md
├── package.json
└── package-lock.json
~~~

No agent may add, remove, rename, or move a top-level directory. Do not create root `src`, `backend`, `frontend`, `server`, `database`, `iot`, `shared`, `common`, `utils`, `misc`, or `temp` alternatives.

### Dependency direction

~~~text
UI / API routes / firmware drivers
              ↓
application use cases
              ↓
domain rules and contract types
              ↓
database / network / framework / hardware adapters
~~~

The rules engine is pure: no React, Next.js, Supabase, HTTP, FastAPI, SQLite, or hardware imports.

## 5. People, branches, and path ownership

| Owner | GitHub-linked email | Fixed branch | Normal allowed paths |
|---|---|---|---|
| PARTH AJMERA | `ajmeraparth.official@gmail.com` | `team/parth-ajmera-governance` | `DOCUMENTAION/**`, root `README.md`/`AGENTS.md`, CODEOWNERS/PR template, approved root config and contracts |
| YASHVARDHAN DOBHAL | `yashvardhandobhal944@gmail.com` | `team/yashvardhan-dobhal-web-ui` | citizen/operator/admin route groups, components, browser API client, styles, public assets |
| AASHU JOSHI | `aashujoshisbps@gmail.com` | `team/aashu-joshi-cloud-api` | `apps/web/src/app/api/v1/**`, auth/domain/Supabase/validation server libraries, `packages/rules-engine/**` |
| KRISHNA PANWAR | `krishnapanwar464@gmail.com` | `team/krishna-panwar-esp32` | `firmware/esp32/**` and explicitly assigned HIL fixtures |
| ADITYA SILSWAL | `adiisilswal@gmail.com` | `team/aditya-silswal-edge-gateway` | `services/edge-gateway/**` and explicitly assigned gateway fixtures |
| BHUMIKA SINGH RAWAT | `bhumika282007@gmail.com` | `team/bhumika-singh-rawat-data-qa` | `supabase/**`, `tests/**`, `.github/workflows/**`, assigned verification scripts |

`packages/contracts/**` is frozen shared infrastructure. Only an approved task after PARTH AJMERA's decision may change it, with KRISHNA PANWAR, ADITYA SILSWAL, AASHU JOSHI, and BHUMIKA SINGH RAWAT reviewing affected boundaries.

An issue may temporarily reassign a specific file only if PARTH AJMERA names the person, branch, exact path, reason, and acceptance criteria. No implicit cross-ownership exists.

## 6. Persistent branch workflow

Protected branches:

- `main` — demo/release only;
- `integration` — team integration only.

Rules:

1. Work only on the assigned `team/*` branch.
2. Pull request from `team/*` to `integration`.
3. Use a normal merge commit.
4. After merge, merge `origin/integration` back into every active team branch.
5. Release through a reviewed `integration` → `main` PR.
6. Never commit directly to `integration` or `main`.
7. Never rebase or force-push a persistent/shared branch.
8. Never squash-merge a branch that will be reused.
9. Never let an AI merge, approve, rewrite history, or change GitHub rules.

Safe sync:

~~~bash
git switch team/<assigned-branch>
git status
git fetch origin
git merge origin/integration
git status
~~~

Prohibited:

~~~bash
git rebase
git push --force
git push --force-with-lease
git reset --hard
git clean -fd
~~~

If the branch, worktree, or conflict is unclear, stop and ask PARTH AJMERA.

## 7. Canonical IoT contract v1

Contract version `1.0` is frozen. Canonical schemas/fixtures belong in `packages/contracts`.

### 7.1 Device-to-edge endpoints

| Method | Path | Message/result |
|---|---|---|
| `POST` | `/v1/ingest/collection-events` | `COLLECTION_EVENT_V1` → durable `QUEUED_LOCALLY` |
| `POST` | `/v1/ingest/gps` | `GPS_V1` → durable `QUEUED_LOCALLY` |
| `POST` | `/v1/ingest/heartbeats` | `HEARTBEAT_V1` → durable `QUEUED_LOCALLY` |
| `POST` | `/v1/ingest/telemetry` | `TELEMETRY_V1` → durable `QUEUED_LOCALLY` |
| `GET` | `/v1/messages/{messageId}` | Signed lookup of transport/cloud result |
| `GET` | `/v1/device/config` | Signed non-secret device configuration |
| `GET` | `/healthz` | Gateway, SQLite, queue, and cloud-connectivity health |

The ESP32 signs the exact request body. Required headers:

~~~text
X-SGV-Device-Id: ESP32-SGV-002
X-SGV-Boot-Id: <boot-uuid>
X-SGV-Sequence: <unsigned-decimal-sequence>
X-SGV-Signature: <lowercase-hex-HMAC-SHA256>
X-Request-Id: <optional-uuid>
Content-Type: application/json
~~~

Signature input is `<METHOD>\n<EXACT_PATH>\n<deviceCode>\n<bootId>\n<sequence>\n<sha256(rawBody)>`, with no trailing newline. The edge verifies it in constant time and atomically claims `(deviceCode, bootId, sequence)`. Do not log the signature or raw identifier.

### 7.2 Collection-event envelope

~~~json
{
  "schemaVersion": "1.0",
  "messageId": "0191a15e-0834-7a3b-9364-8bb75c76a6a2",
  "messageType": "COLLECTION_EVENT_V1",
  "deviceCode": "ESP32-SGV-002",
  "bootId": "35b78309-99c4-4c9c-ad27-60bc4d12a319",
  "sequence": 184,
  "occurredAt": "2026-08-22T03:12:34.123Z",
  "timeQuality": "GPS",
  "firmwareVersion": "sgv-esp32-1.0.0",
  "payload": {
    "eventId": "0191a15d-8cfa-7ec1-bc58-59465353b0fe",
    "vehicleCode": "SGV-002",
    "runId": "fa59b53b-8bb3-44c1-8d80-b65010d096c3",
    "operatorSessionId": "5021336e-5e6f-47bf-9523-9c7b522f7c87",
    "identifier": { "type": "RFID", "value": "04A1B2C3D4" },
    "declaredCategory": "WET",
    "measurements": [
      { "code": "MOTION_DETECTED", "value": true, "unit": "BOOLEAN", "quality": "GOOD", "capturedAt": "2026-08-22T03:12:31.900Z" },
      { "code": "MOISTURE_PERCENT", "value": 81.4, "unit": "PERCENT", "quality": "GOOD", "capturedAt": "2026-08-22T03:12:32.300Z", "calibrationVersion": "moisture-2026-08-a" },
      { "code": "WEIGHT_KG", "value": 2.4, "unit": "KG", "quality": "GOOD", "capturedAt": "2026-08-22T03:12:33.100Z", "calibrationVersion": "hx711-2026-08-a" }
    ],
    "location": { "latitude": 22.719568, "longitude": 75.857727, "accuracyM": 8.2, "speedKph": 0, "headingDeg": 142.3 }
  },
  "extensions": {}
}
~~~

Allowed enums:

- `messageType`: `COLLECTION_EVENT_V1`, `GPS_V1`, `HEARTBEAT_V1`, `TELEMETRY_V1`;
- `declaredCategory`: `WET`, `DRY`, `REJECT`;
- measurement quality: `GOOD`, `ESTIMATED`, `DEGRADED`, `MISSING`, `OUT_OF_RANGE`;
- `timeQuality`: `GPS`, `RTC`, `GATEWAY`, `UNKNOWN`.

Rules:

- `messageId` and `payload.eventId` are UUIDs created once and retained across retry.
- `bootId + sequence` supports diagnostics/replay detection; sequence never replaces `messageId`.
- Missing hardware data uses the JSON Schema's explicit missing/quality representation, never `0` or invented.
- Percentages are 0–100; weight is decimal kilograms; coordinates must be valid ranges.
- Sensor safety signals do not prove citizen non-compliance.
- Cloud may assign a display code such as `CE-2026-0009821` without replacing immutable `eventId`.

### 7.3 Durable edge acknowledgement

The edge returns success only after a SQLite transaction commits the message and outbox row:

~~~json
{
  "data": {
    "messageId": "0191a15e-0834-7a3b-9364-8bb75c76a6a2",
    "edgeStatus": "QUEUED_LOCALLY",
    "duplicate": false,
    "receivedAt": "2026-08-22T03:12:34.310Z"
  },
  "meta": {
    "requestId": "68e4b5ef-d956-4d6c-8f16-4177cbb61c9d"
  }
}
~~~

HTTP status is `202` for a newly queued message. The same ID and same payload hash returns the existing durable state without another row. Same ID plus different payload returns `409 IDEMPOTENCY_CONFLICT`.

`202 QUEUED_LOCALLY` does not mean cloud-processed.

### 7.4 Edge-to-cloud sync

Endpoint:

~~~text
POST /api/v1/device/sync
~~~

Cloud sync v1 sends one authenticated durable message per request. Batching is not part of v1.

Required headers are `X-SGV-Gateway-Id`, `X-SGV-Timestamp`, `X-SGV-Nonce`, `Idempotency-Key`, `X-SGV-Signature`, and `Content-Type: application/json`. The idempotency key is the original `messageId`; exact signing and verification rules are frozen in `06_API_IOT_CONTRACT.md`.

~~~json
{
  "schemaVersion": "1.0",
  "gatewayCode": "EDGE-SGV-002",
  "edgeReceivedAt": "2026-08-22T02:42:35Z",
  "lanPayloadHash": "<lowercase-sha256-hex>",
  "message": {
    "schemaVersion": "1.0",
    "messageId": "6d581ba8-b8d6-4e4b-89a4-e05cf0f60d7c",
    "messageType": "COLLECTION_EVENT_V1",
    "deviceCode": "ESP32-SGV-002",
    "bootId": "35b78309-99c4-4c9c-ad27-60bc4d12a319",
    "sequence": 184,
    "occurredAt": "2026-08-22T03:12:34.123Z",
    "timeQuality": "GPS",
    "firmwareVersion": "sgv-esp32-1.0.0",
    "payload": {},
    "extensions": {}
  }
}
~~~

Cloud responds for the same `messageId`:

~~~json
{
  "data": {
    "messageId": "6d581ba8-b8d6-4e4b-89a4-e05cf0f60d7c",
    "processingStatus": "PROCESSED",
    "duplicate": false,
    "result": {
      "eventId": "4afe8dc7-5b9b-4a1d-9a3c-8d567324a377",
      "eventState": "ACCEPTED",
      "pointsAwarded": 50
    }
  },
  "meta": {
    "requestId": "req_02",
    "processedAt": "2026-08-22T02:42:36Z"
  }
}
~~~

Transport states inside edge: `PENDING`, `IN_FLIGHT`, `ACKED`, `DEAD_LETTER`, `AUTH_BLOCKED`.

The cloud must atomically claim `messageId` and compare `payloadHash` before domain processing. A timeout after cloud commit is resolved by retrying the same ID and returning the stored result.

### 7.5 Standard API envelopes

Successful user/cloud response:

~~~json
{
  "data": {},
  "meta": {
    "requestId": "req_03"
  }
}
~~~

Error response:

~~~json
{
  "error": {
    "code": "STABLE_MACHINE_CODE",
    "message": "Safe human-readable message",
    "requestId": "req_03",
    "details": {}
  }
}
~~~

Do not return a new envelope shape for an individual endpoint. Do not expose stack traces, SQL, secrets, internal paths, or raw validation dumps to clients.

## 8. Frozen application API surface

All paths are under `/api/v1`.

### Citizen/self

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/me` | Authenticated profile and household summary |
| `GET` | `/me/identifier` | Own active identifier, privacy-safe |
| `GET` | `/me/collections` | Own paginated collection history |
| `GET` | `/me/credits` | Own balance and immutable ledger |
| `POST` | `/me/redemptions` | Simulated points redemption request |
| `GET` | `/me/penalties` | Own verified penalties |
| `GET` | `/me/bills` | Own simulated bills |
| `POST` | `/me/disputes` | Dispute own eligible penalty |
| `GET` | `/vehicles/nearby` | Privacy-safe assigned/nearby vehicle status |

### Operator

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/operator/identifiers/lookup` | Resolve active identifier with minimum necessary household data |
| `GET` | `/operator/vehicles/current` | Assigned vehicle/device status |
| `GET` | `/operator/sync-status` | Cloud-visible sync summary |

The operator does not manually create a cloud sensor event that pretends to be hardware. Approved manual/QR fallback is recorded as such.

### Admin/verification

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/admin/dashboard` | Core operational summaries |
| `GET` | `/admin/vehicles` | Authorized fleet/device health |
| `GET` | `/admin/collections` | Filtered collection search |
| `GET` | `/admin/verification-cases` | Flagged queue |
| `POST` | `/admin/verification-cases/:id/decision` | `ACCEPT` or `CONFIRM_VIOLATION` |
| `GET` | `/admin/credits` | Reward ledger summaries/audit |
| `GET` | `/admin/penalties` | Verified penalties |
| `POST` | `/admin/disputes/:id/decision` | Resolve dispute with reason |
| `GET` | `/admin/analytics/summary` | Core ward/category/compliance totals |
| `GET` | `/admin/rulesets` | Read approved versioned rules |

Do not add endpoint aliases or unversioned routes. A needed endpoint change requires `CHANGE_REQUEST` because it affects UI, API, tests, and documentation.

## 9. Domain states and financial invariants

### Collection business lifecycle

~~~text
CAPTURED
  → EVALUATING
      → ACCEPTED → CLOSED
      → FLAGGED
          → REVIEW_ACCEPTED → CLOSED
          → VERIFIED_VIOLATION → PENALIZED → CLOSED
~~~

Business state and sync state are separate.

Mandatory invariants:

1. Sensors are evidence, not proof.
2. Rules return `ACCEPTED` or `FLAGGED` plus stable reason codes.
3. Safety alerts are independent of citizen compliance.
4. Every evaluation stores `rulesetVersion` and explanation codes.
5. `ACCEPTED` may create exactly one reward credit.
6. `FLAGGED` creates a verification case and no reward/penalty finalization.
7. A penalty requires an authenticated officer decision of `VERIFIED_VIOLATION`.
8. A dispute/reversal is append-only and requires actor, timestamp, and reason.
9. Reward, penalty, redemption, bill, and audit records are never silently overwritten.
10. Reward points are integers. Monetary amounts are integer paise.
11. Unique database constraints—not UI state—prevent duplicate event/reward/penalty effects.
12. Historical events retain the rule version used at the time.

The immutable ledger is authoritative. A cached household balance, if present, updates in the same database transaction and is never edited directly from a page or generic CRUD endpoint.

## 10. Data and security rules

Expected core entities:

- `profiles` and role membership;
- `households`;
- `identifiers`;
- `vehicles` and `devices`;
- `device_heartbeats`;
- `ingestion_receipts`;
- `collection_events` and sensor snapshot/readings;
- `gps_locations` or an approved latest/history model;
- versioned `rulesets`;
- `verification_cases` and decisions;
- immutable `reward_ledger`;
- `redemption_requests`;
- `penalties`;
- `disputes`;
- simulated `bills`;
- `notifications`;
- append-only `audit_logs`.

Database rules:

- migrations are forward-only and ordered;
- never edit an already-applied migration;
- never drop/rename a used table or column without approved change control;
- enable and test RLS on every user/municipal table;
- citizens read only their household records;
- operators see minimum necessary operational data;
- admin/officer writes are role-checked server-side;
- service-role use is server-only and narrowly scoped;
- use foreign keys, checks, uniqueness, and transactions for invariants;
- timestamps are `timestamptz` in UTC;
- do not store real citizen data;
- do not store raw payment credentials;
- redact RFID/PII/secrets from logs and analytics.

Security-sensitive files require explicit assignment: environment templates, auth, RLS, migrations, device/gateway authentication, CI, CODEOWNERS, and dependency manifests.

## 11. Required command contract

The initial scaffold must provide these commands. If a command is missing, only the assigned scaffold/config owner may add it. Do not invent a different toolchain.

### Repository/web

Run from repository root:

~~~bash
npm ci
npm run dev:web
npm run format:check
npm run lint
npm run typecheck
npm test
npm run build
npm run test:integration
~~~

Targeted web commands may use:

~~~bash
npm --prefix apps/web run dev
npm --prefix apps/web run lint
npm --prefix apps/web run typecheck
npm --prefix apps/web test
npm --prefix apps/web run build
~~~

Rules engine:

~~~bash
npm --prefix packages/rules-engine test
~~~

Do not replace npm with yarn, pnpm, bun, or ad-hoc global installations.

### Edge gateway

From `services/edge-gateway`:

~~~bash
python3.12 -m venv .venv
source .venv/bin/activate
python -m pip install -e '.[dev]'
ruff format --check .
ruff check .
pytest -q
uvicorn app.main:app --host 0.0.0.0 --port 8080 --reload
~~~

Do not commit `.venv`, SQLite runtime databases, queue snapshots, or logs.

### ESP32 firmware

From repository root:

~~~bash
pio run -d firmware/esp32
pio test -d firmware/esp32
pio run -d firmware/esp32 -t upload
pio device monitor --baud 115200
~~~

Upload/serial commands require a human to confirm the exact connected board and port. Never erase or flash an unconfirmed device.

### Supabase/database

~~~bash
supabase start
supabase db reset
supabase stop
~~~

Only BHUMIKA SINGH RAWAT applies migrations to the shared hosted demo project. Other members test locally.

### Before a PR is ready

Run every applicable module command plus the acceptance scenario. Do not claim a test passed if it was not run. If infrastructure prevents a test, report `NOT RUN` and the exact reason.

## 12. Coding standards

### TypeScript/React

- TypeScript strict mode; no `any`, `@ts-ignore`, or disabled strict checks.
- Validate all external input with approved Zod schemas.
- Prefer server components by default; client components only for interaction/browser APIs.
- Do not call internal server APIs from server code when a domain use case can be called directly.
- Keep business logic out of React components and route handlers.
- Use the typed API client; do not duplicate fetch/envelope parsing per page.
- One focused component per file; accessible labels and keyboard support.
- Loading, empty, error, stale, and degraded states are required.
- Status must not rely on color alone.

### Python/FastAPI

- Full type annotations on public functions.
- Pydantic models at external boundaries.
- Domain/services do not depend on FastAPI request objects.
- SQLite transactions must be explicit for durable receipt and leasing.
- Use bounded exponential backoff with jitter; never tight-loop retries.
- Distinguish retryable, permanent, and authentication failures.
- Structured logs use request/message/device IDs but redact sensitive values.
- Tests use temporary databases, never the live queue.

### ESP32/C++

- No heap-heavy unbounded JSON construction.
- Bounds-check buffers and validate sensor ranges.
- Do not block the main loop with long delays.
- Keep IDs stable across retry.
- Apply calibration explicitly and report missing/degraded quality.
- Store no cloud/service-role secret.
- Redact identifiers and signatures from serial logs.
- Network failure must not fabricate success.
- Safety detection may stop intake/raise an alert but never assigns citizen guilt.

### SQL

- `snake_case` names, explicit constraints, and explicit indexes for queried keys.
- Forward-only migrations.
- Transactions around event, decision, and ledger effects.
- RLS policy tests for allowed and denied actors.
- No floating-point money.
- No direct mutation of immutable ledger/audit history.

## 13. Testing obligations

### Any contract change

Contract changes are normally forbidden. If approved, update in the same task:

- canonical schema/OpenAPI;
- valid fixture;
- invalid fixture;
- duplicate fixture/test;
- conflict fixture/test;
- edge Pydantic model/test;
- cloud Zod model/test;
- firmware compatibility test;
- documentation and version;
- consumer review.

### Rules/credit change

Test:

- wet/dry/reject accepted and flagged evidence;
- missing/degraded sensors;
- safety alert independence;
- immutable ruleset/version reason;
- exactly-once credit;
- duplicate and idempotency conflict;
- unauthorized decision;
- review accept and confirmed violation;
- penalty exactly once;
- dispute/reversal audit.

### UI change

Test or demonstrate:

- intended role;
- loading, empty, error, and success;
- keyboard access;
- mobile citizen layout;
- server authorization, not button hiding;
- screenshot in PR.

### Edge/firmware change

Test:

- valid signed request;
- invalid signature/schema;
- local commit before `202`;
- duplicate same hash;
- conflict different hash;
- WAN outage;
- process restart;
- retry/backoff;
- cloud timeout after commit;
- queue drain;
- real serial/HIL evidence when hardware behavior changes.

### Database change

Test clean reset, seed, constraints, RLS allow/deny, idempotency, transaction rollback, and no duplicate financial effect.

## 14. AI execution protocol

### Before editing

The agent must output:

~~~text
TASK_ACK
Task ID:
Human owner:
Current branch:
Objective:
Allowed paths:
Forbidden paths:
Contract version:
Acceptance criteria:
Checks I will run:
Potential blocker requiring CHANGE_REQUEST: none | <detail>
~~~

Then inspect existing code and tests within scope. Preserve unrelated human changes and the dirty worktree. Prefer a small edit to a broad rewrite.

### While editing

- Work only on assigned paths.
- Do not “improve” unrelated code.
- Do not create alternate folders or duplicate services.
- Do not upgrade/install dependencies unless the task approves the exact dependency.
- Do not change a schema/API/type to make a local error disappear.
- Fix the producer or consumer that violates the approved contract.
- Use existing patterns and canonical fixtures.
- Add/update the smallest necessary tests.
- Never edit generated files manually.
- Never delete a file unless the issue explicitly names it.
- Never access or display secrets.
- Do not commit, push, open/merge a PR, deploy, migrate shared DB, or flash hardware unless a human explicitly authorizes that exact action.

### Before handing back

1. inspect `git diff --check` and the complete diff;
2. ensure only allowed paths changed;
3. run applicable checks;
4. verify acceptance criteria;
5. report any check not run;
6. report risks/assumptions without hiding failures.

Required final handoff:

~~~text
IMPLEMENTATION_REPORT
Task ID:
Outcome:
Files changed:
Contract/schema impact: none | approved detail
Checks run and results:
Acceptance evidence:
Not run:
Known risks:
CHANGE_REQUEST raised: no | identifier
Human next action:
~~~

## 15. Forbidden changes

An AI agent or contributor must not:

- change the product plan, scope, stack, architecture, repository tree, branches, ownership, or milestones;
- add/remove/rename/move a top-level folder;
- create a second frontend, backend, database, edge service, rules engine, or contract source;
- edit another member's paths without an explicit PARTH AJMERA assignment;
- change `schemaVersion 1.0`, endpoint paths, envelopes, enums, units, ID/idempotency behavior, or decision states;
- connect ESP32 directly to the cloud or edge directly to Supabase;
- replace HTTP/JSON MVP transport with MQTT;
- issue an automatic penalty;
- integrate real money/payment/billing;
- add camera/AI classification;
- weaken auth, RLS, signature validation, input validation, audit, redaction, or required CI;
- expose a service key to the browser/firmware or commit any secret;
- store/use real citizen data;
- change or delete an already-applied migration;
- directly update an immutable ledger/audit record;
- disable or skip a failing test to get green;
- suppress TypeScript/Python errors with unsafe escape hatches;
- install an unapproved dependency or switch package managers;
- modify `package-lock.json` for an unrelated task;
- fabricate sensor/GPS readings while labeling them as real;
- silently fall back from hardware to simulator;
- rewrite Git history, force push, rebase a shared branch, direct-push protected branches, or merge a PR;
- change CODEOWNERS/branch protection/workflows without assignment;
- perform destructive file/Git/database/device operations;
- claim work is complete without running or honestly reporting verification.

If the task appears to require any item above, stop and submit `CHANGE_REQUEST`.

## 16. Definition of done

A coding task is done only when all applicable items are true:

- [ ] Correct issue, person, and persistent branch.
- [ ] Only issue-approved paths changed.
- [ ] Frozen plan/tree/contracts remain unchanged.
- [ ] Acceptance criteria demonstrably pass.
- [ ] External inputs are validated.
- [ ] Authorization/RLS is enforced at the correct boundary.
- [ ] Idempotency and financial invariants are preserved.
- [ ] Unit tests added/updated for logic.
- [ ] Contract/integration tests added for boundary behavior.
- [ ] UI includes loading/empty/error/success and accessibility evidence.
- [ ] Firmware/edge work includes real-device or explicit fixture evidence.
- [ ] Format/lint/typecheck/compile/test/build checks pass as applicable.
- [ ] No secret, PII, runtime DB, log, build output, or unrelated lockfile change.
- [ ] Diff self-reviewed.
- [ ] PR body includes task, contract, checks, evidence, risks, and governance checklist.
- [ ] PARTH AJMERA approves; required CI passes; merge uses a normal merge commit.
- [ ] Team branch is resynchronized from `integration` after merge.

“Code written,” “works on my machine,” an AI confidence statement, or a screenshot without underlying correctness is not done.

## 17. Change-request procedure

Only PARTH AJMERA may approve a plan/structure/contract change. The agent must not implement the requested change before approval.

Use exactly:

~~~markdown
# CHANGE_REQUEST — CR-<number>

## Requester and task
- Requester:
- Task/issue:
- Branch:

## Blocker
- Approved requirement being implemented:
- Exact blocking evidence:
- Why the current approved approach cannot satisfy it:

## Requested change
- Scope/stack/tree/contract/schema/ownership item:
- Exact old value:
- Exact proposed value:

## Impact
- Files and owners affected:
- API/IoT consumers affected:
- Database/migration impact:
- Security/privacy impact:
- Test and demo impact:
- Schedule/merge-conflict impact:

## Alternatives considered
1.
2.

## Recommendation
- Smallest safe option:
- Rollback/fallback:

## Approval
- PARTH AJMERA decision: PENDING
- Required reviewers:
- ADR identifier:
- Plan/contract version after approval:
- Team notification completed: NO
~~~

Approval is valid only after:

1. PARTH AJMERA explicitly approves;
2. affected owners review;
3. ADR records context/decision/consequences;
4. authoritative document/contract version updates;
5. dependent issues/tests update;
6. team notification occurs.

Until all six are complete, the current plan remains binding.

## 18. Task prompt template for Freebuff/Cursor/other AI

PARTH AJMERA or the member should fill every placeholder and paste this prompt with root `AGENTS.md`:

~~~markdown
Read and obey root AGENTS.md completely. It is the frozen source of agent instructions.

TASK
- Task ID: <M#-OWNER-## or GitHub issue>
- Human owner: <name>
- Required branch: <exact team/... branch>
- Objective: <one concrete outcome>

SCOPE
- Allowed files/paths:
  - <exact path>
- Forbidden files/paths:
  - <exact path>
- Contract version: 1.0
- Canonical fixture(s): <path>
- Dependencies already available: <issue/commit/API>

ACCEPTANCE CRITERIA
1. Given <state>, when <action>, then <observable result>.
2.
3.

REQUIRED CHECKS
- <exact command>
- <exact command>
- <manual/hardware scenario>

CONSTRAINTS
- Do not change scope, stack, folder structure, contracts, schema, ownership, or milestones.
- Do not edit outside allowed paths.
- Do not add dependencies.
- Preserve all unrelated human changes.
- If blocked by the frozen design, stop and return a CHANGE_REQUEST. Do not improvise.
- Do not commit, push, merge, deploy, migrate the shared database, or flash hardware.

First respond with TASK_ACK from AGENTS.md. Then implement the smallest compliant change. Finish with IMPLEMENTATION_REPORT.
~~~

Do not tell an agent “build the frontend,” “fix everything,” “complete the backend,” or “make it hackathon winning.” Give one bounded issue, exact paths, and measurable acceptance criteria.

## 19. Quick owner-specific reminders

### PARTH AJMERA

- Keep the board, contracts, decision log, and review queue current.
- Review at integration windows; do not become the feature-code bottleneck.
- Reject scope/tree drift even when generated code looks impressive.
- Protect the golden demo and choose fallbacks before risky last-minute fixes.

### YASHVARDHAN DOBHAL

- Confirm Cursor is on `team/yashvardhan-dobhal-web-ui` before every task.
- Build against typed API fixtures/client; never invent backend fields.
- Do not edit API routes, database code, contracts, or dependencies.

### AASHU JOSHI

- Keep HTTP routes thin and domain logic testable.
- Use database transactions and unique constraints for exactly-once effects.
- Never make a penalty from raw rules output.

### KRISHNA PANWAR

- Report actual available hardware and calibration truthfully.
- Stable IDs and retry behavior are as important as sensor reads.
- Never place cloud credentials or reward policy in firmware.

### ADITYA SILSWAL

- Commit to SQLite before `202`.
- Edge owns delivery reliability, not final municipal truth.
- Test WAN loss, process restart, duplicate, conflict, and auth failure.

### BHUMIKA SINGH RAWAT

- Own migrations/RLS/seed and keep CI green without weakening it.
- Verify clean-room setup and the complete real-hardware path.
- Do not patch other owners' feature code without reassignment.

## 20. Teammate-plan enhancements now frozen

- Three role experiences remain inside `apps/web`; “developer app” means the admin IoT-control screen, not a new app.
- Opaque QR is allowed; Aadhaar and Google municipal identity integrations are not claimed in v1.
- Dual wet/dry compartments with IR1/IR2 and one ultrasonic sensor each are conditional on H0 inventory/calibration and degrade honestly when absent.
- Optional ML begins only after G4. Tooling lives under `scripts/demo/ml/**`; observations are `MANUAL_COLAB` or `RECORDED_ML`, admin-imported, and governed by `21_ML_INTEGRATION.md`.
- Its only additive product path is `POST /api/v1/admin/collections/{id}/ml-observations` plus `ml_observations` and an admin evidence card. PARTH AJMERA owns the notebook, AASHU JOSHI the API, BHUMIKA SINGH RAWAT the migration/tests, and YASHVARDHAN DOBHAL the card—each on their existing branch and owned paths.
- ML can never change a collection decision, EcoCredit, review outcome, penalty, bill, or dispute. Automatic negative points are forbidden; use `22_WASTE_DECISION_POINTS.md`.
- Seeded `rules-1.0.0` awards +50 only for `ACCEPTED`/`REVIEW_ACCEPTED`, uses dry moisture <=35 and wet moisture >=65 after calibration, and flags every missing/degraded/mismatch/reject/safety-hold case. Threshold changes require a new immutable ruleset.
- No contributor or AI may turn the optional scene into a new service, direct device/cloud path, or release dependency.

## 21. Final rule

When uncertain, preserve the approved working vertical slice. Stop, show evidence, and ask through `CHANGE_REQUEST`. Never solve uncertainty by changing the architecture, folder structure, contract, schema, or plan.
