> **PLAN & STRUCTURE LOCK — v2.0:** This approved scope, stack, repository structure, contracts, ownership map, truth-tier model, and delivery plan must not be changed by contributors or AI agents. Work only inside assigned paths. If a change is necessary, stop and submit a `CHANGE_REQUEST`; only PARTH AJMERA may approve it, followed by an ADR, contract/document updates, and team notification.

# Smart Waste Ecosystem Documentation Control Centre

Status: approved implementation baseline v2.0
Project owner and final approver: PARTH AJMERA
Team: TLE Eliminators
Event: SIH 2026 university-level hackathon
Repository: `Vortex-ParthAjmera/Smart-Waste-Ecosystem`
Documentation folder: `DOCUMENTATION/`

## Start here

This folder is the implementation authority for the project. It reconciles the original SGV 2.0 planning pack, the earlier teammate workflow, and the final team source `Smart_Waste_Platform_Build_Doc_v4.md`.

The repository-root `AGENTS.md` is the only context file that should be given to Freebuff, Cursor, or another coding agent, together with one task prompt. Humans use the specialized documents in this folder when they need full reference detail.

## One-minute project definition

The Smart Waste Ecosystem links one physical disposal event to an auditable digital record: a citizen presents an opaque QR, chooses the wet or dry compartment, the ESP32 records compartment activity and sensors, and the laptop edge gateway durably saves the event. The gateway captures a phone/laptop camera frame, runs local waste-object inference, correlates the result to the same event, then synchronizes idempotently to the cloud when WAN connectivity exists. Citizens see history and points, municipal users scan and review events, and developer users see device, sensor, edge, and ML health.

The safety/fairness invariant is absolute: **automation may award a qualifying `+10`, but it may never create `-10` or `-20` until an authorized municipal reviewer records `VERIFIED_VIOLATION`.** Uncertain, conflicting, degraded, or environmentally wet evidence is flagged with zero immediate value effect.

## Final truth-tier rule

| Tier | Meaning | Engineering rule |
|---|---|---|
| Tier 1 — `REAL` | Judged functionality implemented end to end | Requires real code/data, tests, health states, and demo evidence |
| Tier 2 — `PREVIEW` | Polished UI using seeded/static fixtures | Permanently labelled; no table, API, worker, or hidden backend exists only for it |
| Tier 3 — `ROADMAP` | Not built in the hackathon | Documentation only; do not create a fake screen |

Tier 2 begins only after the Tier 1 feature-freeze gate passes. A synthetic test event is Tier 1 tooling but every related record and screen must say `SIMULATED`.

## Frozen Tier 1 core

- One real ESP32 prototype with wet/dry compartments, one IR trigger and one ultrasonic fill sensor per compartment, one dry-path moisture sensor, GPS/fix health, Wi-Fi, and component heartbeat.
- Opaque citizen QR; no PII inside the code. RFID may be added only as a non-blocking optional input.
- Signed LAN HTTP/JSON to FastAPI/Pydantic; SQLite WAL persistence before device acknowledgement.
- Edge-orchestrated local camera capture and local model inference with stable `eventId`, pinned model provenance, supported-class mapping, explicit confidence, and fail-safe timeout behavior.
- One authenticated, idempotent edge-to-cloud message; Next.js `/api/v1`; Supabase Auth/Postgres/RLS/Realtime.
- One Next.js deployment with citizen, municipal, and developer/IoT role experiences.
- Deterministic `rules-2.0.0`, append-only point ledger, human review, verified negative entries, and citizen dispute.
- 15–25 seeded historical events for the primary fictional citizen, four to six fictional comparison citizens, reconciled transactions, and one seeded badge/tier.
- Developer diagnostics and a guarded `SIMULATED` test-event fallback that joins after the physical-ingress boundary.
- Explicit offline, duplicate, restart, sensor, camera/model, auth, database, and Realtime recovery.

