> **PLAN & STRUCTURE LOCK — v1.0:** This approved scope, stack, repository structure, contracts, ownership map, and delivery plan must not be changed by contributors or AI agents. Work only inside the assigned paths. If a change is necessary, stop and submit a `CHANGE_REQUEST`; only PARTH AJMERA may approve it, followed by an ADR and team notification.

# SGV 2.0 — 24-Hour Parallel Implementation Plan

Status: Approved delivery baseline  
Plan version: 1.0  
Team: PARTH AJMERA, YASHVARDHAN DOBHAL, AASHU JOSHI, KRISHNA PANWAR, ADITYA SILSWAL, BHUMIKA SINGH RAWAT  
Clock convention: `H0` is hackathon implementation kickoff, not a fixed wall-clock time

## 1. Delivery objective

By H24, demonstrate one reliable, auditable journey using real ESP32 input:

~~~text
RFID/identifier + real sensor readings
  → durable local FastAPI receipt
  → offline-capable idempotent cloud sync
  → collection decision
  → accepted reward OR flagged human verification
  → citizen/admin visibility
  → live vehicle/device operational status
~~~

The build wins by showing a complete vertical slice, explainable decisions, real hardware, failure resilience, and transparent credits. A large collection of disconnected screens is not success.

## 2. Frozen MVP

### Must be complete

- Real ESP32 firmware with RFID/identifier input and at least two real sensor readings.
- FastAPI edge gateway on the vehicle LAN.
- Durable SQLite outbox before device acknowledgement.
- Outbound, authenticated, idempotent cloud synchronization.
- Next.js citizen, operator, and admin experiences.
- Supabase Auth, Postgres, Realtime, migrations, RLS, and deterministic demo seed.
- Accepted-versus-flagged rules with stored ruleset version and reason codes.
- Immutable reward/credit ledger with duplicate protection.
- Human verification before any penalty.
- Citizen collection/credit/penalty/dispute visibility.
- Admin verification, fleet/device health, and core analytics.
- Explicit offline, stale, degraded-sensor, and error states.
- Automated checks plus a rehearsed backup demo.

### Explicitly deferred

- Production/in-line computer-vision or ML waste classification. The only exception is the optional, non-blocking presentation sidecar under `scripts/demo/ml/**` governed below.
- Real UPI payouts, payment credentials, or municipal billing integration.
- Automatic sensor-triggered financial penalties.
- Native Android/iOS applications.
- Production route optimization or dynamic dispatch.
- Camera evidence in the MVP.
- Public exposure of the local gateway.
- MQTT unless every must-have gate is already green.
- Real citizen data.

## 3. Team workstreams

| Member | Workstream | Branch | Primary paths |
|---|---|---|---|
| PARTH AJMERA | Product, repository governance, contract approval, integration, demo | `team/parth-ajmera-governance` | `DOCUMENTAION/**`, root governance files, approved contracts |
| YASHVARDHAN DOBHAL | Citizen/operator/admin web UI | `team/yashvardhan-dobhal-web-ui` | web route groups, components, browser API client |
| AASHU JOSHI | Cloud APIs, auth, domain use cases, rules engine | `team/aashu-joshi-cloud-api` | `app/api/v1`, server libraries, `packages/rules-engine` |
| KRISHNA PANWAR | Physical hardware and ESP32 firmware | `team/krishna-panwar-esp32` | `firmware/esp32/**` |
| ADITYA SILSWAL | Local FastAPI edge gateway and sync | `team/aditya-silswal-edge-gateway` | `services/edge-gateway/**` |
| BHUMIKA SINGH RAWAT | Database, RLS, CI, test automation, release QA | `team/bhumika-singh-rawat-data-qa` | `supabase/**`, `tests/**`, `.github/workflows/**` |

Each member works only on the assigned persistent branch. Pull requests target `integration`. No one develops directly on `integration` or `main`.

## 4. Before H0 — mandatory preflight

These are preparation items, not optional feature work:

| ID | Task | Owner | Evidence |
|---|---|---|---|
| PRE-01 | Create `sgv-2-smart-waste-ecosystem`, invite all real GitHub handles, and enable repository settings | PARTH AJMERA | all six collaborators can view and clone |
| PRE-02 | Create `integration` and all six fixed `team/*` branches | PARTH AJMERA | branches visible remotely |
| PRE-03 | Protect `main` and `integration`; enable required PR/check/review rules | PARTH AJMERA | screenshot/settings checklist |
| PRE-04 | Create GitHub Project board and issue cards from this plan | PARTH AJMERA | every task has owner, paths, and acceptance criteria |
| PRE-05 | Confirm physical BOM, available board, cables, sensors, RFID reader, power supply, and hotspot/router; explicitly record whether dual compartments, IR1/IR2, and one ultrasonic sensor per compartment are physically present | KRISHNA PANWAR + ADITYA SILSWAL | on-hand inventory/photo plus `CONFIRMED` or `NOT_PRESENT` for each conditional part |
| PRE-06 | Install Node/npm, Python 3.12, PlatformIO, Supabase CLI, Git, and required USB drivers | Each member | version command output |
| PRE-07 | Create Supabase and Vercel projects; store credentials outside Git/chat | BHUMIKA SINGH RAWAT + PARTH AJMERA | safe environment handoff completed |
| PRE-08 | Copy `DOCUMENTAION/AGENTS.md` to repository-root `AGENTS.md` unchanged | PARTH AJMERA | parity check |

Do not begin parallel feature coding until PRE-01 through PRE-08 are complete.

## 5. Milestone M0 — contract and scaffold freeze, H0–H1

### Parallel tasks

| ID | Owner | Task | Allowed paths |
|---|---|---|---|
| M0-PARTH-AJMERA-01 | PARTH AJMERA | Confirm MVP, frozen tree, issue IDs, ownership, PR reviewers, and v1 contract decisions | governance/docs |
| M0-YASHVARDHAN-DOBHAL-01 | YASHVARDHAN DOBHAL | Create the Next.js web shell and empty citizen/operator/admin layouts without inventing API data | UI-owned web paths |
| M0-AASHU-JOSHI-01 | AASHU JOSHI | Create typed API/rules-engine skeletons and health route using approved contracts | API/server/rules paths |
| M0-KRISHNA-PANWAR-01 | KRISHNA PANWAR | Create PlatformIO project, board configuration, safe serial boot, and firmware config placeholders | firmware |
| M0-ADITYA-SILSWAL-01 | ADITYA SILSWAL | Create FastAPI/Pydantic project, `/healthz`, SQLite configuration, and test skeleton | edge gateway |
| M0-BHUMIKA-SINGH-RAWAT-01 | BHUMIKA SINGH RAWAT | Create Supabase migration/seed skeleton and path-aware CI skeleton | database/tests/workflows |

### Joint 30-minute contract lock

PARTH AJMERA chairs; KRISHNA PANWAR, ADITYA SILSWAL, AASHU JOSHI, and BHUMIKA SINGH RAWAT must confirm:

- `schemaVersion = "1.0"`;
- message/event/device/gateway ID formats;
- category and state enums;
- required telemetry fields and units;
- edge acknowledgement semantics;
- cloud single-message/result envelope;
- idempotency and conflict behavior;
- which measurements are genuinely available on the physical prototype;
- environment-variable names without revealing values.

### Exit gate G0

- [ ] Frozen folder tree exists exactly.
- [ ] All four technology areas have a compiling or testable skeleton.
- [ ] Canonical v1 valid, invalid, duplicate, and conflict fixtures exist.
- [ ] Every member has pulled `integration` into their fixed branch.
- [ ] No unresolved architecture or contract question remains.

If G0 fails, stop feature work and repair the foundation.

## 6. Milestone M1 — independent foundations, H1–H4

