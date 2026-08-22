> **PLAN & STRUCTURE LOCK — v2.0:** This approved scope, stack, repository structure, contracts, ownership map, truth-tier model, and delivery plan must not be changed by contributors or AI agents. Work only inside assigned paths. If a change is necessary, stop and submit a `CHANGE_REQUEST`; only PARTH AJMERA may approve it, followed by an ADR, contract/document updates, and team notification.

# Waste Decision, EcoCredit, and Reviewed Violation Rules

Status: canonical rules baseline v2.0

Immutable ruleset: **rules-2.0.0**

Code owner: AASHU JOSHI

Approval owner: PARTH AJMERA

Database/test reviewer: BHUMIKA SINGH RAWAT

Hardware/edge evidence reviewers: KRISHNA PANWAR and ADITYA SILSWAL

## 1. Non-negotiable policy

Automation has only two business outcomes: **ACCEPTED** or **FLAGGED**.

- A qualifying accepted event appends exactly one **+10** point transaction.
- Every pending, uncertain, unavailable, mismatched, or environmental-wetting result appends no immediate transaction and displays **0 pending review**.
- An ordinary category mismatch may append **-10** only after an authorized human records **VERIFIED_VIOLATION**.
- Severe wet-in-dry may append **-20** only after an authorized human records **VERIFIED_VIOLATION** and the frozen severe evidence conditions are present.
- ML, firmware, the edge, frontend, and an unreviewed rules result can never create a negative entry.
- Balances are derived from the append-only ledger. No component directly edits a citizen balance or deletes history.

These are prototype EcoCredit points, not money, a legal fine, a government bill, or automatic guilt.

The pure deterministic implementation belongs in **packages/rules-engine**. Thresholds and explanation codes are versioned configuration, not duplicated in frontend, firmware, edge routes, or API handlers.

## 2. Immutable normalized input

The engine receives one snapshot containing:

- eventId, ruleset version, canonical `eventSource`, citizen/session validity, and selected compartment;
- independently debounced physical triggered compartment from wet IR or dry IR;
- sensor quality and calibration versions;
- dry-path moisture percentage when the selected/triggered compartment is DRY;
- ML processing state, observation source, supported label, mapped category, score, confidence band, model/weights/class-map identity, input hash, and quality;
- safety flags, timestamps, duplicate/timeout indicators, and explicit missing/degraded states.

Fill level and GPS are operational evidence only. They never affect ACCEPTED/FLAGGED, confidence, points, review outcome, or violation severity. Moisture is supporting evidence and never proves a violation by itself.

Canonical event provenance is `HARDWARE | RECORDED_HARDWARE | SIMULATED | SEEDED`; ML evidence source is `LOCAL_LIVE | RECORDED_ML | SIMULATED | SEEDED`. UI badges are derived as `REAL | RECORDED | SIMULATED | PREVIEW/SEEDED`. Browser input cannot choose any authoritative source. Tier 2 preview fixtures are never passed to this engine or stored.

## 3. Frozen rules-2.0.0 profile

~~~json
{
  "version": "rules-2.0.0",
  "acceptedPoints": 10,
  "pendingOrUncertainPoints": 0,
  "verifiedCategoryMismatchPoints": -10,
  "verifiedSevereWetInDryPoints": -20,
  "lowConfidenceUpperExclusive": 0.60,
  "highConfidenceLowerInclusive": 0.85,
  "normalMoistureUpperExclusive": 30,
  "elevatedMoistureUpperInclusive": 45,
  "highMoistureLowerExclusive": 45,
  "fillAndGpsAreNonDecisional": true,
  "negativeRequiresVerifiedViolation": true
}
~~~

Exact bands:

| Signal | Range | Frozen interpretation |
|---|---:|---|
| ML confidence | **<0.60** | LOW; uncertain |
| ML confidence | **>=0.60 and <0.85** | MEDIUM; usable evidence |
| ML confidence | **>=0.85** | HIGH; stronger evidence, not automatic guilt |
| Moisture | **<30%** | NORMAL |
| Moisture | **>=30% and <=45%** | ELEVATED |
| Moisture | **>45%** | HIGH |

The score is not called a calibrated probability unless a recorded validation study proves that claim. Moisture percentages require a valid calibration record; these hackathon thresholds are not universal scientific facts. Any threshold change creates a new immutable ruleset version and never rewrites historical results.

## 4. Automated evaluation order

First matching rule wins:

