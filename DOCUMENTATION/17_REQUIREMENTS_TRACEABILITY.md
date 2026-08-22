> **PLAN & STRUCTURE LOCK — v2.0:** This approved scope, stack, repository structure, contracts, ownership map, truth-tier model, and delivery plan must not be changed by contributors or AI agents. Work only inside assigned paths. If a change is necessary, stop and submit a `CHANGE_REQUEST`; only PARTH AJMERA may approve it, followed by an ADR, contract/document updates, and team notification.

# Requirements Traceability Matrix

Status: approved implementation baseline v2.0
Evidence owner: BHUMIKA SINGH RAWAT
Final acceptance: PARTH AJMERA

This matrix prevents “completed” claims without linked code, tests, and judge-visible evidence. Detailed requirement wording is authoritative in `01_PRODUCT_REQUIREMENTS.md`; interfaces remain authoritative in `05_DATA_SCHEMA.md` and `06_API_IOT_CONTRACT.md`.

## Truth-tier rule

- **Tier 1 — REAL:** implementation, schema/API where required, automated proof, and a live or honestly degraded demo are mandatory.
- **Tier 2 — PREVIEW:** frontend fixture only, permanently labelled `PREVIEW/SEEDED`; no database row, feature-specific table, endpoint, worker, or hidden live claim.
- **Tier 3 — ROADMAP:** documentation only; no implementation or imitation screen.

## Core requirement coverage

Every identifier below exists verbatim in `01_PRODUCT_REQUIREMENTS.md`. The detailed v4 table that follows expands the hardware, ML, simulation, seed, badge, and truth-tier rows.

| Requirement IDs | Truth tier | Owner(s) | Primary implementation path | Required proof | Demo evidence |
|---|---|---|---|---|---|
| `FR-AUTH-001`, `FR-AUTH-002`, `FR-AUTH-003` | Tier 1 — REAL | AASHU JOSHI, YASHVARDHAN DOBHAL, BHUMIKA SINGH RAWAT | Supabase Auth/RLS, server role guards, fallback-account setup | role/RLS matrix, provider preflight, separate-browser fallback, developer `403` | Three isolated role sessions and an authorized developer view |
| `FR-EDGE-001`, `FR-EDGE-002`, `FR-EDGE-003`, `FR-EDGE-004`, `FR-EDGE-005` | Tier 1 — REAL | ADITYA SILSWAL, AASHU JOSHI, BHUMIKA SINGH RAWAT | `services/edge-gateway/**`, `packages/contracts/**`, cloud sync handler | HMAC/schema fixtures, persistence-before-ACK, restart/late-ML recovery, replay/conflict/auth-block matrix | WAN off → durable queue → restart → one cloud outcome |
| `FR-RULE-001`, `FR-RULE-002` | Tier 1 — REAL | AASHU JOSHI, BHUMIKA SINGH RAWAT | `packages/rules-engine/**`, rules snapshot tests | exhaustive `rules-2.0.0` matrix and zero automatic negative rows | Accepted and flagged outcomes display reasons and rules version |
| `FR-LEDGER-001`, `FR-LEDGER-002` | Tier 1 — REAL | AASHU JOSHI, BHUMIKA SINGH RAWAT | ledger RPC/transaction, projections, dispute reversal | concurrent replay, ledger-sum reconciliation, verified-review constraint, compensating reversal | `+10` occurs once; reviewed negative and reversal remain auditable |
| `FR-REVIEW-001` | Tier 1 — REAL | AASHU JOSHI, YASHVARDHAN DOBHAL, BHUMIKA SINGH RAWAT | review schema/API/UI and audit log | RBAC, one-terminal-decision uniqueness, idempotency, evidence/version preservation | Flag closes as `REVIEW_ACCEPTED`, `REVIEW_NO_ACTION`, or `VERIFIED_VIOLATION` |
| `FR-UI-001`, `FR-UI-002`, `FR-UI-003` | Tier 1 — REAL | YASHVARDHAN DOBHAL with each service owner | one Next.js app with citizen, municipal, and developer route groups | three Playwright journeys plus role-denial, empty/error/stale states | Citizen QR/history; municipal scan/review; developer component health |
| `FR-LIVE-001` | Tier 1 — REAL | YASHVARDHAN DOBHAL, AASHU JOSHI, BHUMIKA SINGH RAWAT | authorized initial reads, Realtime invalidation, polling/refetch fallback | disconnect/reconnect, missed-event, cross-role and cross-household tests | UI updates live, then still converges when Realtime is disabled |

## Build Doc v4 feature traceability

