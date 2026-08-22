> **PLAN & STRUCTURE LOCK — v1.0:** This approved scope, stack, repository structure, contracts, ownership map, and delivery plan must not be changed by contributors or AI agents. Work only inside the assigned paths. If a change is necessary, stop and submit a `CHANGE_REQUEST`; only PARTH AJMERA may approve it, followed by an ADR and team notification.

# SGV 2.0 Product Requirements Document

| Field | Baseline |
|---|---|
| Product | Smart Garbage Vehicle (SGV 2.0) |
| Document status | Approved implementation baseline v1.0 |
| Product owner and final scope authority | PARTH AJMERA |
| Team | PARTH AJMERA, YASHVARDHAN DOBHAL, AASHU JOSHI, KRISHNA PANWAR, ADITYA SILSWAL, BHUMIKA SINGH RAWAT |
| Primary users | Citizen, vehicle operator, municipal reviewer/admin |
| Prototype class | Hardware-integrated municipal waste-collection system |
| Requirement language | MUST = release gate; SHOULD = important if time permits; MAY = optional |
| Canonical evidence register | `17_REQUIREMENTS_TRACEABILITY.md` |

## 1. Product definition

SGV 2.0 turns a municipal garbage vehicle into a connected, auditable collection point. A household is identified by RFID or QR, the citizen deposits already segregated waste into a vehicle compartment, an ESP32 captures sensor and GPS evidence, and a local edge gateway safely forwards versioned events to the cloud platform. The platform records the collection, evaluates explainable rules, awards auditable EcoCredits for compliant behavior, routes uncertain submissions to a human reviewer, and shows role-appropriate information in citizen, operator, and municipal admin portals.

SGV 2.0 is **not** a smart dustbin installed in each home and is not an autonomous waste sorter. Initial segregation remains the citizen's responsibility; vehicle sensors provide supporting evidence rather than legal proof.

### One-line pitch

**Identify the household, verify the segregated hand-off, reward good behavior, review uncertainty fairly, and give the municipality live operational visibility - even when connectivity is intermittent.**

## 2. Problem and opportunity

Municipal collection currently breaks accountability at several points: waste is handed over anonymously, sensor or route data is disconnected from household records, citizens receive little positive feedback, field connectivity is unreliable, and municipalities cannot easily prove what was collected, where, or why a reward or penalty was applied.

SGV 2.0 closes that loop with one traceable collection record connecting:

`household identity -> operator and vehicle -> declared category -> sensor evidence -> location and time -> rules outcome -> EcoCredit or review -> verified penalty/dispute -> municipal analytics`

## 3. Product outcomes and success measures

| ID | Outcome | MVP acceptance target | Pilot-oriented KPI |
|---|---|---|---|
| OUT-01 | Accountable collections | Every completed demo collection has a unique event ID and audit trail | >= 99% of ingested events retain household, vehicle, category, time, and outcome |
| OUT-02 | Fair incentives | Accepted demo event credits EcoCredits exactly once | Duplicate-credit rate = 0 |
| OUT-03 | Fair enforcement | No financial penalty is created directly from raw sensor output | 100% of penalties reference a recorded human decision |
| OUT-04 | Intermittent-connectivity resilience | At least three events queue offline and sync without loss or duplication | >= 99% eventual sync success within an agreed connectivity window |
| OUT-05 | Fleet visibility | Demo vehicle location and freshness are visible to operator/admin; citizen sees privacy-safe tracking | Active location freshness <= 15 seconds under normal connectivity |
| OUT-06 | Explainability | Admin can see rule version, relevant evidence, and reviewer action for a flagged event | 100% of decisions are reconstructable from stored evidence and audit records |
| OUT-07 | Demo readiness | The full accepted and flagged-to-reviewed journeys run from hardware through portals | All P0 acceptance evidence in this PRD passes before judging |

The pilot KPIs guide architecture but are not claims of measured production performance.

## 4. Personas and authorized outcomes

