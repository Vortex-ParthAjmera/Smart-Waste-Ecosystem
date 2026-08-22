> **PLAN & STRUCTURE LOCK — v1.0:** This approved scope, stack, repository structure, contracts, ownership map, and delivery plan must not be changed by contributors or AI agents. Work only inside the assigned paths. If a change is necessary, stop and submit a `CHANGE_REQUEST`; only PARTH AJMERA may approve it, followed by an ADR and team notification.

# SGV 2.0 Repository Structure and Module Boundaries

Status: Approved and frozen  
Structure version: 1.0  
Repository: `sgv-2-smart-waste-ecosystem`  
Applies to: all human contributors, Freebuff, Cursor, and every other coding agent

## 1. Purpose

This document fixes where every part of SGV 2.0 belongs, who owns it, and which dependencies are permitted. The workspace currently contains planning material but no application scaffold, so the first implementation commit must create this structure exactly.

The structure exists to let six first-time collaborators work in parallel without inventing new folders, duplicating business logic, changing interfaces, or producing avoidable merge conflicts.

## 2. Frozen top-level tree

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
│       │   │   └── api/
│       │   │       └── v1/
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
│   │   └── ml/
│   └── verification/
├── DOCUMENTAION/
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
~~~

No additional top-level folder may be created. No listed folder may be moved, renamed, or deleted. Empty folders may initially contain a `.gitkeep` until their scaffold is implemented.

## 3. Top-level responsibilities

| Path | Purpose | Primary owner | Backup/reviewer |
|---|---|---|---|
| `apps/web/src/app/(citizen)/` | Citizen profile, collection history, credits, bills, disputes, privacy-safe tracker | YASHVARDHAN DOBHAL | PARTH AJMERA |
| `apps/web/src/app/(operator)/` | Operator collection workflow and online fleet/device status | YASHVARDHAN DOBHAL | PARTH AJMERA |
| `apps/web/src/app/(admin)/` | Municipal dashboard, verification, fleet, rules, ledgers, analytics | YASHVARDHAN DOBHAL | PARTH AJMERA |
| `apps/web/src/components/` | Reusable accessible UI components | YASHVARDHAN DOBHAL | PARTH AJMERA |
| `apps/web/src/lib/api-client/` | Typed browser client for approved `/api/v1` endpoints | YASHVARDHAN DOBHAL | AASHU JOSHI |
| `apps/web/src/app/api/v1/` | Cloud HTTP boundaries, authentication, validation, orchestration | AASHU JOSHI | PARTH AJMERA |
| `apps/web/src/lib/domain/` | Cloud use cases and transaction orchestration | AASHU JOSHI | PARTH AJMERA |
| `apps/web/src/lib/auth/` | Server-side role/session checks | AASHU JOSHI | BHUMIKA SINGH RAWAT |
| `apps/web/src/lib/supabase/` | Scoped server/client database adapters | AASHU JOSHI | BHUMIKA SINGH RAWAT |
| `packages/rules-engine/` | Pure, deterministic, versioned compliance/reward rules | AASHU JOSHI | PARTH AJMERA |
| `services/edge-gateway/` | FastAPI LAN ingest, SQLite outbox, retry/sync, health/status | ADITYA SILSWAL | PARTH AJMERA |
| `firmware/esp32/` | Real ESP32 drivers, normalization, IDs, signing, LAN client | KRISHNA PANWAR | ADITYA SILSWAL |
| `supabase/` | Forward-only migrations, RLS, SQL tests, deterministic seed | BHUMIKA SINGH RAWAT | PARTH AJMERA |
| `tests/` | Cross-module contracts, integration, E2E, and hardware-in-loop evidence | BHUMIKA SINGH RAWAT | Relevant module owner |
| `.github/workflows/` | Required CI quality gates | BHUMIKA SINGH RAWAT | PARTH AJMERA |
| `DOCUMENTAION/` | Approved product, architecture, delivery, and operations documents | PARTH AJMERA | BHUMIKA SINGH RAWAT |
| `packages/contracts/` | Versioned OpenAPI/JSON Schema and canonical fixtures | PARTH AJMERA approves | AASHU JOSHI, ADITYA SILSWAL, and KRISHNA PANWAR review |
| `scripts/` | Repeatable setup, demo seed, and verification commands only | BHUMIKA SINGH RAWAT | PARTH AJMERA |
| `scripts/demo/ml/` | Optional, non-blocking manual/recorded ML presentation artifacts only | PARTH AJMERA | AASHU JOSHI and BHUMIKA SINGH RAWAT |
| Root configuration files | Repository-wide dependency, environment, and agent controls | PARTH AJMERA approves | Affected owners review |

