> **PLAN & STRUCTURE LOCK — v1.0:** This approved scope, stack, repository structure, contracts, ownership map, and delivery plan must not be changed by contributors or AI agents. Work only inside the assigned paths. If a change is necessary, stop and submit a `CHANGE_REQUEST`; only PARTH AJMERA may approve it, followed by an ADR and team notification.

# Canonical Glossary and State Vocabulary

Use these terms in code, APIs, UI, tests, docs, and the pitch. Do not create synonyms that blur state or fairness.

| Term | Canonical meaning |
|---|---|
| SGV 2.0 | Smart Garbage Vehicle 2.0, the full edge-connected municipal ecosystem |
| Household | Municipal collection account; may have multiple users/identifiers |
| Citizen | Authenticated person linked to a household |
| Identifier | Opaque RFID/QR reference linked to a household; contains no PII itself |
| Vehicle | Municipal collection asset assigned to device/operator/ward/route |
| Device | Provisioned ESP32 controller with a unique identity and firmware version |
| Edge gateway | Local FastAPI service that validates, persists, and forwards device messages |
| Cloud API | Next.js `/api/v1` server boundary; never the browser or Supabase directly |
| Collection event | Immutable record of one household waste-submission intent |
| Event ID | Globally unique device-generated idempotency identity, stable across retries |
| Sensor reading | Value plus type, unit, validity, quality, time, calibration/source metadata |
| Evidence | Declared category, sensor/location/device data used to explain a decision; not absolute proof |
| Rule version | Immutable identifier for the deterministic decision configuration applied |
| EcoCredit | Prototype non-cash incentive point; never call it rupees, cash, or wallet money |
| Credit ledger | Append-only authority for EcoCredit earns, reversals, redemptions, and adjustments |
| Penalty | Simulated monetary municipal consequence created only after verified violation |
| Review/verification case | Human decision workflow for a flagged collection |
| Dispute | Citizen challenge to their own active verified penalty |
| RLS | PostgreSQL Row Level Security; core row authorization control |
| HIL | Hardware-in-loop test using the real ESP32/sensors and production contract |
| Golden fixture | Versioned canonical sample parsed by firmware/edge/cloud/tests |
| Receipt | Durable acknowledgement containing stable identifiers and current processing status |
| Payload hash | Canonical request digest used to detect same ID with different content |
| Correlation ID | Request/trace identifier across logs; event ID remains the business identity |
| Stale | Last update exceeded configured freshness threshold; not necessarily offline |
| Degraded | Component works with missing/unhealthy evidence and cannot make confident adverse claims |
| Dead letter | Persisted terminal/poison message requiring explicit human remediation |
| Aarav | Fictional seeded citizen used only in the demo narrative |
| ML observation | Optional structured supporting evidence linked to an event; never an automatic decision |
| IoT-control view | Admin-only component health/telemetry view inside the existing web app, not a separate application |

## Orthogonal states

Do not collapse these dimensions into one ambiguous `status`:

### Collection workflow

`CREATED → INTAKE_DETECTED → EVIDENCE_CAPTURED → EVALUATED → CLOSED`

### Decision

- `PENDING`: not evaluated.
- `ACCEPTED`: compliant enough under the applied rule; may earn EcoCredits.
- `FLAGGED`: needs human review; **not a violation and never a penalty**.
- `VERIFIED_VIOLATION`: authorized human confirmed a violation.
- `REVIEW_ACCEPTED`: authorized human cleared the flagged submission.

### Synchronization

- `QUEUED_LOCALLY`: device-facing response proving the gateway durably owns the message.
- `PENDING`: waiting for a cloud attempt or scheduled retry.
- `IN_FLIGHT`: leased for one bounded attempt.
- `ACKED`: matching cloud receipt stored.
- `AUTH_BLOCKED`: credentials require repair.
- `DEAD_LETTER`: terminal/manual remediation.

### Device/location health

`ONLINE`, `STALE`, `OFFLINE`, `DEGRADED`, `DISABLED`.

### Ledger entry

`EARN`, `REDEEM`, `ADJUSTMENT`, `REVERSAL`; entries are never overwritten.

### Data source

- `HARDWARE`: captured live from physical device.
- `RECORDED_HARDWARE`: replay of a preserved real capture.
- `SIMULATOR`: generated test/demo data.
- `MANUAL_COLAB`: optional live notebook inference on synthetic/team-created input.
- `RECORDED_ML`: deterministic saved output of the optional ML demo; not live inference.

## Language to avoid

- “AI proved a violation” (ML is optional supporting evidence; the core is deterministic sensor-assisted evaluation).
- “Automatic fine” (human verification is mandatory).
- “Real payout/bill” (both are simulated).
- “Exactly once network delivery” (delivery may repeat; effects are idempotent).
- “Offline synced” before the cloud receipt exists.
- “Live GPS” when using a simulator or stale sample.
- “Compliant/certified by government” (prototype is designed to align; no certification claimed).
