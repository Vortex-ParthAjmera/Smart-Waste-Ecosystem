> **PLAN & STRUCTURE LOCK — v1.0:** This approved scope, stack, repository structure, contracts, ownership map, and delivery plan must not be changed by contributors or AI agents. Work only inside the assigned paths. If a change is necessary, stop and submit a `CHANGE_REQUEST`; only PARTH AJMERA may approve it, followed by an ADR and team notification.

# API and IoT Contract v1

Contract version: 1.0  
LAN origin: `http://sgv-edge.local:8080` (versioned API paths begin with `/v1`)  
Cloud base path: `/api/v1`  
Encoding: UTF-8 JSON, `Content-Type: application/json`  
Naming: camelCase JSON, plural noun resources, upper-snake enum values

## 1. Contract authority and compatibility

This file defines the boundary between ESP32 firmware, the FastAPI edge gateway, Next.js cloud APIs, and web consumers. Implementations must additionally publish machine-readable contracts under the canonical `packages/contracts/` boundary:

```text
packages/contracts/
  schemas/lan-v1/
  schemas/cloud-device-v1/
  openapi/edge-v1.yaml
  openapi/cloud-v1.yaml
  fixtures/valid/
  fixtures/invalid/
```

Rules:

1. The contract is defined before route implementation.
2. Version 1 fields cannot be removed, renamed, or change type.
3. New response fields must be additive. New request fields are optional until a new major contract.
4. Unknown top-level fields are rejected to expose typos; vendor/experimental data belongs under `extensions`.
5. Firmware, Pydantic, Zod, and test fixtures must agree on the same enum values, limits, and nullability.
6. Device and user APIs never expose database table shapes directly.
7. All mutations are safe to retry only when the caller reuses the same idempotency key and identical body.

## 2. Standard envelopes

### Success

```json
{
  "data": {},
  "meta": {
    "requestId": "68e4b5ef-d956-4d6c-8f16-4177cbb61c9d"
  }
}
```

List responses include cursor pagination:

```json
{
  "data": [],
  "meta": {
    "requestId": "68e4b5ef-d956-4d6c-8f16-4177cbb61c9d",
    "pageSize": 25,
    "nextCursor": null,
    "hasMore": false
  }
}
```

