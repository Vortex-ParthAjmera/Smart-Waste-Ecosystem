> **PLAN & STRUCTURE LOCK — v2.0:** This approved scope, stack, repository structure, contracts, ownership map, truth-tier model, and delivery plan must not be changed by contributors or AI agents. Work only inside assigned paths. If a change is necessary, stop and submit a `CHANGE_REQUEST`; only PARTH AJMERA may approve it, followed by an ADR, contract/document updates, and team notification.

# Security, Privacy, and Fairness Baseline

This is an implementation baseline for a hackathon prototype, not a certification or legal opinion. Only fictional citizen, billing, and device data is allowed.

## Security goals

1. A citizen can access only their household data.
2. An operator sees only information required for collection.
3. Only authorized officers/admins can review, reverse, configure, or bill.
4. A forged or replayed device message cannot mint duplicate EcoCredits.
5. Secrets never reach browser bundles, firmware history, logs, screenshots, or public issues.
6. Every integrity-sensitive action is attributable and auditable.
7. Failure is safe: ambiguous evidence is flagged, never automatically penalized.
8. Live camera/ML processing minimizes imagery, verifies its model artifact, and cannot become an arbitrary network fetcher.
9. Canonical event, ML, and UI provenance is immutable; simulated, recorded, seeded, and preview material can never masquerade as live hardware or `LOCAL_LIVE` inference.

## Assets and trust boundaries

| Boundary | Untrusted input | Required controls |
|---|---|---|
| Sensor/RFID → ESP32 | Noise, spoofed tags, disconnected sensors | Format/range checks, health state, debounce, calibration version |
| ESP32 → edge LAN | Forged/replayed JSON, local network attacker | Per-device secret for MVP, request timestamp/nonce where available, schema validation, size/rate limits |
| Camera → edge capture | SSRF/LAN scanning, credential leakage, oversized/malicious image, person/PII capture | Startup-configured exact endpoint allowlist, no request-supplied URL, redirect denial, strict time/size/dimension limits, privacy framing, memory-only processing |
| Model artifact → inference runtime | Altered or malicious weights, unsupported labels, dependency/license risk | Offline-provisioned artifact, SHA-256 verification, pinned framework/class map, supported-class allowlist, provenance/license gate, no runtime download |
| Edge → cloud | Stolen sync token, replay, malformed message | TLS, gateway identity, hashed secret/token rotation, body limits, idempotency receipt |
| Browser → cloud API | Tampered role/IDs/forms | Verified server session, RBAC, ownership checks, Zod/schema validation, CSRF-safe methods/cookies |
| Cloud API → database | Logic bugs or excessive service role | Least privilege, transactional functions, RLS, constrained tables, audit log |
| Realtime → browsers | Cross-household leakage | Private channels and RLS-authorized subscriptions |
| Developer simulation → processing | Unauthentic evidence, point farming, denial of service | System-admin/developer role, environment gate, fixed fictional identity/device, `SIMULATED` source, rate limit, idempotency, audit, metric exclusion |
| GitHub/CI/deployment | Leaked secrets or malicious dependency | Protected branches, secret scanning, pinned dependencies, least-privilege secrets |

## Role/permission matrix

| Capability | Citizen | Operator | Verification officer | Admin | Device/gateway |
|---|:---:|:---:|:---:|:---:|:---:|
| View own household/events/credits | ✓ | Minimal session view | Case evidence | ✓ | — |
| Create collection event | — | Initiate/confirm | — | — | Submit telemetry |
| Change sensor evidence | — | No | No | No | Append only |
| Review flagged event | — | — | ✓ | ✓ | — |
| Create penalty directly | — | — | Through approved decision only | Through approved decision only | — |
| File dispute | Own | — | — | — | — |
| Resolve dispute/reverse entry | — | — | Assigned cases | ✓ | — |
| Configure rules | — | Read current | Read current | ✓ with audit | Read device config |
| View exact fleet location | Approximate/assigned | Assigned vehicle | Operational | ✓ | Send own |
| Run demo simulation | — | — | — | Demo-enabled only | — |
| Change camera/model configuration | — | — | — | Local deployment approval | Edge loads approved config only |

Hiding a UI button is not authorization. Route handlers and RLS enforce every row-level decision.

## Device identity for MVP

- Each gateway/device has a public `gatewayCode`/`deviceCode` and a different random secret.
- Store only a hash/verification form of long-lived secrets in the cloud when supported.
- Firmware secrets use uncommitted local configuration; public firmware contains placeholders.
- Edge-to-cloud uses a separate gateway token, never the Supabase service-role key.
- Rotate immediately if a token appears in git, chat, video, screenshot, or logs.
- Production roadmap: per-device certificates and mutual TLS. Do not claim mTLS in the MVP.

## Replay and duplicate protection