Ownership means final responsibility for the path. It does not allow an owner to change a frozen contract, architecture decision, or another module's assumptions.

## 4. Member edit boundaries

### PARTH AJMERA — product, governance, integration

Normal edit paths:

- `DOCUMENTAION/**`
- `README.md`
- `AGENTS.md`
- `.github/CODEOWNERS`
- `.github/PULL_REQUEST_TEMPLATE.md`
- approved root configuration changes
- approved changes in `packages/contracts/**`
- optional gated demo artifacts under `scripts/demo/ml/**`

PARTH AJMERA does not implement feature code on `integration` or `main`. Any optional glue code must be assigned as a task on `team/parth-ajmera-governance` with explicit allowed paths.

### YASHVARDHAN DOBHAL — web user experience

Normal edit paths:

- `apps/web/src/app/(citizen)/**`
- `apps/web/src/app/(operator)/**`
- `apps/web/src/app/(admin)/**`
- `apps/web/src/components/**`
- `apps/web/src/lib/api-client/**`
- `apps/web/src/styles/**`
- static assets under `apps/web/public/**`

YASHVARDHAN DOBHAL must not create API routes, change database queries, edit migrations, or invent response shapes in UI code.

### AASHU JOSHI — cloud API and rules

Normal edit paths:

- `apps/web/src/app/api/v1/**`
- `apps/web/src/lib/auth/**`
- `apps/web/src/lib/domain/**`
- `apps/web/src/lib/supabase/**`
- `apps/web/src/lib/validation/**`
- `packages/rules-engine/**`

AASHU JOSHI must not change table structure directly, edit UI-owned routes/components, or change the edge/device contract without approval.

### KRISHNA PANWAR — hardware and ESP32 firmware

Normal edit paths:

- `firmware/esp32/**`
- hardware-in-loop fixtures explicitly assigned under `tests/hardware-in-loop/**`

KRISHNA PANWAR must not embed cloud credentials, citizen data, reward rules, or penalty decisions in firmware.

### ADITYA SILSWAL — local edge gateway

Normal edit paths:

- `services/edge-gateway/**`
- gateway fixtures explicitly assigned under `tests/fixtures/**`

ADITYA SILSWAL must not connect the gateway directly to Supabase, decide rewards/penalties, or change firmware/cloud payloads independently.

### BHUMIKA SINGH RAWAT — data, quality, and release

Normal edit paths:

- `supabase/**`
- `tests/**`
- `.github/workflows/**`
- QA and release evidence assigned under `scripts/verification/**`

BHUMIKA SINGH RAWAT must not rewrite already-applied migrations, weaken RLS, disable checks, or fix failing product code outside an explicitly reassigned task.

## 5. Dependency rules

Allowed dependency direction:

~~~text
UI, HTTP routes, firmware drivers
        ↓
application use cases
        ↓
domain rules and versioned contract types
        ↓
database, network, hardware, and framework adapters
~~~

Mandatory boundaries:

1. `packages/rules-engine` is pure. It imports no React, Next.js, Supabase, FastAPI, SQLite, or hardware code.
2. UI components call the typed API client, never Supabase service-role operations.
3. API routes validate input before calling domain use cases.
4. Cloud use cases access Postgres only through `apps/web/src/lib/supabase`.
5. The edge gateway accesses its own SQLite database and approved cloud APIs only. It never accesses Supabase directly.
6. Firmware talks only to the local edge contract. It never calls Vercel or Supabase.
7. Shared payloads and fixtures originate in `packages/contracts`. Local copies must be generated or verified against them.
8. Cross-module tests live in root `tests`; module unit tests stay with the module.

## 6. File-placement rules

| New artifact | Required location |
|---|---|
| Citizen page or layout | `apps/web/src/app/(citizen)/` |
| Operator page or layout | `apps/web/src/app/(operator)/` |
| Admin page or layout | `apps/web/src/app/(admin)/` |
| Shared visual component | `apps/web/src/components/` |
| Browser API helper | `apps/web/src/lib/api-client/` |
| Cloud endpoint | `apps/web/src/app/api/v1/` |
| Cloud business use case | `apps/web/src/lib/domain/` |
| Compliance/reward calculation | `packages/rules-engine/` |
| FastAPI route | `services/edge-gateway/app/api/` |
| SQLite repository/outbox | `services/edge-gateway/app/persistence/` |
| Edge-to-cloud sync logic | `services/edge-gateway/app/services/` |
| ESP32 sensor driver | `firmware/esp32/src/sensors/` plus header |
| ESP32 network/signing logic | `firmware/esp32/src/network/` plus header |
| API or IoT schema | `packages/contracts/` after approval |
| Database change | new forward-only file in `supabase/migrations/` |
| Seed/demo data | `supabase/seed.sql` or `scripts/demo/` |
| Optional gated ML notebook, runner, manifest, or recorded result | `scripts/demo/ml/` |
| Cross-service test | matching folder under `tests/` |
| GitHub automation | `.github/workflows/` |
| Approved project document | `DOCUMENTAION/` |

