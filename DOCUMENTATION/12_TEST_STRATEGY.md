> **PLAN & STRUCTURE LOCK — v2.0:** This approved scope, stack, repository structure, contracts, ownership map, truth-tier model, and delivery plan must not be changed by contributors or AI agents. Work only inside assigned paths. If a change is necessary, stop and submit a `CHANGE_REQUEST`; only PARTH AJMERA may approve it, followed by an ADR, contract/document updates, and team notification.

# Test Strategy and Quality Gates

Status: approved quality baseline v2.0

QA, seed, CI, and evidence owner: BHUMIKA SINGH RAWAT

Final release acceptance: PARTH AJMERA

Hardware/HIL owner: KRISHNA PANWAR

Edge and local-ML test owner: ADITYA SILSWAL

Cloud/rules test owner: AASHU JOSHI

Web/E2E owner: YASHVARDHAN DOBHAL

## 1. Quality objective

Testing must prove the complete Tier 1 claim, not merely that each module compiles:

```text
real QR + physical compartment trigger + sensors + camera
  -> durable local edge custody and offline inference
  -> duplicate-safe cloud processing
  -> accepted +10 OR FLAGGED 0
  -> authorized reviewed +10/-10/-20
  -> isolated, correctly labelled role views
```

The highest-priority properties are durability, event correlation, idempotency, RLS/RBAC, model/source truth, and the rule that automation never creates negative points. A polished screen cannot compensate for a failed property.

## 2. Truth-tier quality policy

| Tier | Test requirement | Release rule |
|---|---|---|
| **Tier 1 — REAL** | Automated tests plus real-device/runtime evidence for every live claim | All required gates pass before H24 Tier 1 freeze |
| **Tier 2 — PREVIEW** | Fixture integrity, permanent-label, accessibility, and zero-backend regression checks | Runs only after Tier 1 freeze; remove a failing preview |
| **Tier 3 — ROADMAP** | Documentation/claims review only | No application code, route, table, worker, or fake screen |

No required failure may be ignored, disabled, marked flaky without evidence, or converted to a warning to obtain a green merge.

## 3. Release gates

| Gate | Required proof | Owner |
|---|---|---|
| Contract | JSON Schema/OpenAPI and canonical valid, invalid, duplicate, conflict, ML, and simulation fixtures agree across consumers | PARTH AJMERA + affected owners |
| Web | Format/lint, strict typecheck, unit/component tests, Playwright critical flows, accessibility smoke, production build | YASHVARDHAN DOBHAL |
| Edge | Ruff/typing/Pytest, signed ingest, SQLite durability/restart, camera/model orchestration, retry and fault states | ADITYA SILSWAL |
| Firmware | PlatformIO clean compile, contract snapshots, debounce/range tests, real serial/HIL evidence | KRISHNA PANWAR |
| Database | Fresh reset, deterministic seed, constraints, functions, idempotency, RLS allow/deny, ledger reconciliation | BHUMIKA SINGH RAWAT |
| Cloud/rules | Auth guards, strict validation, transaction/concurrency tests, rules-2.0.0 decision matrix | AASHU JOSHI |
| Integration | One physical event reaches all boundaries once; WAN/restart and model failure recover truthfully | all technical owners |
| Security/privacy | Secret scan, role isolation, replay protection, frame/PII retention checks, safe logs | BHUMIKA SINGH RAWAT + PARTH AJMERA |
| Demo | Two consecutive full rehearsals and every approved fallback exercised | PARTH AJMERA |

## 4. Test data and evidence rules