| Persona | Goal | May see/do | Must not see/do |
|---|---|---|---|
| Citizen | Confirm collection, track service, understand EcoCredits and any verified action | Own household profile, own collection history, privacy-safe vehicle status, own EcoCredit ledger, own penalties and disputes | Other households, exact restricted fleet operations, raw secrets, admin controls |
| Vehicle operator | Complete collections safely and recover from connectivity loss | Minimum necessary household confirmation, current vehicle/session, sensor status, queued/synced state, safety alerts | Full citizen financial history, rules administration, penalty approval |
| Municipal reviewer/admin | Monitor fleet and make accountable decisions | Fleet status, flagged queue, relevant evidence, rule configuration, review/penalty/dispute workflows, aggregate analytics | Unlogged edits, silent ledger mutation, bypass of review policy |
| Device identity | Submit authenticated telemetry for one provisioned vehicle | Versioned heartbeat, collection, sensor, and location payloads | Human portal sessions or unrestricted database access |
| Product/repository owner (PARTH AJMERA) | Preserve a coherent build and release | Approve plan/structure change requests, ADRs, protected merges, demo go/no-go | Circumvent CI or conceal scope changes |

## 5. Approved MVP boundary

### 5.1 In scope (P0 unless marked P1)

- One real ESP32-based vehicle prototype with RFID or QR fallback, intake/motion evidence, moisture evidence, weight evidence when hardware is reliable, GPS or a declared GPS simulation fallback, device health, and operator-visible status.
- A local FastAPI edge gateway with Pydantic validation, SQLite durable queue, idempotent forwarding, retry/backoff, health status, and no-internet collection continuity.
- LAN HTTP/JSON between the ESP32 and edge gateway. MQTT is a stretch option only and must not replace the MVP path.
- A Next.js App Router web application with citizen, operator, and admin route groups plus versioned API routes.
- Supabase Postgres, Auth, Realtime, and Row Level Security for cloud persistence, authentication, live updates, and citizen isolation.
- A pure TypeScript, versioned rules engine that produces `ACCEPTED` or `FLAGGED`; it never creates a financial penalty by itself.
- An append-only EcoCredit ledger and balance projection with idempotent award behavior.
- Human review before any verified violation or penalty, plus reason/evidence visibility and a dispute workflow.
- Live/near-live vehicle tracking with last-update time, freshness state, and privacy-reduced citizen presentation.
- Admin fleet, flagged-review, rules, credit, penalty/dispute, audit, and essential analytics views.
- A rehearsed, seeded end-to-end demo with offline and failure fallbacks.

### 5.2 P1 if the P0 journey is stable

- Multiple demo vehicles, configurable ward assignment, downloadable CSV reports, localized Hindi labels, campaign bonuses, and richer charts.
- Weight-based EcoCredit bonuses only after calibration evidence proves the load cell stable.
- Hardware fire/gas inputs if safely available; otherwise clearly labeled simulated safety payloads through the same contract.
- A gated, admin-only `MANUAL_COLAB`/`RECORDED_ML` observation attached to an existing event as supporting evidence; it has no automatic state, credit, or penalty effect.

### 5.3 Explicitly out of scope for v1

- A sensor-equipped household smart bin, Bluetooth pickup from a household bin, or household on-device scoring.
- Autonomous sorting of mixed waste or claims that moisture alone identifies waste reliably.
- Production/automatic camera classification, predictive route optimization, predictive maintenance, digital twins, or automated legal enforcement. The narrow optional evidence demo is governed by `21_ML_INTEGRATION.md`.
- Industrial hydraulic compactor control; the demo may show compartment/fill state but must not actuate unsafe machinery.
- Real money/UPI payout, real Nagar Nigam billing, public production deployment with real citizen PII, or legal/fine integration.
- Native mobile apps, SMS delivery, MQTT as the required transport, and multi-city scale testing.

## 6. Fixed solution baseline

| Layer | Approved choice | Canonical path |
|---|---|---|
| Web and cloud API | Next.js stable App Router, TypeScript strict, Tailwind CSS, shadcn/ui | `apps/web/src/` |
| Citizen/operator/admin portals | Route-separated web experiences | `apps/web/src/app/(citizen)`, `(operator)`, `(admin)` |
| Versioned cloud endpoints | Next.js route handlers under `/api/v1` | `apps/web/src/app/api/v1/` |
| Cloud data/auth/realtime | Supabase Postgres, Auth, Realtime, RLS | `supabase/` |
| Edge gateway | FastAPI, Pydantic, SQLite durable queue | `services/edge-gateway/` |
| Device firmware | ESP32, PlatformIO, Arduino framework | `firmware/esp32/` |
| Shared device/API contracts | Versioned JSON schemas and generated/shared types | `packages/contracts/` |
| Decision logic | Dependency-free pure TypeScript rules | `packages/rules-engine/` |
| MVP transport | ESP32 -> edge over LAN HTTP/JSON; edge -> cloud over authenticated HTTPS | Contracts above |
| Cloud hosting | Vercel application and Supabase cloud | Deployment configuration |