### Error

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The request payload is invalid.",
    "requestId": "68e4b5ef-d956-4d6c-8f16-4177cbb61c9d",
    "details": [
      {
        "path": "payload.measurements[1].value",
        "reason": "Must be between 0 and 100."
      }
    ]
  }
}
```

`message` is safe for users/operators. Stack traces, SQL text, secrets, raw RFID values, and internal provider errors are never returned.

### Status mapping

| HTTP | Code | Meaning | Retry? |
|---:|---|---|---|
| 400 | `BAD_REQUEST` | malformed JSON/header/envelope | no, fix caller |
| 401 | `AUTHENTICATION_REQUIRED` / `INVALID_SIGNATURE` | absent or invalid identity | stop and fix credential |
| 403 | `FORBIDDEN` / `DEVICE_REVOKED` | authenticated but disallowed | stop and escalate |
| 404 | `NOT_FOUND` | resource does not exist or is hidden by authorization | no |
| 409 | `IDEMPOTENCY_CONFLICT` / `STATE_CONFLICT` | same intent key with changed payload or invalid transition | no, reconcile |
| 413 | `PAYLOAD_TOO_LARGE` | body exceeds route limit | no, reduce payload |
| 422 | `VALIDATION_ERROR` / `UNKNOWN_IDENTIFIER` | semantically invalid | no, operator action |
| 429 | `RATE_LIMITED` | caller exceeded limit | yes, honor `Retry-After` |
| 500 | `INTERNAL_ERROR` | unexpected server fault | yes with backoff |
| 503 | `DEPENDENCY_UNAVAILABLE` | database/provider temporarily unavailable | yes with backoff |

Every response carries `X-Request-Id`; a valid caller-supplied UUID may be preserved, otherwise the receiver generates one.

## 3. Shared scalar rules

| Field | Rule |
|---|---|
| IDs | lowercase/uppercase-insensitive UUID string; return canonical lowercase form |
| codes | 1-64 ASCII letters, digits, `_` or `-`; comparison policy documented per resource |
| timestamps | RFC 3339 UTC, e.g. `2026-08-22T03:12:34.123Z` |
| device sequence | integer `0..4294967295`, monotonic within one `bootId` |
| numeric data | finite JSON number only; `NaN` and infinity rejected |
| latitude | `-90..90` |
| longitude | `-180..180` |
| percentage | `0..100` |
| weight | kilograms, `0..500`, maximum 3 decimal places |
| money | integer paise; response may add a formatted INR display string |
| strings | trimmed unless explicitly opaque; control characters rejected |
| body limits | collection 32 KiB; telemetry 16 KiB; GPS/heartbeat 8 KiB; user JSON mutation 64 KiB |

Device time is not assumed trustworthy. Each message includes `occurredAt` when available and `timeQuality`:

- `GPS`: synchronized from GPS time;
- `RTC`: local real-time clock;
- `GATEWAY`: edge assigned time because device time was unavailable;
- `UNKNOWN`: no trustworthy event time; retain gateway/cloud receipt times.

## 4. ESP32 to edge LAN authentication

Each ESP32 is provisioned with `deviceCode` and a unique 256-bit secret in protected NVS. The secret never travels on the network.

Required headers:

```text
X-SGV-Device-Id: ESP32-SGV-002
X-SGV-Boot-Id: 35b78309-99c4-4c9c-ad27-60bc4d12a319
X-SGV-Sequence: 184
X-SGV-Signature: <lowercase hex HMAC-SHA256>
X-Request-Id: <UUID, optional but recommended>
Content-Type: application/json
```

Canonical signature input, including final body hash but no trailing newline:

```text
<UPPERCASE_METHOD>\n
<EXACT_PATH_WITHOUT_HOST_OR_QUERY>\n
<deviceCode>\n
<bootId>\n
<decimalSequence>\n
<lowercaseHexSha256OfExactRawBodyBytes>
```

The gateway calculates `HMAC-SHA256(deviceSecret, canonicalInput)` and compares signatures in constant time. It then verifies header values equal body values and atomically claims `(deviceCode, bootId, sequence)`.

Security note: HMAC prevents forgery and replay but does not encrypt the LAN payload. The prototype therefore runs on an isolated WPA2/WPA3 network with no port forwarding. Production must use TLS or an encrypted device transport.

## 5. Common LAN message envelope

```json
{
  "schemaVersion": "1.0",
  "messageId": "0191a15e-0834-7a3b-9364-8bb75c76a6a2",
  "messageType": "COLLECTION_EVENT_V1",
  "deviceCode": "ESP32-SGV-002",
  "bootId": "35b78309-99c4-4c9c-ad27-60bc4d12a319",
  "sequence": 184,
  "occurredAt": "2026-08-22T03:12:34.123Z",
  "timeQuality": "GPS",
  "firmwareVersion": "sgv-esp32-1.0.0",
  "payload": {},
  "extensions": {}
}
```

Invariants:

- `messageId` is generated once for one intent and remains unchanged across retries.
- `bootId` is a new UUID on every device boot.
- `sequence` increases for every message during that boot and is persisted often enough to avoid accidental reuse.
- A retry sends byte-for-byte identical JSON whenever possible.
- The edge must not overwrite a caller ID, timestamp, measurement, or quality flag.

## 6. LAN endpoints

| Method | Path | Message type | Durable response |
|---|---|---|---|
| `POST` | `/v1/ingest/collection-events` | `COLLECTION_EVENT_V1` | `202 QUEUED_LOCALLY` |
| `POST` | `/v1/ingest/gps` | `GPS_V1` | `202 QUEUED_LOCALLY` |
| `POST` | `/v1/ingest/heartbeats` | `HEARTBEAT_V1` | `202 QUEUED_LOCALLY` |
| `POST` | `/v1/ingest/telemetry` | `TELEMETRY_V1` | `202 QUEUED_LOCALLY` |
| `GET` | `/v1/messages/{messageId}` | signed device status lookup | result or queue state |
| `GET` | `/v1/device/config` | signed configuration read | approved device config |
| `GET` | `/healthz` | gateway-local health; no secrets | liveness/readiness summary |

The signed GET body hash is SHA-256 of zero bytes. Query parameters, when present, must be sorted by key and percent-encoded in the canonical path-and-query contract; v1 routes above intentionally avoid query parameters for device calls.

### Durable local ACK

First acceptance:

```http
HTTP/1.1 202 Accepted
```

```json
{
  "data": {
    "messageId": "0191a15e-0834-7a3b-9364-8bb75c76a6a2",
    "edgeStatus": "QUEUED_LOCALLY",
    "duplicate": false,
    "receivedAt": "2026-08-22T03:12:34.310Z"
  },
  "meta": {
    "requestId": "68e4b5ef-d956-4d6c-8f16-4177cbb61c9d"
  }
}
```

Exact duplicate after the original local transaction:

```http
HTTP/1.1 200 OK
```

```json
{
  "data": {
    "messageId": "0191a15e-0834-7a3b-9364-8bb75c76a6a2",
    "edgeStatus": "QUEUED_LOCALLY",
    "duplicate": true,
    "receivedAt": "2026-08-22T03:12:34.310Z"
  },
  "meta": {
    "requestId": "68e4b5ef-d956-4d6c-8f16-4177cbb61c9d"
  }
}
```

`202` never means cloud-processed. ESP32 may display “saved locally”; cloud decision appears only after sync result.

## 7. Collection event v1

```json
{
  "schemaVersion": "1.0",
  "messageId": "0191a15e-0834-7a3b-9364-8bb75c76a6a2",
  "messageType": "COLLECTION_EVENT_V1",
  "deviceCode": "ESP32-SGV-002",
  "bootId": "35b78309-99c4-4c9c-ad27-60bc4d12a319",
  "sequence": 184,
  "occurredAt": "2026-08-22T03:12:34.123Z",
  "timeQuality": "GPS",
  "firmwareVersion": "sgv-esp32-1.0.0",
  "payload": {
    "eventId": "0191a15d-8cfa-7ec1-bc58-59465353b0fe",
    "vehicleCode": "SGV-002",
    "runId": "fa59b53b-8bb3-44c1-8d80-b65010d096c3",
    "operatorSessionId": "5021336e-5e6f-47bf-9523-9c7b522f7c87",
    "identifier": {
      "type": "RFID",
      "value": "04A1B2C3D4"
    },
    "declaredCategory": "WET",
    "measurements": [
      {
        "code": "MOTION_DETECTED",
        "value": true,
        "unit": "BOOLEAN",
        "quality": "GOOD",
        "capturedAt": "2026-08-22T03:12:31.900Z"
      },
      {
        "code": "MOISTURE_PERCENT",
        "value": 81.4,
        "unit": "PERCENT",
        "quality": "GOOD",
        "capturedAt": "2026-08-22T03:12:32.300Z",
        "calibrationVersion": "moisture-2026-08-a"
      },
      {
        "code": "WEIGHT_KG",
        "value": 2.4,
        "unit": "KG",
        "quality": "GOOD",
        "capturedAt": "2026-08-22T03:12:33.100Z",
        "calibrationVersion": "hx711-2026-08-a"
      },
      {
        "code": "FIRE_DETECTED",
        "value": false,
        "unit": "BOOLEAN",
        "quality": "GOOD",
        "capturedAt": "2026-08-22T03:12:33.200Z"
      }
    ],
    "location": {
      "latitude": 22.719568,
      "longitude": 75.857727,
      "accuracyM": 8.2,
      "speedKph": 0,
      "headingDeg": 142.3
    }
  },
  "extensions": {}
}
```

### Collection constraints

- `eventId`, `identifier`, `vehicleCode`, `declaredCategory`, and at least one measurement are required.
- Approved v1 categories are `WET`, `DRY`, `REJECT`; categories are configured in cloud but firmware must use the approved projection received from config.
- `identifier.value` is opaque input used only for server-side HMAC lookup. It is redacted from all logs and never returned.
- `operatorSessionId` and `runId` may be `null` only under an explicitly enabled degraded-mode configuration.
- Measurement value type must match its code/unit contract.
- `MISSING` quality uses no fabricated numeric value; represent it with an explicit health/quality record as defined by the JSON Schema.
- Safety measurements create/clear alerts independently of compliance evaluation.
- Unknown identifiers return a permanent per-message outcome; the cloud still preserves a privacy-safe ingestion/audit record as policy permits.

### Measurement catalog v1

| Code | Value | Unit | Range/meaning |
|---|---|---|---|
| `MOTION_DETECTED` | boolean | `BOOLEAN` | intake detection |
| `MOISTURE_PERCENT` | number | `PERCENT` | `0..100` calibrated estimate |
| `WEIGHT_KG` | number | `KG` | `0..500` |
| `TEMPERATURE_C` | number | `CELSIUS` | `-40..125` sensor range |
| `GAS_RAW` | number | `ADC_COUNT` | calibrated gas ppm must use a future approved code |
| `FIRE_DETECTED` | boolean | `BOOLEAN` | safety signal |
| `FILL_WET_PERCENT` | number | `PERCENT` | `0..100` |
| `FILL_DRY_PERCENT` | number | `PERCENT` | `0..100` |
| `FILL_REJECT_PERCENT` | number | `PERCENT` | `0..100` |

## 8. GPS, heartbeat, and telemetry payloads

### GPS v1 payload

```json
{
  "vehicleCode": "SGV-002",
  "latitude": 22.719568,
  "longitude": 75.857727,
  "accuracyM": 8.2,
  "speedKph": 18.4,
  "headingDeg": 142.3,
  "fixType": "GPS_3D"
}
```

Allowed `fixType`: `GPS_2D`, `GPS_3D`, `NO_FIX`. A `NO_FIX` message omits coordinates and updates health/staleness only; it must not send `0,0`.

### Heartbeat v1 payload

```json
{
  "vehicleCode": "SGV-002",
  "uptimeSeconds": 18240,
  "freeHeapBytes": 112384,
  "wifiRssiDbm": -54,
  "edgeReachable": true,
  "sensorHealth": {
    "rfid": "OK",
    "motion": "OK",
    "moisture": "OK",
    "loadCell": "DEGRADED",
    "gps": "OK"
  }
}
```

Health values: `OK`, `DEGRADED`, `MISSING`, `FAILED`, `UNKNOWN`.

### Telemetry v1 payload

```json
{
  "vehicleCode": "SGV-002",
  "measurements": [
    {
      "code": "FILL_WET_PERCENT",
      "value": 92.1,
      "unit": "PERCENT",
      "quality": "GOOD",
      "capturedAt": "2026-08-22T03:13:00.000Z"
    },
    {
      "code": "TEMPERATURE_C",
      "value": 31.6,
      "unit": "CELSIUS",
      "quality": "GOOD",
      "capturedAt": "2026-08-22T03:13:00.000Z"
    }
  ]
}
```

Telemetry is operational state, not a collection decision. A near-full threshold creates an alert and affects routing/operations only.

## 9. Edge message status

`GET /v1/messages/{messageId}` returns one of:

```json
{
  "data": {
    "messageId": "0191a15e-0834-7a3b-9364-8bb75c76a6a2",
    "transportStatus": "ACKED",
    "attemptCount": 1,
    "cloudResult": {
      "eventId": "0191a15d-8cfa-7ec1-bc58-59465353b0fe",
      "eventState": "ACCEPTED",
      "pointsAwarded": 50,
      "explanationCodes": ["WET_MOISTURE_MATCH", "SAFETY_CLEAR"]
    }
  },
  "meta": {
    "requestId": "68e4b5ef-d956-4d6c-8f16-4177cbb61c9d"
  }
}
```

Transport status enum: `PENDING`, `IN_FLIGHT`, `ACKED`, `DEAD_LETTER`, `AUTH_BLOCKED`.

## 10. Edge to Next.js cloud authentication

Every edge-to-cloud request uses HTTPS and a per-gateway secret. Required headers:

```text
X-SGV-Gateway-Id: EDGE-SGV-002
X-SGV-Timestamp: 1787377954
X-SGV-Nonce: 0529593c-e55e-4bd1-aa54-af19dd7207e0
Idempotency-Key: 0191a15e-0834-7a3b-9364-8bb75c76a6a2
X-SGV-Signature: <lowercase hex HMAC-SHA256>
Content-Type: application/json
```

Canonical signature input:

```text
<UPPERCASE_METHOD>\n
<EXACT_PATH_AND_CANONICAL_QUERY>\n
<gatewayCode>\n
<unixTimestampSeconds>\n
<nonceUUID>\n
<idempotencyKeyOrEmpty>\n
<lowercaseHexSha256OfExactRawBodyBytes>
```

Cloud validation order:

1. enforce HTTPS at the hosting layer;
2. enforce content type and body size before parsing;
3. resolve active gateway and credential version;
4. require timestamp within 300 seconds of server time;
5. verify HMAC in constant time;
6. apply nonce replay control/rate limit;
7. capture raw-body SHA-256;
8. parse JSON and validate strict schema;
9. atomically claim `messageId`/idempotency key before business effects.

The secret stays in protected edge configuration and Vercel server secret storage. It is never a `NEXT_PUBLIC_*` variable and never reaches Supabase clients.

## 11. Cloud device sync v1

V1 deliberately synchronizes one durable message per request. This makes the idempotency key identical to the original message ID and removes partial-batch ambiguity. Concurrency may be increased with a small bounded worker pool; batching requires a future approved contract.

`POST /api/v1/device/sync`

```json
{
  "schemaVersion": "1.0",
  "gatewayCode": "EDGE-SGV-002",
  "edgeReceivedAt": "2026-08-22T03:12:34.310Z",
  "lanPayloadHash": "8fa17ec0f4c750a5b70856a3f149a63c0ad5a0a90e489054a1c30882ef926ff5",
  "message": {
    "schemaVersion": "1.0",
    "messageId": "0191a15e-0834-7a3b-9364-8bb75c76a6a2",
    "messageType": "COLLECTION_EVENT_V1",
    "deviceCode": "ESP32-SGV-002",
    "bootId": "35b78309-99c4-4c9c-ad27-60bc4d12a319",
    "sequence": 184,
    "occurredAt": "2026-08-22T03:12:34.123Z",
    "timeQuality": "GPS",
    "firmwareVersion": "sgv-esp32-1.0.0",
    "payload": {},
    "extensions": {}
  }
}
```

The edge persists the exact serialized cloud body before sending and reuses those exact bytes for an unknown-outcome retry. Next.js reads the raw request text, computes its hash, then parses/validates it.

Cloud processing success:

```json
{
  "data": {
    "messageId": "0191a15e-0834-7a3b-9364-8bb75c76a6a2",
    "processingStatus": "PROCESSED",
    "duplicate": false,
    "result": {
      "eventId": "0191a15d-8cfa-7ec1-bc58-59465353b0fe",
      "eventState": "ACCEPTED",
      "pointsAwarded": 50,
      "verificationCaseId": null,
      "explanationCodes": ["WET_MOISTURE_MATCH", "SAFETY_CLEAR"]
    }
  },
  "meta": {
    "requestId": "68e4b5ef-d956-4d6c-8f16-4177cbb61c9d"
  }
}
```

An exact retry returns HTTP `200`, `duplicate: true`, and the stored stable result. The edge may mark `ACKED` only after parsing a valid response whose `messageId` matches the outbox row.

### Device config

`GET /api/v1/device/config/{deviceCode}` is gateway-signed and returns a non-secret projection:

```json
{
  "data": {
    "schemaVersion": "1.0",
    "deviceCode": "ESP32-SGV-002",
    "configVersion": "demo-2026-08-22-1",
    "categories": ["WET", "DRY", "REJECT"],
    "gpsIntervalSeconds": 10,
    "heartbeatIntervalSeconds": 30,
    "fillAlertThresholdPercent": 90,
    "minimumFirmwareVersion": "sgv-esp32-1.0.0"
  },
  "meta": {
    "requestId": "68e4b5ef-d956-4d6c-8f16-4177cbb61c9d"
  }
}
```

The edge validates, caches, and serves the last known approved config to ESP32. Config must never include cloud/gateway secrets or financial authority to issue a penalty.

## 12. User/API authentication and authorization

- Users authenticate through Supabase Auth.
- Next.js validates the session on every protected route and reads trusted role/profile data server-side.
- Cookie-authenticated mutations require same-origin validation/CSRF protection.
- Admin MFA is recommended for any non-demo deployment.
- RLS mirrors API authorization; neither layer is a substitute for the other.
- All sensitive mutations record actor, request ID, reason, before/after summary, and timestamp.

Role shorthand used below:

- `C`: citizen, own linked household only;
- `O`: operator, active assigned vehicle/run only;
- `V`: verification officer;
- `A`: municipal admin;
- `S`: system admin.

## 13. Cloud user endpoint catalog

All list endpoints use `?limit=1..100&cursor=<opaque>` and stable newest-first ordering unless the resource contract says otherwise.

### Citizen/own-account

| Method | Path | Role | Purpose |
|---|---|---|---|
| `GET` | `/api/v1/me` | C/O/V/A/S | current profile and safe role projection |
| `GET` | `/api/v1/me/dashboard` | C | points, latest collection, pending penalty/bill, nearby status |
| `GET` | `/api/v1/me/collections` | C | own household collection history |
| `GET` | `/api/v1/me/collections/{eventId}` | C | own event and privacy-safe evidence/explanation |
| `GET` | `/api/v1/me/rewards` | C | balance and ledger page |
| `POST` | `/api/v1/me/redemptions` | C | create idempotent points redemption request |
| `GET` | `/api/v1/me/penalties` | C | own penalties and status |
| `POST` | `/api/v1/me/disputes` | C | dispute one own eligible penalty |
| `GET` | `/api/v1/me/bills` | C | own simulated bills and line items |
| `GET` | `/api/v1/me/vehicle` | C | assigned/nearby privacy-safe latest vehicle location |
| `GET` | `/api/v1/me/notifications` | C | own notifications |
| `PATCH` | `/api/v1/me/notifications/{id}` | C | mark own notification read |

### Operator

| Method | Path | Role | Purpose |
|---|---|---|---|
| `POST` | `/api/v1/operator/identifiers/resolve` | O | minimal household confirmation for active scan |
| `GET` | `/api/v1/operator/run` | O | active run, vehicle, device, and sync status |
| `GET` | `/api/v1/operator/collections` | O | assigned run events |
| `GET` | `/api/v1/operator/vehicles/{vehicleId}/health` | O | assigned sensor/gateway/alert summary |
| `POST` | `/api/v1/operator/alerts/{alertId}/acknowledgements` | O | acknowledge operational alert |

The operator lookup response contains only household code, active/inactive status, first-name/display-safe label if approved, and current eligibility. It never returns full address, phone, bill, dispute, or unrelated history.

### Verification/admin

| Method | Path | Role | Purpose |
|---|---|---|---|
| `GET` | `/api/v1/admin/dashboard` | A/S | operational KPI summary |
| `GET` | `/api/v1/admin/vehicles` | A/S | fleet list and latest status |
| `GET` | `/api/v1/admin/vehicles/{id}` | A/S | vehicle detail, locations, device health, alerts |
| `GET` | `/api/v1/admin/collections` | V/A/S | filtered authorized events |
| `GET` | `/api/v1/admin/verification-cases` | V/A/S | open/assigned/decided queue |
| `POST` | `/api/v1/admin/verification-cases/{id}/assignments` | V/A/S | claim/assign case |
| `POST` | `/api/v1/admin/verification-cases/{id}/decisions` | V/A/S | append final accepted/violation decision |
| `GET` | `/api/v1/admin/rulesets` | A/S | list rule versions |
| `POST` | `/api/v1/admin/rulesets` | A/S | create draft ruleset |
| `POST` | `/api/v1/admin/rulesets/{id}/publish` | A/S | publish immutable version |
| `GET` | `/api/v1/admin/rewards` | A/S | ledger/audit reporting |
| `GET` | `/api/v1/admin/penalties` | V/A/S | verified penalties |
| `POST` | `/api/v1/admin/penalties/{id}/waivers` | A/S | append authorized waiver/reversal |
| `GET` | `/api/v1/admin/disputes` | V/A/S | dispute queue |
| `POST` | `/api/v1/admin/disputes/{id}/decisions` | V/A/S | resolve dispute with reason |
| `GET` | `/api/v1/admin/bills` | A/S | simulated bill administration |
| `POST` | `/api/v1/admin/bills/generate` | A/S | idempotent period bill generation |
| `GET` | `/api/v1/admin/analytics/summary` | A/S | ward/category/compliance/fleet metrics |
| `GET` | `/api/v1/admin/audit-logs` | A/S | authorized audit search |
| `POST` | `/api/v1/admin/collections/{id}/ml-observations` | A/S | optional validated supporting-evidence import; no decision/value side effect |

### Optional ML observation import (P1)

The caller is an authenticated admin importing the JSON artifact; the Colab notebook receives no application credential. Body shape is frozen in `21_ML_INTEGRATION.md`. The endpoint requires `Idempotency-Key: <observationId>`, accepts at most 32 KiB JSON, rejects raw/base64 images and URLs, and returns `201` for a new row or stable `200` for an exact retry. Same ID with a changed body returns `409 IDEMPOTENCY_CONFLICT`.

The transaction inserts `ml_observations` plus an audit record only. It is forbidden for this endpoint to update `collection_events.event_state`, open/decide a verification case, or write `reward_ledger`, `penalties`, `bills`, or `disputes`.

## 14. User mutation examples

### Review decision

```http
POST /api/v1/admin/verification-cases/5a5f5f41-b7cc-4cbe-931c-409f6028dc0d/decisions
Idempotency-Key: 81100790-01e5-4565-a6ab-27afea23463d
```

```json
{
  "decision": "VERIFIED_VIOLATION",
  "reasonCode": "CATEGORY_EVIDENCE_CONFLICT_CONFIRMED",
  "notes": "Officer confirmed the wet compartment submission was inconsistent with available evidence."
}
```

Response:

```json
{
  "data": {
    "caseId": "5a5f5f41-b7cc-4cbe-931c-409f6028dc0d",
    "eventState": "PENALIZED",
    "decisionId": "41df9962-22f9-424d-8145-3b16aab74fe3",
    "penalty": {
      "id": "0240062f-504f-4bc0-a2c9-a93f44f15710",
      "amountPaise": 10000,
      "formattedAmount": "₹100.00",
      "status": "PENDING_BILL"
    }
  },
  "meta": {
    "requestId": "68e4b5ef-d956-4d6c-8f16-4177cbb61c9d"
  }
}
```

### Citizen dispute

```http
POST /api/v1/me/disputes
Idempotency-Key: f9f5eef9-c753-4604-8621-a02cab4cc0c4
```

```json
{
  "penaltyId": "0240062f-504f-4bc0-a2c9-a93f44f15710",
  "reason": "The material was wet recyclable packaging and the sensor evidence is ambiguous."
}
```

The API derives household/user identity from the session. It rejects a client-supplied household ID.

## 15. Idempotency contract

All state-changing device routes and these user actions require `Idempotency-Key`: redemption, dispute, review decision, waiver, ruleset publish, bill generation, and any future payment-like operation.

1. Caller generates one UUID per intent and reuses it for every retry.
2. Server atomically inserts `(scope, actor, key, requestHash, status)` before side effects.
3. Same key + same normalized request hash returns the stored status/body.
4. Same key + different request hash returns `409 IDEMPOTENCY_CONFLICT`.
5. An in-progress duplicate returns `409 REQUEST_IN_PROGRESS` with `Retry-After`, unless the route explicitly supports bounded waiting.
6. Idempotency records outlive the longest retry/offline replay window. Prototype minimum: 30 days for device events and sensitive user mutations.
7. A timeout is an unknown outcome. Caller retries the same intent; it never invents a new key.

## 16. Offline and retry behavior

### ESP32 to edge

- Retry connection/5xx/429 with the same body/message ID.
- Do not retry permanent 4xx without correcting the problem.
- Use exponential backoff with jitter and a cap defined in `08_EDGE_GATEWAY.md`.
- `202` means stop device retry; edge owns delivery.

### Edge to cloud

| Outcome | Edge action |
|---|---|
| valid `200` with matching message ID | mark `ACKED`, cache result |
| timeout/connection reset | return to `PENDING`; same exact body and ID |
| `429`, `500`, `502`, `503`, `504` | retry after server hint/backoff |
| `401`, `403` | enter `AUTH_BLOCKED`, stop storm, raise critical local alert |
| `409 IDEMPOTENCY_CONFLICT` | `DEAD_LETTER`, operator investigation |
| `400`, `413`, `422` | `DEAD_LETTER`, preserve error code and safe detail |

The edge never marks a row ACKed based solely on HTTP status. It validates response content and correlation IDs.

## 17. Realtime contract

Realtime notifications are invalidation hints. They use stable IDs and safe summaries; consumers refetch the authorized REST resource.

Suggested topics/events:

```text
household:{householdId}:collection.changed
household:{householdId}:reward.changed
vehicle:{vehicleId}:location.changed
vehicle:{vehicleId}:alert.changed
admin:verification.case-created
```

Authorization is enforced before subscription and by RLS. Citizens never subscribe to a fleet-wide channel.

## 18. Validation and abuse controls

- Pydantic and Zod schemas use strict mode and bounded arrays/strings.
- A collection contains at most 32 measurements in v1.
- No endpoint accepts client-supplied role, balance, reward amount, penalty amount, audit actor, or household ownership.
- Ruleset and server configuration determine rewards/penalties.
- Device and gateway rate limits are per identity, not merely IP.
- Public login/recovery endpoints use managed provider protections.
- Rich text/HTML is not accepted for notes; render plain text safely.
- CSV/report export neutralizes spreadsheet formula prefixes.
- External provider responses are validated before storage or display.
- CORS is explicit; LAN edge permits only the approved local UI origin, not `*` with credentials.

## 19. Contract tests required before merge

For every message/endpoint:

- one valid fixture accepted by ESP32 assumptions, Pydantic, Zod, and OpenAPI;
- invalid enum, missing field, extra field, oversized body, boundary numeric, and malformed timestamp fixtures;
- valid/invalid HMAC vectors with exact canonical strings;
- duplicate same-body and conflict changed-body concurrency tests;
- cloud timeout-after-commit replay test;
- authorization matrix test for every role;
- citizen cross-household isolation test;
- response envelope and request ID test;
- offline queue-to-cloud end-to-end test with real SQLite;
- hardware-in-loop test for at least two sensors plus identifier input.

The contract test suite, not a handwritten frontend assumption, decides whether two modules are compatible.