| Requirement ID | Truth tier | Requirement summary | Owner(s) | Implementation paths | Required tests | Demo evidence |
|---|---|---|---|---|---|---|
| `FR-QR-001` | Tier 1 — REAL | Generate and display an opaque, rotatable citizen QR containing no PII. | AASHU JOSHI, YASHVARDHAN DOBHAL, BHUMIKA SINGH RAWAT | identity API, citizen QR UI, identifier schema/RLS | payload inspection, rotation/revocation, cross-household denial | Citizen opens their QR; presenter shows opaque payload |
| `FR-QR-002` | Tier 1 — REAL | Validate QR server-side with expiry/rotation, rate limiting, replay control, and active-session binding. | AASHU JOSHI, BHUMIKA SINGH RAWAT | `/api/v1` identity validation, identifier schema/RLS, audit/rate controls | expired, altered, replayed, rotated, cross-session, rate-limit, and role-denial cases | Valid QR starts one bound session; reused/expired QR fails safely |
| `FR-QR-003` | Tier 1 — REAL | Return only the minimum citizen/household information required for municipal collection. | YASHVARDHAN DOBHAL, AASHU JOSHI, BHUMIKA SINGH RAWAT | municipal scanner/lookup UI, response projection, RLS | response snapshot excludes phone, email, full address, balance, and unrelated history | Scan resolves the fictional citizen with a minimal safe summary |
| `FR-HW-001` | Tier 1 — REAL | Wet/dry selection and one independently debounced IR trigger per compartment handle duplicates and incomplete cycles safely. | KRISHNA PANWAR, ADITYA SILSWAL | `firmware/esp32/**`, edge fixtures | five triggers per compartment, bounce/duplicate suppression, cross-compartment and incomplete-cycle tests | Correct compartment trigger and one `eventId` appear live |
| `FR-HW-002` | Tier 1 — REAL | One ultrasonic per compartment reports calibrated/clamped fill telemetry and exposes invalid calibration explicitly; fill never classifies waste. | KRISHNA PANWAR, ADITYA SILSWAL | firmware sensor drivers, contracts, developer telemetry | empty/full calibration, clamp boundaries, invalid calibration, range/no-echo, sensor disconnect | Wet/dry fill readings and quality are visible and excluded from classification |
| `FR-HW-003` | Tier 1 — REAL | Dry-path moisture uses calibrated `<30`, `30–45`, and `>45` bands as supporting evidence, never as universal or standalone classification. | KRISHNA PANWAR, AASHU JOSHI, BHUMIKA SINGH RAWAT | firmware calibration, contracts, `rules-2.0.0`, test fixtures | exact 30/45 boundaries, wet-path not-applicable, degraded/missing, environmental-wetting matrix | High moisture plus dry ML evidence becomes flagged with `0` |
| `FR-HW-004` | Tier 1 — REAL | GPS and component heartbeat report explicit quality and never fabricate unavailable readings. | KRISHNA PANWAR, ADITYA SILSWAL | firmware, edge health, authorized telemetry | valid/no-fix/out-of-range/stale and sensor-health tests | Developer view shows live GPS or honest `MISSING/UNKNOWN` |
| `FR-ML-001` | Tier 1 — REAL | Selected-compartment IR triggers an event-correlated local phone/laptop frame burst without manual upload. | ADITYA SILSWAL, KRISHNA PANWAR | edge orchestration, local capture runner, contracts | event correlation, no-manual-upload, stale-frame rejection, camera timeout/restart | IR-triggered frame capture shows the same `eventId` |
| `FR-ML-002` | Tier 1 — REAL | Local offline inference uses pinned framework/model/class-map versions, pre-downloaded dependencies, verified weights hash, and `evidenceSource=LOCAL_LIVE`. | ADITYA SILSWAL, PARTH AJMERA, BHUMIKA SINGH RAWAT | local ML runtime, model manifest, verification scripts | WAN-off inference, hash mismatch rejection, supported-class/`UNKNOWN`, provenance-to-truth mapping | `LOCAL_LIVE` model/version/hash suffix and `REAL` truth badge displayed |
| `FR-ML-003` | Tier 1 — REAL | Only frozen supported labels map explicitly to `WET`/`DRY`; unsupported, no-object, or category-conflicting detections map to uncertainty. | ADITYA SILSWAL, AASHU JOSHI, BHUMIKA SINGH RAWAT | class map, contracts, rule fixtures | supported/unsupported/no-object/multiple-conflicting-object mapping tests | Friendly approved label or honest “Unknown/conflicting waste” shown |
| `FR-ML-004` | Tier 1 — REAL | Store/display model-score bands `<0.60 LOW`, `0.60–<0.85 MEDIUM`, and `>=0.85 HIGH`; never call score a guaranteed probability. | AASHU JOSHI, ADITYA SILSWAL, YASHVARDHAN DOBHAL | contracts, rules engine, UI mapper | exact 0.60/0.85 boundaries, non-finite/out-of-range, UI copy review | Friendly label and confidence band shown together |
| `FR-ML-005` | Tier 1 — REAL | Camera/model failure, low confidence, late output, hash mismatch, or privacy/license gate failure fails safe and creates no automatic negative ledger entry. | PARTH AJMERA, ADITYA SILSWAL, AASHU JOSHI, BHUMIKA SINGH RAWAT | edge failure paths, model/privacy manifest, rules/transaction tests, fallback evidence | forced failures, no-side-effect assertions, no-frame-retention/secret scan, `RECORDED_ML` drill | Event becomes visibly flagged/unavailable; fallback remains labelled |
| `FR-SIM-001` | Tier 1 — REAL control | Test-event injection is restricted to system-admin/developer role and gated by `DEMO_SIMULATION_ENABLED`. | AASHU JOSHI, YASHVARDHAN DOBHAL, BHUMIKA SINGH RAWAT | developer UI, `/api/v1` simulation route, server config | `401/403`, disabled flag, rate-limit and audit tests | Authorized developer injects one test event |
| `FR-SIM-002` | Tier 1 — REAL control | Simulated events use fixed fictional identities, stable idempotency, audit, rate limits, permanent `eventSource=SIMULATED`, `evidenceSource=SIMULATED` when supplied, and UI truth badge `SIMULATED`. | AASHU JOSHI, BHUMIKA SINGH RAWAT, YASHVARDHAN DOBHAL | simulation service, fixtures, schema, UI badges | same-key replay, changed-body conflict, rate limit, audit/provenance propagation, reset reconciliation | Repeated injection creates one canonical effect and remains `SIMULATED` end to end |
| `FR-SIM-003` | Tier 1 — REAL control | Simulation shares the post-ingress validation/decision/persistence/live path but never claims physical QR, IR, sensor, camera, or firmware evidence. | AASHU JOSHI, BHUMIKA SINGH RAWAT, YASHVARDHAN DOBHAL | simulation route/service, downstream integration, evidence counters/UI | trace comparison, real-hardware metric exclusion, no physical-source assertion | Apps update through the normal downstream flow with explicit disclosure |
| `FR-SEED-001` | Tier 1 — REAL data | Main fictional citizen has 15–25 reconciled historical `eventSource=SEEDED` events across one to two weeks. | BHUMIKA SINGH RAWAT | `supabase/seed.sql`, deterministic seed tests | fresh reset count/range, provenance, event-to-ledger reconciliation | Populated history is visibly `PREVIEW/SEEDED` before hardware demo |
| `FR-SEED-002` | Tier 1 — REAL data | Seed four to six fictional peers plus mixed accepted, flagged, reviewed, and environmental-wetting cases using permanent `SEEDED` provenance. | BHUMIKA SINGH RAWAT, AASHU JOSHI | `supabase/seed.sql`, cross-system fixtures | exact peer count, required scenario presence, state/rules/provenance consistency | Populated fictional comparison/history and every key decision case are ready |
| `FR-SEED-003` | Tier 1 — REAL data | Every visible seeded balance, result, badge, tier, provenance field, and `PREVIEW/SEEDED` badge reconciles to canonical rows; repeated reset is deterministic. | BHUMIKA SINGH RAWAT, AASHU JOSHI, YASHVARDHAN DOBHAL | seed/reset scripts, ledger/badge projections, UI fixtures | reconciliation totals, provenance/badge mapping, reset idempotency/hash, no manual DB edit | Before-demo manifest matches every visible value |
| `FR-BADGE-001` | Tier 1 — REAL | Ledger-derived tier is `BRONZE` at `0–499`, `SILVER` at `500–999`, `GOLD` at `1000–1999`, and `PLATINUM` at `>=2000`. | AASHU JOSHI, BHUMIKA SINGH RAWAT | tier projection/API and tests | exact 0/499/500/999/1000/1999/2000 boundaries, negative-after-review, projection reconciliation | Citizen tier matches their ledger balance |
| `FR-BADGE-002` | Tier 1 — REAL | At least one seeded badge is awarded through a deterministic rule and shown with reason/date. | BHUMIKA SINGH RAWAT, YASHVARDHAN DOBHAL | badge seed/schema/API/UI | qualification/non-qualification, duplicate award protection | Citizen opens one earned badge |
| `FR-BADGE-003` | Tier 1 — REAL | Leaderboard uses fictional opt-in aliases and an authorized aggregate while revealing no household identity. | YASHVARDHAN DOBHAL, AASHU JOSHI, BHUMIKA SINGH RAWAT | privacy-safe leaderboard API/query, citizen UI, seed | alias opt-in/privacy response snapshot, authorization, deterministic order/tie tests | Leaderboard shows fictional aliases only |
| `FR-TIER-001` | Tier 1 — REAL governance | Every planned feature has exactly one Tier 1/2/3 classification, and every displayed runtime datum maps stored provenance to an honest truth badge/freshness state. | PARTH AJMERA, YASHVARDHAN DOBHAL, BHUMIKA SINGH RAWAT | traceability matrix, shared provenance/truth mapper, live screens, E2E | no-unclassified-feature audit plus event-source, ML/evidence-source, truth-badge, freshness, and stale-state mapping tests | Judge can identify what is implemented and what evidence is live |
| `FR-TIER-002` | Tier 2 — PREVIEW | Map/ETA, multi-truck/zone, discount, full reports, and route stepper use approved frontend fixtures and permanent `PREVIEW/SEEDED` labels. | YASHVARDHAN DOBHAL, BHUMIKA SINGH RAWAT | approved UI fixture path and preview screens | network/database interception proves no feature API or persistence; label cannot be hidden/cropped | Presenter explicitly calls the surface a roadmap preview |
| `FR-TIER-003` | Tier 3 — ROADMAP | Tier 3 features have documentation only and no code or imitation UI. | PARTH AJMERA, all reviewers | documentation and repository policy | path/route/schema scan finds no Tier 3 implementation | Roadmap slide only |