No contributor may introduce a second frontend, alternate backend, different database, parallel contract shape, or changed folder tree without the lock process.

## 7. End-to-end journeys

### 7.1 Accepted collection and EcoCredit award

1. Operator starts a collection session for the provisioned vehicle.
2. Citizen presents RFID; operator may use a registered QR fallback if RFID is unavailable.
3. Operator confirms only the minimum household identity and declared waste category.
4. ESP32 records intake, available sensor readings, device timestamp, vehicle identity, and location/fix state.
5. Firmware creates a client-generated `event_id` and sends a `CollectionEventV1` envelope to the local edge gateway.
6. Edge validates schema and device identity, persists before acknowledgement, then forwards when cloud connectivity exists.
7. Cloud idempotently stores the event and runs the versioned rules engine.
8. If evidence is consistent and no blocking safety/data-quality issue exists, status becomes `ACCEPTED`.
9. One append-only EcoCredit transaction is created with the event ID, rule version, amount, and reason.
10. Citizen, operator, and admin views update with role-appropriate detail; an audit record proves the transition.

### 7.2 Ambiguous submission, human review, and dispute

1. The same intake path records evidence inconsistent with the declared category or below the configured confidence/data-quality threshold.
2. Rules engine returns `FLAGGED`; no EcoCredits and no financial penalty are created at this point.
3. Admin opens the verification case and sees declared category, relevant readings, location/time, rule explanation, and data-quality flags.
4. Reviewer chooses `REVIEW_ACCEPTED` or `VERIFIED_VIOLATION`, enters a reason, and confirms the action.
5. Acceptance may create the configured EcoCredit exactly once. A verified violation may create one simulated penalty linked to both event and review.
6. Citizen sees reason, status, and a dispute action. Dispute resolution is recorded as another append-only decision, never as silent history editing.

### 7.3 Offline collection and eventual synchronization

1. Cloud connectivity is intentionally disabled while ESP32 and edge LAN remain available.
2. Edge durably records acknowledged events in SQLite with `PENDING` state.
3. Operator sees queued count and degraded/offline status but can continue safe collection.
4. When cloud connectivity returns, edge retries with bounded exponential backoff and stable idempotency keys.
5. Cloud acknowledges each accepted or already-known event; edge records `ACKED` without deleting audit evidence.
6. Portals show the same number of cloud events as unique device events, with no duplicate EcoCredits.

### 7.4 Live tracking and stale-state behavior

1. ESP32 sends location samples or an explicitly labeled GPS fallback through the edge gateway.
2. Cloud stores latest and limited history, including received time and fix quality.
3. Operator/admin see precise prototype location, freshness, connectivity, and last update.
4. Citizen sees an approximate/route-appropriate position and arrival status.
5. If the freshness threshold expires, all portals show `STALE` or `OFFLINE`; the UI must never imply that an old coordinate is live.

## 8. Functional requirements

### 8.1 Identity, access, and provisioning

| ID | Priority | Requirement | Acceptance evidence |
|---|---|---|---|
| FR-ID-001 | P0 | The system MUST authenticate citizen, operator, and admin users and authorize every protected server action by role. | Integration tests prove allowed access and `401/403` for cross-role attempts; citizen cross-household read is blocked by RLS. |
| FR-ID-002 | P0 | Each household MUST have a stable household ID and at least one active RFID identifier or QR fallback, with identifiers independently activatable/deactivatable. | Seeded `HH-10452` resolves through both approved demo paths; an inactive identifier is rejected and logged. |
| FR-ID-003 | P0 | The operator display MUST reveal only the minimum identity needed for collection. | UI evidence shows household ID, display name, ward, and eligibility without phone, email, bill, or dispute history. |
| FR-ID-004 | P0 | Each ESP32/edge installation MUST use a provisioned device and vehicle identity; the cloud MUST reject unknown or disabled devices. | Device-auth integration test accepts the provisioned device and rejects altered/disabled credentials. |

### 8.2 Collection session and hardware evidence