- Use only deterministic fictional citizens, identifiers, addresses, devices, events, camera inputs, and ledger entries.
- The main fictional citizen has 15–25 historical events; four to six additional fictional citizens provide opt-in seeded-alias leaderboard data.
- Every seeded event has matching event state, rule version, source label, review result where applicable, and ledger entry. The displayed balance must equal the ledger sum.
- At least one accepted, environmental-wetting, low-confidence, reviewed violation, dispute, sensor-degraded, model-unavailable, WAN-queued, duplicate, and `SIMULATED` event exists.
- Event provenance uses only `HARDWARE`, `RECORDED_HARDWARE`, `SIMULATED`, or `SEEDED`; ML/evidence provenance uses only `LOCAL_LIVE`, `RECORDED_ML`, `SIMULATED`, or `SEEDED`.
- UI maps those sources only to `REAL`, `RECORDED`, `SIMULATED`, or `PREVIEW/SEEDED`; Tier 2 fixtures are never persisted.
- Raw frames are not retained by default. Debug captures must be synthetic or explicitly consented, access-restricted, and deleted by the documented expiry/reset procedure.
- Every acceptance artifact records commit SHA, firmware version, edge version, schema migration, contract version, ruleset version, model/runtime version, weights hash, device ID, timestamp, environment, and pass/fail.

## 5. Test layers

### 5.1 Static and unit tests

| Area | Required unit coverage |
|---|---|
| Rules engine | score bands, class map, moisture bands, quality, deterministic reason order, accepted/flagged output, reviewed value policy |
| Cloud domain | auth/role mapping, state transitions, idempotency claims, ledger/review transaction orchestration, safe errors |
| Web | typed envelope parsing, source/tier badge rendering, state/status mapping, pagination, access-aware navigation |
| Edge | HMAC verification, schema validation, payload hashing, SQLite transaction, leases, retry classification, event correlation, camera/model health |
| Firmware | stable IDs, per-compartment debounce, sensor range/quality, no-fix GPS, bounded JSON, retry identity |
| Database | constraint/function behavior, exact ledger balance, immutable rows, review-before-negative enforcement |

Business logic is tested outside React routes, FastAPI handlers, and database adapters wherever possible.

### 5.2 Contract tests

Each canonical fixture must be accepted or rejected identically by:

1. JSON Schema/OpenAPI validation;
2. FastAPI/Pydantic edge models;
3. Next.js/Zod cloud models;
4. firmware serialization assumptions;
5. database function/constraint expectations where applicable.

Required cases include:

- minimum and full valid physical event;
- wet and dry compartment values;
- missing field, extra field, wrong enum/version/unit/type, non-finite and boundary numbers;
- oversized body, malformed timestamp/UUID, unsupported model class, invalid confidence, and invalid health state;
- exact HMAC vectors and invalid/altered signatures;
- same ID/same body exact retry;
- same ID/different body `409 IDEMPOTENCY_CONFLICT`;
- event/ML result arriving late or twice;
- all event sources (`HARDWARE`, `RECORDED_HARDWARE`, `SIMULATED`, `SEEDED`) and all ML/evidence sources (`LOCAL_LIVE`, `RECORDED_ML`, `SIMULATED`, `SEEDED`);
- system-admin simulation request with idempotency key and fixed demo identity.

### 5.3 Integration tests

- Edge returns `202 QUEUED_LOCALLY` only after the message and outbox row commit.
- A process kill immediately after `202` retains and later synchronizes the row.
- A WAN outage leaves sensing, camera capture, local inference, SQLite receipt, and local status operational.
- Cloud timeout after commit is retried with the same body/key and returns the stored result.
- Retryable failures return to `PENDING`; `401/403` becomes `AUTH_BLOCKED`; terminal schema/conflict failures become `DEAD_LETTER`.
- One physical event, ML observation, decision, review, ledger effect, notification, and audit chain remains correlated by stable IDs.
- Realtime is an invalidation hint; reconnect/refetch and polling produce the same authorized result.
- Database unavailability produces a controlled dependency error and no partial event/ledger/review write.
- `POST /api/v1/developer/simulations` enters after physical-ingress validation and cannot claim or manufacture firmware, IR, sensor, camera, or live-ML evidence.

### 5.4 End-to-end tests

Required Playwright journeys:

1. Citizen login -> own profile/QR -> reconciled balance -> history -> live result -> dispute.
2. Municipal login -> QR scan -> minimum citizen view -> selected compartment -> active-disposal timeline -> result.
3. Developer/system-admin login -> component health -> queue -> authorized telemetry -> model monitor -> safe logs.
4. Matching physical event -> `ACCEPTED` -> exactly one `+10` visible after Realtime or polling.
5. Environmental wetting -> `FLAGGED 0` -> officer `REVIEW_ACCEPTED` -> exactly one `+10`.
6. Category mismatch -> `FLAGGED 0` -> authorized verified violation -> exactly one `-10`; severe wet-in-dry uses `-20`; citizen dispute remains append-only.
7. Sensor or camera/model unavailable -> honest degraded state, review route, no automatic negative.
8. System-admin test injection -> permanently `SIMULATED`, fixed demo identity, audit entry, excluded from real metrics.
9. Citizen A cannot access Citizen B through URL, API body, Realtime topic, or guessed identifier.
10. Every Tier 2 component remains `PREVIEW/SEEDED` at mobile and desktop widths.

## 6. Rules and fairness decision matrix

The following outcomes are non-negotiable for `rules-2.0.0`:

| Scenario | Automatic state | Immediate ledger | Permitted human outcome |
|---|---|---:|---|
| Supported dry class, score `>=0.60`, dry selected, moisture `<30%`, good evidence | `ACCEPTED` | `+10` once | none |
| Supported wet class, score `>=0.60`, wet selected, required evidence good | `ACCEPTED` | `+10` once | none |
| score `<0.60`, model unavailable, unsupported class, conflicting multiple objects | `FLAGGED` | `0` | accept `+10` or close `0` |
| supported dry class, dry selected, moisture `30–45%` | `ACCEPTED` with elevated evidence recorded | `+10` once | none |
| supported dry class, dry selected, moisture `>45%` | `FLAGGED`, `ENVIRONMENTAL_WETTING_SUSPECTED` | `0` | clear and append `+10` |
| supported opposite category | `FLAGGED`, category mismatch | `0` | verified violation may append `-10` |
| wet evidence in dry path with strong corroboration | `FLAGGED`, severe mismatch suspected | `0` | verified violation may append `-20` |
| missing/degraded sensor, invalid identity/session, safety hold | `FLAGGED` | `0` | approved review transition only |

Boundary tests cover confidence `0`, `0.59999`, `0.60`, `0.84999`, `0.85`, and `1`; moisture immediately below/at/above `30` and `45`; every health/quality enum; and all wet/dry/unknown class mappings.

Mandatory invariants:

- model scores are not described or tested as calibrated probability unless a separate validation proves calibration;
- no firmware, edge, ML adapter, route handler, or client can request a negative value;
- `FLAGGED` writes neither positive nor negative final value automatically;
- `REVIEW_ACCEPTED` may append `+10` once;
- `VERIFIED_VIOLATION` by an authorized reviewer is required before `-10/-20`;
- retries/concurrency never duplicate an event, review, or ledger entry;
- every decision retains ruleset and evidence provenance.

## 7. Physical hardware-in-loop protocol

KRISHNA PANWAR and ADITYA SILSWAL jointly run the following on the final physical assembly:

| Trial | Minimum repetitions | Pass condition |
|---|---:|---|
| Opaque QR scan/resolve | 5 | same fictional identity; no PII in QR/log |
| Wet-compartment IR debounce | 10 | one disposal produces one trigger; dry IR unaffected |
| Dry-compartment IR debounce | 10 | one disposal produces one trigger; wet IR unaffected |
| Wet/dry ultrasonic calibration | empty, midpoint, full x 3 each | bounded fill values and honest quality |
| Dry-path moisture calibration | 3 dry, 3 intermediate, 3 wet samples | recorded bands/tolerance; no universal-accuracy claim |
| GPS | valid fix plus indoor no-fix | coordinates valid or explicit no-fix; never `0,0` fallback |
| Heartbeat | 15-minute soak | no brownout; each component health and last-seen updates |
| Duplicate trigger/retry | 5 | stable event identity and one cloud effect |
| Sensor disconnect/reconnect | each enabled component | exact component shows degraded/failed then recovers |
| WAN disconnect/reconnect | at least 3 events | local capture/inference/queue continue; cloud later reconciles once |

