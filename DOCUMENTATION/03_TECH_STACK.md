> **PLAN & STRUCTURE LOCK — v2.0:** This approved scope, stack, repository structure, contracts, ownership map, truth-tier model, and delivery plan must not be changed by contributors or AI agents. Work only inside assigned paths. If a change is necessary, stop and submit a `CHANGE_REQUEST`; only PARTH AJMERA may approve it, followed by an ADR, contract/document updates, and team notification.

# Technology Stack and Version Policy

Status: frozen implementation baseline v2.0
Rule: use the smallest stack that delivers the real vertical slice; pin exact versions in lockfiles/manifests at scaffold time.

## 1. Frozen stack

| Concern | Approved technology | Purpose and boundary |
|---|---|---|
| Monorepo/runtime scripts | npm workspaces and root scripts | One dependency graph and repeatable team commands |
| Web application | Next.js App Router + React + strict TypeScript | One deployment with citizen, municipal, developer/IoT experiences and `/api/v1` |
| Styling/components | Tailwind CSS + shadcn/ui-compatible accessible primitives | Fast consistent UI without a second design system |
| Boundary validation | Zod | Strict cloud/browser input and environment validation |
| Cloud platform | Supabase Postgres, Auth, RLS, Realtime | Source of truth, managed sessions, authorization, live invalidation |
| Cloud hosting | Vercel | One Next.js deployment |
| Edge language/runtime | Python 3.12-compatible runtime | Local gateway and ML orchestration |
| Edge web/validation | FastAPI, Pydantic v2, Uvicorn | Versioned signed LAN endpoints, health, typed failures |
| Edge persistence | Python `sqlite3`, SQLite WAL, `synchronous=FULL` | Durable local custody and outbox before ACK |
| Camera capture | OpenCV-compatible local capture adapter | Bounded phone IP-camera/laptop-camera frame burst; configured URL/device only |
| Local inference | Pinned YOLOv8n-compatible model/runtime; Ultralytics only after license/provenance gate | Offline local object detection with frozen class map and manifest |
| Firmware | ESP32 DevKit, PlatformIO, Arduino framework, ArduinoJson-compatible bounded JSON | Sensors, debounce, heartbeat, IDs, signed LAN client |
| Shared contracts | JSON Schema + OpenAPI + golden JSON fixtures | One contract across firmware, Pydantic, Zod, SQL and tests |
| Decision engine | Dependency-free TypeScript package | Deterministic immutable `rules-2.0.0` |
| Web/unit tests | Vitest + React Testing Library | Rules, utilities, component behavior |
| Browser E2E | Playwright | Role journeys, labels, accessibility, fallback |
| Edge tests | Pytest + FastAPI test client/httpx | Validation, SQLite, capture/inference adapters, retry |
| Firmware tests | PlatformIO native/device tests + HIL scripts | Drivers, debounce, serialization, real prototype evidence |
| Python quality | Ruff + type checking chosen at scaffold | Consistent typed code |
| SQL/data quality | Forward-only Supabase migrations + SQL/RLS tests | Integrity and authorization evidence |

Maps/animations for Tier 2 are frontend-only fixtures/components. Do not add a map service, geofencing library, route backend, or paid API for the preview.

## 2. Version policy

Do not write floating version instructions such as “install latest.” At the G0 scaffold:

1. select versions compatible with the actual Node, Python, PlatformIO, browser, and laptop environment;
2. pin direct dependencies in `package.json`, `package-lock.json`, `pyproject.toml`/lock, `platformio.ini`, and the model manifest;
3. commit lockfiles and record Node/Python/PlatformIO versions;
4. install once on every contributor machine before parallel work;
5. freeze dependencies at H6; a later addition requires a task-specific reason, owner, security/license check, and PARTH AJMERA approval;
6. never upgrade during demo hardening unless it fixes a release-blocking defect and the full affected suite passes.

The model manifest additionally pins:

- model family and runtime version;
- weights filename and SHA-256;
- supported source URL/provenance and license decision;
- ordered label/class map and `WET`/`DRY`/`UNKNOWN` mapping;
- input size and confidence thresholds;
- actual demo-laptop p50/p95 capture/inference measurements;
- test-set identifier/hash.

Weights are downloaded during setup and excluded from Git when redistribution is not approved. A checksum mismatch is a hard runtime `FAILED` health state, never an automatic download during the demo.

## 3. Runtime isolation

```text
Browser
  -> Next.js typed /api/v1 client
  -> server-only domain/use cases
  -> Supabase scoped adapter

ESP32
  -> signed LAN /v1
  -> FastAPI validation + SQLite custody
  -> local camera/model adapters
  -> authenticated one-message cloud sync

Rules engine
  -> contract types only
```

