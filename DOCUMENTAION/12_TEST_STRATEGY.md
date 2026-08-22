> **PLAN & STRUCTURE LOCK — v1.0:** This approved scope, stack, repository structure, contracts, ownership map, and delivery plan must not be changed by contributors or AI agents. Work only inside the assigned paths. If a change is necessary, stop and submit a `CHANGE_REQUEST`; only PARTH AJMERA may approve it, followed by an ADR and team notification.

# Test Strategy and Quality Gates

QA/release owner: BHUMIKA SINGH RAWAT  
Final acceptance: PARTH AJMERA  
Principle: test the cross-system vertical slice before polishing extra screens.

## Release gates

| Gate | Required proof |
|---|---|
| Contract | OpenAPI/JSON Schema valid; shared golden fixtures pass web, edge, and firmware parsers |
| Web | Format/lint, strict typecheck, unit tests, production build |
| Edge | Ruff, Pytest, API contract, SQLite persistence/restart, retry/backoff |
| Firmware | PlatformIO clean compile, event-builder fixture, real serial evidence |
| Database | Fresh migration reset, seed, constraints, RLS positive/negative tests |
| Integration | Real/emulated event travels edge → cloud → decision → ledger exactly once |
| E2E | Accepted and flagged/review/dispute journeys pass in supported browser |
| Security | Authorization, replay, secret scan, invalid payload, audit tests |
| Demo | Two rehearsals, internet-off test, backup recording and deterministic reset |

No failing required gate may be ignored, disabled, or converted into a warning to merge.

## Test layers

### Unit

- `packages/rules-engine`: category/sensor matrix, degraded sensors, safety alerts, rule versions, rewards, reversal eligibility.
- Web helpers: authorization mapping, pagination/filter parsing, error mapping.
- Edge: schema validation, queue state transitions, backoff, payload hashing, and atomic message leasing.
- Firmware: stable event ID, sensor normalization, debounce, serialization size.

### Contract

The exact fixtures in `tests/fixtures/telemetry/v1/` are parsed by:

1. JSON Schema validator.
2. Edge Pydantic model.
3. Cloud TypeScript schema/type.
4. Firmware event-builder snapshot.

Include valid minimum/full payloads and invalid cases for missing required field, unknown enum, non-finite number, out-of-range reading, oversized request, wrong version, and changed body under the same message ID.

### Integration

- Edge persists before `202` acknowledgement.
- Gateway restart retains pending rows.
- Cloud outage causes retry without data loss.
- Cloud replay returns previous receipt and creates no duplicate ledger row.
- Accepted event, flagged event, admin decision, penalty, dispute, and reversal use valid transactions/states.
- Supabase realtime update reaches UI; polling fallback reaches the same eventual state.

### End-to-end

Critical Playwright journeys:

1. Citizen login → EcoCredit balance → collection detail.
2. Operator login → household scan/lookup → collection session → result.
3. Admin login → flagged queue → evidence → accept case.
4. Admin confirm violation → citizen sees penalty → citizen files dispute → admin resolves.
5. Admin device health → stale/offline/online transitions.

## Rules-engine decision matrix

At minimum test wet/dry/reject (or active configured categories) across low/medium/high moisture, valid/invalid weight, intake present/absent, required sensor degraded, and safety alert. Expected properties:

- Ambiguous evidence returns `FLAGGED`.
- Fire/gas safety alerts do not directly mean a segregation violation.
- `FLAGGED` never calls penalty creation.
- The stored explanation matches the applied rule version.
- A retry returns the identical decision and ledger result.

## Hardware-in-loop protocol

KRISHNA PANWAR and ADITYA SILSWAL jointly record:

- Five RFID/QR reads.
- Five intake detections.
- Three dry and three wet moisture samples.
- Zero plus two known load-cell masses.
- Ten-minute heartbeat.
- One accepted candidate and one mismatch candidate sent through the real edge gateway.
- Wi-Fi disconnect, at least one queued event, reconnect, one cloud receipt.

Evidence includes firmware commit, device ID, calibration version, timestamp, serial log, edge log, cloud event ID, and screenshot. “It worked once” without linked IDs is not acceptance evidence.

## RLS/RBAC negative tests

- Citizen cannot select/update another household by changing URL, query, JWT claim in UI, or request body.
- Citizen cannot insert credits or penalties.
- Operator can create collection workflows but cannot review or edit rules.
- Verification officer can decide assigned cases but cannot alter raw telemetry.
- Device/gateway token cannot access citizen/admin endpoints.
- Anon session cannot join private realtime channels.

## Performance targets for the prototype

| Measure | Target |
|---|---:|
| Edge acknowledgement after durable local write | p95 < 300 ms on demo laptop/LAN |
| Normal cloud read API | p95 < 750 ms in rehearsal region |
| Cloud collection processing | p95 < 2 s |
| Live UI update | < 5 s, or polling fallback by next interval |
| Edge restart recovery | pending queue visible < 10 s |
| Device heartbeat stale threshold | configured, demo default 30 s |

These are rehearsal targets, not production SLO claims.

## Demo acceptance scenarios

### A: accepted and credited

Given an active seeded household/device and healthy calibrated evidence, when an event is synchronized, then it is accepted, one EcoCredit earn entry exists, the citizen balance changes once, and the admin can view the explanation.

### B: flagged and accepted by officer

Given conflicting/insufficient evidence, the event is flagged, no penalty exists, the officer accepts it, and the final audit shows the review.

### C: verified violation and dispute

A flagged event is confirmed with a reason, one simulated penalty/bill item appears, the citizen disputes it, and an authorized resolution is audited.

### D: offline replay

Internet is disabled, the edge accepts/persists an event, pending count increases, internet returns, one cloud event/credit is created, and re-sending produces the original receipt.

### E: degraded hardware

A required sensor is disconnected; device/edge show degraded health, the collection cannot be confidently auto-accepted, and no false normal reading or penalty is created.

### F: optional ML evidence (only after G4)

- Admin can import one valid `MANUAL_COLAB` observation and see provenance.
- Citizen/operator/anonymous imports fail; malformed, oversized, URL/base64, non-finite, and changed-body retry cases fail safely.
- Before/after assertions prove no collection state, reward, review decision, penalty, or bill changed.
- Colab unavailable switches to visibly labelled `RECORDED_ML`; omitting ML leaves all P0 scenarios green.

## Bug severity

- P0: data loss, duplicate credit/penalty, auth bypass, secrets, demo cannot start.
- P1: core journey broken with no safe fallback; hardware-edge-cloud mismatch.
- P2: non-core feature/cosmetic issue with workaround.
- P3: post-demo polish.

After H19, fix only P0/P1. Record P2/P3 honestly rather than destabilizing the release.

## PR evidence checklist

- [ ] Linked issue and requirement IDs.
- [ ] Only allowed paths changed.
- [ ] Commands and results listed.
- [ ] New/changed behavior has tests.
- [ ] Contract/schema docs updated only through approved change control.
- [ ] UI screenshot, API receipt, database assertion, or serial evidence attached as appropriate.
- [ ] No secrets or real data.
- [ ] `git diff` reviewed by the author and designated reviewer.
