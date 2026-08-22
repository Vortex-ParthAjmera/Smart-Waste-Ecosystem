> **PLAN & STRUCTURE LOCK — v2.0:** This approved scope, stack, repository structure, contracts, ownership map, truth-tier model, and delivery plan must not be changed by contributors or AI agents. Work only inside assigned paths. If a change is necessary, stop and submit a `CHANGE_REQUEST`; only PARTH AJMERA may approve it, followed by an ADR, contract/document updates, and team notification.

# SGV 2.0 — 30-Hour, Six-Person Implementation Plan

Status: approved delivery baseline v2.0

Final scope and integration owner: PARTH AJMERA

Team: PARTH AJMERA, YASHVARDHAN DOBHAL, AASHU JOSHI, KRISHNA PANWAR, ADITYA SILSWAL, BHUMIKA SINGH RAWAT

Clock convention: `H0` is implementation kickoff; all ranges are elapsed hackathon hours

Contract authority: `05_DATA_SCHEMA.md`, `06_API_IOT_CONTRACT.md`, and `23_BUILD_DOC_V4_RECONCILIATION.md`

## 1. Delivery objective

By H24, freeze a tested Tier 1 system in which a judge can follow one immutable `eventId` through the real physical and digital chain:

```text
opaque citizen QR + selected wet/dry compartment
  -> that compartment's debounced IR trigger
  -> ESP32 sensor/fill/GPS evidence
  -> signed LAN HTTP/JSON v1
  -> FastAPI validation + SQLite WAL durable receipt
  -> event-correlated local camera capture + pinned offline ML
  -> authenticated, idempotent cloud synchronization
  -> deterministic rules-2.0.0 decision
  -> +10 accepted OR FLAGGED with 0 pending human review
  -> reviewed +10 / -10 / -20 append-only ledger entry
  -> authorized citizen, municipal, and developer/IoT views
```

The release wins through a complete, truthful vertical slice: real hardware, WAN-independent local custody and inference, duplicate-safe cloud processing, explainable scoring, human review before negative points, and clear recovery evidence.

## 2. Truth-tier execution rule

| Tier | Build window | Rule |
|---|---:|---|
| **Tier 1 — REAL** | H0–H24 | Implement, integrate, test, and freeze. Every live claim needs evidence. |
| **Tier 2 — PREVIEW** | H24–H26 only after Tier 1 freeze | Frontend fixture only; permanently show `PREVIEW/SEEDED`; no table, API, worker, or hidden backend. |
| **Tier 3 — ROADMAP** | no implementation time | Documentation/pitch only; no fake screen or partial service. |

Tier 2 does not start because the clock reaches H24. It starts only when gate G6 declares Tier 1 green. If G6 is late or conditional, Tier 2 is cut completely.

## 3. Frozen Tier 1 scope

### 3.1 Real hardware and local runtime

- One ESP32 prototype with wet and dry compartments.
- One independently debounced IR disposal trigger and one ultrasonic fill sensor per compartment.
- One calibrated moisture sensor in the dry path; moisture supports a decision but never proves misconduct by itself.
- GPS/no-fix and component heartbeat states represented truthfully as `OK`, `DEGRADED`, `MISSING`, `FAILED`, or `UNKNOWN`.
- Opaque, rotatable citizen QR with no PII; RFID is an optional enhancement only if bench-proven.
- Signed ESP32-to-edge HTTP/JSON v1 on a private LAN.
- FastAPI/Pydantic edge gateway with SQLite WAL, `synchronous=FULL`, durable receipt before `202`, restart recovery, retry/backoff, dead-letter, and auth-blocked visibility.
- Local camera capture and local offline inference correlated to the physical `eventId`.
- Pinned model/runtime/class map, a frozen supported-class allowlist, `UNKNOWN` for unsupported classes, and a disclosed recorded fallback.

### 3.2 Real cloud, product, and fairness behavior

