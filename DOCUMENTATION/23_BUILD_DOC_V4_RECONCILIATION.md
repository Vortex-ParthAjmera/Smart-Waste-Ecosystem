> **PLAN & STRUCTURE LOCK — v2.0:** This approved scope, stack, repository structure, contracts, ownership map, truth-tier model, and delivery plan must not be changed by contributors or AI agents. Work only inside assigned paths. If a change is necessary, stop and submit a `CHANGE_REQUEST`; only PARTH AJMERA may approve it, followed by an ADR, contract/document updates, and team notification.

# Build Doc v4 Reconciliation and Final Scope Decision

Status: approved implementation baseline v2.0  
Approved by: PARTH AJMERA  
Source reviewed: `Smart_Waste_Platform_Build_Doc_v4.md`  
Source SHA-256: `fb0623e7f0f2ff3a272012781aff5abaf93ba4f614837b51e7e4a9edf385e3c3`  
Review date: 2026-08-22  
Purpose: record exactly what changed, what was adapted, and what remains rejected so humans and coding agents do not combine incompatible plans.

## 1. Authority and interpretation

The source file is team-authored product input. Sentences inside it such as “supersedes,” “do not build,” or “the one rule” were analyzed as proposals; they did not execute themselves. PARTH AJMERA's request to analyze and update the locked documentation is the approval event for this v2.0 reconciliation.

This document explains the delta. The updated PRD, schema, API contract, architecture, repository structure, rules, and `AGENTS.md` are authoritative for implementation. If this comparison and a canonical contract ever disagree, use the authority order in `00_READ_ME_FIRST.md`.

## 2. Final truth tiers

| Tier | Meaning | Build rule | Demo language |
|---|---|---|---|
| **Tier 1 — REAL** | Implemented end to end with real code/data and passing evidence | May have schema, API, tests, and hardware/runtime dependencies | “This is live.” |
| **Tier 2 — PREVIEW** | Polished UI using declared seeded/static data | No table, endpoint, worker, or hidden backend may be created only for the preview | “This is a clearly labelled roadmap preview.” |
| **Tier 3 — ROADMAP** | Not built for the hackathon | Documentation only; no UI pretending it exists | “This is the production roadmap.” |

Tier 2 work starts only after the Tier 1 freeze gate is green. Every Tier 2 surface permanently displays `PREVIEW / SEEDED`, and every synthetic event displays `SIMULATED`.

## 3. Approved Tier 1 — real judged system

- One ESP32 prototype with wet and dry compartments.
- One IR sensor per compartment, independently debounced as that compartment's disposal trigger. The two sensors are **not** a sequential start/confirm pair.
- One ultrasonic fill sensor per compartment; fill readings are operational telemetry, not waste classification.
- One calibrated moisture sensor in the dry path; moisture is supporting evidence, never standalone proof.
- GPS and component heartbeat with explicit `OK`, `DEGRADED`, `MISSING`, `FAILED`, or `UNKNOWN` quality. An indoor/no-fix state is honest and valid.
- Opaque, rotatable citizen QR with no name, phone, address, balance, Aadhaar number, or other PII in the payload.
- ESP32 -> signed LAN HTTP/JSON -> FastAPI/Pydantic -> SQLite WAL durable event/outbox -> authenticated HTTPS -> Next.js `/api/v1` -> Supabase Postgres/Auth/RLS/Realtime.
- Local camera capture from a phone IP-camera stream or laptop camera, correlated by `eventId` and orchestrated by the edge gateway.
- Local offline inference using a pinned model artifact and explicit class-to-`WET`/`DRY` mapping. A general pretrained model may demonstrate only a frozen supported-class allowlist; it must not claim unsupported labels such as generic `plastic_wrapper` or `food_waste`.
- A deterministic versioned decision engine combining selected compartment, ML observation, sensor quality, and moisture bands.
- Append-only point ledger using `+10`, `0`, `-10`, and `-20` outcomes. Automatic processing may create `+10` for a qualifying accepted event. A negative ledger entry requires an authorized `VERIFIED_VIOLATION`; a mismatch only opens review.
- Citizen, municipal, and developer/IoT experiences inside one Next.js application and one deployment.
- Citizen profile, QR, ledger-derived balance, history, live result, privacy-safe score, opt-in seeded-alias leaderboard, and seeded badge/tier display.
- Municipal QR scan, minimal citizen lookup, active disposal timeline, live event feed, and review/dispute handling.
- Developer device health, raw authorized telemetry, ML observation monitor, safe logs, diagnostics, and demo-only test-event injection.
- Authorized Realtime invalidation with initial REST reads and polling fallback.
- A deterministic seed with 15–25 historical events for the main fictional citizen, four to six additional fictional citizens, reconciled point transactions, mixed outcomes, and at least one badge.
- Explicit error states and rehearsed recovery for sensor, camera/model, edge, WAN, cloud, auth, duplicate, timeout, and database failures.