## Non-functional coverage

| Requirement ID | Truth tier | Owner(s) | Required proof | Demo use |
|---|---|---|---|---|
| `NFR-REL-001` | Tier 1 | ADITYA SILSWAL, AASHU JOSHI, BHUMIKA SINGH RAWAT | three-event offline queue, gateway restart, exact drain and reconciliation | Disconnect/reconnect without duplicate effects |
| `NFR-PERF-001` | Tier 1 | ADITYA SILSWAL, BHUMIKA SINGH RAWAT | edge durable-ACK p50/p95 evidence; p95 at or below 250 ms on the demo LAN | Quote measured ACK latency only |
| `NFR-PERF-002` | Tier 1 | ADITYA SILSWAL, BHUMIKA SINGH RAWAT | actual demo-laptop capture/inference p50/p95 and frozen G1 threshold | Quote measured inference latency only |
| `NFR-SEC-001` | Tier 1 | BHUMIKA SINGH RAWAT, AASHU JOSHI, ADITYA SILSWAL | secret scan, bundle/log inspection, auth abuse, camera URL and simulation authorization tests | Security evidence on request |
| `NFR-PRIV-001` | Tier 1 | PARTH AJMERA, YASHVARDHAN DOBHAL, BHUMIKA SINGH RAWAT | fictional-data inventory and QR/frame/log/storage minimization audit | Opaque QR, fictional aliases, no retained raw frames by default |
| `NFR-A11Y-001` | Tier 1/2 UI | YASHVARDHAN DOBHAL, BHUMIKA SINGH RAWAT | automated scan plus keyboard, scanner, dialog, live-region, responsive and non-color checks | Critical flows remain keyboard-readable and responsive |
| `NFR-OBS-001` | Tier 1 | All, led by BHUMIKA SINGH RAWAT | forced-failure diagnosis, correlation/source fields, redaction and trace search | Developer health and one end-to-end `eventId` trace |
| `NFR-DEMO-001` | Tier 1 | PARTH AJMERA and all members | three consecutive post-freeze rehearsals plus reset and fallback scorecard | Repeatable truthful live demo and disclosed fallback |

