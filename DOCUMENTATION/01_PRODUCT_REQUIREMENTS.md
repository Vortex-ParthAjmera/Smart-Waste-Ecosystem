> **PLAN & STRUCTURE LOCK — v2.0:** This approved scope, stack, repository structure, contracts, ownership map, truth-tier model, and delivery plan must not be changed by contributors or AI agents. Work only inside assigned paths. If a change is necessary, stop and submit a `CHANGE_REQUEST`; only PARTH AJMERA may approve it, followed by an ADR, contract/document updates, and team notification.

# Smart Waste Ecosystem Product Requirements

| Field | Approved baseline |
|---|---|
| Product | Smart Waste Ecosystem / SGV 2.0 |
| Document status | Implementation baseline v2.0 |
| Product owner | PARTH AJMERA |
| Delivery window | 30 hours, six people |
| Primary users | Citizen, municipal operator/reviewer, developer/IoT operator |
| Core object | Auditable disposal event |
| Requirements language | MUST = release gate; SHOULD = valuable after core; MAY = optional |
| Scope truth | Tier 1 `REAL`; Tier 2 `PREVIEW`; Tier 3 `ROADMAP` |
| Canonical evidence register | `17_REQUIREMENTS_TRACEABILITY.md` |

## 1. Product definition

The Smart Waste Ecosystem connects a citizen-linked waste hand-off to real hardware evidence, local camera inference, a deterministic segregation decision, an auditable point ledger, municipal review, and role-appropriate live views.

One opaque QR identifies a fictional demo citizen. The citizen selects the wet or dry compartment. The ESP32 captures the selected compartment's IR trigger, fill level, dry-path moisture when applicable, GPS/fix health, and component health. The local FastAPI gateway durably stores the event before acknowledgement, correlates a phone/laptop camera capture to the same `eventId`, runs local inference, and synchronizes one idempotent message to the cloud. The cloud validates identity and authorization, persists normalized evidence, evaluates `rules-2.0.0`, appends any allowed ledger entry, and publishes safe Realtime invalidation.

The product is not an autonomous sorter, legal enforcement system, or production billing platform. ML and sensors are fallible evidence. Only a human-verified violation can create a negative point entry.

### One-line pitch

**From physical disposal to a verifiable digital record—live, offline-resilient, explainable, and fair.**

## 2. Problem and differentiator

Municipal waste collection commonly loses the connection between identity, segregation behavior, physical evidence, operational health, and citizen feedback. Typical hackathon “smart bins” stop at a fill sensor or dashboard.

This prototype demonstrates a stronger chain:

```text
opaque citizen QR
  -> selected wet/dry compartment
  -> ESP32 sensor and health evidence
  -> durable local event
  -> correlated local camera inference
  -> deterministic decision
  -> append-only points or review
  -> citizen/municipal/developer proof
```

The differentiators are event correlation, offline durability, duplicate-safe ledger effects, honest ML uncertainty, visible component health, and an auditable human-review path.

## 3. Outcomes and success measures

| ID | Outcome | Demo acceptance target | Pilot-oriented target, not a current claim |
|---|---|---|---|
| OUT-01 | Traceable disposal | Every live/seeded event has one stable ID and complete source labels | >=99% event provenance completeness |
| OUT-02 | Real physical-to-digital loop | IR/sensor event, local inference, cloud result, and UI update correlate to one ID | p95 live result within the measured demo budget |
| OUT-03 | Offline resilience | Three events survive WAN loss and gateway restart, then sync once | >=99% eventual delivery in the configured window |
| OUT-04 | Ledger integrity | Qualifying event creates one `+10`; replay creates no duplicate | duplicate financial-effect rate = 0 |
| OUT-05 | Fair adverse action | Raw sensor/ML output creates no automatic negative entry | 100% negative entries reference verified human review |
| OUT-06 | Explainability | Event shows ruleset, model, calibration, evidence quality, reasons, and source | every final decision reconstructable |
| OUT-07 | Operational visibility | Developer view shows device, edge, camera, model, sensor, queue, and cloud health | stale/degraded state always visible |
| OUT-08 | Claims integrity | Every preview/simulation is persistently labelled | zero unlabeled fake-live surfaces |
| OUT-09 | Demo repeatability | Reset, seed, live run, failure, and fallback are rehearsed | three consecutive successful rehearsals |