| Priority | Condition | Automated outcome | Immediate ledger | Explanation code |
|---:|---|---|---:|---|
| 1 | Safety/fire condition active | FLAGGED plus separate safety alert | 0 | SAFETY_HOLD |
| 2 | Citizen/session/QR binding invalid or expired | FLAGGED | 0 | IDENTITY_OR_SESSION_INVALID |
| 3 | No valid debounced compartment trigger | FLAGGED | 0 | INTAKE_NOT_CONFIRMED |
| 4 | Triggered compartment differs from selected compartment | FLAGGED | 0 | COMPARTMENT_TRIGGER_MISMATCH |
| 5 | Required non-ML sensor or calibration evidence missing, failed, out of range, or corrupt | FLAGGED | 0 | EVIDENCE_INSUFFICIENT |
| 6 | ML processing is ML_UNAVAILABLE, late beyond deadline, or observation missing | FLAGGED | 0 | ML_UNAVAILABLE |
| 7 | Event/ML provenance pairing is not HARDWARE/LOCAL_LIVE, RECORDED_HARDWARE/RECORDED_ML, SIMULATED/SIMULATED, or SEEDED/SEEDED | FLAGGED | 0 | PROVENANCE_MISMATCH |
| 8 | ML source is RECORDED_ML | FLAGGED for reviewer/fallback disclosure | 0 | RECORDED_ML_REQUIRES_REVIEW |
| 9 | Label unsupported/UNKNOWN, relevant objects conflict, or score <0.60 | FLAGGED | 0 | ML_UNCERTAIN |
| 10 | Selected DRY, ML maps WET, and calibrated dry-path moisture >45% | FLAGGED | 0 | SEVERE_WET_IN_DRY_SUSPECTED |
| 11 | ML mapped category differs from selected compartment | FLAGGED | 0 | CATEGORY_MISMATCH |
| 12 | Selected DRY, ML maps DRY, and calibrated moisture >45% | FLAGGED | 0 | ENVIRONMENTAL_WETTING_SUSPECTED |
| 13 | Selected DRY, ML maps DRY with score >=0.60 and calibrated moisture <=45% | ACCEPTED | +10 exactly once | DRY_CATEGORY_MATCH |
| 14 | Selected WET, ML maps WET with score >=0.60 | ACCEPTED | +10 exactly once | WET_CATEGORY_MATCH |
| 15 | Any unhandled combination | FLAGGED | 0 | UNCLASSIFIED_EVIDENCE |

For a WET event, the dry-path moisture sensor is not required and its absence does not fabricate a wet/dry conclusion. A MEDIUM-confidence category match may be accepted; the confidence band remains visible in the audit snapshot. A HIGH-confidence mismatch still only opens review.

SIMULATED events may exercise the same deterministic rules and ledger safeguards only for the fixed fictional demo identity. SEEDED events populate reconciled fictional history. Their records retain their canonical provenance, map to `SIMULATED` or `PREVIEW/SEEDED` UI badges, and are excluded from real-hardware proof and every metric that is not explicitly labelled.

## 5. Required decision examples

| Selected | ML evidence | Moisture | Automated result | Immediate points | Possible reviewed result |
|---|---|---:|---|---:|---|
| DRY | supported DRY, >=0.60 | <30% | ACCEPTED | +10 | none |
| DRY | supported DRY, >=0.60 | 30–45% | ACCEPTED with elevated evidence recorded | +10 | none |
| WET | supported WET, >=0.60 | not required | ACCEPTED | +10 | none |
| either | score <0.60, UNKNOWN/conflicting, or ML unavailable | any | FLAGGED | 0 | `REVIEW_ACCEPTED` +10 or `REVIEW_NO_ACTION` 0 |
| DRY | supported DRY | >45% | FLAGGED: environmental wetting suspected | 0 | `REVIEW_ACCEPTED` +10 or `REVIEW_NO_ACTION` 0 |
| DRY | supported WET | >45% | FLAGGED: severe wet-in-dry suspected | 0 | verified violation may append -20 |
| either | supported opposite category | any other valid moisture state | FLAGGED: category mismatch | 0 | verified violation may append -10 |

## 6. Human review and value effects

The reviewer sees the original selected/triggered compartment, calibrated sensor evidence, ML provenance and confidence, rule version/hash, explanation codes, event source, duplicate/timeout history, and plain-language context. The reviewer cannot edit evidence.

| Authorized review outcome | Preconditions | Append-only value effect |
|---|---|---:|
| REVIEW_ACCEPTED — reward | Reviewer finds compliant evidence | +10 once |
| REVIEW_NO_ACTION | Evidence remains insufficient but no violation is verified | 0; no ledger row; close case |
| VERIFIED_VIOLATION — ordinary mismatch | CATEGORY_MISMATCH evidence, reason, actor and authorization recorded | -10 once |
| VERIFIED_VIOLATION — severe wet-in-dry | DRY selected/triggered, supported WET evidence, calibrated moisture >45%, reason, actor and authorization recorded | -20 once |
| Human correction of a prior transaction | Authorized correction references original transaction | Compensating reversal; original remains immutable |

A reviewer cannot choose -20 for an ordinary mismatch, cannot create both -10 and -20 for one terminal review, and cannot verify a violation from moisture alone, GPS, fill level, low confidence, UNKNOWN class, camera failure, or model failure.

## 7. Orthogonal state machines

### Processing

~~~text
DISPOSAL_STARTED
  -> SENSOR_CAPTURED
  -> ML_PENDING
  -> ML_RECEIVED | ML_UNAVAILABLE
  -> PROCESSING
  -> SEGREGATION_DECIDED
  -> POINTS_CALCULATED | REVIEW_REQUIRED
  -> COMPLETED