- One Next.js application and deployment with citizen, municipal/operator/admin, and restricted developer/IoT experiences.
- Supabase Auth, Postgres, RLS, Realtime invalidation, migrations, and deterministic seed.
- Versioned `/v1` LAN and `/api/v1` cloud contracts, stable IDs, request hashes, and exactly-once effects.
- Three separate state dimensions: processing, decision/review, and edge transport.
- `rules-2.0.0` with ML score bands, calibrated moisture bands, stable reason codes, and deterministic output.
- Automatic `+10` only for a qualifying accepted event.
- Every mismatch, low-confidence/model-unavailable case, environmental-wetting case, or insufficient evidence case becomes `FLAGGED` with immediate ledger effect `0`.
- `REVIEW_ACCEPTED` may append `+10`; only authorized `VERIFIED_VIOLATION` may append `-10` or `-20` according to the approved rule/reason. No automatic negative points.
- Append-only ledger, review, dispute, idempotency, and audit records.
- A system-admin-only demo simulation that joins after physical ingest, uses a fixed fictional identity, and permanently shows `SIMULATED` on every related record and screen.
- A seed with 15–25 reconciled historical events for the main fictional citizen, four to six additional fictional citizens, mixed outcomes, and at least one seeded badge/tier display.

Canonical provenance is frozen: event `eventSource` is `HARDWARE`, `RECORDED_HARDWARE`, `SIMULATED`, or `SEEDED`; ML/evidence source is `LOCAL_LIVE`, `RECORDED_ML`, `SIMULATED`, or `SEEDED`; UI badges are `REAL`, `RECORDED`, `SIMULATED`, or `PREVIEW/SEEDED`. Tier 2 fixtures are never persisted.

### 3.3 Tier 2 and Tier 3 boundary

Tier 2 may contain only the approved preview map/ETA, extra truck/zone cards, bill-discount preview, seeded report charts, and non-live collection-status stepper. Tier 3 includes dedicated edge-AI hardware, autonomous sorting/compaction, MQTT operations, production routing/geofencing, government identity federation, real billing/UPI/fines, native apps, and multi-city claims.

## 4. Team workstreams and branches

| Member | Fixed branch | Accountable workstream | Normal owned paths |
|---|---|---|---|
| PARTH AJMERA | `team/parth-ajmera-governance` | Product truth, issues, contracts, reviews, integration, release, demo | `DOCUMENTATION/**`, root governance, approved shared contracts/config |
| YASHVARDHAN DOBHAL | `team/yashvardhan-dobhal-web-ui` | One-app citizen/municipal/developer UI using Cursor | UI route groups, components, browser client, styles/assets |
| AASHU JOSHI | `team/aashu-joshi-cloud-api` | Cloud APIs, auth guards, use cases, rules engine | `/api/v1`, server libraries, `packages/rules-engine/**` |
| KRISHNA PANWAR | `team/krishna-panwar-esp32` | Physical build, calibration, ESP32 firmware | `firmware/esp32/**`, assigned HIL fixtures |
| ADITYA SILSWAL | `team/aditya-silswal-edge-gateway` | FastAPI/SQLite sync plus local camera/ML orchestration | `services/edge-gateway/**`, approved local-ML assets/tests |
| BHUMIKA SINGH RAWAT | `team/bhumika-singh-rawat-data-qa` | Schema, RLS, seed, CI, cross-system QA, evidence | `supabase/**`, `tests/**`, `.github/workflows/**`, verification scripts |

YASHVARDHAN DOBHAL must confirm Cursor is on his exact branch before every task. KRISHNA PANWAR and ADITYA SILSWAL may authenticate to GitHub through the same approved Aditya account, but they still use separate branches, separate clones/worktrees, and correct local commit authors. The shared login never merges their ownership or permits cross-branch edits.

## 5. Before H0 — mandatory preflight

| ID | Task | Owner | Required evidence |
|---|---|---|---|
| PRE-01 | Confirm `main`, `integration`, all six team branches, collaborators, merge policy, issue board, and manual protection rules | PARTH AJMERA | branch/collaborator screenshot and assigned issues |
| PRE-02 | Copy approved `DOCUMENTATION/README.md` and `DOCUMENTATION/AGENTS.md` to repository root and verify parity | PARTH AJMERA | hash or zero-diff check |
| PRE-03 | Inventory and bench-test ESP32, two IR, two ultrasonic, moisture, GPS, power, wiring, wet/dry paths, camera device, hotspot, and spare cables | KRISHNA PANWAR + ADITYA SILSWAL | labelled photo, part list, `PASS/DEGRADED/MISSING` result |
| PRE-04 | Verify camera stream address/resolution and measure one local capture on the actual edge laptop | ADITYA SILSWAL | timestamped capture without PII |
| PRE-05 | Freeze the model artifact, framework/runtime, class allowlist/map, weights hash, dataset/provenance, license decision, and recorded fallback | ADITYA SILSWAL + PARTH AJMERA | signed model manifest and offline artifact |
| PRE-06 | Install pinned Node/npm, Python, PlatformIO, Supabase CLI, Git, USB drivers, and model runtime without upgrading unapproved versions | each member | version output saved to issue |
| PRE-07 | Create Vercel/Supabase demo projects and distribute secrets outside Git/chat | BHUMIKA SINGH RAWAT + PARTH AJMERA | safe environment handoff completed |
| PRE-08 | Create separate browser profiles for citizen, municipal, and system-admin demo accounts; record provider fallbacks | YASHVARDHAN DOBHAL + BHUMIKA SINGH RAWAT | login smoke evidence |
| PRE-09 | For the shared GitHub login, configure separate clone/worktree and local author identity for Krishna and Aditya | KRISHNA PANWAR + ADITYA SILSWAL | branch plus `git config --local` evidence, no credential shown |

