> **PLAN & STRUCTURE LOCK — v2.0:** This approved scope, stack, repository structure, contracts, ownership map, truth-tier model, and delivery plan must not be changed by contributors or AI agents. Work only inside assigned paths. If a change is necessary, stop and submit a `CHANGE_REQUEST`; only PARTH AJMERA may approve it, followed by an ADR, contract/document updates, and team notification.

# Architecture Decision Records

Accepted ADRs are immutable history. A change creates a new ADR that says which decision it supersedes; it does not rewrite the old entry.

## ADR-001: One Next.js web/cloud application

- Status: accepted
- Context: four software contributors need citizen, operator, admin, and API surfaces with one deploy target.
- Decision: use one Next.js App Router app under `apps/web`, with logical route boundaries and cloud Route Handlers.
- Consequence: fast integration and shared types; CODEOWNERS/tests must enforce boundaries.

## ADR-002: Supabase for Postgres, Auth, RLS, and Realtime

- Status: accepted
- Decision: use managed relational data/auth/realtime rather than custom auth/database/websocket infrastructure.
- Consequence: rapid delivery and SQL integrity; project remains portable at the schema level but uses managed APIs in MVP.

## ADR-003A: Full hardware simulation

- Status: superseded by ADR-003B
- Source: legacy `docs/DECISIONS.md` ADR-003.
- Reason superseded: PARTH AJMERA's latest approved team plan explicitly assigns real ESP32 hardware/IoT to KRISHNA PANWAR and ADITYA SILSWAL.

## ADR-003B: Real ESP32 plus an offline local edge gateway

- Status: accepted
- Decision: ESP32 sends LAN HTTP JSON v1 to a FastAPI gateway. The gateway validates, persists to SQLite, acknowledges locally, and synchronizes to cloud.
- Consequence: real physical proof and internet-loss resilience; one additional runtime is justified and exclusively owned.

## ADR-004: HTTP JSON for MVP; MQTT is stretch

- Status: accepted
- Options: HTTP JSON, MQTT, direct database, BLE phone sync.
- Decision: HTTP JSON between one device and local gateway.
- Rationale: simplest observable and contract-testable path for first-time builders.
- Consequence: fleet-scale broker semantics are deferred behind an adapter.

## ADR-005: Deterministic versioned rules with human review

- Status: accepted
- Decision: pure rule engine produces `ACCEPTED` or `FLAGGED`; it does not directly create a penalty.
- Rationale: sensor evidence is noisy and no validated ML dataset exists.
- Consequence: every decision is explainable by rule version; officers decide violations.

## ADR-006: EcoCredit immutable ledger

- Status: accepted
- Decision: the ledger is the authority; balance is derived or transactionally cached. One earn entry per accepted collection event.
- Consequence: replay/fraud resilience and auditability; entries are reversed by new entries, never deleted/edited.

## ADR-007: Simulated redemption and municipal billing

- Status: superseded for the hackathon build by ADR-018
- Decision: show points/redemption request and penalty/bill workflows without real money or government API calls.
- Consequence: safe reliable demo; production integration requires separate legal/security approval.

## ADR-008: Contract-first boundary

- Status: accepted
- Decision: OpenAPI/JSON Schema v1 in `packages/contracts` precedes firmware, edge, cloud, and UI implementation.
- Consequence: teams can work in parallel; public v1 changes are additive-only and PARTH AJMERA-approved.

## ADR-009: Persistent named team branches with protected integration

- Status: accepted
- Decision: six fixed `team/*` branches PR into `integration`; milestone PRs reach `main`; use merge commits and merge `integration` back into personal branches.
- Consequence: easy mental model and audit for beginners; history is less linear but avoids rebase/force and persistent-branch squash surprises.

## ADR-010: Frozen repository structure and single AI context

- Status: accepted
- Decision: top-level tree is locked; only root `AGENTS.md` is fed as global AI context, plus one scoped issue prompt.
- Consequence: agents cannot reorganize architecture or plans; legitimate changes use `CHANGE_REQUEST` + ADR.

## ADR-011: Legacy household smart-bin concept is out of scope