| ID | Priority | Requirement | Acceptance evidence |
|---|---|---|---|
| FR-COL-001 | P0 | A collection MUST receive a globally unique, client-generated event ID before first transmission. | Hardware-in-loop test creates 100 events across restarts with no repeated ID. |
| FR-COL-002 | P0 | A collection event MUST bind household, vehicle, operator/session, declared category, timestamps, contract version, available readings, and location/fix state. | Contract test rejects missing required fields; stored demo event displays the complete provenance set. |
| FR-COL-003 | P0 | ESP32 MUST capture intake/motion and moisture evidence; weight and other configured sensors MUST report value, unit, validity, and calibration/version metadata when enabled. | Serial/HIL capture and stored JSON show normalized readings and an explicit invalid/unavailable state rather than fabricated values. |
| FR-COL-004 | P0 | Operator MUST be able to select wet, dry, or reject category and see session progress and final/queued state. | E2E operator test covers category selection, intake, processing, accepted, flagged, and queued states. |
| FR-COL-005 | P0 | Safety input MUST be represented separately from segregation compliance and MUST raise a visible operator/admin alert without auto-penalizing a household. | Test payload with `fire_detected=true` creates a safety alert and zero penalty records. |
| FR-COL-006 | P0 | Missing or unhealthy sensors MUST place the system in a visible degraded mode and MUST not be converted into confident adverse evidence. | Sensor-disconnect HIL test produces `DEGRADED`, a data-quality flag, and no automatic violation. |

### 8.3 Edge gateway and synchronization

| ID | Priority | Requirement | Acceptance evidence |
|---|---|---|---|
| FR-EDGE-001 | P0 | Edge gateway MUST expose only versioned LAN HTTP/JSON endpoints defined in `packages/contracts` and validate requests with Pydantic. | Contract parity test sends valid/invalid fixtures to FastAPI; invalid payload returns deterministic `4xx` without persistence. |
| FR-EDGE-002 | P0 | Edge MUST durably persist a valid event in SQLite before acknowledging it to ESP32. | Process-kill test immediately after acknowledgement recovers the event on restart. |
| FR-EDGE-003 | P0 | Edge MUST use stable idempotency keys and retry cloud forwarding with bounded backoff. | Replayed message and forced timeout yield one cloud event and one EcoCredit transaction. |
| FR-EDGE-004 | P0 | Edge MUST expose local health including cloud reachability, device heartbeat, pending/dead-letter counts, and last successful sync. | Operator health panel and gateway test show each field under online, offline, and malformed-event conditions. |
| FR-EDGE-005 | P0 | Repeatedly invalid or exhausted events MUST enter a visible dead-letter state with reason; they MUST not be silently discarded. | Poison-event test shows dead-letter record, audit entry, and operator/admin remediation information. |
| FR-EDGE-006 | P0 | Sync acknowledgements MUST distinguish accepted, duplicate/already-known, retryable, and terminal-rejected records. | Message integration fixtures assert each result and the correct local state transition. |

### 8.4 Rules, review, penalties, and disputes

| ID | Priority | Requirement | Acceptance evidence |
|---|---|---|---|
| FR-RULE-001 | P0 | A pure, deterministic, versioned rules engine MUST evaluate declared category, normalized evidence, validity, and safety/data-quality flags. | Unit suite covers wet/dry/reject boundaries and snapshots the explanation for each version. |
| FR-RULE-002 | P0 | Automated evaluation MUST output only a positive acceptance or a request for human review; it MUST NOT create a financial penalty. | Unit and integration tests assert zero penalty writes for every raw sensor input combination. |
| FR-RULE-003 | P0 | Every outcome MUST include a machine-readable rule version and human-readable reason codes. | Admin event detail and database evidence show both; replay with the same input/version gives the same result. |
| FR-REV-001 | P0 | Only an authorized admin/reviewer MAY resolve a flagged case, and a decision MUST include actor, timestamp, reason, and evidence reference. | RBAC test rejects operator/citizen; approved review appears in immutable audit history. |
| FR-REV-002 | P0 | A penalty MAY be created only after `VERIFIED_VIOLATION`, MUST be simulated, and MUST reference exactly one event and one review. | Database constraint/integration test rejects penalty without a verified review and prevents duplicate penalty for an event. |
| FR-REV-003 | P0 | A citizen MUST be able to submit a dispute against their own active penalty and see its resolution. | Citizen E2E creates a dispute; another citizen receives `403`; admin resolution retains original decision and records a new action. |

### 8.5 EcoCredits

