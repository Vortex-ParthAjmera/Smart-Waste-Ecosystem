> **PLAN & STRUCTURE LOCK — v2.0:** This approved scope, stack, repository structure, contracts, ownership map, truth-tier model, and delivery plan must not be changed by contributors or AI agents. Work only inside assigned paths. If a change is necessary, stop and submit a `CHANGE_REQUEST`; only PARTH AJMERA may approve it, followed by an ADR, contract/document updates, and team notification.

# Repository Structure and Module Boundaries

Status: approved and frozen
Structure version: 2.0
Repository: `Vortex-ParthAjmera/Smart-Waste-Ecosystem`
Applies to: every contributor, Freebuff, Cursor, and other coding agent

## 1. Purpose

This tree lets six contributors implement firmware, edge/ML, cloud rules/API, web roles, schema/quality, and governance in parallel without inventing competing folders or contracts. The final Build Doc v4 features are incorporated without creating three frontend deployments or a top-level ML application.

No contributor or coding agent may rename, move, add, or delete a top-level path. A necessary change requires the approved process in `00_READ_ME_FIRST.md`.

## 2. Frozen top-level tree

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
│       │   │   └── api/
│       │   │       └── v1/
│       │   ├── components/
│       │   ├── fixtures/
│       │   │   └── tier2-preview/
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
│       ├── models/
│       │   └── README.md
│       ├── tests/
│       ├── pyproject.toml
│       └── README.md
├── firmware/
│   └── esp32/
│       ├── include/
│       │   ├── config/
│       │   ├── contracts/
│       │   ├── network/
│       │   └── sensors/
│       ├── src/
│       │   ├── config/
│       │   ├── network/
│       │   ├── sensors/
│       │   └── main.cpp
│       ├── test/
│       └── platformio.ini
├── packages/
│   ├── contracts/
│   │   ├── openapi/
│   │   ├── schemas/
│   │   ├── fixtures/
│   │   ├── src/
│   │   │   └── generated/
│   │   └── README.md
│   └── rules-engine/
│       ├── src/
│       ├── test/
│       ├── package.json
│       └── tsconfig.json
├── supabase/
│   ├── migrations/
│   ├── tests/
│   ├── config.toml
│   └── seed.sql
├── tests/
│   ├── contract/
│   ├── integration/
│   ├── e2e/
│   ├── hardware-in-loop/
│   └── fixtures/
├── scripts/
│   ├── setup/
│   ├── demo/
│   │   ├── ml/
│   │   │   ├── model-manifest.json
│   │   │   ├── class-map.json
│   │   │   └── README.md
│   │   ├── fixtures/
│   │   ├── reset/
│   │   └── seed/
│   └── verification/
├── DOCUMENTATION/
├── .github/
│   ├── ISSUE_TEMPLATE/
│   ├── workflows/
│   ├── CODEOWNERS
│   └── PULL_REQUEST_TEMPLATE.md
├── .env.example
├── .gitignore
├── AGENTS.md
├── README.md
├── package.json
└── package-lock.json
```

Rules:

- `services/edge-gateway/models/` contains documentation and ignored runtime artifacts; model binaries are committed only when license and size policy explicitly allow it.
- `scripts/demo/ml/model-manifest.json` and `class-map.json` are controlled contract-like files; weights hash and class order must match runtime.
- Tier 2 fixtures exist only under `apps/web/src/fixtures/tier2-preview/` and must never be imported by server routes/domain modules.
- Empty scaffold directories may temporarily contain `.gitkeep`.

## 3. Path responsibilities

| Path | Responsibility | Primary owner | Reviewer/backup |
|---|---|---|---|
| `apps/web/src/app/(citizen)/**` | citizen profile, QR, history, points, tier/badges, dispute | YASHVARDHAN DOBHAL | PARTH AJMERA |
| `apps/web/src/app/(municipal)/**` | QR scanner, active disposal, authorized review | YASHVARDHAN DOBHAL | PARTH AJMERA |
| `apps/web/src/app/(developer)/**` | technical health, telemetry, ML monitor, simulation UI | YASHVARDHAN DOBHAL | ADITYA SILSWAL |
| `apps/web/src/components/**`, `styles/**` | accessible shared UI | YASHVARDHAN DOBHAL | PARTH AJMERA |
| `apps/web/src/fixtures/tier2-preview/**` | permanently labelled static previews only | YASHVARDHAN DOBHAL | PARTH AJMERA |
| `apps/web/src/lib/api-client/**` | typed browser client for approved API | YASHVARDHAN DOBHAL | AASHU JOSHI |
| `apps/web/src/app/api/v1/**` | cloud HTTP boundaries and orchestration | AASHU JOSHI | PARTH AJMERA |
| `apps/web/src/lib/auth/**`, `validation/**` | server sessions, roles, boundary schemas | AASHU JOSHI | BHUMIKA SINGH RAWAT |
| `apps/web/src/lib/domain/**` | cloud use cases, transactions, review/ledger flow | AASHU JOSHI | PARTH AJMERA |
| `apps/web/src/lib/supabase/**` | scoped data adapters | AASHU JOSHI | BHUMIKA SINGH RAWAT |
| `packages/rules-engine/**` | pure deterministic `rules-2.0.0` | AASHU JOSHI | PARTH AJMERA |
| `services/edge-gateway/**` | LAN API, SQLite, event coordinator, capture/inference, sync, health | ADITYA SILSWAL | PARTH AJMERA |
| `firmware/esp32/**` | hardware drivers, calibration, debounce, heartbeat, signed client | KRISHNA PANWAR | ADITYA SILSWAL |
| `supabase/**` | lean Tier 1 schema, constraints, RLS, seed | BHUMIKA SINGH RAWAT | PARTH AJMERA |
| `tests/**` | cross-module contracts, HIL, integration, E2E evidence | BHUMIKA SINGH RAWAT | affected module owner |
| `.github/workflows/**` | CI gates | BHUMIKA SINGH RAWAT | PARTH AJMERA |
| `scripts/demo/ml/**` | model/class manifest and reproducible setup evidence | ADITYA SILSWAL | BHUMIKA SINGH RAWAT, PARTH AJMERA |
| `scripts/demo/fixtures/**` | guarded simulation fixtures | BHUMIKA SINGH RAWAT | AASHU JOSHI |
| `scripts/demo/reset/**`, `seed/**` | deterministic reset/seed procedures | BHUMIKA SINGH RAWAT | PARTH AJMERA |
| `DOCUMENTATION/**` | approved plans/contracts/reference | PARTH AJMERA | BHUMIKA SINGH RAWAT |
| `packages/contracts/**` | shared public/device contract authority | PARTH AJMERA approves | AASHU JOSHI, ADITYA SILSWAL, KRISHNA PANWAR review |
| root governance/config | repo-wide scripts, env shape, agent rules | PARTH AJMERA approves | affected owners |

Ownership permits implementation inside the path; it does not permit changing the plan, contract, tier, or another module's assumptions.

## 4. Member edit boundaries

### PARTH AJMERA — governance, contracts, integration, release

Normal paths:

- `DOCUMENTATION/**`
- root `README.md`, `AGENTS.md`
- `.github/CODEOWNERS`, PR/issue templates
- approved root configuration
- approved `packages/contracts/**` changes

Parth reviews cross-boundary contracts and merges. Feature code requires an explicitly assigned issue and allowed paths.

### YASHVARDHAN DOBHAL — all web role experiences

Normal paths:

- `apps/web/src/app/(auth)/**`
- `apps/web/src/app/(citizen)/**`
- `apps/web/src/app/(municipal)/**`
- `apps/web/src/app/(developer)/**`
- `apps/web/src/components/**`
- `apps/web/src/lib/api-client/**`
- `apps/web/src/fixtures/tier2-preview/**`
- `apps/web/src/styles/**`, `apps/web/public/**`

Yashvardhan must verify Cursor is on `team/yashvardhan-dobhal-web-ui` before every prompt. UI code may not invent fields, query Supabase service operations directly, compute final points, or remove truth labels.

### AASHU JOSHI — cloud API and rules

Normal paths:

- `apps/web/src/app/api/v1/**`
- `apps/web/src/lib/auth/**`
- `apps/web/src/lib/domain/**`
- `apps/web/src/lib/supabase/**`
- `apps/web/src/lib/validation/**`
- `packages/rules-engine/**`

Aashu must not edit migrations directly, create preview APIs, change device/cloud payloads without approval, or allow client-supplied point/role/ownership values.

### KRISHNA PANWAR — ESP32 and physical prototype

Normal paths:

- `firmware/esp32/**`
- assigned HIL tests/fixtures

Krishna must not embed cloud credentials, citizen data, ML/business rules, or point logic. He coordinates event timing and payloads with Aditya but changes shared contracts only through Parth.

### ADITYA SILSWAL — edge gateway and local ML

Normal paths:

- `services/edge-gateway/**`
- `scripts/demo/ml/**`
- assigned edge/model fixtures

Aditya must not connect directly to Supabase, silently download/change models, invent unsupported labels, or own final point/review decisions.

### BHUMIKA SINGH RAWAT — data, QA, seed, CI

Normal paths:

- `supabase/**`
- `tests/**`
- `.github/workflows/**`
- `scripts/demo/fixtures/**`, `seed/**`, `reset/**`
- `scripts/verification/**`

Bhumika must not rewrite applied migrations, bypass RLS, weaken checks, or edit product code without reassignment.

## 5. Dependency rules

Mandatory rules:

1. UI calls `lib/api-client`, not privileged Supabase operations.
2. API routes validate input, authorize server-side, then call domain use cases.
3. Domain use cases access Postgres only through `lib/supabase` adapters/RPCs.
4. Rules engine is pure and receives normalized typed input.
5. Firmware calls only edge `/v1`; never Vercel/Supabase.
6. Edge accesses SQLite and approved Next.js cloud APIs; never Supabase directly.
7. Edge ML adapters receive a locally configured capture source and pinned manifest; no request-supplied arbitrary URL/path/model.
8. Shared external payloads originate from `packages/contracts` and golden fixtures.
9. Tier 2 fixtures are imported only by client presentation modules; lint/tests must block imports from `api`, `domain`, `supabase`, edge, firmware, rules, or migrations.
10. Cross-runtime tests live under root `tests`; module unit tests stay with their module.

## 6. File-placement rules

| Artifact | Required location |
|---|---|
| Citizen/municipal/developer page | matching route group under `apps/web/src/app/` |
| Tier 2 static data | `apps/web/src/fixtures/tier2-preview/` |
| Shared visual component | `apps/web/src/components/` |
| Cloud endpoint | `apps/web/src/app/api/v1/` |
| Cloud use case | `apps/web/src/lib/domain/` |
| Rules/points recommendation | `packages/rules-engine/` |
| JSON/OpenAPI contract | `packages/contracts/` after approval |
| FastAPI route | `services/edge-gateway/app/api/` |
| SQLite repository | `services/edge-gateway/app/persistence/` |
| Camera/model adapter | `services/edge-gateway/app/ml/` |
| Event/sync coordinator | `services/edge-gateway/app/services/` |
| Runtime model binary | ignored `services/edge-gateway/models/` |
| Model/class manifest | `scripts/demo/ml/` |
| ESP32 sensor/network code | matching `firmware/esp32/src/` and `include/` path |
| Database change | new forward-only `supabase/migrations/` file |
| Canonical seed | `supabase/seed.sql` plus repeatable script under `scripts/demo/seed/` if needed |
| Simulation fixture | `scripts/demo/fixtures/` |
| Cross-service verification | appropriate root `tests/` folder |
| Approved document | `DOCUMENTATION/` |

Do not create `utils/`, `helpers/`, `misc/`, `temp/`, `ml/`, `esp32/`, a second `backend/`, or separate top-level citizen/municipal/developer apps.

## 7. Source and naming conventions

- React components/types: `PascalCase`; functions/variables: `camelCase`.
- TypeScript non-component files/routes: lowercase `kebab-case`.
- Python modules/functions: `snake_case`; classes: `PascalCase`.
- C++ types: `PascalCase`; functions/variables: `camelCase`; constants: `UPPER_SNAKE_CASE`.
- Database tables/columns: `snake_case`.
- API JSON fields/query parameters: `camelCase`; enums: `UPPER_SNAKE_CASE`.
- Timestamps: UTC RFC 3339 at boundaries; `timestamptz` in Postgres.
- Points: signed integer; model score: decimal `0..1`; moisture/fill: decimal percent `0..100`.
- IDs: globally unique, stable, and never derived from mutable display names.
- Event source: `HARDWARE`, `RECORDED_HARDWARE`, `SIMULATED`, or `SEEDED`.
- ML/evidence source: `LOCAL_LIVE`, `RECORDED_ML`, `SIMULATED`, or `SEEDED`.
- UI truth badge: `REAL`, `RECORDED`, `SIMULATED`, or `PREVIEW/SEEDED`; never reuse a misleading label.

## 8. Controlled files

Parth approval is required before modifying:

- root/app package manifests and lockfile;
- `packages/contracts/**` and `packages/rules-engine` public types/config;
- `.env.example`, `.gitignore`, `.github/CODEOWNERS`;
- RLS policies and any destructive/data-rewriting migration;
- model/class manifest and confidence/category mapping;
- root and documentation `AGENTS.md`;
- any file/tree change affecting ownership or top-level layout.

## 9. Scaffold acceptance checklist

- [ ] every frozen path exists and no unapproved top-level path exists;
- [ ] root `README.md` and `AGENTS.md` are byte-identical to `DOCUMENTATION/` copies;
- [ ] `.gitignore` excludes credentials, `.env*` secrets, SQLite runtime DB, camera artifacts, and unapproved model binaries;
- [ ] `.env.example` contains names/placeholders only;
- [ ] root scripts run web lint/typecheck/test/build and relevant Python/firmware/data checks;
- [ ] FastAPI `/healthz` and a durable SQLite ingest test pass;
- [ ] model manifest/class map parse and checksum verification has a deterministic test adapter;
- [ ] PlatformIO compiles and golden firmware payload matches the contract;
- [ ] Supabase resets from migrations/seed and RLS tests pass;
- [ ] Tier 2 import-boundary test prevents server/backend use;
- [ ] CI runs applicable checks on pull requests.

## 10. Structure change control

An agent must not improvise a path. Submit a `CHANGE_REQUEST` containing the blocked requirement, current path, proposed path, alternatives, tier/contract/schema/security impact, owners, migration/test impact, and merge risk. Only PARTH AJMERA can approve; approval requires an ADR and updates to this tree, `AGENTS.md`, CODEOWNERS, issues, and dependent documents before code moves.