Evidence links firmware serial, edge log, camera/model record, cloud event, ledger/review row, and UI card using the same event/correlation IDs. A screenshot without linked underlying evidence is not a HIL pass.

## 8. Camera and local-model acceptance

### 8.1 Artifact and provenance

- Model file, dependency/runtime versions, class names, class-to-category mapping, supported-class allowlist, weights SHA-256, dataset/provenance, and license decision are immutable release evidence.
- The model is downloaded before the demo and starts with WAN disabled.
- A general pretrained model may claim only allowlisted labels it actually supports. Unsupported items return `UNKNOWN`.
- Raw image/frame storage is off by default; logs store hashes and bounded metadata, not image bytes or URLs.
- `RECORDED_ML` is a disclosed non-live fallback and remains `FLAGGED 0` pending human review; it cannot substitute for `LOCAL_LIVE` in real-ML evidence counts.

### 8.2 Functional and fault tests

- valid supported dry and wet demo items;
- unsupported item and empty frame;
- multiple same-category objects and conflicting-category objects;
- blurred, dark, overexposed, partial, and rotated views;
- score bands LOW/MEDIUM/HIGH and exact thresholds;
- camera URL unavailable, timeout, stale frame, and disconnect/reconnect;
- missing/corrupt model, wrong hash, class-map mismatch, slow inference, and process crash/restart;
- duplicate IR capture and duplicate/late inference for one `eventId`;
- event B result cannot attach to event A;
- WAN off during capture/inference;
- forced fallback changes the source label and never appears as live.

### 8.3 Performance gate

Measure at least 30 warm captures on the actual demo laptop and camera network. Record p50, p95, maximum, failure rate, resolution, model/runtime, and CPU/GPU environment. Target capture-plus-inference p95 is `<= 2.0 s`. A miss is a release-blocking local-ML defect unless PARTH AJMERA activates the visibly disclosed recorded fallback; it never authorizes an unsupported accuracy or speed claim.

## 9. Edge, WAN, and idempotency fault matrix

| Injected fault | Expected result |
|---|---|
| Edge unavailable before receipt | firmware retries same message with bounded backoff; no success shown |
| Kill edge before SQLite commit | no `202`; caller retries safely |
| Kill edge immediately after `202` | committed row recovers after restart |
| WAN down | local ingest, ML, and queue continue; cloud marked unavailable/stale |
| Cloud timeout before commit | row returns to `PENDING` with same exact body/key |
| Cloud timeout after commit | retry receives stored result; one domain/ledger effect |
| Cloud `429/5xx` | bounded retry with `Retry-After`/jitter |
| Cloud `401/403` | `AUTH_BLOCKED`; no retry storm; critical health state |
| Cloud `400/413/422` | `DEAD_LETTER`; safe error retained |
| Same ID/same hash | existing receipt/result; no new row/effect |
| Same ID/different hash | `409 IDEMPOTENCY_CONFLICT`; audit/security visibility |
| Lease worker crash | lease expires/reclaims once; no concurrent double effect |
| Disk unwritable/full | readiness fails; no false durable ACK |

Queue-drain reconciliation compares unique IDs, hashes, row counts, and ledger sums before and after recovery.

## 10. Auth, RLS, privacy, and abuse tests

- Anonymous users cannot access any role data or private Realtime topic.
- Citizen can read only their linked fictional household, events, ledger, review result, and dispute.
- Municipal operator sees only the minimum lookup/current-event information and cannot decide a review or mutate values.
- Reviewer/admin can act only through authorized state-changing APIs with reason and idempotency key.
- Developer/system-admin telemetry, logs, ML monitor, and simulation are denied to other roles.
- Browser-supplied role, household, score, point amount, source, actor, and audit values are ignored/rejected.
- Service-role, gateway, device, Wi-Fi, model-store, and auth secrets do not appear in browser bundles, firmware source, logs, screenshots, seed, or Git diff.
- QR is opaque and rotatable; raw identifier is redacted and cannot be enumerated.
- Simulation requires the feature flag, system-admin session, fixed identity, rate limit, audit, and idempotency key.
- Phone OTP and Google OAuth are tested only when provider preflight is green; pre-created fictional accounts remain a tested mandatory fallback.
- Stored-XSS, CSV formula, oversized input, malformed JSON, and log-injection cases fail safely.
- Realtime subscriptions enforce the same row authorization as REST reads.