| ID | Priority | Requirement | Acceptance evidence |
|---|---|---|---|
| FR-ECO-001 | P0 | EcoCredits MUST be represented by an append-only ledger; displayed balance MUST be a projection of ledger entries, not an independently editable source. | Database/API test shows no direct balance-edit endpoint and reconciles balance to ledger sum. |
| FR-ECO-002 | P0 | One qualifying accepted event MUST create at most one award transaction using a configured rule version and idempotency key. | Concurrent duplicate requests yield one ledger row and the expected balance once. |
| FR-ECO-003 | P0 | Reversal or adjustment MUST use a compensating ledger entry with actor and reason; history MUST never be overwritten. | Admin adjustment E2E shows original and compensating entries and an audit record. |
| FR-ECO-004 | P0 | Citizen MUST see current balance, transaction history, amount, reason, related event, and status. | UI test against seeded ledger verifies all fields and no other household entries. |
| FR-ECO-005 | P1 | Admin SHOULD be able to configure award values within validated limits, with effective version and audit history. | Boundary tests reject negative/out-of-range values; two events preserve their respective rule versions. |

### 8.6 Portals, tracking, and municipal operations

| ID | Priority | Requirement | Acceptance evidence |
|---|---|---|---|
| FR-CIT-001 | P0 | Citizen portal MUST show own profile, recent collections, EcoCredits, verified penalties/disputes, and privacy-safe vehicle status. | Citizen journey E2E completes all sections using `HH-10452`; cross-household network calls fail. |
| FR-OPS-001 | P0 | Operator portal MUST support identifier lookup, category/session control, sensor/device health, result, queue count, and safety/offline alerts. | HIL-assisted E2E completes accepted, flagged, degraded, and offline sessions. |
| FR-ADM-001 | P0 | Admin portal MUST show fleet health/location, events, flagged queue, review actions, EcoCredit/penalty audit, and summary analytics. | Admin demo checklist reaches each view and performs one accepted review and one verified violation. |
| FR-TRK-001 | P0 | Provisioned vehicle MUST submit versioned location samples with fix time, received time, coordinates, and quality/fix state. | Contract and ingestion tests accept valid range and reject impossible coordinates. |
| FR-TRK-002 | P0 | Tracking UI MUST show last-update age and change from live to stale/offline after configurable thresholds. | Fake-clock test verifies state transitions; screenshot evidence shows stale label. |
| FR-TRK-003 | P0 | Citizen tracking MUST reduce precision or expose route/ETA status, while operator/admin may see precise prototype coordinates. | Role comparison test proves different response/view precision. |
| FR-ADM-002 | P1 | Admin SHOULD provide ward/category/compliance/event and fleet-health summaries without exposing raw secrets. | Seeded aggregate values reconcile to source rows; export contains no credential or unnecessary PII. |
| FR-IOT-001 | P1 | Admin SHOULD provide a component-level IoT-control view with last-seen age, health, source, queue, and exact failed component. | Forced IR/moisture/GPS/edge failures render distinct truthful states; no secret/raw identifier appears. |
| FR-ML-001 | P1 | After the core gate, an admin MAY import a validated optional ML observation for an existing event; it MUST remain provenance-labelled supporting evidence and MUST NOT mutate decisions, credits, or penalties. | RBAC/schema/idempotency tests pass and before/after database assertions prove zero value/state side effects. |

### 8.7 Audit, configuration, and notification

| ID | Priority | Requirement | Acceptance evidence |
|---|---|---|---|
| FR-AUD-001 | P0 | Security- or value-sensitive mutations MUST emit an append-only audit record with actor/device, action, target, timestamp, correlation ID, and redacted metadata. | Tests cover review, penalty, dispute resolution, rule change, device disablement, and EcoCredit adjustment. |
| FR-AUD-002 | P0 | All services MUST propagate `event_id`/correlation identifiers so a collection can be traced from device to UI. | Demo trace search returns firmware receipt, edge queue/sync, cloud event, rule result, and ledger/review action. |
| FR-CFG-001 | P0 | Contract version, rule version, thresholds, and demo configuration MUST be explicit; unsupported contract versions MUST fail safely. | Compatibility test accepts v1 and rejects unsupported v99 with a clear terminal reason. |
| FR-NOT-001 | P0 | In-app notifications MUST cover accepted/EcoCredit, flagged, reviewed/penalized, dispute, and critical vehicle/sync states as appropriate to the role. | E2E fixtures produce the expected notifications once without leaking other-household content. |

