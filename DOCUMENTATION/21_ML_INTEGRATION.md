> **PLAN & STRUCTURE LOCK — v2.0:** This approved scope, stack, repository structure, contracts, ownership map, truth-tier model, and delivery plan must not be changed by contributors or AI agents. Work only inside assigned paths. If a change is necessary, stop and submit a `CHANGE_REQUEST`; only PARTH AJMERA may approve it, followed by an ADR, contract/document updates, and team notification.

# Tier 1 Local Live ML Integration

Status: Tier 1 — real, release-blocking for the judged vertical slice

Runtime owner: ADITYA SILSWAL

Firmware trigger collaborator: KRISHNA PANWAR

Rules/cloud collaborator: AASHU JOSHI

QA and provenance reviewer: BHUMIKA SINGH RAWAT

UI reviewer: YASHVARDHAN DOBHAL

Approval owner: PARTH AJMERA

Canonical data/API shapes remain in **05_DATA_SCHEMA.md** and **06_API_IOT_CONTRACT.md**. Canonical business outcomes remain in **22_WASTE_DECISION_POINTS.md**.

## 1. Approved decision

Local live inference is Tier 1. After the FastAPI gateway durably commits an authenticated ESP32 disposal event, it correlates that event's **eventId** with one bounded frame from an approved phone IP-camera stream or laptop camera, runs a pinned model locally with WAN disabled, and stores a provenance-rich observation with **source=LOCAL_LIVE**.

ML supplies versioned evidence; it is not the ledger or review authority. The deterministic **rules-2.0.0** engine decides **ACCEPTED** or **FLAGGED**. A model, camera, or correlation failure becomes **ML_UNAVAILABLE** and **FLAGGED** with **0** immediate points. It never invalidates the already durable hardware ingest and never creates a negative transaction.

## 2. Truth-labelled sources

| Source | Meaning | May be called live? | Business use |
|---|---|:---:|---|
| **LOCAL_LIVE** | Frame captured from the approved local camera for a real durable hardware eventId and inferred by the verified local artifact | Yes | Evidence input to rules-2.0.0 |
| **RECORDED_ML** | Frozen, validated observation used when live capture/inference cannot be demonstrated | No | Disclosed fallback/reviewer evidence; never hardware proof |
| **SIMULATED** | Deterministic developer test-event observation | No | Demo/test pipeline only; fixed fictional identity and permanent label |
| **SEEDED** | Deterministic historical seed observation | No | Populated demo history only; never live proof |

**MANUAL_COLAB** is not the Tier 1 runtime. A notebook may be used offline by the team to evaluate or prepare an approved artifact, but it does not connect to the application database, hold product credentials, or masquerade as LOCAL_LIVE.

Event provenance is separate: `eventSource` is exactly `HARDWARE`, `RECORDED_HARDWARE`, `SIMULATED`, or `SEEDED`. A real judged event pairs `eventSource=HARDWARE` with ML `evidenceSource=LOCAL_LIVE`. A disclosed recorded fallback pairs `RECORDED_HARDWARE` with `evidenceSource=RECORDED_ML`; a developer fixture uses `SIMULATED`; deterministic history uses `SEEDED`.

The UI derives only `REAL`, `RECORDED`, `SIMULATED`, or `PREVIEW/SEEDED` badges from server provenance. Tier 2 preview fixtures are not ML observations and are never persisted.

## 3. Frozen runtime flow

~~~mermaid
flowchart LR
  I[Independent wet/dry IR trigger] --> E[ESP32 event with stable eventId]
  E --> V[FastAPI auth + Pydantic validation]
  V --> Q[(SQLite WAL durable commit)]
  Q --> A[202 QUEUED_LOCALLY]
  Q --> J[Durable ML job keyed by eventId]
  J --> C[Approved phone/laptop camera adapter]
  C --> H[In-memory frame + input SHA-256]
  H --> M[Pinned local model + frozen class map]
  M --> O[LOCAL_LIVE observation]
  O --> Q
  Q --> S[Authenticated idempotent cloud sync]
  S --> R[rules-2.0.0]
  C -. failure/timeout .-> U[ML_UNAVAILABLE]
  M -. failure/unknown .-> U
  U --> S
~~~

The gateway acknowledges local custody before capture/inference. ML latency or failure cannot cause an ESP32 retry storm, erase sensor evidence, or change an outbox transport state.

## 4. Event correlation and recovery

1. Firmware creates **eventId** before first delivery and reuses it for every retry.
2. The edge commits the authenticated event and one durable ML job in an idempotent transaction or immediately linked transactions before scheduling work.
3. At most one canonical LOCAL_LIVE observation is accepted for the approved event/model attempt identity.
4. Replayed hardware input returns the existing receipt and reuses the existing ML job; it does not recapture a new frame.
5. Capture/inference leases expire safely. After an edge restart, an unfinished job returns to ML_PENDING with bounded attempts.
6. The ML deadline is explicit. Timeout becomes ML_UNAVAILABLE; cloud processing proceeds to FLAGGED.
7. A late observation is retained as late evidence but cannot replace the canonical result, reopen a closed event, or mutate points without the authorized review flow.
8. Same immutable observation ID plus different payload/hash is IDEMPOTENCY_CONFLICT and is quarantined/audited.