## Per-task closure record

Every issue and PR must add or link this evidence record:

```md
Requirement IDs:
Truth tier: TIER_1_REAL | TIER_2_PREVIEW | TIER_3_ROADMAP
Implementation paths:
Contract/schema/rules/model versions:
Event sources exercised: HARDWARE | RECORDED_HARDWARE | SIMULATED | SEEDED | not applicable
ML/evidence sources exercised: LOCAL_LIVE | RECORDED_ML | SIMULATED | SEEDED | not applicable
UI truth badges verified: REAL | RECORDED | SIMULATED | PREVIEW/SEEDED | not applicable
Tests and exact commands:
Evidence links (screenshot/log/receipt/video):
Demo step affected:
Known limitation or fallback:
Reviewer sign-off:
```

## Release completeness rules

- Every Tier 1 row must have merged implementation and passing proof; “screen exists” is insufficient.
- Tier 2 may start only after the Tier 1 freeze gate and must have a permanent truth label plus a negative test proving no forbidden backend call.
- Tier 3 has no implementation. Any Tier 3 code is scope drift and blocks merge.
- A screenshot without a backend or hardware assertion does not prove Tier 1 integrity.
- A unit test without real boundary evidence does not prove hardware or local-ML integration.
- A simulated or recorded run never satisfies a real-hardware evidence row.
- Requirement ID, `eventId`, event source, ML/evidence source, UI truth badge, code path, test, and demo artifact must remain linkable from the PR.