1. ESP32 creates one immutable `eventId` before first delivery.
2. Edge inserts it under a unique constraint before acknowledging.
3. Cloud claims `messageId` atomically, scoped to the authenticated gateway/device, and hashes the request payload.
4. Same ID + same payload returns the stored result.
5. Same ID + different payload returns `409 IDEMPOTENCY_CONFLICT` and creates a security/audit alert.
6. `reward_ledger` has a unique earn constraint per collection event.
7. Review and penalty endpoints require their own idempotency key and valid state transition.

## Secrets map

| Secret | Allowed location | Forbidden location |
|---|---|---|
| Supabase service role | Vercel server secret only | Browser, firmware, shared `.env`, screenshots |
| Publishable/anon key | Browser env; protected by RLS | Treating it as authorization by itself |
| Edge sync token | Edge secret file/env + cloud verifier | Firmware and browser |
| ESP32 shared secret | Firmware local secret + edge verifier | Git, serial logs, demo slides |
| Demo passwords | Password manager/local env | README, seed SQL, public issue |

`.env.example` contains names and safe placeholders only. `.env*`, SQLite queue data, dumps, captures, camera credentials/URLs, model binaries, and device secrets are gitignored unless a license-approved non-secret artifact is deliberately tracked with its manifest and hash.

## Canonical provenance and truth labels

| Layer | Allowed values | Integrity rule |
|---|---|---|
| Event `eventSource` | `HARDWARE`, `RECORDED_HARDWARE`, `SIMULATED`, `SEEDED` | Only authenticated, physically observed ESP32 ingest may set `HARDWARE` |
| ML/evidence `source` | `LOCAL_LIVE`, `RECORDED_ML`, `SIMULATED`, `SEEDED` | Only edge-correlated capture using the verified local runtime may set `LOCAL_LIVE` |
| UI badge | `REAL`, `RECORDED`, `SIMULATED`, `PREVIEW/SEEDED` | Derived server-side from provenance; never accepted as client authority |

Imports, seed scripts, simulation, and frontend payloads cannot assign `HARDWARE` or `LOCAL_LIVE`. Tier 2 data exists only as approved frontend fixtures, always displays `PREVIEW/SEEDED`, and is never persisted in a table, API, edge queue, ledger, audit event, or Realtime topic.

## Privacy and minimization

- Use fictional “Aarav” seed data only.
- RFID/QR carries an opaque identifier, not a name, address, balance, or phone number.
- Vehicle UI shows household ID/short name and collection need only.
- Citizen map uses an approximate/assigned vehicle view, not unrestricted full fleet history.
- Tier 1 camera framing must show only the disposal zone. Do not aim it at faces, QR codes, screens, homes, number plates, or bystanders.
- Raw frames are processed in memory and are not persisted by default. Cloud records receive only bounded structured observation metadata and cryptographic input hash, never raw/base64 imagery or a retrievable camera URL.
- Debug-frame retention is off by default. An explicitly approved debug run uses only synthetic/team-consented images, restricted local storage outside web-served paths, opaque filenames, and automatic expiry; it is never uploaded through normal product APIs.
- Canonical event/ML provenance is immutable and maps to a permanent UI truth badge. A fallback is never presented as `REAL`.
- Logs use IDs and redact contact fields, tokens, and raw tag values.
- Retention configuration is explicit: prototype GPS 30 days, raw sensor evidence 90 days, application/audit records retained for demo unless PARTH AJMERA approves a reset. Production retention requires municipal/legal approval.
- Account deactivation must preserve historical ledger/audit integrity while preventing new use.