Any stage -> PROCESSING_FAILED
~~~

### Decision and review

~~~text
CAPTURED -> EVALUATING -> ACCEPTED | FLAGGED
FLAGGED -> REVIEW_ACCEPTED | REVIEW_NO_ACTION | VERIFIED_VIOLATION
VERIFIED_VIOLATION -> PENALIZED
ACCEPTED | REVIEW_ACCEPTED | REVIEW_NO_ACTION | PENALIZED -> CLOSED
~~~

`REVIEW_ACCEPTED` appends +10 if absent. `REVIEW_NO_ACTION` appends no ledger row and closes at 0. The review record retains the no-action reason, actor, and evidence snapshot.

### Edge transport

~~~text
PENDING -> IN_FLIGHT -> ACKED
IN_FLIGHT -> PENDING | DEAD_LETTER | AUTH_BLOCKED
AUTH_BLOCKED -> PENDING after credential repair
~~~

Never place processing or review states in the transport enum.

## 8. Idempotency and transactional integrity

For a given event, evidence hash, and ruleset:

1. Re-evaluation returns the same outcome and ordered explanation codes.
2. One accepted or `REVIEW_ACCEPTED` event creates at most one +10 reward.
3. One flagged event receives at most one terminal `REVIEW_ACCEPTED`, `REVIEW_NO_ACTION`, or `VERIFIED_VIOLATION` decision.
4. One verified event creates exactly one applicable negative entry, never both -10 and -20.
5. Retry returns the stored canonical result.
6. Same immutable identity plus different content returns IDEMPOTENCY_CONFLICT and creates an audit/security event.
7. A compensating reversal is separately authorized, idempotent, and linked to the original; no transaction is updated or deleted.

Automated decision plus optional +10 insertion occurs in one database transaction. Human review, state transition, exactly one optional -10/-20 entry, and audit record occur in one database transaction. Database constraints enforce uniqueness; application checks alone are insufficient.

The ledger snapshot stores event ID, ruleset version/hash, ordered explanation codes, review ID when applicable, signed point amount, actor/source, and timestamps. Historical rows retain the original rules/model/calibration identities.

## 9. Security, fairness, and simulation safeguards

- Only the cloud rules service evaluates business outcomes; firmware, edge and UI never calculate authority-bearing points.
- Only the verification-officer/admin server path can record VERIFIED_VIOLATION; frontend visibility is not authorization.
- Event and ML sources are immutable. Import, seed, simulation, and browser input cannot set HARDWARE or LOCAL_LIVE.
- The developer simulation endpoint is disabled unless DEMO_SIMULATION_ENABLED=true, role-gated, rate-limited, idempotent, audited, and fixed to fictional identities/fixtures.
- Raw frames, camera URLs, secrets, arbitrary model labels, GPS and fill values are not copied into public explanation text.
- Citizen explanation states what evidence was available and how to dispute; it never says “AI proved guilt.”
- Analytics never rank real citizens publicly. The demo leaderboard uses opt-in fictional aliases and excludes undisclosed simulation.

## 10. Required tests

At minimum cover:

- confidence 0, just below/at 0.60, just below/at 0.85, 1, non-finite, and out-of-range;
- moisture just below/at 30 and just below/at/above 45 after calibration;
- MEDIUM and HIGH matching WET/DRY categories;
- ordinary mismatch, severe wet-in-dry, and environmental-wetting paths;
- wet event without dry-path moisture;
- missing/degraded/failed/uncalibrated evidence, no trigger, cross-compartment trigger, invalid session, safety hold, UNKNOWN and conflicting objects;
- every valid event/ML provenance pair plus every rejected cross-pair; recorded evidence always remains review-only;
- camera/model timeout and ML_UNAVAILABLE preserve durable ingest and create 0 immediate points;
- same input repeated, concurrent duplicate processing, and same identity/different body;
- accepted and `REVIEW_ACCEPTED` create +10 once; `REVIEW_NO_ACTION` closes at 0 with no ledger row;
- FLAGGED creates no immediate ledger row and no negative value;
- ordinary VERIFIED_VIOLATION creates -10 once; severe creates -20 once; neither is possible without human authorization;
- attempts to choose severe for ordinary mismatch, use moisture alone, create both negative amounts, mutate balance directly, edit evidence, or delete a ledger row are rejected;
- reversal is additive/idempotent and preserves the original;
- SIMULATED truth label, fixed identity, metric exclusion, role/env/rate/idempotency/audit controls;
- explanation order and ruleset hash remain stable for every normalized input.

Property-based testing should assert that every normalized input returns a defined result, automation never emits a negative value, and no human review can exceed the frozen -20 lower outcome for one event.

## 11. Judge-safe explanation

“The sensors and local model provide versioned evidence, not guilt. A supported category match can earn exactly ten EcoCredits. Anything missing, uncertain, mismatched, or environmentally ambiguous pauses at zero for human review. Only a verified human decision can append minus ten or minus twenty, and every value change is immutable, idempotent, explainable, and disputable.”