No feature implementation begins until PRE-01 through PRE-09 are owned and any failed physical/model/auth dependency has an explicit fallback.

## 6. M0 — contract, truth, and scaffold freeze (H0–H1)

| Owner | Deliverable |
|---|---|
| PARTH AJMERA | Chair a 30-minute freeze of v2.0 scope, issue IDs, exact paths, reviewers, Tier labels, and acceptance evidence. |
| YASHVARDHAN DOBHAL | Create one Next.js shell for citizen, municipal, and developer/IoT experiences; no invented API fields. |
| AASHU JOSHI | Create typed `/api/v1`, auth-guard, rules-2.0.0, and error-envelope skeletons. |
| KRISHNA PANWAR | Create the PlatformIO build, safe boot, pin configuration, component health skeleton, and contract fixture. |
| ADITYA SILSWAL | Create FastAPI/Pydantic, SQLite migration/outbox, sync-worker, camera adapter, and model-runner boundaries. |
| BHUMIKA SINGH RAWAT | Create migration/seed/CI skeletons and contract/RLS test harness. |

### G0 exit gate

- [ ] Frozen repository tree exists and every task names allowed paths.
- [ ] Canonical valid, invalid, duplicate, conflict, hardware, ML, and simulation fixtures exist or have an assigned completion task.
- [ ] Processing, decision/review, and transport states are not collapsed.
- [ ] Every member has merged current `origin/integration` into the correct team branch.
- [ ] No unresolved contract or model-class question remains.

## 7. M1 — independent foundations (H1–H4)

| Owner | Deliverable | Acceptance evidence |
|---|---|---|
| PARTH AJMERA | Dependency board, PR template, claim ledger, demo acceptance manifest | no task lacks owner/dependency/truth tier |
| YASHVARDHAN DOBHAL | Accessible role navigation plus loading, empty, error, offline, and source-badge primitives | desktop/mobile screenshots and keyboard smoke |
| AASHU JOSHI | Server role guards, strict Zod boundaries, deterministic rule functions, idempotency service skeleton | unit tests for accepted, flagged, and forbidden negative path |
| KRISHNA PANWAR | Stable device/boot/message/event IDs, signing, heartbeat, and one IR plus one real sensor driver | real serial log and valid fixture |
| ADITYA SILSWAL | Signature validation, request limits, SQLite WAL transaction before `202`, leasing, health endpoint | process-kill/restart Pytest |
| BHUMIKA SINGH RAWAT | Lean Tier 1 migrations, core constraints, RLS baseline, fictional accounts/device/rules seed | clean local reset and citizen-isolation test |

### G1 exit gate

- [ ] Web lint/typecheck/build, edge lint/tests, firmware compile, and clean database reset pass.
- [ ] One signed heartbeat is stored locally and reaches the cloud without a duplicate.
- [ ] No secret, PII, model input frame, or unsupported class appears in source/logs.

## 8. M2 — physical ingress and durable edge custody (H4–H8)

| Owner | Deliverable |
|---|---|
| KRISHNA PANWAR | Both compartment IR triggers independently debounced; both ultrasonic fill readings; calibrated dry-path moisture; GPS/no-fix and component quality; opaque QR flow. |
| ADITYA SILSWAL | All device ingest endpoints, durable receipts, exact duplicate/conflict behavior, event state timeline, and edge health/queue visibility. |
| AASHU JOSHI | Gateway authentication, cloud idempotency claim, device/event persistence transaction, safe response cache. |
| BHUMIKA SINGH RAWAT | Device-message, event, readings, heartbeat, identifier, and audit constraints plus duplicate/RLS tests. |
| YASHVARDHAN DOBHAL | Municipal active-disposal shell and developer component-health screen against canonical fixtures. |
| PARTH AJMERA | Live boundary checkpoint; reject any fixture presented as hardware or any unlabelled degraded value. |