- Status: accepted
- Decision: `Smart_Segregation_Bin_Project_Plan_v2.md` remains research-only.
- Rationale: household Bluetooth bin/on-device UPI scoring is a separate product and would split the team's judged story.

## ADR-012: Offline acknowledgement semantics

- Status: accepted
- Decision: edge returns `202` only after durable SQLite insert. Cloud result is a later receipt/state.
- Consequence: operator can continue collecting without internet while UI distinguishes `QUEUED_LOCALLY`, cloud `ACKED`, and the final business decision.

## ADR-013: Source-aware evidence

- Status: accepted; provenance vocabulary expanded by ADR-015
- Decision: every event/evidence/demo record has an honest source. Event `eventSource` values are `HARDWARE`, `RECORDED_HARDWARE`, `SIMULATED`, or `SEEDED`; ML `evidenceSource` values are `LOCAL_LIVE`, `RECORDED_ML`, `SIMULATED`, or `SEEDED`.
- Consequence: honest fallback demonstrations and clearer debugging.

## ADR-014: Reconcile teammate IoT/YOLO workflow without weakening the core

- Status: accepted except the manual-only ML portion, superseded by ADR-016
- Decision: adopt opaque QR identity, conditional dual-compartment IR/ultrasonic sensing, active/normal UI states, and an admin IoT-control view. Permit a post-G4 manual-Colab ML observation path under `scripts/demo/ml/**` with provenance and a recorded fallback.
- Rejected conflicts: separate deployments, direct ESP32-to-Supabase, Aadhaar/Google identity claims, and automatic negative points/penalties.
- Consequence: the teammate plan improves hardware observability and pitch value while offline resilience, one-message v1, deterministic rules, and mandatory human review remain authoritative.

## ADR-015: Reconcile final Build Doc v4 with truth tiers

- Date: 2026-08-22
- Status: accepted
- Owner/approver: PARTH AJMERA
- Context: the team supplied `Smart_Waste_Platform_Build_Doc_v4.md` as its latest 30-hour build source. It added valuable scope discipline and demo features but conflicted with the approved local server, one-app topology, versioned contracts, and fairness invariants.
- Decision: adopt Tier 1 `REAL`, Tier 2 `PREVIEW`, and Tier 3 `ROADMAP`; adopt the seed quantities, developer diagnostics, failure rehearsal, live local inference, confidence/moisture bands, `+10/0/-10/-20` policy, and demo flow subject to the adaptations in `23_BUILD_DOC_V4_RECONCILIATION.md`.
- Rejected: direct ESP32-to-cloud, separate frontend deployments, unsupported model labels, unversioned routes, hidden preview backends, and automatic negative entries.
- Consequences: every feature has one truth tier; Tier 2 begins after Tier 1 freeze and has no schema/API; the complete documentation pack and root AI context move to baseline v2.0.
- Rollback: revert to the last v1.0 baseline only by an approved repository rollback; do not mix v1 and v2 contracts.

## ADR-016: Edge-orchestrated live local inference

- Date: 2026-08-22
- Status: accepted; supersedes ADR-014's manual-only ML runtime decision
- Owner: ADITYA SILSWAL; firmware trigger integration by KRISHNA PANWAR; cloud/rules integration by AASHU JOSHI
- Context: v4 requires an IR-triggered phone/laptop camera and local YOLO-compatible inference without a manual upload.
- Decision: FastAPI remains the local orchestrator. After committing the hardware event, it captures a bounded frame burst, runs a pinned pre-downloaded model/class map, records `LOCAL_LIVE` metadata, and freezes one event-correlated cloud body. Raw frames are not stored by default.
- Safety: unsupported/no/multiple/low/late/failed evidence becomes `UNKNOWN`/`FLAGGED`; ML never directly writes points. A model/weights/class/license/privacy/latency gate and `RECORDED_ML` fallback are mandatory.
- Consequence: the demo gains genuine local AI while preserving durable ingest, provenance, fairness, and failure isolation.

## ADR-017: Adopt rules-2.0.0 and review-gated negative points