## 4. Personas and authorization

| Persona | Primary goal | Allowed | Forbidden |
|---|---|---|---|
| Citizen | Prove identity, see own disposal result and points | Own profile/QR/history/ledger/badges/disputes and privacy-safe previews | Other citizens, raw telemetry, admin controls |
| Municipal operator | Identify citizen and observe active disposal | QR scan, minimum citizen confirmation, active event and safe device status | Arbitrary citizen history, point/penalty mutation |
| Municipal reviewer/admin | Resolve flagged evidence and audit the system | Authorized events, relevant evidence, verified review, dispute handling | Unlogged edits, direct balance mutation, hidden simulation |
| Developer/IoT operator | Keep the prototype functioning | Device/sensor/edge/model health, authorized raw telemetry/log summaries, demo simulation | Citizen PII, production-enable simulation, financial bypass |
| Device/gateway identity | Submit signed, versioned messages | Only its provisioned contract and device scope | Human sessions, direct database access |
| Repository owner | Preserve delivery coherence | Approve contracts, structure changes, merges, release | Bypass CI or conceal scope change |

Developer is an application role, not a separate public deployment. Municipal operator and reviewer are two permission levels within the municipal experience.

## 5. Scope by truth tier

### 5.1 Tier 1 — REAL

- One ESP32 and two physical compartments: wet and dry.
- One IR trigger and one ultrasonic fill sensor per compartment; one calibrated dry-path moisture sensor; GPS/fix status; heartbeat.
- Opaque QR generation/display/scan/validation and event binding.
- FastAPI/Pydantic edge, SQLite WAL durable custody, replay protection, retry/backoff, dead-letter and health.
- Local phone/laptop camera capture and pinned local inference correlated to `eventId`.
- Strict supported-class map to `WET`, `DRY`, or `UNKNOWN`; friendly display labels.
- Versioned cloud ingestion, lean Tier 1 schema, RLS, Realtime invalidation, polling fallback.
- `rules-2.0.0` confidence/moisture matrix; automatic `ACCEPTED` or `FLAGGED` only.
- Append-only point ledger; exactly-once `+10`; reviewed `-10/-20`; dispute/compensating entries.
- Citizen, municipal, and developer/IoT role experiences in one Next.js application.
- Citizen balance/history/live result, municipal scan/active/review, developer health/telemetry/ML/log/simulation.
- Bronze/Silver/Gold/Platinum tier projection and a limited seeded badge set.
- Seed: 15–25 primary-citizen events, four to six fictional peers, reconciled transactions, mixed cases.
- Guarded `SIMULATED` test event through the post-ingress processing path.
- Failure handling, offline proof, security tests, demo reset, and claim labels.

### 5.2 Tier 2 — PREVIEW

- Animated truck map, distance, and ETA not backed by real location.
- Multiple truck/zone cards beyond the one prototype.
- Bill-discount preview driven by real points but not real billing.
- Full municipal analytics/report charts from frozen fixtures.
- Static route/collection status stepper not driven by geofencing.

Tier 2 MUST live in approved frontend fixtures, display `PREVIEW/SEEDED`, and create no dedicated database table, API endpoint, worker, or aggregation job.

### 5.3 Tier 3 — ROADMAP

- Dedicated edge-AI camera hardware, autonomous sorting, compactor control.
- MQTT/broker fleet transport, route optimization, geofencing, scalable multi-zone database.
- Real billing, UPI, rewards marketplace, government/Aadhaar identity, legal fines.
- Native mobile applications, unrestricted production PII, and multi-city scale claims.

## 6. Fixed solution baseline