## Tier 2 and Tier 3 boundary

Tier 2 previews: animated truck map/ETA, multiple truck/zone cards, bill-discount preview, full report charts, and static GPS/geofence status journey. These live in frontend fixtures and have no dedicated schema or endpoint.

Tier 3 roadmap: dedicated edge-AI camera, autonomous physical sorting, MQTT fleet transport, route optimization/geofencing, scalable multi-zone persistence, real billing/UPI, government identity integration, native apps, and production-scale claims.

## Reconciled source decisions

| Source proposal | Final treatment |
|---|---|
| Direct ESP32 -> Supabase/cloud | Rejected; user-required FastAPI/SQLite local server remains mandatory |
| Three separate frontend apps | Adapted to three role experiences in one Next.js app/deployment |
| Live phone-camera YOLO | Adopted through the local edge gateway with model/class/provenance and fallback gates |
| Off-the-shelf model emits arbitrary waste labels | Rejected; only the frozen supported-class map may be claimed |
| IR1 starts and IR2 confirms one event | Rejected as incompatible with one IR per compartment; each compartment IR is independently debounced |
| Automatic `-10/-20` | Adapted: amounts exist only after a recorded human-verified violation |
| `+10`, confidence `60/85`, moisture `30/45` | Adopted in immutable `rules-2.0.0`, with calibrated inputs and review-safe handling |
| Phone OTP and Google login | Provider-enabled Tier 1 target with pre-created fictional Supabase accounts as mandatory demo fallback |
| Developer “Inject Test Event” | Adopted with system-admin authorization, idempotency, rate limit, demo-only configuration, audit, and `SIMULATED` labels |
| Tier 2 static screens | Adopted only with permanent preview labels and zero backend/schema scope |

The complete old-versus-new comparison is in `23_BUILD_DOC_V4_RECONCILIATION.md`.

## Authority order

When files appear to conflict, follow this order:

1. A written `APPROVED` change request from PARTH AJMERA.
2. `06_API_IOT_CONTRACT.md` and `05_DATA_SCHEMA.md` for machine, API, and persistence contracts.
3. `01_PRODUCT_REQUIREMENTS.md` for scope and acceptance criteria.
4. Root `AGENTS.md` for AI behavior, ownership, and workflow.
5. `02_SYSTEM_ARCHITECTURE.md`, `03_TECH_STACK.md`, and `04_REPOSITORY_STRUCTURE.md`.
6. `22_WASTE_DECISION_POINTS.md` for rules semantics and values.
7. `10_IMPLEMENTATION_PLAN.md` and `11_TEAM_GITHUB_WORKFLOW.md`.
8. Other files in `DOCUMENTATION/`.
9. `23_BUILD_DOC_V4_RECONCILIATION.md` as the historical comparison if a canonical file has already incorporated its decision.
10. Legacy/source material outside `DOCUMENTATION/`.

No contributor or AI may silently choose between conflicting designs. Stop and escalate.

## Documentation map