## 9. Non-functional requirements

| ID | Category | Requirement | Acceptance evidence |
|---|---|---|---|
| NFR-SEC-001 | Security | TLS MUST protect edge-to-cloud and browser-to-cloud traffic; device/cloud secrets MUST not be committed or exposed to clients. | Secret scan is clean; production/preview endpoints use HTTPS; client bundle inspection finds no service credential. |
| NFR-SEC-002 | Authorization | Supabase RLS and server-side role checks MUST enforce tenant/role boundaries on every protected entity. | Automated negative-access matrix passes for citizen/operator/admin/anonymous roles. |
| NFR-SEC-003 | Input safety | API and edge inputs MUST be schema-validated, size-bounded, rate-limited where exposed, and safely logged. | Fuzz/abuse fixtures return controlled errors with no stack trace, injection, or secret in logs. |
| NFR-PRV-001 | Privacy | Demo MUST use synthetic citizen data; operator views and logs MUST minimize PII, and GPS precision/retention MUST be role-appropriate. | Data inventory review and UI/log inspection pass; no real participant phone/address is stored. |
| NFR-REL-001 | Reliability | Device/cloud ingestion and EcoCredit/penalty creation MUST be idempotent across retries and concurrent duplicate delivery. | Retry, replay, and concurrency tests show one canonical event/value transaction. |
| NFR-REL-002 | Offline | A valid event acknowledged by edge MUST survive process restart and at least 30 minutes of cloud outage in the demo profile. | Offline soak queues >= 20 events, restarts gateway, reconnects, and reconciles counts/hashes. |
| NFR-PERF-001 | Performance | Under demo load, local edge acknowledgement SHOULD be <= 500 ms p95 and normal cloud reads SHOULD be <= 1 s p95 on the test network. | Timestamped 100-request report records p50/p95/error rate and environment. |
| NFR-TRK-001 | Freshness | Active GPS samples SHOULD reach admin view within 15 seconds under normal connectivity; stale state MUST be truthful when this target is missed. | Timed HIL/live test records device, cloud, and rendered timestamps. |
| NFR-ACC-001 | Accessibility | Core portal flows MUST be keyboard-operable, have visible focus, labeled controls, sufficient contrast, and text alternatives/status announcements. | Automated accessibility scan plus manual keyboard checklist has no critical issue in P0 pages. |
| NFR-OBS-001 | Observability | Web, edge, and firmware diagnostics MUST expose actionable health without logging secrets or full sensitive payloads. | A forced device/sync/API failure is diagnosable by correlation ID and redaction test passes. |
| NFR-MNT-001 | Maintainability | TypeScript MUST use strict mode; Pydantic models and JSON contracts MUST remain version-aligned; rules engine MUST stay pure. | Typecheck, Python tests, contract parity tests, and dependency-boundary checks pass in CI. |
| NFR-DEM-001 | Demo resilience | The judged story MUST have tested hardware, local-recorded, and seeded-cloud fallback levels, each honestly labeled. | `14_DEMO_JUDGING_PLAN.md` fallback drill passes and backup assets are available offline. |

## 10. Canonical states and invariants

### 10.1 Orthogonal state dimensions

- **Collection processing:** `CAPTURED -> EVALUATING -> ACCEPTED | FLAGGED -> REVIEW_ACCEPTED | VERIFIED_VIOLATION -> PENALIZED -> CLOSED`.
- **Synchronization:** `PENDING -> IN_FLIGHT -> ACKED | AUTH_BLOCKED | DEAD_LETTER`; retryable failures return to `PENDING` with a future `nextAttemptAt`.
- **Penalty:** `NONE -> PENDING_BILL -> BILLED | DISPUTED -> WAIVED | PAID`.
- **Vehicle connectivity:** `ONLINE -> DEGRADED -> OFFLINE`; location freshness is `LIVE -> STALE -> UNAVAILABLE`.

Processing state and synchronization state MUST NOT be collapsed into one ambiguous `status` field.

### 10.2 Release invariants