- Browser code never receives Supabase service-role, gateway, device, camera, or model secrets.
- Firmware never imports cloud/database/business-rule concerns.
- Edge never uses Supabase directly; it calls the approved Next.js device API.
- Local inference is an edge adapter. It never has cloud credentials or direct database access.
- `packages/rules-engine` imports no React, Next.js, Supabase, FastAPI, SQLite, OpenCV, model runtime, or firmware code.

## 4. Contract generation policy

- Canonical JSON schemas: `packages/contracts/schemas/`.
- Canonical cloud/LAN OpenAPI: `packages/contracts/openapi/`.
- Golden examples/negative fixtures: `packages/contracts/fixtures/`.
- Generated TypeScript types: `packages/contracts/src/generated/`; never hand-edit.
- Pydantic models and compact firmware representations must pass parity fixtures.
- `/v1` and `/api/v1` remain additive-only during the hackathon. Removing/renaming/changing a field's meaning requires a new version and approved change request.

## 5. Transport decision

HTTP/JSON is frozen for the prototype:

```text
ESP32 --LAN HTTP/JSON + HMAC--> FastAPI edge
FastAPI edge --HTTPS + gateway HMAC/idempotency--> Next.js /api/v1
Next.js --server transaction--> Supabase
```

Why:

- inspectable with serial logs and `curl`;
- no broker setup for a six-person, 30-hour build;
- direct compatibility with Pydantic/Zod and golden fixtures;
- local persistence survives WAN failure;
- one message/one key has clear retry semantics.

MQTT is Tier 3. Do not build both transports.

## 6. Local ML decision

Live local inference is Tier 1, but its claims are narrow:

- use a pinned, pre-downloaded artifact on the actual team laptop;
- freeze an explicit supported-class allowlist;
- use `UNKNOWN` for unsupported, missing, multiple conflicting, or low-score observations;
- store metadata/provenance/hash, not raw frames by default;
- model score is not called calibrated probability;
- the model supplies evidence; `rules-2.0.0` returns `ACCEPTED`/`FLAGGED`;
- capture/model failure degrades safely and never blocks the already-durable event;
- `RECORDED_ML` is a disclosed fallback, not a live claim;
- if package/model/dataset license or redistribution is unclear, use only a reviewed compatible artifact or disable the live scene and report the gate honestly.

Do not assume a general pretrained model can emit `plastic_wrapper`, `food_waste`, or arbitrary waste classes. Demonstrate only tested labels/classes or an approved waste-specific model.

## 7. Authentication decision

Supabase Auth is the only auth provider in application code.

- Citizen target: phone OTP when an SMS provider, test number, callback, quota, and venue connectivity pass preflight.
- Municipal target: Google OAuth when redirect URIs, test account, cookies, and callbacks pass preflight.
- Developer: restricted fictional account with server-side role.
- Mandatory fallback: pre-created fictional Supabase accounts in separate browser profiles.

No custom JWT/password store, Aadhaar claim, or government identity integration is permitted.

## 8. Rejected alternatives

| Alternative | Reason rejected |
|---|---|
| Three Next.js apps/deployments | triples routing/auth/config/build and merge surface without improving the judged flow |
| Direct ESP32 -> Vercel/Supabase | breaks local-server requirement, offline custody, credential isolation, and durable ACK semantics |
| FastAPI as a second cloud backend | duplicates deployment, authorization, and contracts |
| Supabase Edge Functions for device ingress | creates a competing cloud boundary and does not replace the local outbox |
| MQTT for MVP | adds broker and dual-transport failure modes |
| Firebase/NoSQL | relational constraints and transactions fit events/review/ledger/audit |
| Automatic model authority | model/sensors are fallible; adverse decisions require review |
| Storing camera frames by default | unnecessary privacy/storage risk |
| Real payments/billing | credentials, policy, compliance, and external integration are out of scope |
| Kubernetes/microservices | operational overhead with no hackathon value |
| New backend for Tier 2 previews | violates the truth-tier rule |

## 9. Quality configuration

- TypeScript: `strict`, no unexplained `any`, no service secrets in client modules.
- Python: typed public functions, strict Pydantic boundaries, bounded I/O/timeouts, Ruff clean.
- Firmware: compiler warnings visible, bounded documents/buffers, nonblocking sensor schedule, redacted serial logs.
- SQL: forward-only migrations, constraints/indexes first, RLS enabled before role tests/seed UI.
- ML/camera: checksum verification, configured source allowlist, finite frame/inference timeouts, deterministic fake adapters in tests.
- Accessibility: keyboard, visible focus, semantic labels, contrast, text plus color, reduced-motion support.
- Observability: structured safe IDs/state/latency; never log QR values, tokens, camera credentials, raw frames, or citizen PII.

## 10. New-technology gate

A request for another dependency/service must identify the blocked Tier 1 requirement, why the frozen stack cannot satisfy it, exact package/version, installation and offline cost, security/privacy/license impact, owner, removal/fallback plan, and passing proof of concept. It remains forbidden until PARTH AJMERA approves a change request and ADR.