Do not create generic dumping grounds such as `utils/`, `helpers/`, `misc/`, `common/`, `temp/`, or a second `src/` at repository root.

### Optional ML sidecar boundary

`scripts/demo/ml/**` is the only approved ML tool path and is not a new product service. PARTH AJMERA may start it only after the G4 core vertical is green; AASHU JOSHI and BHUMIKA SINGH RAWAT must both review it. It may produce advisory class/category/confidence output using synthetic input, with the source persistently labeled `MANUAL_COLAB` or `RECORDED_ML`. Its only product integration is the optional observation table/API/UI frozen in `05_DATA_SCHEMA.md`, `06_API_IOT_CONTRACT.md`, and `21_ML_INTEGRATION.md`; it must not change device sync v1, deterministic rules, collection state, EcoCredits, review outcomes, or penalty behavior. A timeout, low-confidence result, licensing/privacy concern, or unavailable runtime means use the deterministic `RECORDED_ML` artifact or skip the scene; the core demo never waits.

Before approval, record a compatible model/license decision and verify that no PII, credential, token, private Drive mount, or secret appears in the notebook, output, or artifact. For Ultralytics, check the official [licensing options](https://www.ultralytics.com/license); unresolved AGPL-3.0/Enterprise compatibility is `NO-GO`. Colab is optional compute with non-guaranteed availability, so follow the [Google Colab FAQ](https://research.google.com/colaboratory/faq.html) and keep the recorded fallback deterministic.

## 7. Naming and source conventions

- React components and exported TypeScript types: `PascalCase`.
- TypeScript functions and variables: `camelCase`.
- TypeScript non-component filenames: `kebab-case`.
- Python modules/functions: `snake_case`; classes: `PascalCase`.
- C++ types: `PascalCase`; functions/variables: `camelCase`; constants: `UPPER_SNAKE_CASE`.
- Database tables/columns: `snake_case`.
- API paths: lowercase `kebab-case` only where multiple words are necessary.
- Timestamps: UTC RFC 3339 at boundaries; `timestamptz` in Postgres.
- Money: integer paise, never floating point.
- Weight: decimal kilograms.
- IDs: stable, globally unique, and never derived from mutable display names.

## 8. Repository-wide controlled files

The following files have unusually high conflict or security impact and require PARTH AJMERA's approval before modification:

- root `package.json` and `package-lock.json`;
- `apps/web/package.json`;
- `packages/contracts/**`;
- `.env.example` and `.gitignore`;
- `.github/CODEOWNERS` and required CI workflows;
- Supabase RLS policies and destructive migrations;
- `AGENTS.md` and the locked documents;
- any file that changes the repository tree.

Dependency installation is centralized during the foundation milestone. An agent must not add a package merely to avoid implementing a small function.

## 9. Initial scaffold acceptance checklist

The repository structure is ready only when:

- [ ] every top-level path in the frozen tree exists;
- [ ] no unapproved top-level path exists;
- [ ] root `AGENTS.md` matches the approved copy in `DOCUMENTAION/AGENTS.md`;
- [ ] active `.gitignore` and `.env.example` exist at repository root;
- [ ] `.github/CODEOWNERS` contains real GitHub handles;
- [ ] root scripts provide web lint, typecheck, test, and build commands;
- [ ] FastAPI has a passing `/healthz` test;
- [ ] PlatformIO compiles a minimal ESP32 firmware target;
- [ ] Supabase can reset from migrations and deterministic seed;
- [ ] canonical v1 payload fixtures validate in firmware, edge, and cloud checks;
- [ ] CI runs the applicable module checks on a pull request.

## 10. Structure change control

If an assigned task genuinely cannot fit this structure, do not create an alternative path. Submit:

~~~text
CHANGE_REQUEST
Requester:
Task/issue:
Blocked requirement:
Current approved path:
Requested structural change:
Why the approved structure cannot satisfy it:
Files/modules affected:
Contract/schema/security impact:
Alternatives considered:
Schedule and merge-conflict impact:
~~~

Only PARTH AJMERA may approve the request. Approval is incomplete until an ADR is added, this document receives a version update, affected owners are notified, and dependent tasks are updated.