The [Solid Waste Management Rules, 2026](https://moef.gov.in/uploads/pdf-uploads/pdf_69a16e3b04c107.91022257.pdf) took effect on 1 April 2026 and describe segregated streams and authorized collection. The [Digital Personal Data Protection Rules, 2025](https://www.meity.gov.in/static/uploads/2025/11/53450e6e5dc0bfa85ebd78686cadad39.pdf) have phased commencement. The team presents SGV 2.0 as privacy-aware prototype design, not as a legally certified municipal deployment.

## Fairness controls

- Sensors are supporting evidence with health/calibration metadata.
- The rules engine stores `ruleVersion`, decision factors, and confidence/quality indicators.
- `FLAGGED` awards no final negative outcome and creates no penalty.
- Officer decisions require reason, actor, timestamp, and evidence view.
- `REVIEW_NO_ACTION` closes insufficient evidence at `0` with no ledger row; it is distinct from `REVIEW_ACCEPTED` and `VERIFIED_VIOLATION`.
- Citizen can see a plain-language reason and dispute a verified penalty.
- Admin reversal is additive: create reversal records; do not delete ledger/audit history.
- Analytics must not rank citizens publicly or expose household-level behavior.

### Tier 1 local ML controls

- The edge creates `LOCAL_LIVE` only after a real H0-approved camera adapter captures a frame for a durably stored hardware `eventId`.
- The camera endpoint is local deployment configuration, never request data. Allow only the exact approved scheme/host/IP/port/path, disable redirects, revalidate resolution, deny all other destinations, and never forward application/device credentials.
- Enforce bounded frame bytes, decoded dimensions, capture attempts, inference duration, and concurrency. Malformed/oversized data fails closed as `ML_UNAVAILABLE`.
- Load only the approved model artifact after SHA-256 verification. The manifest records framework version, class map, supported labels, weights hash, dataset/provenance, license decision, and validation evidence. Runtime downloads and request-selected model paths are forbidden. Treat pickle-capable model formats as executable code and never deserialize an untrusted artifact.
- General pretrained models may report only the frozen supported-class allowlist. Unsupported or conflicting classes map to `UNKNOWN`; low confidence, camera/model failure, or multiple conflicting objects becomes `FLAGGED` with `0` immediate points.
- ML is evidence for deterministic `rules-2.0.0`; it never writes the ledger or declares `VERIFIED_VIOLATION`. Any `-10` or `-20` entry requires an authorized human review decision.
- `RECORDED_ML`, `SIMULATED`, and `SEEDED` are disclosed non-live sources. They cannot claim physical capture or `LOCAL_LIVE`; simulated/seeded records are excluded from real-hardware proof and every metric that is not explicitly labelled.
- Model/weights/data provenance and license compatibility are a go/no-go requirement. License uncertainty blocks that artifact.

## High-priority abuse cases

| Abuse | Impact | Mandatory mitigation/test |
|---|---|---|
| Citizen changes household ID in URL | Cross-household PII leak | Server ownership check + RLS negative test |
| Replay accepted event | Duplicate EcoCredits | Unique event/ledger constraints + replay test |
| Operator sends arbitrary sensor values | False decision | Device source/auth, audit, bounds, manual review |
| Stolen admin session | Penalty/rule manipulation | Short session, secure cookies, server RBAC, audit; MFA post-MVP |
| Service-role key in browser | Full DB compromise | Server-only env/build scan |
| Same event ID with altered body | Integrity conflict | Payload hash + `409 IDEMPOTENCY_CONFLICT` + alert |
| Malicious evidence text/script | Stored XSS | Schema limits and escaped rendering |
| Edge queue theft | Local data exposure/tampering | OS account protection; minimal PII; restricted file permissions |
| Camera URL supplied or changed by attacker | Edge used to scan LAN/metadata or leak credentials | No request URL; exact startup allowlist; redirects off; DNS/destination revalidation; network egress restriction |
| Altered/untrusted model artifact | Code execution, false classifications, supply-chain compromise | Offline provisioning; SHA-256/manifest verification; fixed loader/path; least privilege; no runtime download |
| Raw frame retained or uploaded | Face/location/identity exposure | Memory-only default; metadata/hash only; approved synthetic/consented debug TTL |
| Simulation endpoint abused | Fake evidence, point farming, availability loss | Environment gate; fixed demo identity/device; RBAC; rate limit; idempotency; audit; permanent `SIMULATED` label |
| Dependency compromise | Build/runtime compromise | Lockfiles, audit, minimal additions, CI review |

## Required security tests before `main`

- Citizen A cannot query Citizen B's household, events, credits, penalties, bills, or disputes.
- Operator cannot call admin review/rules endpoints.
- Browser build contains no service/device secret.
- Invalid, oversized, unauthenticated, old-contract, and replayed payloads fail predictably.
- Duplicate accepted event produces one ledger earn entry.
- Flagged event produces zero penalties until review.
- `REVIEW_NO_ACTION` creates no point transaction and closes the flagged case idempotently.
- Automated category mismatch, environmental wetting, low confidence, and `ML_UNAVAILABLE` each produce `0` immediate points.
- A negative point transaction cannot exist without one authorized `VERIFIED_VIOLATION`; severe wet-in-dry is capped at `-20` and ordinary mismatch at `-10` under `rules-2.0.0`.
- Camera capture rejects unapproved destinations, redirects, credentials in URLs, oversized frames, and unexpected content; raw frames do not appear in DB, logs, cloud storage, git, or normal exports.
- Model startup fails closed on weights-hash, framework, class-map, provenance, or license-gate mismatch; unsupported labels become `UNKNOWN`.
- Simulation is disabled without the environment flag, denied to non-admin/developer roles, idempotent/rate-limited, audited, fixed to fictional identities, and permanently labelled.
- Canonical event/ML provenance pairs are enforced server-side; every cross-pair and every client attempt to assert a truth badge is rejected or safely flagged.
- Audit entries exist for rule change, review, penalty, dispute resolution, credit adjustment, and admin login-sensitive action.
- Logs and exported reports contain no secret or unnecessary contact data.

## Incident response

If a secret or real personal record is exposed: stop the demo/deploy, revoke/rotate the credential, preserve minimal audit evidence, remove the data from active systems, check git history/artifacts, notify PARTH AJMERA and BHUMIKA SINGH RAWAT privately, and only resume after a clean verification. Deleting one visible commit is not sufficient for a leaked secret.