1. Sensor evidence never directly creates a penalty.
2. A collection event is immutable after canonical ingestion except for explicit state transitions and linked append-only records.
3. A unique event can award EcoCredits at most once.
4. Every penalty references a human review; every review references a flagged event.
5. Edge acknowledges only after durable local persistence.
6. Duplicate delivery returns the existing canonical result.
7. Missing sensor data is `unavailable/invalid`, never zeroed or fabricated.
8. Every displayed live position includes freshness.
9. Real credentials and real citizen PII never enter the repository or demo dataset.
10. Every contract-breaking or structure/scope change follows `CHANGE_REQUEST -> PARTH AJMERA approval -> ADR -> team notification`.

## 11. Minimum event contract semantics

The detailed schemas live only in `packages/contracts`; this section defines product-required meaning.

| Envelope | Required semantics |
|---|---|
| `CollectionEventV1` | `contract_version`, unique `event_id`, device/vehicle/household/session references, declared category, event/device time, readings with unit and validity, location/fix state, firmware version, correlation/idempotency key |
| `LocationSampleV1` | vehicle/device identity, coordinate or explicit no-fix, fix time, received time, accuracy/quality, sequence/idempotency key |
| `HeartbeatV1` | device/firmware identity, uptime, connectivity, enabled sensor health, edge association, local queue visibility where appropriate |
| `CloudSyncMessageV1` | gateway identity, edge receipt time, payload hash, one stable message, contract version |
| `SyncAckV1` | per-record `accepted`, `already_known`, `retryable_rejection`, or `terminal_rejection`, canonical server ID/status, reason code |

All money-like values use integer minor units; EcoCredits use integers; weights use kilograms as normalized decimal values; timestamps use UTC ISO 8601 plus a stored device-time quality indicator.

## 12. Acceptance and release gates

### Gate G0 - Plan and contract freeze

- Canonical tree exists; owners understand assigned paths.
- v1 contracts, enums, seed identities, and requirement IDs are frozen.
- No unresolved P0 `CHANGE_REQUEST` exists.

### Gate G1 - Vertical hardware slice

- Real ESP32 -> LAN edge -> SQLite -> cloud -> admin event view works for one valid event.
- Correlation/event ID is visible at each hop.

### Gate G2 - Product truth

- Accepted event awards EcoCredits exactly once.
- Mismatch becomes flagged, not penalized.
- Authorized review can accept or verify violation; citizen can dispute.

### Gate G3 - Resilience and safety

- Offline queue/restart/reconnect reconciliation passes.
- Invalid sensor and fire/safety cases fail safely.
- Stale GPS is labeled; role and RLS negative tests pass.

### Gate G4 - Judge-ready release

- CI/typecheck/tests pass; P0 traceability has evidence.
- Demo reset and all three fallback levels are rehearsed.
- Team can state limitations honestly: prototype, simulated billing, synthetic data, no AI/autonomous sorting.

## 13. Dependencies, assumptions, and constraints

- A shared Wi-Fi/LAN can be created locally for ESP32-to-edge communication; internet may disappear and must not stop local capture.
- The edge gateway runs on a team laptop/local machine with enough persistent storage for the demo.
- Supabase and Vercel credentials are shared through a secure channel, not Git or group chat.
- RFID reliability is not assumed; QR fallback is a required continuity path.
- GPS may be difficult indoors. A clearly labeled prerecorded/simulated coordinate stream may be used as fallback, but must use the same v1 contract and must not be presented as live hardware GPS.
- Sensor thresholds require calibration against the physical prototype and environment; demo values are evidence, not scientific classification claims.
- The municipality, payout provider, and billing system are not integrated; all citizen, credit, and penalty records are synthetic/simulated.

## 14. Open items that do not authorize scope drift

These items must be resolved as configuration or a `CHANGE_REQUEST`; contributors may not invent independent answers:

- Exact ESP32 pins and final sensor bill of materials after breadboard validation.
- Final moisture/load-cell calibration bands and which optional safety sensors are physically enabled.
- Demo LAN SSID/IP reservation and device credential provisioning procedure.
- EcoCredit amount and simulated penalty value used in seed data.
- GPS precision and history-retention values for the demo configuration.
- Review reason codes and dispute-resolution wording approved by PARTH AJMERA.

## 15. Definition of product success

The MVP succeeds when a judge can watch a real tagged household collection travel from ESP32 hardware through a resilient local gateway to the municipal platform; see an explainable accepted event award auditable EcoCredits; see an ambiguous event pause for human review before any simulated penalty; observe offline recovery and truthful live/stale tracking; and inspect evidence proving that every important transition is secure, idempotent, and traceable.