Processing, business decision/review, and outbox transport are separate state machines. Do not collapse them into one enum.

## 5. Camera adapters and SSRF boundary

Supported adapters:

- direct laptop camera selected from approved local device configuration;
- phone IP camera at one H0-approved LAN endpoint.

Mandatory controls:

- Camera URL/device selection is startup/deployment configuration, never a request field, QR value, database field editable by a normal user, or ML artifact field.
- For an IP camera, allow only the exact configured HTTP/HTTPS scheme, host/IP, port, and path. Reject embedded credentials and fragments; disable redirects; revalidate the resolved destination; deny all non-approved destinations.
- Because the intended target is a private-LAN phone, use a narrow positive allowlist. Never broadly permit private, loopback, link-local, multicast, or cloud-metadata destinations.
- Use short connect/read/total timeouts, bounded retries, strict response bytes, accepted image content types, decoded width/height/pixel limits, and limited capture concurrency.
- Do not forward Supabase sessions, gateway/device tokens, cookies, or arbitrary request headers to the camera.
- Decode with a maintained image library; malformed or decompression-bomb input fails as ML_UNAVAILABLE.

## 6. Camera privacy

- Frame only the disposal zone. Do not capture faces, QR codes, screens, homes, number plates, addresses, or bystanders.
- Hold the frame in memory only long enough to validate, hash, and infer. Persist the SHA-256 and bounded metadata, not the raw/base64 frame or a retrievable camera URL.
- Normal logs contain event/model IDs, safe status codes, latency, dimensions, and hash suffixes only; no camera credentials or raw pixels.
- Debug retention is disabled by default. If PARTH AJMERA explicitly authorizes it, use only synthetic/team-consented images, restricted local storage outside any web root, opaque filenames, and automatic expiry.
- No frame is sent to Supabase Storage, Vercel, Colab, a third-party API, or source control in the Tier 1 flow.

## 7. Model artifact and class-map gate

The runtime loads only the artifact named in an approved local manifest. Readiness is false unless all required fields verify:

~~~json
{
  "manifestVersion": "2.0",
  "modelFamily": "YOLO-compatible",
  "frameworkVersion": "pinned",
  "weightsSha256": "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
  "classMapVersion": "waste-demo-1",
  "supportedClasses": {
    "approved-model-label": "DRY"
  },
  "datasetProvenance": "recorded-and-reviewed",
  "licenseDecision": "APPROVED",
  "validationReport": "tests/fixtures/ml/validation-report.json"
}
~~~