| Layer | Approved choice | Canonical path |
|---|---|---|
| Web and cloud API | One Next.js App Router app, strict TypeScript, Tailwind, accessible components | `apps/web/` |
| Role experiences | Citizen, municipal operator/admin, restricted developer/IoT routes | route groups under `apps/web/src/app/` |
| Cloud endpoints | Versioned Next.js route handlers | `apps/web/src/app/api/v1/` |
| Cloud data/auth/live | Supabase Postgres, Auth, RLS, Realtime | `supabase/` |
| Edge and local ML | Python, FastAPI, Pydantic, SQLite WAL, OpenCV-compatible capture, pinned local inference | `services/edge-gateway/` |
| Firmware | ESP32, PlatformIO, Arduino framework | `firmware/esp32/` |
| Shared contracts | JSON Schema, OpenAPI, fixtures, generated/shared types | `packages/contracts/` |
| Decision logic | Pure TypeScript, immutable rulesets | `packages/rules-engine/` |
| Demo/model utilities | Setup, model manifest, fixtures, reset/verification | `scripts/demo/` |
| Hosting | Vercel + Supabase; edge on team laptop/local server | deployment files/runbook |

No second frontend, direct ESP32 cloud path, parallel backend, alternate database, or unapproved top-level directory is allowed.

## 7. Core journeys

### 7.1 Correct disposal and award

1. Citizen signs in and presents a short-lived/rotatable opaque QR.
2. Municipal operator scans it; the server returns minimum display-safe identity.
3. Operator/citizen selects `WET` or `DRY` and an `eventId` is created before physical capture.
4. The selected compartment's IR trigger is debounced; firmware sends readings and health to the edge.
5. Edge validates and commits locally, then returns `202 QUEUED_LOCALLY`.
6. Edge captures a short frame burst, runs the pinned local model, stores provenance, and finalizes one cloud message.
7. Cloud idempotently persists the normalized event and evaluates `rules-2.0.0`.
8. A supported category match with sufficient evidence becomes `ACCEPTED`; one `+10` ledger row is appended.
9. Citizen and municipal views refetch after authorized Realtime notification.

### 7.2 Uncertain/mismatched evidence and human review

1. Low confidence, unknown/multiple objects, category mismatch, high dry-path moisture, missing sensor, or model timeout becomes `FLAGGED` with zero immediate ledger effect.
2. Reviewer sees only relevant evidence, model/calibration/rules versions, source labels, and reason codes.
3. Reviewer records exactly one terminal outcome with reason: `REVIEW_ACCEPTED`, `REVIEW_NO_ACTION`, or `VERIFIED_VIOLATION`.
4. Review acceptance may append `+10` once; no-action closes at zero with no ledger row. A verified normal mismatch may append `-10`; verified severe wet-in-dry may append `-20`.
5. Citizen can dispute an own negative entry. Resolution uses a compensating ledger entry; history is never rewritten.

### 7.3 Offline capture and recovery

1. WAN is disabled while the ESP32, camera, and edge remain on the LAN.
2. Edge acknowledges only after SQLite commit; local capture/inference may continue.
3. Cloud-dependent views show stale state; edge health shows pending count.
4. After WAN restoration, the edge retries stable bodies/keys.
5. Timeout-after-cloud-commit and exact replay return the existing outcome, not a duplicate event/ledger entry.

### 7.4 Guarded simulation

1. Authorized developer selects a frozen test fixture in demo mode.
2. The system creates a `SIMULATED` event for a fixed fictional identity and enters after physical ingress.
3. It uses the same validation, decision, database, ledger-safeguard, Realtime, and UI code from that boundary onward.
4. It never claims IR, sensor, camera, or firmware proof and is excluded from real-hardware evidence counts.

## 8. Functional requirements

### 8.1 Tier and truth controls

| ID | Requirement | Acceptance evidence |
|---|---|---|
| FR-TIER-001 | Every planned feature MUST have exactly one Tier 1/2/3 classification. | Traceability matrix has no unclassified feature. |
| FR-TIER-002 | Tier 2 MUST be visibly `PREVIEW/SEEDED` and MUST NOT introduce dedicated persistence or APIs. | UI test plus schema/route inventory diff. |
| FR-TIER-003 | Tier 3 MUST remain documentation-only. | Release-tree audit finds no Tier 3 implementation or fake screen. |