- Date: 2026-08-22
- Status: accepted; supersedes the amount/threshold portion of ADR-005, not its human-review principle
- Context: v4 freezes positive/negative values and confidence/moisture bands, while v1.0 used `+50` and different moisture thresholds.
- Decision: accepted automatic result appends exactly `+10`; flagged/uncertain/environmental evidence appends `0`; a reviewer-confirmed normal violation may append `-10`, and reviewer-confirmed severe wet-in-dry may append `-20`. Confidence bands are `<0.60`, `0.60–<0.85`, and `>=0.85`; calibrated dry-path moisture bands are `<30`, `30–45`, and `>45` percent.
- Constraint: automation produces only `ACCEPTED` or `FLAGGED`. Negative values require `VERIFIED_VIOLATION`; browser/firmware/model never supplies the delta.
- Consequence: the ledger remains immutable/exactly once and the v4 values become judge-explainable without automated guilt.

## ADR-018: Lean Tier 1 schema; no Tier 2 backend

- Date: 2026-08-22
- Status: accepted; supersedes ADR-007's real demo billing/redemption tables
- Context: v4 explicitly prohibits backend/schema work for preview maps, zones, bills, discounts, and reports.
- Decision: implement only the identity/session, gateway/device, idempotency, event/sensor/ML/result, review/ledger/dispute, badge, health/telemetry, and audit model in `05_DATA_SCHEMA.md`. Tier 2 uses labelled frontend fixtures only.
- Consequence: smaller migration/API surface and lower delivery risk; production fleet/routing/billing remains Tier 3.

## ADR-019: One web app with three role experiences

- Date: 2026-08-22
- Status: accepted; clarifies ADR-001
- Decision: keep one `apps/web` and one deployment. Use `(citizen)`, `(municipal)`, and `(developer)` route groups; municipal contains operator and review permissions.
- Consequence: v4's user experiences are present without tripling auth, configuration, deployment, and merge work.

## ADR-020: One independently debounced IR per compartment

- Date: 2026-08-22
- Status: accepted
- Context: v4's hardware diagram places one IR in each compartment, but its text incorrectly uses IR1 as start and IR2 as confirmation for one disposal.
- Decision: IR-wet triggers wet events and IR-dry triggers dry events independently. A session/compartment match plus debounce/time window supplies confirmation. Two sequential chute sensors would require additional hardware and are not claimed.
- Consequence: the declared two-sensor BOM matches the actual event logic.

## ADR-021: Provider auth targets with rehearsed fallback

- Date: 2026-08-22
- Status: accepted
- Decision: Supabase Auth remains the only auth system. Phone OTP and Google OAuth are real provider-enabled Tier 1 targets after preflight. Pre-created fictional Supabase citizen/municipal/developer accounts in separate browser profiles are mandatory fallback.
- Consequence: the team can show provider auth when reliable without making an SMS/OAuth outage destroy the judged core or making government identity claims.

## ADR-022: Guarded post-ingress simulation

- Date: 2026-08-22
- Status: accepted
- Decision: developer simulation is system-admin/developer-only, demo-environment gated, fixture-allowlisted, idempotent, rate-limited, audited, fixed to fictional identities, and permanently `SIMULATED`. It shares validation/decision/persistence/ledger-safeguard/Realtime/UI code only after physical ingress.
- Consequence: deterministic failure insurance exists without pretending that a synthetic event proves ESP32, IR, sensors, or live camera operation.

## ADR-023: Correct repository identity and documentation folder

- Date: 2026-08-22
- Status: accepted
- Decision: canonical repository is `Vortex-ParthAjmera/Smart-Waste-Ecosystem`; the professional folder name is `DOCUMENTATION/`, replacing the earlier misspelled folder name. Root `README.md` and `AGENTS.md` are exact copies of the approved documents.
- Consequence: links, CODEOWNERS, agent instructions, and contributor commands use one real repository identity.

## New ADR template

```md
## ADR-0XX: Title
- Date:
- Status: proposed | accepted | superseded by ADR-0YY
- Owner:
- Context:
- Constraints:
- Options considered:
- Decision:
- Consequences:
- Migration/rollback:
- Approved by PARTH AJMERA:
```