- Verify the artifact SHA-256 before every process startup and expose only a short hash suffix in safe health/UI output.
- Pin framework/runtime dependencies and run without network model download. A request can never choose a model path, URL, loader, class map, or subprocess argument.
- Treat pickle-capable model formats as executable code. Prefer a non-executable exported format when validated; otherwise load only the locally provisioned, hash-verified artifact from the fixed approved path and never deserialize an upload or downloaded/request-selected weight file.
- Prefer in-process inference. A necessary worker subprocess uses a fixed executable/argument array, shell disabled, bounded time/resources, and a least-privilege OS account.
- A general pretrained model may demonstrate only labels actually present in the frozen allowlist. It must not claim unsupported concepts such as generic plastic_wrapper or food_waste.
- Unsupported labels map to UNKNOWN. Multiple conflicting relevant objects are UNCERTAIN; do not silently choose the highest score.
- Model/weights/dataset provenance and licensing are a go/no-go decision. Ultralytics describes AGPL-3.0 and separate enterprise terms; resolve the chosen software and weights before use. See [Ultralytics licensing](https://www.ultralytics.com/license) and [prediction documentation](https://docs.ultralytics.com/modes/predict).

## 8. Observation semantics

The canonical observation contract includes, at minimum:

- observationId, eventId, schema version, and immutable source;
- observed timestamp and correlation/deadline status;
- model family/version, weights SHA-256, framework and class-map versions;
- input SHA-256, with framePersisted=false in the normal path;
- supported detected label or UNKNOWN, mapped WET/DRY/UNKNOWN category;
- numeric confidence in 0..1, band, inference milliseconds, and quality/error code;
- bounded extensions only.

Confidence bands are exact:

| Score | Band | Meaning |
|---:|---|---|
| **<0.60** | LOW | Uncertain; FLAGGED, 0 immediate points |
| **>=0.60 and <0.85** | MEDIUM | Usable evidence; mismatch still opens review rather than a debit |
| **>=0.85** | HIGH | Stronger evidence; still cannot directly verify a violation |

The score is not called a calibrated probability unless a recorded validation study supports that claim.

## 9. Rules and UI boundaries

- ML never writes the point ledger, review decision, dispute, bill, or penalty table.
- Supported matching evidence can help deterministic rules accept and award exactly +10 once.
- Category mismatch, severe wet-in-dry suspicion, environmental wetting, low confidence, unknown/conflicting class, and ML_UNAVAILABLE are FLAGGED with 0 immediate points.
- An authorized reviewer may resolve insufficient evidence as `REVIEW_NO_ACTION`, which closes at 0 with no ledger row.
- Only an authorized human VERIFIED_VIOLATION can append -10 for an ordinary mismatch or -20 for verified severe wet-in-dry under rules-2.0.0.
- Citizen UI receives a plain-language category/result, not raw internal class IDs or a claim that “AI proved guilt.”
- Developer/reviewer UI shows source, model version, safe weights/input-hash suffixes, label/category, confidence band, latency, health, and whether the observation was late/fallback.
- Every `RECORDED_ML`, `SIMULATED`, or `SEEDED` card visibly says it is not live. The UI badge is derived from server provenance, never supplied as authority by the browser.

## 10. Demo fallback and simulation

Prepare one deterministic RECORDED_ML result and one cloud developer test event before the demo. They are resilience tools, not hidden substitutes.

The developer simulation endpoint:

- is enabled only by DEMO_SIMULATION_ENABLED=true;
- requires the authorized system-admin/developer role;
- accepts only approved deterministic fixture IDs, not arbitrary camera URLs, files, commands, citizen IDs, or model paths;
- uses a fixed fictional citizen/device, `eventSource=SIMULATED`, and ML `evidenceSource=SIMULATED`;
- requires idempotency, strict body limits, rate limiting, and an audit record for actor, fixture, request, and outcome;
- enters after the physical-ingress boundary and shares schema validation, rules, persistence, ledger safeguards, Realtime, and UI code;
- is excluded from real-hardware proof counts and unlabelled leaderboard/analytics metrics.

If used on stage, say: “The live camera path is unavailable, so this visibly labelled recorded/simulated event is exercising the same post-ingress processing safely.”

## 11. Acceptance gate

Live local ML is demo-ready only when:

1. Artifact, framework, class map, weights SHA-256, provenance, dataset and license decision are recorded and verified.
2. The artifact is pre-provisioned and runs with WAN disabled.
3. The supported class allowlist is explicit; unsupported classes become UNKNOWN.
4. A representative local fixture set passes the approved confusion/unknown checks.
5. Measured laptop p95 capture-plus-inference latency meets the demo budget recorded in the test report.
6. Duplicate triggers, late inference, timeout and edge restart preserve one-event/one-observation correlation.
7. Raw frames are absent from persistent stores in the normal flow; any approved debug image expires automatically.
8. Low/conflicting confidence, camera/model failure and unsupported classes become FLAGGED, never a negative transaction.
9. A disclosed RECORDED_ML or SIMULATED fallback is ready and cannot be mistaken for live.

## 12. Required tests

- exact confidence boundaries below/at 0.60 and below/at 0.85, plus non-finite/out-of-range values;
- supported class mapping, unsupported class to UNKNOWN, and multiple conflicting objects to UNCERTAIN;
- changed/missing weights, manifest, framework, class-map, provenance, and license-gate failures;
- camera unavailable, timeout, malformed type, oversized bytes/dimensions, decode failure, and capture/inference deadline;
- SSRF rejection for request-supplied URL, wrong scheme/host/port/path, credentials, redirects, DNS/destination change, metadata target, and unapproved private host;
- duplicate ESP32 delivery, duplicate IR edge, concurrent worker, late result, process kill during capture/inference, and restart recovery;
- raw frames/base64/URLs/PII/secrets absent from SQLite, cloud payloads, logs, exports, and source control;
- HARDWARE/LOCAL_LIVE cannot be assigned by import, seed, or simulation; recorded, simulated, and seeded sources map to the correct permanent UI badge;
- each canonical event/ML provenance pair is accepted and every cross-pair is rejected or safely flagged;
- ML failure leaves the durable hardware receipt/outbox intact and creates no automatic negative point;
- `REVIEW_NO_ACTION` resolves an insufficient-evidence ML case at 0 with no ledger row;
- simulation disabled-by-default, role denial, fixed identities, idempotency, rate limit, audit, and metric exclusion.

## 13. Repository boundary

Tier 1 runtime belongs under the existing edge service, not a new top-level application:

~~~text
services/edge-gateway/app/ml/
├── adapters/
├── capture.py
├── inference.py
├── manifest.py
├── class_map.py
└── types.py

scripts/demo/ml/
├── README.md
├── model-manifest.json
├── fixtures/
│   ├── synthetic-input/
│   └── recorded-results/
└── validate-observation.mjs
~~~

Do not create another deployed ML service or top-level application. Google Colab is optional preparation/evaluation tooling only; its availability is not guaranteed and shared notebooks can expose code/output/comments. See the [Google Colab FAQ](https://research.google.com/colaboratory/faq.html).

## 14. Production evolution

A production camera/edge-AI path requires representative labelled data, accuracy/error evaluation, calibration and drift monitoring, device attestation, encrypted/managed model delivery, DPIA/retention approval, fleet capacity tests, observability, rollback and final license/legal approval. Dedicated edge-AI camera hardware remains Tier 3 and requires a future ADR and contract version.