### G2 real-hardware gate

1. Scan the opaque demo QR and select one compartment.
2. Trigger that compartment's IR once and show the other IR remains independent.
3. Capture real fill/moisture/GPS-or-no-fix evidence with quality states.
4. Receive `202 QUEUED_LOCALLY` only after SQLite commits.
5. Kill/restart edge and recover the acknowledged row.
6. Replay the same payload and receive the existing result; changed payload under the same ID returns conflict.

Do not start cosmetic dashboards or Tier 2 work when G2 fails.

## 9. M3 — cloud truth, core portals, and exact-once ledger (H8–H12)

| Owner | Deliverable |
|---|---|
| AASHU JOSHI | Finish one-message edge sync, event orchestration, REST reads, authorized Realtime invalidation, rules/ledger transaction, and safe error mapping. |
| BHUMIKA SINGH RAWAT | Finish ledger/review/audit invariants, RLS policies, transaction/concurrency tests, and first deterministic seed slice. |
| YASHVARDHAN DOBHAL | Citizen profile/own QR/history/ledger-derived balance/privacy-safe score, municipal active event/feed, and developer authorized telemetry/queue/health/safe-log views through typed APIs. |
| ADITYA SILSWAL | Retry/backoff, timeout-after-cloud-commit recovery, `ACKED/AUTH_BLOCKED/DEAD_LETTER`, and correlated local result cache. |
| KRISHNA PANWAR | Firmware retry with stable IDs, correct local-vs-cloud status, disconnect/reconnect health. |
| PARTH AJMERA | Verify a single `eventId` at firmware, edge, cloud, API, audit, and UI boundaries. |

### G3 cloud/integrity gate

- [ ] One physical event reaches each source-of-truth boundary.
- [ ] Duplicate delivery produces one event and at most one ledger effect.
- [ ] Citizen cannot read another household; operator cannot review; system routes fail closed.
- [ ] WAN loss leaves the event safely queued and the cloud UI visibly stale.

## 10. M4 — live local ML and accepted `+10` golden flow (H12–H16)

| Owner | Deliverable |
|---|---|
| ADITYA SILSWAL | Correlate event trigger to camera capture; run pinned model offline as `LOCAL_LIVE`; apply class allowlist/map; persist provenance, hash, latency, score band, and health; implement `RECORDED_ML` fallback. |
| KRISHNA PANWAR | Emit stable compartment/event trigger data without double capture; prove camera/firmware event correlation. |
| AASHU JOSHI | Integrate validated ML evidence into pure rules-2.0.0; automatic path returns only `ACCEPTED +10` or `FLAGGED 0`. |
| BHUMIKA SINGH RAWAT | ML observation/provenance constraints and tests proving no automatic negative entry; latency and class-map evidence harness. |
| YASHVARDHAN DOBHAL | Human-friendly live result/timeline and developer ML monitor with persistent source/model/health labels. |
| PARTH AJMERA | Approve the supported demo items, wording, measured latency, and license/privacy evidence. |

### G4 ML and positive-award gate

- [ ] Model artifact runs with WAN disabled and matches the recorded hash.
- [ ] Supported class maps deterministically to `WET` or `DRY`; unsupported, conflicting multiple-object, or low-confidence input becomes `UNKNOWN`/`FLAGGED`.
- [ ] Capture-plus-inference p95 is measured on the demo laptop and meets the agreed budget.
- [ ] Healthy matching physical evidence creates one `ACCEPTED` event and exactly one `+10` entry.
- [ ] Replaying the event, ML callback, or cloud request creates no second event or points.
- [ ] Camera/model failure switches to the disclosed fallback or human review without a negative entry.

G4 is the minimum winning live story. Protect it from later work.

## 11. M5 — fairness, offline recovery, seed, and simulation (H16–H20)

| Owner | Deliverable |
|---|---|
| AASHU JOSHI | Review assignment/decision, `REVIEW_ACCEPTED`, `VERIFIED_VIOLATION`, reviewed `-10/-20`, dispute, and guarded `POST /api/v1/developer/simulations`. |
| BHUMIKA SINGH RAWAT | Database enforcement for review-before-negative, append-only ledger/dispute/audit, 15–25 main events plus 4–6 fictional citizens, reconciled balances, badge/tier seed, simulation isolation. |
| YASHVARDHAN DOBHAL | Review workspace, citizen result/dispute, opt-in seeded-alias leaderboard, badge/tier display, and permanent `SIMULATED` rendering. |
| ADITYA SILSWAL | WAN-offline collection plus local ML, edge restart recovery, queue drain, camera/model degraded states, and simulation handoff strictly after physical ingest. |
| KRISHNA PANWAR | Sensor disconnect/reconnect, no-fix GPS, repeated compartment trigger, and honest component-health behavior. |
| PARTH AJMERA | Enforce environmental-wetting and human-review narrative; approve seed counts and simulated-data exclusion from real proof. |