| ID | Owner | Deliverable | Acceptance evidence |
|---|---|---|---|
| M1-PARTH-AJMERA-01 | PARTH AJMERA | Review queue, dependency board, demo acceptance checklist | no task lacks owner/dependency |
| M1-YASHVARDHAN-DOBHAL-01 | YASHVARDHAN DOBHAL | Accessible role-aware navigation and page shells with loading/error/empty components | screenshots at desktop and mobile widths |
| M1-AASHU-JOSHI-01 | AASHU JOSHI | Server role guards, Zod boundary validation, pure rules-engine functions and unit tests | accepted/flagged tests pass |
| M1-KRISHNA-PANWAR-01 | KRISHNA PANWAR | Stable device ID, boot ID, monotonic sequence, heartbeat, and one real sensor driver | serial log from real board |
| M1-ADITYA-SILSWAL-01 | ADITYA SILSWAL | Device signature validation, schema validation, SQLite WAL database, transactional outbox insert | Pytest proves row exists before `202` |
| M1-BHUMIKA-SINGH-RAWAT-01 | BHUMIKA SINGH RAWAT | Core migrations, RLS baseline, safe seed users/households/vehicle/device/rules | clean `supabase db reset` |

### Exit gate G1

- [ ] Web lint/typecheck/build passes.
- [ ] API/rules unit tests pass.
- [ ] Edge unit tests pass after a process restart.
- [ ] ESP32 firmware compiles and emits a valid heartbeat.
- [ ] Database resets deterministically and citizens are isolated by RLS.
- [ ] CI reports independent required checks.

## 7. Milestone M2 — real hardware vertical slice, H4–H8

The only goal of this milestone is to make one real measurement visible end-to-end.

| ID | Owner | Deliverable |
|---|---|---|
| M2-KRISHNA-PANWAR-01 | KRISHNA PANWAR | Add the second required real sensor plus normalized units, quality state, and stable message signing |
| M2-ADITYA-SILSWAL-01 | ADITYA SILSWAL | Accept heartbeat/collection messages over LAN, durably queue, expose queue/device health, and sync one v1 message per request |
| M2-AASHU-JOSHI-01 | AASHU JOSHI | Authenticate gateway, validate each message, claim idempotency key, persist event/device status transactionally |
| M2-BHUMIKA-SINGH-RAWAT-01 | BHUMIKA SINGH RAWAT | Add idempotency, device-heartbeat, collection, reading, and audit constraints/tests |
| M2-YASHVARDHAN-DOBHAL-01 | YASHVARDHAN DOBHAL | Admin IoT-health view showing each confirmed component as `ONLINE`, `OFFLINE`, `DEGRADED`, or `UNKNOWN`, its last seen/last valid reading, and gateway queue/cloud sync state |
| M2-PARTH-AJMERA-01 | PARTH AJMERA | Run integration checkpoint and reject any mocked evidence presented as hardware evidence |

### Exit gate G2 — mandatory live checkpoint

With the real ESP32 and local gateway:

1. trigger a heartbeat and real sensor reading;
2. show edge durable receipt;
3. show the cloud event;
4. show the value and health state in admin UI;
5. replay the same message and show no duplicate.

Do not begin analytics, animation, or cosmetic polish until G2 passes.

If PRE-05 confirms the parts, G2 also verifies dual-compartment routing, IR1 disposal start followed by debounced IR2 confirmation, and independent wet/dry ultrasonic fill readings. Ultrasonic readings measure compartment fill only; they never classify waste. Missing optional parts are recorded as `NOT_PRESENT`, are not represented as live, and do not block the two-real-sensor core gate.

## 8. Milestone M3 — golden accepted-and-credit flow, H8–H12

| ID | Owner | Deliverable |
|---|---|---|
| M3-KRISHNA-PANWAR-01 | KRISHNA PANWAR | RFID/identifier capture with manual/QR fallback clearly labeled, collection trigger, sensor snapshot |
| M3-ADITYA-SILSWAL-01 | ADITYA SILSWAL | Collection-event receipt/result cache, retry/backoff, sync status, payload redaction |
| M3-AASHU-JOSHI-01 | AASHU JOSHI | RFID lookup, collection orchestration, accepted decision, exactly-once reward ledger transaction |
| M3-BHUMIKA-SINGH-RAWAT-01 | BHUMIKA SINGH RAWAT | Household/identifier, rule version, reward ledger, uniqueness, RLS and transaction tests |
| M3-YASHVARDHAN-DOBHAL-01 | YASHVARDHAN DOBHAL | Operator scan/confirm/result screens; citizen balance and collection/credit history; normal dashboard state that switches to a focused active-disposal state and clears session-only data on completion/timeout |
| M3-PARTH-AJMERA-01 | PARTH AJMERA | Validate the Aarav happy-path story and merge the milestone only when demonstrable |

