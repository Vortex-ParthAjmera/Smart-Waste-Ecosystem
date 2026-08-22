> **PLAN & STRUCTURE LOCK — v2.0:** This approved scope, stack, repository structure, contracts, ownership map, truth-tier model, and delivery plan must not be changed by contributors or AI agents. Work only inside assigned paths. If a change is necessary, stop and submit a `CHANGE_REQUEST`; only PARTH AJMERA may approve it, followed by an ADR, contract/document updates, and team notification.

# API and IoT Contract

Wire path version: `v1`
Additive contract revision: `1.1`
Rules version: `rules-2.0.0`
Authority: this file defines external LAN/cloud behavior; JSON Schema/OpenAPI committed in `packages/contracts/` is the executable contract.

## 1. Contract authority and compatibility

- LAN routes use `/v1`; cloud routes use `/api/v1`.
- `schemaVersion: "1.1"` adds event-correlated local ML, explicit provenance, processing state, and dual-compartment readings to the v1 family.
- During the hackathon, changes are additive and optional-by-default. Removing/renaming/changing field meaning or enum behavior requires a new version and approved change request.
- Every external input is untrusted and strictly validated at the boundary.
- Firmware, edge Pydantic, cloud Zod/OpenAPI, database mappings, and UI types must share golden fixtures.
- API paths below are frozen. Do not add Build Doc v4's unversioned `/auth/*`, `/iot/*`, `/ml/detection`, or `/disposal/process` routes.

## 2. Standard envelopes

### Success

```json
{
  "data": {},
  "meta": {
    "requestId": "0191b9d1-7580-7d2f-9ddc-f3d5466579ae"
  }
}
```

List response:

```json
{
  "data": [],
  "page": {
    "nextCursor": null,
    "hasMore": false
  },
  "meta": {
    "requestId": "0191b9d1-7580-7d2f-9ddc-f3d5466579ae"
  }
}
```