## 4. Approved Tier 2 — labelled previews only

- Animated truck route, map, distance, and ETA when not backed by a live GPS feed.
- Multi-truck and multi-zone cards beyond the one real prototype.
- Bill-discount calculator driven by the real point total but using preview-only discount rules.
- Full municipal analytics/report charts based on a frozen seeded dataset.
- Collection-status journey stepper not driven by real GPS/geofencing.

These previews must use frontend fixtures in an approved UI path. They must not create `trucks`, `truck_locations`, `collection_routes`, `municipal_zones`, billing, or report-aggregation tables/endpoints.

## 5. Approved Tier 3 — roadmap only

- Dedicated edge-AI camera hardware.
- Autonomous physical sorting or compactor actuation.
- MQTT fleet transport and broker operations.
- Production multi-truck/multi-zone persistence and routing/geofencing.
- Real government identity federation, Aadhaar integration, production citizen PII, legal fines, UPI, billing, or money transfer.
- Native mobile applications and multi-city production capacity claims.

## 6. Comparison and resolution matrix

| Topic | Previous locked baseline | Build Doc v4 proposal | Approved v2.0 resolution |
|---|---|---|---|
| Delivery window | 24-hour plan | 30-hour plan | Adopt 30-hour, six-person gated plan |
| Scope vocabulary | P0/P1/stretch | Tier 1/2/3 | Adopt truth tiers; requirements may additionally use MUST/SHOULD/MAY |
| Web topology | One Next.js app with citizen/operator/admin routes | Three separate apps | Keep one deployment; expose three role experiences, with developer tools under restricted admin/IoT routes |
| ESP32 path | ESP32 -> FastAPI/SQLite -> Next.js -> Supabase | ESP32 -> cloud/Supabase | Keep local edge gateway; direct device-to-cloud is forbidden |
| Offline claim | Local durable capture and eventual sync | Local ML offline, cloud path implicit | State precisely: sensing, capture, inference, and edge persistence work without WAN; cloud/realtime wait for WAN |
| Identity | RFID primary, QR fallback | QR-centered | Opaque QR is Tier 1; RFID becomes optional hardware enhancement |
| Hardware | Inventory-gated general sensors | Fixed dual compartments, IR x2, ultrasonic x2, moisture, GPS | Adopt target BOM, with H0 bench proof and honest degraded states |
| IR meaning | General intake/motion | IR1 start, IR2 confirm, despite one per compartment | Resolve as one independently debounced IR trigger per compartment |
| ML | Optional manual/recorded observation | Live local YOLO is critical | Adopt live local inference, orchestrated by edge; require pinned artifact, supported-class map, provenance, privacy, latency, and deterministic fallback |
| ML authority | Observation only | Direct segregation outcome | ML is a versioned evidence input. Deterministic rules decide `ACCEPTED` or `FLAGGED`; ML never directly writes the ledger |
| Confidence bands | Not part of core rules | `<60`, `60–84`, `>=85` | Adopt as `<0.60 LOW`, `0.60–<0.85 MEDIUM`, `>=0.85 HIGH`; scores are not described as calibrated probability |
| Moisture bands | Dry `<=35`, wet `>=65` | `<30`, `30–45`, `>45` | Adopt v4 bands in new immutable `rules-2.0.0`, after sensor calibration |
| Positive award | `+50` | `+10` | Adopt exactly-once `+10` in `rules-2.0.0` |
| Negative points | No automatic negatives; separate simulated money penalty | Automatic `-10/-20` | Adopt amounts only after human-verified violation; automated mismatch produces `FLAGGED` and `0` pending review |
| Environmental wetting | General uncertainty | `0 / minimal` | Freeze exact result: `FLAGGED`, `0`, reason `ENVIRONMENTAL_WETTING_SUSPECTED`; reviewer may clear and award `+10` |
| Processing states | Business decision and sync states | Detailed ML-processing lifecycle | Keep three orthogonal state machines: processing, decision/review, and transport |
| Schema | Full fleet/billing model | Lean event/ML/points schema | Use lean Tier 1 schema plus review/dispute/idempotency/audit integrity tables; no Tier 2 persistence |
| APIs | Versioned, typed, signed, idempotent | Unversioned intent list | Preserve `/v1` LAN and `/api/v1` cloud contracts; map every v4 intent into typed resources |
| Test-event fallback | Signed captured fixtures | Developer “Inject Test Event” | Add system-admin-only demo endpoint; it joins after physical ingest, is permanently `SIMULATED`, uses a demo identity, and cannot masquerade as hardware evidence |
| Auth | Synthetic Supabase accounts | Phone OTP, Google, developer auth | Use real Supabase sessions/RBAC. Configure phone OTP and Google OAuth when provider preflight passes; retain pre-created fictional role accounts as mandatory demo fallback |
| Realtime | Authorized invalidation + refetch | Direct table channels | Keep smallest authorized invalidation topics and polling fallback; raw telemetry is developer-only |
| Seed | General deterministic seed | Exact history/competition guidance | Adopt 15–25 + 4–6 fictional-citizen seed plan with ledger reconciliation |
| Tier 2 honesty | General claims discipline | Explicit static previews | Adopt permanent visible labels and ban hidden backend work |