### 8.2 Authentication and QR

| ID | Requirement | Acceptance evidence |
|---|---|---|
| FR-AUTH-001 | Supabase sessions and server/RLS role checks MUST protect citizen, municipal, reviewer, and developer actions. | Positive/negative RBAC and cross-citizen RLS suite. |
| FR-AUTH-002 | Citizen phone OTP and municipal Google OAuth SHOULD be enabled only after provider preflight; fictional fallback accounts MUST be ready. | Provider smoke evidence plus separate-browser fallback rehearsal. |
| FR-AUTH-003 | Developer simulation and raw technical views MUST require the restricted developer/system-admin role. | Unauthorized roles receive `403`; audit proves authorized use. |
| FR-QR-001 | QR MUST carry an opaque random reference only and MUST reveal no PII. | Decoded demo QR contains only approved version/token fields. |
| FR-QR-002 | QR validation MUST be server-side, expiry/rotation-aware, rate-limited, and bound to the active event/session. | Expired, altered, replayed, and cross-session tests fail safely. |
| FR-QR-003 | Municipal scan response MUST return minimum identity needed for the collection. | Response snapshot excludes phone, email, full address, balance, and unrelated history. |

### 8.3 Hardware and firmware

| ID | Requirement | Acceptance evidence |
|---|---|---|
| FR-HW-001 | Prototype MUST support wet/dry selection, one independently debounced IR trigger per compartment, and duplicate/incomplete-cycle handling. | HIL matrix proves one physical action creates one event in either compartment. |
| FR-HW-002 | One ultrasonic per compartment MUST report calibrated/clamped fill percentage and invalid calibration explicitly. | Empty/full calibration record and boundary tests. |
| FR-HW-003 | Dry-path moisture MUST report calibrated percent/quality; it MUST NOT be treated as universal or standalone classification. | Wet-path event omits/not-applicable moisture; dry matrix passes. |
| FR-HW-004 | GPS/fix, Wi-Fi, sensor and firmware health MUST be component-level; missing data MUST never become fabricated zero. | Heartbeat and disconnect HIL evidence. |

### 8.4 Edge, sync, and idempotency

| ID | Requirement | Acceptance evidence |
|---|---|---|
| FR-EDGE-001 | LAN endpoints MUST be versioned, signed, replay-protected, strictly validated, and bounded. | Golden/negative HMAC and schema fixtures. |
| FR-EDGE-002 | Edge MUST commit a valid event to SQLite WAL before `202 QUEUED_LOCALLY`. | Process-kill-after-ACK test recovers the row. |
| FR-EDGE-003 | Edge MUST correlate sensor event and local inference by stable `eventId`, persist progress, and resume/timeout deterministically. | Restart, late result, duplicate trigger, and wrong-ID tests. |
| FR-EDGE-004 | Edge-to-cloud MUST use one immutable body/idempotency key per intent and classify retryable, terminal, conflict, and auth-blocked outcomes. | Timeout-after-commit and same-ID/different-body tests. |
| FR-EDGE-005 | Edge health MUST expose queue, oldest pending, device, camera, model, WAN, last sync, and safe error codes. | Online/offline/degraded API and UI snapshots. |

### 8.5 Local ML evidence

| ID | Requirement | Acceptance evidence |
|---|---|---|
| FR-ML-001 | Selected-compartment IR MUST trigger an event-correlated local frame burst without manual upload. | HIL video/log shows `eventId` from IR through detection. |
| FR-ML-002 | Runtime MUST use a pinned model, weights hash, class map, version, source `LOCAL_LIVE`, and pre-downloaded dependencies. | Manifest/hash check and WAN-disabled inference test. |
| FR-ML-003 | Only frozen supported labels may map to `WET`/`DRY`; unsupported/multiple/no detections MUST map to uncertainty. | Class-map and unknown/multi-object tests. |
| FR-ML-004 | `<0.60`, `0.60–<0.85`, and `>=0.85` bands MUST be stored/displayed as model-score bands, not guaranteed probability. | Boundary tests and UI copy review. |
| FR-ML-005 | Camera/model failure, low confidence, late output, hash mismatch, or privacy/license gate failure MUST fail safe and MUST NOT create a negative ledger entry. | Forced-failure tests and before/after ledger assertion. |