### G5 fairness/resilience gate

Run and record all of these:

1. Supported dry item in dry path with moisture `<30%` -> `ACCEPTED`, `+10` once.
2. Dry-class item with moisture `>45%` -> `FLAGGED`, `0`, `ENVIRONMENTAL_WETTING_SUSPECTED`; reviewer clears it and appends `+10`.
3. Opposite-category evidence -> `FLAGGED`, `0`; verified review appends `-10` or severe wet-in-dry `-20`, then citizen dispute is audited.
4. WAN disabled -> physical capture, local ML, durable queue, edge restart, WAN restoration, exact-once reconciliation.
5. System-admin injection -> joins after physical ingest, uses fixed fictional identity, keeps `eventSource=SIMULATED` and any ML `evidenceSource=SIMULATED`, is audited, and is excluded from real-hardware proof counts.

No raw sensor or ML output may directly append a negative value.

## 12. M6 — Tier 1 hardening and freeze (H20–H24)

BHUMIKA SINGH RAWAT leads destructive testing. Feature development stops at H20; owners fix only reproducible Tier 1 defects inside their paths.

### Required release-candidate matrix

- [ ] Fresh clone/bootstrap and all documented commands.
- [ ] Web format/lint/typecheck/unit/E2E/build and accessibility smoke.
- [ ] Edge format/lint/tests, SQLite kill/restart, leases, retry, auth-blocked, dead-letter, disk/health truth.
- [ ] Firmware clean compile/upload/cold boot, dual IR debounce, two fill sensors, moisture calibration, GPS/no-fix, stable IDs.
- [ ] Local camera/model allowlist, offline artifact/hash, low/medium/high score bands, unsupported/multiple object, timeout, restart, and fallback.
- [ ] Supabase clean reset, exact seed counts, ledger reconciliation, constraints, RLS/RBAC allow/deny, audit, and rollback.
- [ ] Same ID/same body, same ID/changed body, concurrent retry, and cloud timeout-after-commit.
- [ ] Automatic accepted `+10`; all automated adverse paths `FLAGGED 0`; reviewed `+10/-10/-20` exactly once.
- [ ] Environmental wetting, degraded sensor, camera unavailable, model unavailable, WAN outage, database unavailable, and Realtime polling fallback.
- [ ] Simulation auth, flagging, audit, rate limit, idempotency, fixed identity, and exclusion from real metrics.
- [ ] Every synthetic/recorded/preview surface has an uncroppable permanent label.
- [ ] No secret, PII, raw identifier, unapproved frame, or unsupported ML claim appears in Git, bundles, logs, screenshots, or seed.

### G6 — Tier 1 freeze

PARTH AJMERA may declare `TIER 1 FROZEN` only when:

- all Tier 1 required checks pass on the recorded commit;
- no P0/P1 integrity, security, fairness, offline, hardware, or ML issue remains;
- two consecutive golden-flow rehearsals succeed, including one fallback recovery;
- BHUMIKA SINGH RAWAT signs the evidence manifest;
- model, firmware, edge, contract, ruleset, schema, seed, and web versions/hashes are recorded together.

If any condition fails, use H24–H26 to repair Tier 1 and skip Tier 2.

## 13. M7 — Tier 2 previews, only after G6 (H24–H26)

| Owner | Allowed work |
|---|---|
| YASHVARDHAN DOBHAL | Implement only approved fixture-backed preview map/ETA, extra vehicle/zone cards, discount display, seeded charts, or status stepper; every surface permanently shows `PREVIEW/SEEDED`. |
| PARTH AJMERA | Approve wording, verify no preview is presented as live, and cap work at the H26 freeze. |
| AASHU JOSHI, BHUMIKA SINGH RAWAT, ADITYA SILSWAL, KRISHNA PANWAR | No Tier 2 backend, schema, edge, firmware, model, or API work. Support only regression verification. |

### G7 preview gate