## 11. Seed and ledger reconciliation tests

After every clean reset:

1. the main fictional citizen has between 15 and 25 historical events;
2. four to six additional fictional citizens exist with safe seeded aliases;
3. every event has valid source, state, category, reason, rule version, time, and evidence-health fields;
4. accepted and review-accepted events have exactly one `+10` entry;
5. flagged-pending events have no ledger entry/value effect;
6. reviewed violations have one authorized `-10` or `-20` entry;
7. every displayed balance equals the append-only ledger sum;
8. at least one badge/tier display derives from the seeded balance/rule and is not an independently editable balance;
9. `SIMULATED` events are fixed-identity, permanently labelled, and excluded from real-hardware/leaderboard proof metrics;
10. running the seed/reset twice produces the documented counts and hashes without duplicate effects.

## 12. Tier 2 preview tests

- Preview components import only approved frontend fixtures.
- Network interception while navigating previews shows no Tier 2-specific request.
- Migration/schema diff contains no Tier 2 table or function.
- `PREVIEW/SEEDED` is visible without interaction on every card, chart, map, stepper, modal, screenshot, and viewport.
- Screen reader text includes the preview status; color is not the only distinction.
- A preview never displays “live,” “real-time,” or a changing timestamp sourced from a local animation.
- Deleting/disabling the entire preview module leaves all Tier 1 checks green.

## 13. Prototype performance and reliability targets

| Measure | Release target |
|---|---:|
| Edge durable LAN acknowledgement | p95 `< 300 ms` on demo laptop/LAN |
| Camera capture plus local inference | p95 `<= 2.0 s` over 30 warm trials |
| Cloud event processing after sync | p95 `< 2.0 s` under rehearsal load |
| UI update | `< 5 s`, or visible by next polling interval |
| Edge restart recovery visibility | `< 10 s` |
| Heartbeat soak | 15 minutes without brownout or silent component failure |
| Offline queue trial | at least 20 unique events, zero loss/duplicate effects |
| Seed/reset repeatability | two consecutive resets with matching counts/hashes |

These are measured prototype targets, not production SLOs or scale claims.

## 14. CI and human-only checks

CI runs every applicable format, lint, type, unit, contract, database, security, and build check by changed path. CI fixtures never require a live secret or hosted production project. HIL flashing, camera privacy inspection, model-license approval, live OAuth/OTP provider tests, and final visual/claims review remain human gates with uploaded evidence.

Before a PR is ready:

- [ ] Linked issue, owner, branch, allowed paths, Tier, and acceptance criteria are present.
- [ ] Applicable commands and exact results are listed; unrun checks say `NOT RUN` with reason.
- [ ] New behavior includes positive, negative, retry, authorization, and degraded-state coverage.
- [ ] Schema/contract change has synchronized fixtures/consumers/docs and approved change control.
- [ ] UI evidence includes mobile/desktop, keyboard, and permanent source/tier labels.
- [ ] No secret, PII, raw frame, runtime database, or unrelated lockfile is included.
- [ ] Author and designated reviewer inspect the full diff.

## 15. Bug severity and freeze policy

| Severity | Examples | Release action |
|---|---|---|
| P0 | data loss, duplicate event/value, auth/RLS bypass, secret/PII/frame leak, automatic negative, false live/source label, unsafe hardware, cannot start | stop; repair before any merge/release |
| P1 | Tier 1 hardware/edge/model/cloud/fairness journey wrong or unreliable with no acceptable fallback | fix before G6 |
| P2 | non-critical usability or preview defect with safe removal | fix before H26 or remove/document |
| P3 | cosmetic/roadmap request | defer |

After H20, only reproducible Tier 1 P0/P1 fixes may alter product/runtime code. After H26, no feature change is permitted. A passing clock or demo pressure never waives integrity, security, fairness, or truth-labelling tests.
