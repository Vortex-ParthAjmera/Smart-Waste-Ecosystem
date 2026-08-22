> **PLAN & STRUCTURE LOCK — v1.0:** This approved scope, stack, repository structure, contracts, ownership map, and delivery plan must not be changed by contributors or AI agents. Work only inside the assigned paths. If a change is necessary, stop and submit a `CHANGE_REQUEST`; only PARTH AJMERA may approve it, followed by an ADR and team notification.

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

- Status: accepted
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

- Status: accepted
- Decision: every telemetry/demo record states `HARDWARE`, `RECORDED_HARDWARE`, or `SIMULATOR`.
- Consequence: honest fallback demonstrations and clearer debugging.

## ADR-014: Reconcile teammate IoT/YOLO workflow without weakening the core

- Status: accepted
- Decision: adopt opaque QR identity, conditional dual-compartment IR/ultrasonic sensing, active/normal UI states, and an admin IoT-control view. Permit a post-G4 manual-Colab ML observation path under `scripts/demo/ml/**` with provenance and a recorded fallback.
- Rejected conflicts: separate deployments, direct ESP32-to-Supabase, Aadhaar/Google identity claims, and automatic negative points/penalties.
- Consequence: the teammate plan improves hardware observability and pitch value while offline resilience, one-message v1, deterministic rules, and mandatory human review remain authoritative.

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