- [ ] No new Tier 2 table, endpoint, worker, dependency, or device behavior exists.
- [ ] Preview data lives only in the approved frontend fixture path.
- [ ] `PREVIEW/SEEDED` remains visible at every viewport and cannot be cropped from evidence.
- [ ] Removing all Tier 2 components leaves every Tier 1 test green.

If a preview fails G7, remove it rather than weakening Tier 1.

## 14. M8 — release, rehearsal, and evidence (H26–H29)

| Owner | Task |
|---|---|
| PARTH AJMERA | Open `integration -> main` release PR, verify scope/diff, lead two timed rehearsals, decide fallback level and go/no-go. |
| YASHVARDHAN DOBHAL | Verify all role routes, responsive/source labels, keyboard flow, screenshots, and Cursor branch cleanliness. |
| AASHU JOSHI | Freeze API/rules configuration and prepare transaction/idempotency evidence. |
| KRISHNA PANWAR | Secure hardware, label components, complete soak/power test, prepare spare wiring/power. |
| ADITYA SILSWAL | Preflight LAN, SQLite queue, camera/model artifact, recorded fallback, and recovery commands. |
| BHUMIKA SINGH RAWAT | Run clean seed/reset, export QA/evidence manifest, record backup video, and review release PR. |

Tag `v1.0.0-hackathon-demo` only after the release commit passes the same Tier 1 smoke suite.

## 15. M9 — submission buffer (H29–H30)

No feature or dependency change is allowed. Use this hour for:

- one clean reset and startup;
- submission form/repository/README/link verification;
- copying evidence, model artifact, fallback video, and presentation to two offline devices;
- browser/profile/tab preparation;
- physical transport and power/network contingency.

## 16. Critical path and cut order

```text
contract + model/class freeze
  -> real QR/compartment/sensors
  -> durable edge custody
  -> idempotent cloud truth
  -> local camera/ML evidence
  -> accepted +10 exactly once
  -> flagged human review and reviewed values
  -> WAN/restart recovery + RLS/fairness proof
  -> Tier 1 freeze
  -> optional labelled previews
  -> release and rehearsal
```

If behind schedule, cut in this order:

1. all Tier 2 previews;
2. leaderboard/badge polish while preserving seeded ledger truth;
3. extra analytics and animations;
4. real GPS display while retaining honest no-fix health;
5. RFID enhancement while retaining opaque QR.

Never cut durable edge storage, idempotency, RLS, model/source truth labels, accepted `+10`, human review before negative points, audit, or offline recovery.

## 17. Integration cadence

PARTH AJMERA runs bounded integration windows near H1, H4, H8, H12, H16, H20, H24, H26, and H29.

Before every window:

1. member verifies their exact `team/*` branch and clean/understood worktree;
2. member fetches and merges `origin/integration` without rebase;
3. member runs applicable checks and attaches evidence;
4. member opens a small PR to `integration` with only owned paths;
5. PARTH AJMERA checks contract, truth tier, source labels, and diff scope;
6. CI and required human review pass;
7. PARTH AJMERA uses a normal merge commit;
8. all active branches merge the new `origin/integration`.

No AI agent approves, merges, rebases, force-pushes, deploys, migrates the shared database, or flashes hardware.

## 18. Priority and defect policy

| Priority | Meaning | Required response |
|---|---|---|
| P0 | data loss/duplicate effect, auth/RLS bypass, secret/PII leak, automatic negative points, false source label, unsafe hardware, or demo cannot start | stop dependent work; owner repairs before any preview/release |
| P1 | required Tier 1 path unreliable or incorrect but contained | fix before G6; no waiver for integrity/fairness |
| P2 | non-critical Tier 1 usability or Tier 2 defect with a safe removal/fallback | fix before H26 or remove/document |
| P3 | cosmetic/roadmap improvement | defer |

## 19. Definition of milestone done

A milestone is complete only when:

- its exit gate is demonstrated against the named commit, not merely coded;
- only assigned paths changed and the frozen contracts/tree remain coherent;
- required checks pass and every unrun check is reported honestly;
- source, health, latency, identity, and `eventId` evidence is attached;
- no mock, recorded input, simulation, or preview is presented as hardware/live;
- ledger, review, idempotency, RLS, and audit invariants reconcile;
- changes are reviewed and merged through `integration` using the approved workflow;
- all active branches synchronize from `integration` afterward;
- PARTH AJMERA records the gate result on the project board.

Elapsed time never makes an incomplete gate complete. Protect the last proven Tier 1 vertical slice and remove optional work when necessary.