## 7. Resolved lifecycle model

Processing state:

```text
DISPOSAL_STARTED
  -> SENSOR_CAPTURED
  -> ML_PENDING
  -> ML_RECEIVED | ML_UNAVAILABLE
  -> PROCESSING
  -> SEGREGATION_DECIDED
  -> POINTS_CALCULATED | REVIEW_REQUIRED
  -> COMPLETED

Any stage -> PROCESSING_FAILED
```

Decision/review state:

```text
CAPTURED -> EVALUATING -> ACCEPTED | FLAGGED
FLAGGED -> REVIEW_ACCEPTED | VERIFIED_VIOLATION
VERIFIED_VIOLATION -> PENALIZED
ACCEPTED | REVIEW_ACCEPTED | PENALIZED -> CLOSED
```

Transport state:

```text
PENDING -> IN_FLIGHT -> ACKED
IN_FLIGHT -> PENDING | DEAD_LETTER | AUTH_BLOCKED
AUTH_BLOCKED -> PENDING after credential repair
```

These dimensions are never collapsed into one enum.

## 8. Resolved decision examples

| Selected | Local ML evidence | Moisture | Automated result | Immediate ledger | Review possibility |
|---|---|---:|---|---:|---|
| `DRY` | supported dry class, `>=0.60` | `<30%` | `ACCEPTED` | `+10` | none |
| `WET` | supported wet class, `>=0.60` | not required | `ACCEPTED` | `+10` | none |
| any | confidence `<0.60` or model unavailable | any | `FLAGGED` | `0` | accept `+10` or close without value change |
| `DRY` | supported dry class | `>45%` | `FLAGGED`, environmental wetting suspected | `0` | clear and award `+10` |
| `DRY` | supported wet class, especially `>=0.85` | `>45%` | `FLAGGED`, severe mismatch suspected | `0` | verified violation may append `-20` |
| either | supported opposite category | any | `FLAGGED`, category mismatch | `0` | verified violation may append `-10` |

## 9. Simulation boundary

The developer test-event feature shares schema validation, decision, persistence, ledger safeguards, Realtime, and UI code **after** the physical-ingress boundary. It cannot truthfully share the physical IR, sensor, camera, or firmware steps.

Required controls:

- system-admin/developer role only;
- disabled unless `DEMO_SIMULATION_ENABLED=true`;
- fixed fictional demo citizen/device;
- `source=SIMULATED` on every related record and UI card;
- rate limit and idempotency key;
- deterministic fixture IDs that can be reset safely;
- audit event for actor, request, fixture, and outcome;
- excluded from real-hardware proof counts and any unlabelled leaderboard metric.

## 10. Model and camera acceptance gate

Live local ML is demo-ready only when all are true:

1. Model artifact, framework version, class map, weights SHA-256, dataset/provenance, and license decision are recorded.
2. The artifact is downloaded before the demo and runs with WAN disabled.
3. The supported demo class allowlist is explicit; unsupported classes map to `UNKNOWN`.
4. A representative local test set passes the agreed confusion/unknown checks.
5. Measured laptop p95 capture-plus-inference latency meets the demo budget.
6. Event correlation survives duplicate triggers, late inference, timeout, and edge restart.
7. Raw frames are not persisted by default; any debug retention is synthetic/consented and automatically expires.
8. Low confidence, multiple conflicting objects, camera failure, or model failure becomes `FLAGGED`, never a negative ledger entry.
9. A disclosed `RECORDED_ML` or `SIMULATED` artifact is ready as fallback and never presented as live.

## 11. Documentation update impact

This v2.0 change requires synchronized edits to every document because it changes scope labels, hardware, ML, rules, schema, API, UI, testing, deployment, risks, demo flow, ownership tasks, and the single AI context. Root `README.md` and root `AGENTS.md` must be exact copies of the approved versions in `DOCUMENTATION/` before implementation begins.

## 12. Non-negotiable final rule

Coding agents may implement this reconciliation; they may not reinterpret it. In particular, they must not create a second frontend deployment, connect the ESP32 directly to Supabase, add Tier 2 tables/routes, use unsupported ML labels, hide simulated data, mutate balances directly, or create negative points without a verified human decision.