### Exit gate G3 — golden path

- [ ] RFID `HH-10452` resolves to the seeded Aarav household with minimum necessary data.
- [ ] Wet category plus compliant real sensor evidence produces `ACCEPTED`.
- [ ] One immutable credit entry is created.
- [ ] Replaying the edge message creates neither a second event nor a second credit.
- [ ] Citizen and admin views show the same source-of-truth result.
- [ ] Every state has a clear loading, success, and failure presentation.

G3 is the minimum viable demo. Protect it from all later work.

## 9. Milestone M4 — verification, penalty, dispute, and offline proof, H12–H16

| ID | Owner | Deliverable |
|---|---|---|
| M4-KRISHNA-PANWAR-01 | KRISHNA PANWAR | Sensor health/degraded states, retry indicators, and safe disconnect/reconnect behavior |
| M4-ADITYA-SILSWAL-01 | ADITYA SILSWAL | WAN-offline queue, restart recovery, leased sync worker, auth-blocked/dead-letter visibility |
| M4-AASHU-JOSHI-01 | AASHU JOSHI | Flagged decision, verification API, authorized violation transaction, penalty and dispute APIs |
| M4-BHUMIKA-SINGH-RAWAT-01 | BHUMIKA SINGH RAWAT | Verification, penalty, dispute, bill simulation, append-only audit, and authorization tests |
| M4-YASHVARDHAN-DOBHAL-01 | YASHVARDHAN DOBHAL | Admin verification queue/evidence/review; citizen penalty and dispute experience; offline/stale banners |
| M4-PARTH-AJMERA-01 | PARTH AJMERA | Enforce the rule that sensors never directly create a penalty |

### Exit gate G4

Run two demonstrations:

1. Mismatched evidence becomes `FLAGGED`, awards no points, and creates no penalty. An officer accepts it.
2. A separate flagged event is confirmed by an authorized officer, creates one penalty, and allows a citizen dispute.

Then disconnect WAN, capture at least three events, restart FastAPI, restore WAN, and prove:

- all acknowledged local events survive;
- all sync once;
- no duplicate credit/penalty is produced;
- queue depth returns to zero;
- stale/offline state was visible.

## 10. Milestone M5 — operational value and polish, H16–H19

| ID | Owner | Deliverable |
|---|---|---|
| M5-YASHVARDHAN-DOBHAL-01 | YASHVARDHAN DOBHAL | Responsive polish, accessible status system, fleet/credit/verification summaries, polling fallback |
| M5-AASHU-JOSHI-01 | AASHU JOSHI | Core admin summaries, approximate citizen tracker data, controlled rules-config reads |
| M5-KRISHNA-PANWAR-01 | KRISHNA PANWAR | Final calibration, wiring strain check, power/reboot test, labeled physical prototype |
| M5-ADITYA-SILSWAL-01 | ADITYA SILSWAL | Operator-friendly health endpoint/status, bounded logs, queue metrics, recovery command |
| M5-BHUMIKA-SINGH-RAWAT-01 | BHUMIKA SINGH RAWAT | E2E golden/flagged tests, security/RLS checks, production-like deterministic seed |
| M5-PARTH-AJMERA-01 | PARTH AJMERA | README/pitch alignment, impact story, judge questions, known-limitations list |
| M5-PARTH-AJMERA-ML-01 | PARTH AJMERA | Optional gated ML sidecar under `scripts/demo/ml/**`, only after G4; AASHU JOSHI and BHUMIKA SINGH RAWAT both review |

### Optional ML go/no-go gate (never release-blocking)

The task above starts only when every item is true; otherwise it is skipped:

1. G4 and all required core CI checks are green and the golden path is protected.
2. Notebook/model artifacts stay under `scripts/demo/ml/**`. The only additive integration is the optional observation API/table/UI already frozen in documents 05, 06, 20, and 21; device sync v1, rules, collection state, credits, review outcomes, and penalties remain unchanged.
3. The model and dependency licenses are recorded as compatible. Ultralytics defaults to AGPL-3.0 with separate Enterprise terms; use its official [licensing page](https://www.ultralytics.com/license), and treat uncertainty as `NO-GO` rather than legal approval.
4. Only synthetic/local input is used. Colab contains no PII, secrets, tokens, private Drive mounts, or sensitive output. Its runtime is non-guaranteed per the [Google Colab FAQ](https://research.google.com/colaboratory/faq.html).
5. A deterministic recorded result is ready, and every screen/frame persistently says `MANUAL_COLAB` or `RECORDED_ML`.
6. Output is advisory only and never automatically classifies the canonical collection, awards/deducts credits, or creates a penalty.
7. AASHU JOSHI and BHUMIKA SINGH RAWAT both approve the PR and evidence.

Runtime failure, timeout, low confidence, or any failed check switches immediately to `RECORDED_ML` or skips the optional scene. It cannot delay feature freeze, QA, release, or the judged core demo.

### Feature freeze at H19

After H19:

- no new page, endpoint, table, sensor, dependency, animation system, or integration;
- only P0 demo blockers and P1 correctness/security defects may change;
- every fix requires a reproducible issue and regression evidence;
- PARTH AJMERA may defer a defect rather than risk the golden path.
- no new optional ML work begins; only an already approved sidecar may remain, and its failure is never a P0/P1 release blocker.

## 11. Milestone M6 — release candidate and destructive testing, H19–H22

BHUMIKA SINGH RAWAT leads; all owners remain available to fix only their paths.

### Required QA matrix

- [ ] Fresh clone/setup using documented commands.
- [ ] Web format, lint, typecheck, unit test, and production build.
- [ ] Edge format/lint, unit, queue durability, retry, and auth tests.
- [ ] ESP32 clean compile, upload, cold boot, and reconnect.
- [ ] Supabase clean reset, seed, RLS, uniqueness, and transaction tests.
- [ ] Valid, invalid, duplicate, and conflicting contract fixtures.
- [ ] Real-hardware happy path.
- [ ] Real-hardware flagged path.
- [ ] Gateway restart after local acknowledgement.
- [ ] WAN loss and queue drain.
- [ ] Cloud timeout after commit followed by duplicate-safe retry.
- [ ] Missing GPS and degraded sensor without fabricated values.
- [ ] Citizen cannot access another household.
- [ ] No secrets/PII in git, browser bundle, firmware source, screenshots, or logs.
- [ ] Realtime outage preserves functionality through polling/refetch.
- [ ] Mobile citizen view and keyboard-operated critical admin flow.
- [ ] Admin component-level IoT health and normal → active-disposal → normal UI transitions.
- [ ] Conditional dual-compartment, IR1/IR2, and independent ultrasonic tests when PRE-05 confirms those parts; otherwise evidence says `NOT_APPLICABLE — PART NOT CONFIRMED`.
- [ ] If optional ML is enabled: labels, license/privacy record, deterministic fallback, and forced-runtime-failure/no-core-mutation proof (informational, never a release gate).

### Release gate G6

Create a pull request from `integration` to `main` only when:

- every required check is green;
- no P0 issue is open;
- P1 issues are fixed or explicitly accepted by PARTH AJMERA with a fallback;
- the seeded demo is repeatable;
- BHUMIKA SINGH RAWAT signs the release checklist;
- PARTH AJMERA performs the final review and merge.

Tag the release candidate `v0.1.0-rc1`.

## 12. Milestone M7 — demo hardening and submission, H22–H24

| ID | Owner | Task |
|---|---|---|
| M7-PARTH-AJMERA-01 | PARTH AJMERA | Lead two timed rehearsals, final repository/README check, judge narrative, submission |
| M7-YASHVARDHAN-DOBHAL-01 | YASHVARDHAN DOBHAL | Verify all presentation routes and prepare static screenshots |
| M7-AASHU-JOSHI-01 | AASHU JOSHI | Verify seed/config/rules and prepare API response evidence |
| M7-KRISHNA-PANWAR-01 | KRISHNA PANWAR | Secure hardware, batteries/power/cables, spare USB, labeled sensor demo |
| M7-ADITYA-SILSWAL-01 | ADITYA SILSWAL | Preflight LAN/edge/queue and prepare exact replay backup using production fixtures |
| M7-BHUMIKA-SINGH-RAWAT-01 | BHUMIKA SINGH RAWAT | Record backup video, export QA report, verify release URL/local fallback |

Final tag: `v1.0.0-hackathon-demo`.

## 13. Critical path and dependency rules

~~~text
v1 contract freeze
  ├── ESP32 payload
  ├── edge validation/outbox
  ├── cloud ingestion
  └── database constraints
        ↓
real heartbeat/sensor vertical slice
        ↓
accepted + exactly-once credit
        ↓
flagged + human verification
        ↓
offline/restart proof
        ↓
QA, release, rehearsal
~~~

Rules:

1. Contract fixtures unblock KRISHNA PANWAR, ADITYA SILSWAL, AASHU JOSHI, and BHUMIKA SINGH RAWAT; they are the first shared dependency.
2. YASHVARDHAN DOBHAL may build UI shells early, but must switch to real typed endpoints as soon as M2 is available.
3. No UI invents a temporary response shape. Use canonical fixture data through the approved API client.
4. No database table is created merely for a screen; schema follows domain requirements and invariants.
5. No hardware behavior is inferred from simulated data once a real measurement is required by a gate.
6. Cross-workstream changes are split into coordinated issues and separately owned commits.

## 14. Integration cadence

PARTH AJMERA runs short integration windows at approximately H1, H4, H8, H12, H16, H19, and H22.

Before each window:

1. member merges current `origin/integration` into their persistent team branch;
2. member runs applicable local checks;
3. member opens or updates a small PR with evidence;
4. PARTH AJMERA checks allowed paths, contract impact, and acceptance criteria;
5. required CI and review pass;
6. PARTH AJMERA uses a normal merge commit into `integration`;
7. every member merges the updated `origin/integration` back into their team branch.

Rebase, force push, direct pushes to protected branches, and squash-merging a reused persistent branch are prohibited.

## 15. Priority and defect policy

| Priority | Meaning | Response |
|---|---|---|
| P0 | Golden demo cannot run; data loss/duplicate financial effect; secret exposure; access-control failure | stop other work, owner fixes immediately |
| P1 | Major required flow wrong or unreliable; hardware/edge offline recovery broken | fix before release candidate |
| P2 | Non-critical usability or analytics issue with a safe workaround | fix before H19 or document |
| P3 | Cosmetic/stretch improvement | defer |

No one fixes another owner's source code without PARTH AJMERA explicitly reassigning the issue.

## 16. Reliability fallbacks

Fallbacks keep the demo moving; they must never be presented as the primary real-hardware path.

| Risk | Primary prevention | Approved fallback |
|---|---|---|
| Sensor/board failure | preflight inventory, calibration, spare cables/power | replay recorded production-format telemetry and disclose fallback |
| Internet failure | edge durable queue and WAN-loss rehearsal | demonstrate local receipt/queue, then use recorded cloud result/video |
| Realtime failure | initial query plus reconnect/refetch | polling using the same authorized REST endpoint |
| Map tile failure | preflight and non-map status | coordinates, route/status table, prepared screenshot |
| Demo database corruption | forward-only migrations and deterministic seed | reset/reseed approved demo project |
| Laptop failure | committed repo, environment checklist, backup machine plan | backup video and screenshots |
| AI-generated scope drift | root `AGENTS.md`, path ownership, protected branches | reject PR; issue a smaller corrected task |
| Optional ML/Colab failure | post-G4 gate, synthetic input, license/privacy review, pre-recorded deterministic output | show `RECORDED_ML` or skip the optional scene; core path is unchanged |

## 17. Definition of milestone done

A milestone is done only when:

- its exit gate is demonstrated, not merely coded;
- all changes are merged through reviewed PRs into `integration`;
- required checks pass;
- contract/schema/security effects are documented;
- evidence is attached to the issue or PR;
- no temporary mock remains on the critical path;
- all members sync the updated `integration` into their persistent branches;
- PARTH AJMERA marks the milestone complete on the project board.

Time elapsed does not make an incomplete gate complete. If behind schedule, cut stretch scope and protect the last working vertical slice.