### 8.6 Decision, ledger, badges, review

| ID | Requirement | Acceptance evidence |
|---|---|---|
| FR-RULE-001 | Pure `rules-2.0.0` MUST evaluate selected compartment, supported ML category/score, dry-path moisture, and quality flags deterministically. | Snapshot decision matrix with immutable config hash. |
| FR-RULE-002 | Automated output MUST be `ACCEPTED` or `FLAGGED`; it MUST NOT create a negative point entry. | Exhaustive rule tests show zero automatic negative rows. |
| FR-LEDGER-001 | Accepted event MUST append exactly one `+10`; displayed balance MUST equal ledger sum. | Concurrent replay test and reconciliation query. |
| FR-LEDGER-002 | `-10/-20` MUST reference one authorized verified review; reversals MUST be compensating entries. | Database constraints and review/dispute E2E. |
| FR-REVIEW-001 | Flagged cases MUST preserve evidence versions/reasons and accept one auditable review decision. | RBAC, uniqueness, audit, and UI evidence. |
| FR-BADGE-001 | Tier MUST derive from ledger balance: Bronze `0–499`, Silver `500–999`, Gold `1000–1999`, Platinum `>=2000`. | Boundary unit tests. |
| FR-BADGE-002 | Demo MUST seed at least one earned badge/certificate; badge claims MUST be limited to frozen rules. | Seed reset and citizen UI evidence. |
| FR-BADGE-003 | Leaderboard MUST use fictional opt-in aliases and authorized aggregate output; it MUST reveal no household identity. | Privacy test and response snapshot. |

### 8.7 Simulation, seed, role experiences

| ID | Requirement | Acceptance evidence |
|---|---|---|
| FR-SIM-001 | Simulation MUST be disabled outside demo config and restricted to developer/system-admin. | Environment and `403` tests. |
| FR-SIM-002 | Simulated events MUST use fixed fictional identities, stable idempotency, audit, rate limit, and `SIMULATED` labels end to end. | E2E plus database/UI source assertions. |
| FR-SIM-003 | Simulation MUST share the post-ingress validation/decision/persistence/live path but MUST NOT claim physical hardware/camera evidence. | Trace comparison and evidence-counter exclusion test. |
| FR-SEED-001 | Seed MUST create 15–25 primary-citizen historical events across one to two weeks. | Deterministic count/time assertions. |
| FR-SEED-002 | Seed MUST create four to six fictional peers and mixed accepted, flagged, reviewed, and environmental-wetting cases. | Seed scenario assertions. |
| FR-SEED-003 | Every visible seeded balance/result/badge MUST reconcile to canonical rows and survive repeated reset. | Reconciliation and idempotent reset test. |
| FR-UI-001 | Citizen MUST see profile, QR, balance/history, live result, safe score, tier/badges, and dispute path. | Citizen Playwright journey. |
| FR-UI-002 | Municipal user MUST scan/validate QR, see active event, and authorized reviewer MUST resolve a flag. | Municipal Playwright journey and RBAC negative tests. |
| FR-UI-003 | Developer MUST see component health, raw authorized telemetry, local ML evidence/log summaries, queue/sync, and guarded simulation. | Developer Playwright journey. |
| FR-LIVE-001 | Realtime MUST be an authorization-safe invalidation hint with initial read and polling/refetch fallback. | Disconnect/reconnect and cross-role tests. |

## 9. Non-functional requirements

