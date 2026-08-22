> **PLAN & STRUCTURE LOCK — v2.0:** This approved scope, stack, repository structure, contracts, ownership map, truth-tier model, and delivery plan must not be changed by contributors or AI agents. Work only inside assigned paths. If a change is necessary, stop and submit a `CHANGE_REQUEST`; only PARTH AJMERA may approve it, followed by an ADR, contract/document updates, and team notification.

# Canonical Glossary and State Vocabulary

Use these exact terms in code, APIs, UI, tests, documentation, PR evidence, and the pitch. Friendly UI text may explain a canonical term but must preserve a one-to-one mapping.

## Product and architecture terms

| Term | Canonical meaning |
|---|---|
| Smart Waste Ecosystem / SGV 2.0 | The complete edge-connected municipal waste-disposal and accountability prototype in `Vortex-ParthAjmera/Smart-Waste-Ecosystem` |
| Household | Fictional municipal collection account that may have multiple authorized people and identifiers |
| Citizen | Authenticated person linked to a household |
| Municipal user | Authorized worker/reviewer/admin using the municipal experience; exact permissions remain role-specific |
| Developer/IoT user | Restricted technical role or system-admin view for device health, telemetry, ML, logs, diagnostics, and simulation |
| Role experience | Citizen, municipal, or developer/IoT interface inside the one Next.js application; not a separate deployment |
| Identifier | Opaque, rotatable RFID/QR reference linked server-side to a household |
| Citizen QR | Opaque identifier QR containing no name, phone, address, balance, Aadhaar number, or other PII |
| Device | Provisioned ESP32 controller with a unique identity and firmware version |
| Edge gateway | Local FastAPI/Pydantic service that authenticates, validates, durably persists, coordinates capture/inference, and forwards device messages |
| Durable local ACK | `QUEUED_LOCALLY`, returned only after the edge SQLite transaction commits; it is not cloud acceptance |
| Cloud API | Next.js `/api/v1` server boundary; never a browser direct-to-database path |
| Disposal event / collection event | Immutable record of one citizen waste-disposal intent; the two product phrases refer to the same canonical event entity |
| Event ID | Globally unique, client-created idempotency identity retained across device, edge, ML, cloud, ledger, audit, and UI |
| Sensor reading | Value plus type, unit, quality, time, and calibration version; provenance comes from the parent event's `eventSource` |
| Selected compartment | Citizen/operator-selected `WET` or `DRY` physical intake path; not an ML prediction |
| Evidence | Compartment, sensor, ML, time, and device facts used to explain a decision; never absolute proof |
| ML observation | Event-correlated label/category/confidence/model record produced locally or from an explicitly recorded fallback |
| Supported class | Model output present in the approved model-manifest allowlist and mapped explicitly to `WET`, `DRY`, or `UNKNOWN` |
| Rule version | Immutable deterministic configuration applied to one event; v2 demo rules use `rules-2.0.0` |
| EcoCredit / point | Prototype non-cash unit in the append-only ledger; never rupees, cash, or wallet money |
| Point ledger | Append-only authority for awards, verified-violation deductions, reversals, redemptions, and adjustments; balance is derived |
| Badge | Deterministic fictional-demo achievement with rule, reason, and award date |
| Citizen tier | Ledger-derived `BRONZE`, `SILVER`, `GOLD`, or `PLATINUM` band |
| Verification case | Human workflow opened for a `FLAGGED` event |
| Verified violation | Authorized human decision permitting the configured negative ledger entry or simulated consequence |
| Dispute | Citizen challenge to an eligible verified action |
| Golden fixture | Versioned canonical sample parsed and tested by every relevant runtime |
| Payload hash | Request digest used to distinguish an exact retry from same-ID/different-content conflict |
| Correlation ID | Request/trace identifier; `eventId` remains the business identity |
| Realtime invalidation | Small authorized notification that causes clients to refetch canonical REST data; not a replacement for server authorization |

## Truth tiers