| File | Purpose |
|---|---|
| `README.md` | Repository introduction and safe quickstart; copied byte-for-byte to root |
| `AGENTS.md` | Sole master context for Freebuff/Cursor/other coding agents; copied byte-for-byte to root |
| `01_PRODUCT_REQUIREMENTS.md` | Outcomes, personas, tiers, requirement IDs, acceptance gates |
| `02_SYSTEM_ARCHITECTURE.md` | Edge, ML, cloud, trust boundaries, state machines, data flow |
| `03_TECH_STACK.md` | Frozen technologies, dependency/version policy, rejected alternatives |
| `04_REPOSITORY_STRUCTURE.md` | Exact tree, module boundaries, owners, allowed paths |
| `05_DATA_SCHEMA.md` | Tier 1 tables, relationships, constraints, RLS, ledger invariants |
| `06_API_IOT_CONTRACT.md` | Versioned LAN/cloud APIs, payloads, errors, auth, idempotency |
| `07_HARDWARE_FIRMWARE.md` | BOM, wiring decisions, calibration, firmware lifecycle |
| `08_EDGE_GATEWAY.md` | Durable local server, ML orchestration, outbox, retry, health |
| `09_SECURITY_PRIVACY.md` | Threats, RBAC/RLS, camera/QR/model/privacy/fairness controls |
| `10_IMPLEMENTATION_PLAN.md` | 30-hour parallel execution plan and gates |
| `11_TEAM_GITHUB_WORKFLOW.md` | Branches, ownership, commits, PR review, manual protection |
| `12_TEST_STRATEGY.md` | Unit, contract, HIL, ML, RLS, offline, E2E, demo tests |
| `13_DEPLOYMENT_RUNBOOK.md` | Local/cloud/model/camera setup, startup, fallback, rollback |
| `14_DEMO_JUDGING_PLAN.md` | Judge narrative, live scenes, evidence, failure recovery |
| `15_RISK_REGISTER.md` | Risk owners, triggers, mitigation, contingency |
| `16_ARCHITECTURE_DECISIONS.md` | ADR history and v4 reconciliation decisions |
| `17_REQUIREMENTS_TRACEABILITY.md` | Requirement -> owner -> path -> test -> demo evidence |
| `18_TROUBLESHOOTING.md` | Five-minute integration and stage recovery |
| `19_GLOSSARY.md` | Canonical vocabulary, states, confidence bands, source labels |
| `20_UI_UX_SPECIFICATION.md` | Citizen, municipal, developer, truth-label, and preview UI |
| `21_ML_INTEGRATION.md` | Local capture/inference contract, provenance, privacy, fallback |
| `22_WASTE_DECISION_POINTS.md` | Exact `rules-2.0.0`, points, review, and badge policy |
| `23_BUILD_DOC_V4_RECONCILIATION.md` | Source comparison, conflicts, final adopt/adapt/reject record |

## Non-negotiable implementation rules

1. Do not change the folder tree, stack, contracts, schema, tier, rules, ownership, or milestones inside a feature task.
2. Work only in the issue's allowed paths and assigned branch.
3. Firmware never holds cloud credentials or calls Supabase/Vercel directly.
4. The edge commits before acknowledging; a replay never creates a second event or ledger entry.
5. UI never computes identity, authorization, final points, or adverse action.
6. ML output is evidence; unsupported, low-confidence, conflicting, missing, or late output becomes review-safe uncertainty.
7. Negative point entries require human `VERIFIED_VIOLATION`; no raw sensor/model result directly debits a citizen.
8. Tier 2 has no dedicated backend and is never described as live.
9. Simulated data is isolated, audited, and visibly labelled.
10. Never commit credentials, camera URLs with embedded secrets, model tokens, real PII, or raw QR values.
11. No direct push to `main` or `integration`, no force push, and only PARTH AJMERA merges.
12. A human reviews `git diff`, tests, and evidence before every PR.

## Change-request format

```md
# CHANGE_REQUEST — CR-###

Requested by:
Blocked issue/task:
Current approved rule or contract:
Why the task cannot fit it:
Smallest proposed change:
Affected tiers/files/contracts/tables/endpoints:
Migration, security, test, and schedule impact:
Alternatives considered:
Fallback if rejected:
Approval: PENDING
```

Until PARTH AJMERA changes `Approval` to `APPROVED`, current v2.0 remains active. Approval is incomplete until an ADR, affected document/contract updates, and team notification exist.

## Baseline completion test

Before feature coding, every member must be able to answer:

1. Which branch and exact paths do I own?
2. Is my task Tier 1, Tier 2, or Tier 3?
3. Which requirement, contract revision, and fixture am I implementing?
4. Which test and demo evidence prove it?
5. How does failure degrade safely?
6. Who reviews the PR and who merges it?

If any answer is guessed, the task is not ready to start.
