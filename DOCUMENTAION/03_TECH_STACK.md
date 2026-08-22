> **PLAN & STRUCTURE LOCK — v1.0:** This approved scope, stack, repository structure, contracts, ownership map, and delivery plan must not be changed by contributors or AI agents. Work only inside the assigned paths. If a change is necessary, stop and submit a `CHANGE_REQUEST`; only PARTH AJMERA may approve it, followed by an ADR and team notification.

# Technology Stack and Version Policy

## Decision summary

SGV 2.0 uses one TypeScript web/cloud application, one small Python edge service, and one ESP32 firmware target. This is the minimum architecture that supports the real hardware requirement, offline operation, parallel ownership, and a cloud-backed demonstration without building unnecessary microservices.

## Frozen stack

| Layer | Approved choice | Why it fits this team |
|---|---|---|
| Runtime | Node.js 24 LTS, npm workspaces | One locked JavaScript toolchain for web, contracts, and rules |
| Web framework | Current stable Next.js App Router, React, strict TypeScript | Citizen, operator, admin, and server route handlers in one deployable app |
| UI | Tailwind CSS + shadcn/ui source components | Fast accessible dashboard construction without a black-box component runtime |
| Maps | Leaflet + OpenStreetMap-compatible tiles | No mandatory commercial key for the prototype |
| Cloud data | Supabase managed PostgreSQL | Relational integrity, migrations, Auth, RLS, and realtime in one service |
| Authentication | Supabase Auth with cookie-based SSR sessions | Avoids custom password/token implementation; authorization remains server/RLS enforced |
| Realtime | Supabase Realtime; 5-second polling fallback | Live fleet/demo updates with a deterministic fallback |
| Cloud API | Next.js Route Handlers under `/api/v1` | Same types and deployment as the web app; no separate cloud backend to operate |
| Rules | Pure TypeScript package in `packages/rules-engine` | Deterministic, explainable, testable, and dependency-free business decisions |
| Contracts | OpenAPI 3.1 + JSON Schema 2020-12 in `packages/contracts` | One contract for firmware fixtures, Python validation, TypeScript types, and tests |
| Edge runtime | Python 3.12 + FastAPI + Pydantic + Uvicorn | Clear payload validation, async HTTP, automatic OpenAPI, quick hardware integration |
| Edge persistence | SQLite in WAL mode | Zero-setup durable queue on the demo laptop; easy inspection and recovery |
| Device transport | LAN HTTP/1.1 JSON with timeouts and stable IDs | Easier to build and debug than MQTT for the one-vehicle MVP |
| Firmware | ESP32 + PlatformIO + Arduino framework + ArduinoJson | Broad sensor-library support and reproducible command-line/CI builds |
| Web tests | Vitest + Testing Library + Playwright | Unit, component, and critical journey coverage |
| Edge tests | Pytest + Ruff | Fast contract, queue, retry, and API verification |
| Firmware checks | PlatformIO compile + Unity/native fixtures where feasible | Reproducible firmware and payload checks before flashing |
| Hosting | Vercel for `apps/web`; Supabase for data | Preview deployments and low operational burden |
| Edge deployment | Team laptop for MVP; Raspberry Pi-compatible later | Matches the local-server requirement without extra hardware dependency |
| CI | GitHub Actions | Enforces all merge gates in the shared repository |
| Optional ML evidence | License-approved, version-pinned YOLO-compatible Colab notebook under `scripts/demo/ml/**` | Judge-visible experiment without another production service or decision authority |

## Version rule

1. At H0, PARTH AJMERA/BHUMIKA SINGH RAWAT scaffold with supported stable/LTS releases and commit all lockfiles.
2. Exact versions in `package-lock.json`, the Python lock file, and `platformio.ini` are authoritative.
3. Do not use unpinned `latest`, broad `>=`, or floating firmware libraries after the baseline commit.
4. No dependency may be added or upgraded inside a feature PR without PARTH AJMERA's approval and BHUMIKA SINGH RAWAT's CI evidence.
5. Major upgrades are out of scope during the hackathon.
6. If the installed environment cannot run Node 24 LTS, submit a change request; do not silently switch runtimes.