| Term | Canonical meaning | Required visible language |
|---|---|---|
| Tier 1 — REAL | Implemented end to end with real code/data and passing evidence; recorded, simulated, and seeded fallbacks remain truth-labelled | `REAL`, `RECORDED`, `SIMULATED`, or `PREVIEW/SEEDED` according to the evidence actually shown |
| Tier 2 — PREVIEW | Polished UI backed only by an approved frontend fixture, with no database row, feature table/API, or worker | `PREVIEW/SEEDED` |
| Tier 3 — ROADMAP | Not built during the hackathon; documentation only | `ROADMAP` when discussed; no imitation screen |

Tier is about implementation truth, not visual quality. A polished preview does not become real, and a degraded live component does not become simulated. Feature tier, stored provenance, and rendered truth badge are related but separate concepts.

## Canonical provenance and truth labels

### Event source

`eventSource` describes how the disposal event entered the system.

| `eventSource` | Meaning |
|---|---|
| `HARDWARE` | Captured live from the physical ESP32/sensor ingress |
| `RECORDED_HARDWARE` | Replay of a preserved real hardware payload; never presented as a current physical trigger |
| `SIMULATED` | Restricted synthetic event injected after the physical-ingress boundary; excluded from real-hardware proof counts |
| `SEEDED` | Deterministic fictional Tier 1 record created by the approved database seed/reset workflow |

### ML/evidence source

`evidenceSource` describes how an ML observation or evidence record was obtained.

| `evidenceSource` | Meaning |
|---|---|
| `LOCAL_LIVE` | Captured and inferred live on the local laptop from the configured phone/laptop camera for this event |
| `RECORDED_ML` | Verified saved ML observation used because live capture/inference is unavailable |
| `SIMULATED` | Deterministic synthetic ML/evidence fixture attached to a simulated test event |
| `SEEDED` | Deterministic fictional ML/evidence record created by the approved database seed/reset workflow |

`LOCAL_LIVE` describes the inference source, not the final decision. One event may validly have `eventSource=HARDWARE` and `evidenceSource=LOCAL_LIVE`; never collapse the two fields into one source enum. `SIMULATED` and `SEEDED` remain permanent through the event, evidence, decision, ledger, audit, Realtime, and UI projections that persist them.

### UI truth badge

The UI renders one of these exact, human-readable truth badges while showing technical provenance separately where useful.

| UI truth badge | Use |
|---|---|
| `REAL` | Current physical evidence (`HARDWARE`) or current local inference (`LOCAL_LIVE`) |
| `RECORDED` | A `RECORDED_HARDWARE` event or `RECORDED_ML` observation |
| `SIMULATED` | An injected event with `eventSource=SIMULATED`, or its ML evidence with `evidenceSource=SIMULATED` |
| `PREVIEW/SEEDED` | An approved `SEEDED` Tier 1 demo record or a Tier 2 frontend-only fixture |

A Tier 2 preview has **no** database row and therefore no `eventSource` or `evidenceSource`; its frontend fixture renders `PREVIEW/SEEDED`. A persisted Tier 1 seed record uses `SEEDED` provenance and the same truth badge, but its implemented feature remains Tier 1.

## Orthogonal state machines

Never collapse processing, decision/review, and transport into one ambiguous `status` field.

### Processing state

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

- `DISPOSAL_STARTED`: a compartment IR created the disposal intent.
- `SENSOR_CAPTURED`: required available sensor snapshot was recorded.
- `ML_PENDING`: local capture/inference is expected but unfinished.
- `ML_RECEIVED`: one canonical validated ML observation is linked.
- `ML_UNAVAILABLE`: capture/model timed out, failed, or had no usable supported result.
- `PROCESSING`: server is applying the frozen deterministic rules.
- `SEGREGATION_DECIDED`: automatic decision and reasons are stored.
- `POINTS_CALCULATED`: allowed ledger effect committed exactly once.
- `REVIEW_REQUIRED`: automatic path produced no final value effect and opened review.
- `COMPLETED`: event processing finished for the current path.
- `PROCESSING_FAILED`: terminal/current processing failure with an explicit reason; not silent disappearance.

### Decision and review state