### Error

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The request could not be accepted.",
    "details": [
      { "path": "payload.selectedCompartment", "code": "INVALID_ENUM" }
    ],
    "retryable": false
  },
  "meta": {
    "requestId": "0191b9d1-7580-7d2f-9ddc-f3d5466579ae"
  }
}
```

Rules:

- `code` is stable and machine-readable.
- `message` is safe for the caller. Never return stack traces, SQL, paths, raw QR, signatures, tokens, camera credentials, or provider internals.
- `details` is bounded and contains field paths/codes, not echoed secrets.
- Responses use `Content-Type: application/json; charset=utf-8`.
- Every request/response has a correlation `requestId`; clients do not treat display text as program logic.

### Status mapping

| HTTP | Meaning |
|---:|---|
| `200` | successful read/update or exact idempotent replay |
| `201` | new resource created |
| `202` | locally durable/accepted for processing, not cloud-complete |
| `204` | successful no-body operation |
| `400` | malformed request |
| `401` | missing/invalid authentication |
| `403` | authenticated but unauthorized/disabled |
| `404` | absent or deliberately hidden resource |
| `409` | state conflict, request in progress, or idempotency body mismatch |
| `410` | expired/revoked QR/session when disclosure is safe |
| `413` | body too large |
| `415` | unsupported content type |
| `422` | syntactically valid but schema/domain-invalid body |
| `429` | rate limited; include `Retry-After` |
| `500` | unexpected server failure |
| `502/503/504` | dependency unavailable/timeout where appropriate |

Canonical conflict code for same ID/key with changed body is `409 IDEMPOTENCY_CONFLICT`, never `422`.

## 3. Shared scalar and naming rules

| Field | Rule |
|---|---|
| IDs | lowercase canonical UUID string; UUIDv7 preferred for new sortable IDs |
| timestamps | UTC RFC 3339 with `Z`; reject ambiguous local time |
| JSON fields/query | `camelCase` |
| enums/codes | `UPPER_SNAKE_CASE` |
| compartment | `WET` or `DRY` |
| ML category | `WET`, `DRY`, or `UNKNOWN` |
| model score | decimal `0..1`, not described as calibrated probability |
| moisture/fill | decimal percent `0..100` |
| GPS | latitude `-90..90`, longitude `-180..180`; no coordinates for `NO_FIX` |
| point delta | signed integer; browser/device never supplies authoritative value |
| body size | endpoint-specific hard limit before parse |
| pagination | `limit=1..100` plus opaque `cursor`; stable newest-first ordering |

Canonical provenance:

- event `eventSource`: `HARDWARE`, `RECORDED_HARDWARE`, `SIMULATED`, `SEEDED`;
- ML `evidenceSource`: `LOCAL_LIVE`, `RECORDED_ML`, `SIMULATED`, `SEEDED`;
- UI truth badge: `REAL`, `RECORDED`, `SIMULATED`, or `PREVIEW/SEEDED`.

Tier 2 preview data never enters these APIs.

## 4. Device-to-edge LAN authentication

ESP32 calls only the FastAPI edge over the isolated LAN. Required headers:

```text
X-SGV-Device-Id: ESP32-001
X-SGV-Timestamp: 1787390400
X-SGV-Nonce: 0191b9dc-a9d5-73e1-809d-3e8fa0ff3654
X-SGV-Signature: <lowercase hex HMAC-SHA256>
Content-Type: application/json
```

Canonical signing bytes:

```text
<UPPERCASE_METHOD>\n
<EXACT_PATH_AND_CANONICAL_QUERY>\n
<deviceCode>\n
<unixTimestampSeconds>\n
<nonceUUID>\n
<lowercaseHexSha256OfExactRawBodyBytes>
```

Validation order:

1. source is on approved LAN/interface and endpoint rate/body limits pass;
2. content type and required headers exist;
3. active device/credential version resolves;
4. timestamp is within configured skew (default 300 seconds); if the clock is degraded, use the approved boot/sequence recovery policy rather than skipping replay protection;
5. signature is verified in constant time over exact raw bytes;
6. nonce and `(deviceCode, bootId, sequence)` replay checks run;
7. JSON parses and validates strictly with extra fields rejected unless inside approved `extensions`;
8. valid message is committed locally before response.

Device secrets stay in protected provisioning and must never be logged/committed or returned by config.

## 5. LAN endpoint catalog

| Method | Path | Auth | Purpose |
|---|---|---|---|
| `GET` | `/healthz` | local read policy | edge, queue, camera, model, WAN and sync health; no secrets |
| `GET` | `/v1/device/active-session` | device HMAC | current unexpired session/event/compartment for this device |
| `POST` | `/v1/disposal-events` | device HMAC | persist hardware sensor event and start local capture/inference |
| `POST` | `/v1/heartbeats` | device HMAC | component health heartbeat |
| `POST` | `/v1/telemetry` | device HMAC | operational fill/GPS telemetry |
| `GET` | `/v1/messages/{messageId}` | device HMAC | local transport/processing result for own message |

There is no public `/v1/ml/detection` route. Capture and inference are modules inside the edge runtime. If a separate local worker is later required, it must bind to loopback, authenticate, accept only event IDs already persisted, and remain an implementation detail—not a new public contract.

## 6. Active session contract

The municipal cloud route creates a short-lived QR-bound disposal session. The gateway claims it outbound over HTTPS (Section 13), then serves only the minimal projection to the provisioned ESP32:

```http
GET /v1/device/active-session
```

```json
{
  "data": {
    "sessionId": "0191b9e8-eef4-7e5c-b43d-9f3668c37a5d",
    "eventId": "0191b9e8-ee15-76af-89f9-ce1470a0812f",
    "selectedCompartment": "DRY",
    "expiresAt": "2026-08-22T14:30:00.000Z"
  },
  "meta": {
    "requestId": "0191b9e9-1f09-73c6-9d4e-4f10936d2095"
  }
}
```

No citizen ID/name/QR value is sent to firmware. If no active session exists, return `404 ACTIVE_SESSION_NOT_FOUND`; firmware remains ready and does not invent a session.

## 7. Common device message envelope

```json
{
  "schemaVersion": "1.1",
  "messageId": "0191b9eb-dbf9-79ac-9e1d-13e31c8294e3",
  "messageType": "DISPOSAL_EVENT_V1",
  "deviceCode": "ESP32-001",
  "bootId": "0191b9ea-6d14-7402-89a8-6ac3a4d24f8b",
  "sequence": 184,
  "occurredAt": "2026-08-22T14:28:11.123Z",
  "timeQuality": "DEVICE_SYNCED",
  "firmwareVersion": "smart-waste-esp32-1.0.0",
  "payload": {},
  "extensions": {}
}
```

Rules:

- `messageId` is stable across device retry; never generate a new ID per attempt.
- `(deviceCode, bootId, sequence)` is unique.
- `messageType` selects the exact strict payload schema.
- allowed `timeQuality`: `GPS`, `DEVICE_SYNCED`, `EDGE_ASSIGNED`, `UNKNOWN`.
- `extensions` defaults to `{}` and accepts only separately approved additive keys.

## 8. Disposal event LAN payload

```json
{
  "schemaVersion": "1.1",
  "messageId": "0191b9eb-dbf9-79ac-9e1d-13e31c8294e3",
  "messageType": "DISPOSAL_EVENT_V1",
  "deviceCode": "ESP32-001",
  "bootId": "0191b9ea-6d14-7402-89a8-6ac3a4d24f8b",
  "sequence": 184,
  "occurredAt": "2026-08-22T14:28:11.123Z",
  "timeQuality": "DEVICE_SYNCED",
  "firmwareVersion": "smart-waste-esp32-1.0.0",
  "payload": {
    "eventId": "0191b9e8-ee15-76af-89f9-ce1470a0812f",
    "sessionId": "0191b9e8-eef4-7e5c-b43d-9f3668c37a5d",
    "eventSource": "HARDWARE",
    "selectedCompartment": "DRY",
    "trigger": {
      "componentCode": "ir-dry-1",
      "triggered": true,
      "quality": "GOOD",
      "capturedAt": "2026-08-22T14:28:10.900Z"
    },
    "measurements": [
      {
        "componentCode": "ultrasonic-dry-1",
        "code": "FILL_DRY_PERCENT",
        "value": 41.2,
        "unit": "PERCENT",
        "quality": "GOOD",
        "capturedAt": "2026-08-22T14:28:11.000Z",
        "calibrationVersion": "fill-dry-2026-08-a"
      },
      {
        "componentCode": "moisture-dry-1",
        "code": "MOISTURE_DRY_PERCENT",
        "value": 22.8,
        "unit": "PERCENT",
        "quality": "GOOD",
        "capturedAt": "2026-08-22T14:28:11.050Z",
        "calibrationVersion": "moisture-2026-08-a"
      }
    ],
    "location": {
      "fixQuality": "NO_FIX"
    }
  },
  "extensions": {}
}
```

Constraints:

- event/session/device/selected compartment must match the active session cached by edge;
- trigger component must belong to the selected compartment and be `true` for a complete event;
- wet event must not fabricate dry-path moisture; omit it or report a configured `NOT_APPLICABLE` health state outside the measurement list;
- measurement catalog is limited to `FILL_WET_PERCENT`, `FILL_DRY_PERCENT`, and `MOISTURE_DRY_PERCENT` for disposal evidence;
- fill/moisture `0..100`; edge rejects invalid type/range and preserves typed failure evidence as policy allows;
- GPS `NO_FIX` omits coordinates; never send `0,0`;
- event source `RECORDED_HARDWARE` is accepted only in an explicitly enabled demo replay mode and remains visibly labelled;
- `SIMULATED` events do not use the hardware endpoint.

## 9. Durable local acknowledgement

New valid message:

```http
HTTP/1.1 202 Accepted
```

```json
{
  "data": {
    "messageId": "0191b9eb-dbf9-79ac-9e1d-13e31c8294e3",
    "eventId": "0191b9e8-ee15-76af-89f9-ce1470a0812f",
    "durability": "QUEUED_LOCALLY",
    "processingState": "SENSOR_CAPTURED",
    "duplicate": false,
    "edgeReceivedAt": "2026-08-22T14:28:11.181Z"
  },
  "meta": {
    "requestId": "0191b9eb-fb58-7d5d-9b98-ae3c814666cc"
  }
}
```

`202` is returned only after SQLite commits accepted event/replay custody. It does not mean camera/model/cloud/points complete. Exact replay returns stable `200`/`202` with `duplicate: true`. Same message ID or `(bootId, sequence)` with changed body returns `409 IDEMPOTENCY_CONFLICT`.

## 10. Heartbeat and telemetry

### Heartbeat

```json
{
  "schemaVersion": "1.1",
  "messageId": "0191b9f0-1dda-77b5-aa4b-fdb17caa1517",
  "messageType": "HEARTBEAT_V1",
  "deviceCode": "ESP32-001",
  "bootId": "0191b9ea-6d14-7402-89a8-6ac3a4d24f8b",
  "sequence": 185,
  "occurredAt": "2026-08-22T14:28:30.000Z",
  "timeQuality": "DEVICE_SYNCED",
  "firmwareVersion": "smart-waste-esp32-1.0.0",
  "payload": {
    "uptimeSeconds": 18240,
    "freeHeapBytes": 112384,
    "wifiRssiDbm": -54,
    "edgeReachable": true,
    "componentHealth": {
      "irWet": "OK",
      "irDry": "OK",
      "ultrasonicWet": "OK",
      "ultrasonicDry": "OK",
      "moistureDry": "OK",
      "gps": "DEGRADED"
    }
  },
  "extensions": {}
}
```

Health values: `OK`, `DEGRADED`, `MISSING`, `FAILED`, `UNKNOWN`. Camera/edge/model health is added by the edge/cloud technical-health projection, not fabricated by firmware.

### Telemetry

Telemetry uses the common envelope with `messageType: "TELEMETRY_V1"` and bounded `measurements` for `FILL_WET_PERCENT`, `FILL_DRY_PERCENT`, or a `location` object. Fill/GPS is operational; it does not affect segregation rules.

## 11. Edge local message status

`GET /v1/messages/{messageId}` returns:

```json
{
  "data": {
    "messageId": "0191b9eb-dbf9-79ac-9e1d-13e31c8294e3",
    "eventId": "0191b9e8-ee15-76af-89f9-ce1470a0812f",
    "processingState": "COMPLETED",
    "transportStatus": "ACKED",
    "attemptCount": 1,
    "ml": {
      "status": "DETECTED",
      "friendlyLabel": "Plastic Bottle",
      "predictedCategory": "DRY",
      "score": 0.96,
      "confidenceBand": "HIGH",
      "evidenceSource": "LOCAL_LIVE"
    },
    "cloudResult": {
      "decisionState": "ACCEPTED",
      "pointsDelta": 10,
      "reasonCodes": ["SUPPORTED_CATEGORY_MATCH", "DRY_MOISTURE_NORMAL"]
    }
  },
  "meta": {
    "requestId": "0191b9f6-4323-7224-82ec-54751ca22e36"
  }
}
```

Transport enum: `PENDING`, `IN_FLIGHT`, `ACKED`, `DEAD_LETTER`, `AUTH_BLOCKED`. Processing and transport are separate fields.

## 12. Edge-to-cloud authentication

Every edge request uses HTTPS and a per-gateway secret:

```text
X-SGV-Gateway-Id: EDGE-001
X-SGV-Timestamp: 1787390400
X-SGV-Nonce: 0191b9fc-7447-7257-8c25-e5bf61c7ba43
Idempotency-Key: 0191b9eb-dbf9-79ac-9e1d-13e31c8294e3
X-SGV-Signature: <lowercase hex HMAC-SHA256>
Content-Type: application/json
```

Canonical signing bytes:

```text
<UPPERCASE_METHOD>\n
<EXACT_PATH_AND_CANONICAL_QUERY>\n
<gatewayCode>\n
<unixTimestampSeconds>\n
<nonceUUID>\n
<idempotencyKeyOrEmpty>\n
<lowercaseHexSha256OfExactRawBodyBytes>
```

Cloud enforces HTTPS, body/content limits, active gateway/version, clock window, constant-time HMAC, nonce replay/rate limit, raw-body hash, strict schema, and atomic idempotency claim—in that order where applicable.

## 13. Gateway disposal-session claim

The cloud never opens an inbound connection to the LAN. After a municipal scan creates a short-lived session, edge polls/claims it outbound:

```http
POST /api/v1/device/disposal-session-claims
Idempotency-Key: 0191ba02-4e53-70ac-8069-d146e095b022
```

```json
{
  "schemaVersion": "1.1",
  "deviceCode": "ESP32-001"
}
```

New claim returns `201`; no pending session returns `204`; exact replay returns the same claim. Response contains only `sessionId`, `eventId`, `selectedCompartment`, and expiry. The transaction atomically moves the session from `PENDING` to `BOUND_TO_EDGE`; two gateways cannot claim it.

## 14. Cloud device sync

One durable message is synchronized per request:

```http
POST /api/v1/device/sync
```

```json
{
  "schemaVersion": "1.1",
  "gatewayCode": "EDGE-001",
  "edgeReceivedAt": "2026-08-22T14:28:11.181Z",
  "lanPayloadHash": "8fa17ec0f4c750a5b70856a3f149a63c0ad5a0a90e489054a1c30882ef926ff5",
  "edgeProcessing": {
    "processingState": "ML_RECEIVED",
    "capture": {
      "sourceKind": "PHONE_IP_CAMERA",
      "inputSha256": "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
      "capturedAt": "2026-08-22T14:28:11.450Z"
    },
    "mlDetection": {
      "detectionId": "0191ba08-72c7-7ee8-97e1-b6415711586c",
      "evidenceSource": "LOCAL_LIVE",
      "status": "DETECTED",
      "modelFamily": "yolov8n-compatible",
      "modelVersion": "demo-1.0.0",
      "weightsSha256": "abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789",
      "classMapVersion": "waste-map-1.0.0",
      "detectedLabel": "bottle",
      "friendlyLabel": "Plastic Bottle",
      "predictedCategory": "DRY",
      "score": 0.96,
      "confidenceBand": "HIGH",
      "inferenceMs": 612,
      "observedAt": "2026-08-22T14:28:12.100Z"
    }
  },
  "deviceMessage": {
    "schemaVersion": "1.1",
    "messageId": "0191b9eb-dbf9-79ac-9e1d-13e31c8294e3",
    "messageType": "DISPOSAL_EVENT_V1",
    "deviceCode": "ESP32-001",
    "bootId": "0191b9ea-6d14-7402-89a8-6ac3a4d24f8b",
    "sequence": 184,
    "occurredAt": "2026-08-22T14:28:11.123Z",
    "timeQuality": "DEVICE_SYNCED",
    "firmwareVersion": "smart-waste-esp32-1.0.0",
    "payload": {},
    "extensions": {}
  }
}
```

If capture/model fails, `mlDetection.status` is `UNAVAILABLE`, `TIMED_OUT`, or `FAILED`; label/category/score may be omitted, but model/manifest identity and safe error code remain. Cloud flags review and applies zero automatic negative value.

Edge freezes exact serialized body bytes before first attempt and reuses them after unknown outcomes.

Successful result:

```json
{
  "data": {
    "messageId": "0191b9eb-dbf9-79ac-9e1d-13e31c8294e3",
    "processingStatus": "PROCESSED",
    "duplicate": false,
    "result": {
      "eventId": "0191b9e8-ee15-76af-89f9-ce1470a0812f",
      "processingState": "COMPLETED",
      "decisionState": "ACCEPTED",
      "pointsDelta": 10,
      "verificationCaseId": null,
      "rulesetVersion": "rules-2.0.0",
      "reasonCodes": ["SUPPORTED_CATEGORY_MATCH", "DRY_MOISTURE_NORMAL"]
    }
  },
  "meta": {
    "requestId": "0191ba0e-38f2-79d6-9fd2-0af18398b041"
  }
}
```

Exact replay returns `200`, `duplicate: true`, and the stored stable result. Edge marks `ACKED` only after validating the envelope and matching message/event IDs.

## 15. User authentication and authorization

- Supabase Auth owns sign-in, OTP/OAuth callback, session refresh, logout, and recovery. There are no custom `/auth/*` application endpoints.
- Next.js verifies the session and trusted profile role on every protected request.
- RLS mirrors server authorization; neither replaces the other.
- Cookie mutations enforce same-origin/CSRF controls.
- Phone OTP/Google OAuth are enabled only after provider preflight. Fictional fallback accounts are still real Supabase sessions, not a bypass.
- Sensitive mutations audit actor, request ID, source, reason, and result.

Role shorthand below: `C` citizen, `M` municipal operator, `R` reviewer/admin, `D` developer, `S` system admin.

## 16. Cloud user endpoint catalog

### Citizen/self

| Method | Path | Role | Purpose |
|---|---|---|---|
| `GET` | `/api/v1/me` | C/M/R/D/S | safe current profile/role projection |
| `GET` | `/api/v1/me/dashboard` | C | balance, tier/badges, latest result, score summary |
| `POST` | `/api/v1/me/qr-tokens` | C | rotate/issue own opaque expiring QR; returns raw token once |
| `GET` | `/api/v1/me/qr-token` | C | safe active token metadata/QR display payload |
| `GET` | `/api/v1/me/disposal-events` | C | own cursor-paginated history |
| `GET` | `/api/v1/me/disposal-events/{eventId}` | C | own safe event/result/evidence summary |
| `GET` | `/api/v1/me/points` | C | derived balance and point transactions |
| `GET` | `/api/v1/me/badges` | C | own derived tier and earned demo badges |
| `GET` | `/api/v1/leaderboard` | C | opted-in fictional aliases/ranks only |
| `POST` | `/api/v1/me/disputes` | C | dispute one own eligible negative transaction |
| `GET` | `/api/v1/me/disputes` | C | own dispute status/history |

### Municipal

| Method | Path | Role | Purpose |
|---|---|---|---|
| `POST` | `/api/v1/municipal/disposal-sessions` | M/R | validate QR, bind citizen/device/compartment, create event/session |
| `GET` | `/api/v1/municipal/disposal-sessions/{sessionId}` | M/R | active session and safe event progress |
| `GET` | `/api/v1/municipal/disposal-events` | M/R | authorized event feed/history |
| `GET` | `/api/v1/municipal/disposal-events/{eventId}` | M/R | authorized safe event; reviewer receives relevant evidence |
| `GET` | `/api/v1/municipal/review-cases` | R | open/assigned/decided review queue |
| `POST` | `/api/v1/municipal/review-cases/{caseId}/decisions` | R | append `REVIEW_ACCEPTED`, `REVIEW_NO_ACTION`, or `VERIFIED_VIOLATION` |
| `GET` | `/api/v1/municipal/disputes` | R | authorized dispute queue |
| `POST` | `/api/v1/municipal/disputes/{disputeId}/decisions` | R | uphold/reverse with compensating transaction |

Create disposal session body:

```json
{
  "qrToken": "opaque-random-value-from-citizen-qr",
  "deviceCode": "ESP32-001",
  "selectedCompartment": "DRY"
}
```

The raw token is accepted only here over HTTPS, hashed immediately, never logged/stored/returned, and never sent to edge/firmware. New `201` response returns session/event IDs, safe citizen label/code, compartment and expiry.

### Developer/IoT

| Method | Path | Role | Purpose |
|---|---|---|---|
| `GET` | `/api/v1/developer/devices` | D/S | device list and safe latest health |
| `GET` | `/api/v1/developer/devices/{deviceId}/health` | D/S | ESP32/edge/camera/model/component/queue/cloud health |
| `GET` | `/api/v1/developer/devices/{deviceId}/telemetry` | D/S | bounded raw technical telemetry |
| `GET` | `/api/v1/developer/ml-detections` | D/S | model/source/score/latency/status metadata without frames/PII |
| `GET` | `/api/v1/developer/log-events` | D/S | structured redacted diagnostic summaries; not raw arbitrary logs |
| `POST` | `/api/v1/developer/simulations` | D/S | create one guarded demo event from an allowlisted fixture |

Simulation request:

```http
POST /api/v1/developer/simulations
Idempotency-Key: 0191ba22-d1a4-784d-a3ce-e1bbdf754714
```

```json
{
  "fixtureId": "dry-bottle-correct-v1"
}
```

Server derives fixed fictional citizen/device, evidence, model metadata and expected constraints from the fixture. It rejects arbitrary citizen ID, sensor values, label, points, source, or role. It requires `DEMO_SIMULATION_ENABLED=true`, rate limit, audit, permanent `eventSource=SIMULATED`, and `evidenceSource=SIMULATED` whenever ML evidence exists. It joins after physical ingress and does not count as hardware evidence.

### Intentionally absent Tier 2 endpoints

Do not implement `/trucks`, `/truck-locations`, `/routes`, `/municipal/metrics`, `/municipal/waste-composition`, `/billing`, `/discounts`, or geofence APIs for preview screens.

## 17. Review and point mutation contract

Review request:

```http
POST /api/v1/municipal/review-cases/0191ba28-31f6-73d6-b3ae-91477cfe3a58/decisions
Idempotency-Key: 0191ba29-08da-75d4-930e-c9b2cc050332
```

```json
{
  "decision": "VERIFIED_VIOLATION",
  "violationSeverity": "SEVERE",
  "reasonCode": "WET_IN_DRY_CONFIRMED",
  "notes": "Reviewer confirmed the prepared wet item was placed in the dry compartment."
}
```

The server derives value effect:

- `REVIEW_ACCEPTED` -> append `+10` only if no award exists;
- `REVIEW_NO_ACTION` -> append no ledger row and close the case at zero;
- `VERIFIED_VIOLATION/NORMAL` -> append `-10`;
- `VERIFIED_VIOLATION/SEVERE` -> append `-20`;
- `violationSeverity` MUST be omitted for `REVIEW_ACCEPTED` and `REVIEW_NO_ACTION`, and MUST be `NORMAL` or `SEVERE` for `VERIFIED_VIOLATION`;
- browser cannot submit `pointsDelta`;
- automated device sync can never call this transaction or create a negative entry.

Dispute body includes own `negativeTransactionId` and bounded plain-text reason. Server derives citizen ownership from session. A reversal is a compensating transaction, never an update/delete.

## 18. Idempotency contract

Every state-changing device route and these user actions require idempotency: QR issue/rotation, session creation, session claim, review decision, dispute create/decision, simulation, and compensating reversal.

1. Caller generates one UUID per intent and reuses it for every retry.
2. Server atomically inserts `(scope, actor, key, requestHash, IN_PROGRESS)` using a unique constraint.
3. Same key + same normalized request hash returns stored status/body.
4. Same key + changed hash returns `409 IDEMPOTENCY_CONFLICT`.
5. In-flight duplicate returns `409 REQUEST_IN_PROGRESS` with `Retry-After`.
6. Timeout is unknown outcome; retry the same intent/key/body.
7. Records outlive the longest edge/offline/manual retry path; prototype minimum 30 days.

The idempotency key comes from intent, never from a retry attempt or timestamp.

## 19. Retry and edge state behavior

### ESP32 -> edge

- connection failure, `429`, or retryable `5xx`: retry same exact message/ID with bounded exponential backoff and jitter;
- permanent `4xx`: stop/recover according to code; do not invent new values;
- `202`/exact replay: device stops retry because edge owns durable processing;
- device may query its own local message result.

### Edge -> cloud

| Outcome | Edge action |
|---|---|
| valid `200/201` with matching IDs | mark `ACKED`, cache result |
| timeout/reset | return to `PENDING`, retry exact body/key |
| `429`, `500`, `502`, `503`, `504` | respect hint/backoff and retry |
| `401`, `403` | `AUTH_BLOCKED`, stop storm, critical health alert |
| `409 IDEMPOTENCY_CONFLICT` | `DEAD_LETTER`, preserve safe diagnostics |
| `400`, `413`, `415`, `422` | `DEAD_LETTER` |

Never mark ACK based only on HTTP status; validate envelope and correlation IDs.

## 20. Realtime contract

Realtime delivers authorized invalidation hints; consumers refetch REST resources.

Suggested safe topics:

```text
citizen:{citizenId}:disposal-event.changed
citizen:{citizenId}:points.changed
municipal:active-disposal.changed
municipal:review-case.created
developer:{deviceId}:health.changed
```

- authorization is checked before subscription and by RLS/private channel policy;
- citizen never subscribes fleet-wide;
- raw telemetry is developer-only and preferably fetched, not broadcast;
- payload is stable ID + safe change kind, not full evidence/PII;
- clients perform initial read and refetch/poll after reconnect.

## 21. Validation and abuse controls

- Strict Pydantic/Zod schemas; unknown top-level keys rejected.
- Device body maximum and measurement count are bounded (maximum 16 event measurements; exact limits in JSON Schema).
- QR/session expiration, one-time binding, rate limit and audit.
- Camera URL/model path cannot arrive from a public request.
- No endpoint accepts authoritative role, citizen ownership, point amount, tier, evidence source, review actor, or device ownership.
- Model/class/thresholds come from the pinned manifest/ruleset, not browser/firmware.
- Plain text only for notes; safe rendering and bounded length.
- CORS is explicit; never use wildcard with credentials.
- External provider/model/camera responses are validated as untrusted input.
- Structured log APIs return allowlisted fields; no arbitrary file/path/tail parameter.
- Simulation is environment-gated, fixture-allowlisted, rate-limited, idempotent and audited.

## 22. Required contract tests

For every applicable route/message:

- valid golden fixture across firmware assumptions, Pydantic, Zod/OpenAPI, and SQL mapping;
- malformed JSON, missing/extra field, invalid enum, boundary numeric, timestamp, oversized body;
- HMAC canonical-string vectors and constant-time negative cases;
- timestamp/nonce/boot-sequence replay;
- same ID/body exact replay and changed-body `409` under concurrency;
- edge kill after local ACK and cloud timeout after commit;
- session double-claim, expiry, wrong device/compartment, consumed replay;
- ML detected/no/multiple/low/timeout/unavailable/hash mismatch/class-map mismatch;
- automatic accepted `+10`, flagged `0`, and proof that sync cannot create `-10/-20`;
- authorized `REVIEW_ACCEPTED`, `REVIEW_NO_ACTION`, reviewed `-10/-20`, duplicate prevention, and dispute compensation;
- every role allowed/denied matrix and citizen cross-account RLS;
- simulation environment/role/fixture/source/rate/idempotency isolation;
- Realtime authorization and polling fallback;
- route inventory assertion that Tier 2 endpoints do not exist.

The contract suite—not a handwritten UI assumption—decides whether modules are compatible.