The official Next.js installer currently recommends TypeScript, Tailwind, ESLint, App Router, and Turbopack defaults and requires Node 20.9 or newer; this project standardizes on the newer LTS line and pins it. See [Next.js installation](https://nextjs.org/docs/app/getting-started/installation). Supabase's official Next.js quickstart uses cookie-based auth and emphasizes RLS for exposed data; see [Supabase Next.js quickstart](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs) and [server-side auth](https://supabase.com/docs/guides/auth/server-side).

## Dependency boundaries

```text
apps/web ───────────────> packages/contracts
apps/web ───────────────> packages/rules-engine
packages/rules-engine ──> packages/contracts
services/edge-gateway ──> exported JSON Schema fixtures only
firmware/esp32 ─────────> compact contract constants + JSON examples only
tests ──────────────────> every runtime surface
```

- `packages/rules-engine` may not import database, HTTP, React, Supabase, or edge code.
- Firmware and edge gateway do not call Supabase directly.
- Browser code never receives a service-role key or device credential.
- Database writes that affect credits, penalties, or idempotency occur through server-controlled transactions/RPCs.

## Contract generation policy

- Canonical schemas live in `packages/contracts/schemas/`.
- Canonical API descriptions live in `packages/contracts/openapi/`.
- Generated TypeScript types live in `packages/contracts/src/generated/`; never hand-edit them.
- Pydantic and firmware representations must pass the shared golden-fixture tests.
- Contract v1 is additive-only. Removing, renaming, or changing the meaning/type of a field requires v2 and approved change control.

## Transport decision

HTTP JSON is the MVP because every team member can inspect it with logs or `curl`, it works over a phone hotspot/LAN, and FastAPI validates it directly. MQTT is a post-MVP adapter, not a parallel implementation. Building both in the hackathon would double failure modes without improving the judged vertical slice.

The edge gateway acts as the HTTP server; the ESP32 is normally an HTTP client. Espressif documents lightweight HTTP/WebSocket capability in ESP-IDF, but the MVP avoids exposing the device itself as the system of record. See the [ESP-IDF HTTP documentation](https://docs.espressif.com/projects/esp-idf/en/stable/esp32/api-reference/protocols/esp_http_server.html).

## Rejected alternatives

| Alternative | Why rejected for MVP |
|---|---|
| Separate React apps for citizen/admin/operator | Duplicate routing, auth, deployment, and UI work |
| Full FastAPI cloud backend plus Next.js frontend | Adds a second cloud deployment and cross-language contract risk |
| Direct ESP32-to-Supabase writes | Exposes credentials, bypasses validation, and weakens offline/idempotency control |
| MQTT as the only transport | Requires broker setup and team knowledge before the core story works |
| Firebase/NoSQL | Ledger, review, billing, and audit relationships benefit from SQL constraints/transactions |
| Custom JWT authentication | Avoidable security and schedule risk |
| Automatic ML decision authority | No validated training data; conflicts with explainable human review. A post-core, provenance-labelled observation demo is allowed by `21_ML_INTEGRATION.md`. |
| Real UPI payouts/municipal billing | Compliance, credentials, and external approval are outside the prototype |
| Kubernetes/microservices | Operational complexity with no hackathon benefit |

## Quality configuration

- TypeScript: `strict: true`; no unexplained `any`; server/browser modules separated.
- Python: typed public functions, Pydantic boundary validation, Ruff format/lint, Pytest.
- Firmware: warnings visible, secrets excluded, deterministic payload fields, serial logs tagged by state.
- SQL: forward-only migrations, explicit constraints/indexes, RLS enabled before seed accounts are used.
- Accessibility: keyboard navigation, visible focus, text labels in addition to color, responsive citizen pages.
- Observability: structured logs with `requestId`, `eventId`, `deviceCode`, `actorId` where applicable; never log tokens or full PII.

## Approval gate for a new technology

A proposal must show: the blocked requirement, why the approved stack cannot meet it, installation/deployment cost, security impact, owner, removal plan, and passing proof-of-concept. Until PARTH AJMERA approves it and records an ADR, it is forbidden.