- `CAPTURED`: canonical event exists but evaluation has not completed.
- `EVALUATING`: deterministic rules are being applied.
- `ACCEPTED`: evidence qualifies under the applied rule and may award `+10` exactly once.
- `FLAGGED`: uncertainty or mismatch requires a human; it is **not guilt** and has immediate ledger effect `0`.
- `REVIEW_ACCEPTED`: authorized reviewer cleared the flagged event and may award `+10` exactly once.
- `REVIEW_NO_ACTION`: authorized reviewer found evidence insufficient, closes the case at zero, and creates no ledger row.
- `VERIFIED_VIOLATION`: authorized human confirmed a violation and may append configured `-10` or `-20`.
- `PENALIZED`: authorized negative ledger/simulated consequence committed.
- `CLOSED`: no further normal decision transition remains.

### Transport state

- `QUEUED_LOCALLY`: device-facing proof of durable edge custody.
- `PENDING`: stored in the edge outbox and waiting for an attempt or retry time.
- `IN_FLIGHT`: leased by one worker for one bounded cloud attempt.
- `ACKED`: matching cloud receipt persisted locally.
- `AUTH_BLOCKED`: credential/configuration repair is required before retry.
- `DEAD_LETTER`: terminal/manual remediation; record remains preserved.

An event may simultaneously be `ML_PENDING` (processing), `CAPTURED` (decision), and `ACKED` (transport). This is valid.

## Health, freshness, and quality

| Term | Meaning |
|---|---|
| `OK` | Component/read is present and within its validated operating contract |
| `DEGRADED` | Component works partially or evidence quality is insufficient for a confident adverse result |
| `MISSING` | Expected component/read is not present |
| `FAILED` | Component attempted operation and returned a known failure |
| `UNKNOWN` | Current health cannot be established |
| `ONLINE` | Connectivity heartbeat is within its configured window |
| `STALE` | Last update exceeded freshness threshold; not necessarily physically offline |
| `OFFLINE` | Connectivity/heartbeat is unavailable beyond the offline threshold |
| `DISABLED` | Administratively unavailable and must fail closed |

Health state and provenance are independent: a sensor reading on an `eventSource=SIMULATED` event can be `OK`, and one on an `eventSource=HARDWARE` event can be `DEGRADED`.

## Confidence and moisture bands

### ML confidence

- `LOW`: `0 <= confidence < 0.60` → `FLAGGED`.
- `MEDIUM`: `0.60 <= confidence < 0.85` → rules may accept only the frozen supported combination; the UI must still show `MEDIUM`.
- `HIGH`: `0.85 <= confidence <= 1.00` → high-confidence evidence, not proof or guilt.

Confidence is a model score. Do not call it a calibrated probability unless separate validation proves calibration.

### Dry-path moisture

- `NORMAL`: `<30%`.
- `ELEVATED`: `>=30%` and `<=45%`.
- `HIGH`: `>45%`.

The moisture sensor is in the dry path. It is supporting evidence only and is not required for a wet-compartment event. Missing or uncalibrated data is not zero.

`ENVIRONMENTAL_WETTING_SUSPECTED` means dry ML evidence plus dry-path moisture `>45%`; the automatic outcome is `FLAGGED`, immediate ledger `0`, and human review may clear it and award `+10`.

## Simulation terminology

| Term | Meaning |
|---|---|
| Inject Test Event | Restricted demo action that enters the real downstream validation/decision/persistence/realtime/UI path after physical ingest |
| Simulation boundary | The point after physical QR/IR/sensor/camera/firmware evidence; injection cannot claim those steps happened |
| Demo fixture | Fixed fictional input with stable IDs, expected outcome, explicit `eventSource`/`evidenceSource` or frontend-only preview status, and safe reset behavior |

## Language to avoid

- “AI proved a violation.” Say “Local ML provided evidence; deterministic rules flagged it and an authorized human decided.”
- “Automatic fine.” A mismatch is `FLAGGED` with `0`; negative points require `VERIFIED_VIOLATION`.
- “Real payout/bill.” EcoCredits and civic consequences are prototype-only.
- “Exactly-once delivery.” Delivery may repeat; business effects are idempotent.
- “Offline synced.” Local capture/inference/persistence may be offline; cloud sync exists only after receipt.
- “Live GPS/map” when the map uses `PREVIEW/SEEDED`, stale, recorded, or simulated data.
- “Live AI” for `RECORDED_ML` or `SIMULATED` output.
- “Three applications” when describing deployment. Say “three role experiences in one Next.js application.”
- “100% accurate,” “calibrated probability,” “government approved,” or “legally compliant” without the required independent evidence.