| ID | Requirement | Target/evidence |
|---|---|---|
| NFR-REL-001 | Local custody survives gateway restart and WAN loss. | Three queued events, restart, reconnect, exact drain. |
| NFR-PERF-001 | Edge durable ACK remains responsive. | p95 <=250 ms on demo LAN, excluding capture/inference. |
| NFR-PERF-002 | Capture + inference latency is measured, not guessed. | Recorded p50/p95 on the actual demo laptop; release threshold frozen at G1. |
| NFR-SEC-001 | Secrets stay server/device-scoped and out of logs/browser/Git. | secret scan, bundle check, redacted log review. |
| NFR-PRIV-001 | Raw frames are not stored by default; all demo citizens are fictional. | storage/database audit and fixture manifest. |
| NFR-A11Y-001 | Critical UI is keyboard-operable, labelled, responsive, and not color-only. | accessibility test and manual check. |
| NFR-OBS-001 | Logs correlate `requestId`, `messageId`, `eventId`, device/gateway, model and source without PII/secrets. | structured-log snapshots. |
| NFR-DEMO-001 | Three consecutive end-to-end rehearsals pass after feature freeze. | signed rehearsal scorecard. |

## 10. Canonical states and invariants

Processing, decision, and transport states are orthogonal; definitions are frozen in `19_GLOSSARY.md`.

Release invariants:

1. One physical/simulated intent has one stable `eventId` and idempotency key.
2. `202 QUEUED_LOCALLY` means durable at edge, not cloud-complete.
3. ML output never bypasses the rules engine or writes points.
4. An automatic mismatch has zero immediate point effect and opens review.
5. Negative ledger entry requires `VERIFIED_VIOLATION` and an authorized actor.
6. Balance is a projection of append-only transactions.
7. Tier 2 makes no backend call that exists solely for the preview.
8. `SIMULATED`, `RECORDED_ML`, `PREVIEW`, and stale/degraded sources never lose their visible label.
9. A duplicate with the same body replays; the same ID with a changed body returns `409 IDEMPOTENCY_CONFLICT`.
10. No missing coordinate/sensor value is represented as zero.

## 11. Delivery gates

| Gate | Required proof |
|---|---|
| G0 — Plan/contract freeze | v2 docs/root AI context, exact tree, branches, contracts, schema plan, fixtures, provider/model/BOM preflight |
| G1 — Local physical slice | QR/session, compartment IR, sensors/health, durable edge ACK, camera/model manifest and measured local inference |
| G2 — Cloud truth | One idempotent sync, RLS-safe normalized event, rules decision, exactly-once `+10` or flagged review |
| G3 — Role experience | Citizen/municipal/developer critical screens and safe Realtime/polling |
| G4 — Fairness/resilience | Review-gated `-10/-20`, dispute/reversal, offline/restart/replay, camera/model/sensor failure, simulation isolation |
| G5 — Tier 1 freeze | seed reconciliation, CI/security/a11y, zero critical/high defects, complete evidence |
| G6 — Preview/demo | optional Tier 2 labels, three rehearsals, reset/fallback, judge claims review, release candidate |

## 12. Assumptions, dependencies, and fallbacks

- All people and records are fictional; no real municipal integration is claimed.
- Phone OTP requires an SMS provider and Google OAuth requires configured credentials/callbacks. Pre-created fictional Supabase accounts are mandatory fallback.
- Cloud UI/realtime require WAN. Local sensing, edge persistence, and pre-downloaded inference do not.
- The model supports only the tested class allowlist. Unknown items are not forced into wet/dry.
- If dual-compartment parts or GPS fail H0 bench proof, the feature is visibly degraded and cannot be used as judged proof until fixed; simulation never conceals the condition.
- Tier 2 can be omitted entirely without failing product success.

## 13. Definition of product success

The product succeeds when the team can repeatedly demonstrate a real opaque-QR disposal through ESP32, durable edge capture, correlated live local inference, duplicate-safe cloud processing, explainable accepted/flagged decision, exactly-once positive award or fair review, and role-appropriate UI—then deliberately show a safe failure and recovery without misrepresenting preview or simulated data.
