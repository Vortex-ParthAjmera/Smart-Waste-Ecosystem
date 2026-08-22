> **PLAN & STRUCTURE LOCK — v1.0:** This approved scope, stack, repository structure, contracts, ownership map, and delivery plan must not be changed by contributors or AI agents. Work only inside the assigned paths. If a change is necessary, stop and submit a `CHANGE_REQUEST`; only PARTH AJMERA may approve it, followed by an ADR and team notification.

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

## Assets and trust boundaries

| Boundary | Untrusted input | Required controls |
|---|---|---|
| Sensor/RFID → ESP32 | Noise, spoofed tags, disconnected sensors | Format/range checks, health state, debounce, calibration version |
| ESP32 → edge LAN | Forged/replayed JSON, local network attacker | Per-device secret for MVP, request timestamp/nonce where available, schema validation, size/rate limits |
| Edge → cloud | Stolen sync token, replay, malformed message | TLS, gateway identity, hashed secret/token rotation, body limits, idempotency receipt |
| Browser → cloud API | Tampered role/IDs/forms | Verified server session, RBAC, ownership checks, Zod/schema validation, CSRF-safe methods/cookies |
| Cloud API → database | Logic bugs or excessive service role | Least privilege, transactional functions, RLS, constrained tables, audit log |
| Realtime → browsers | Cross-household leakage | Private channels and RLS-authorized subscriptions |
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

`.env.example` contains names and safe placeholders only. `.env*`, SQLite queue data, dumps, captures, and device secrets are gitignored.

## Privacy and minimization

- Use fictional “Aarav” seed data only.
- RFID/QR carries an opaque identifier, not a name, address, balance, or phone number.
- Vehicle UI shows household ID/short name and collection need only.
- Citizen map uses an approximate/assigned vehicle view, not unrestricted full fleet history.
- Camera evidence is outside MVP.
- Logs use IDs and redact contact fields, tokens, and raw tag values.
- Retention configuration is explicit: prototype GPS 30 days, raw sensor evidence 90 days, application/audit records retained for demo unless PARTH AJMERA approves a reset. Production retention requires municipal/legal approval.
- Account deactivation must preserve historical ledger/audit integrity while preventing new use.

The [Solid Waste Management Rules, 2026](https://moef.gov.in/uploads/pdf-uploads/pdf_69a16e3b04c107.91022257.pdf) took effect on 1 April 2026 and describe segregated streams and authorized collection. The [Digital Personal Data Protection Rules, 2025](https://www.meity.gov.in/static/uploads/2025/11/53450e6e5dc0bfa85ebd78686cadad39.pdf) have phased commencement. The team presents SGV 2.0 as privacy-aware prototype design, not as a legally certified municipal deployment.

## Fairness controls

- Sensors are supporting evidence with health/calibration metadata.
- The rules engine stores `ruleVersion`, decision factors, and confidence/quality indicators.
- `FLAGGED` awards no final negative outcome and creates no penalty.
- Officer decisions require reason, actor, timestamp, and evidence view.
- Citizen can see a plain-language reason and dispute a verified penalty.
- Admin reversal is additive: create reversal records; do not delete ledger/audit history.
- Analytics must not rank citizens publicly or expose household-level behavior.

### Optional ML controls

- Use only synthetic/team-created waste images with no person, face, identifier, address, or location.
- Colab stores no application/database/device secret; an authenticated admin imports a structured artifact.
- Accept hashes and bounded metadata, never raw/base64 images or server-side fetched URLs.
- `MANUAL_COLAB`/`RECORDED_ML` is always visible and cannot trigger a state, ledger, bill, or penalty mutation.
- Model/weights/data provenance and license compatibility are a go/no-go requirement.

## High-priority abuse cases

| Abuse | Impact | Mandatory mitigation/test |
|---|---|---|
| Citizen changes household ID in URL | Cross-household PII leak | Server ownership check + RLS negative test |
| Replay accepted event | Duplicate EcoCredits | Unique event/ledger constraints + replay test |
| Operator sends arbitrary sensor values | False decision | Device source/auth, audit, bounds, manual review |
| Stolen admin session | Penalty/rule manipulation | Short session, secure cookies, server RBAC, audit; MFA post-MVP |
| Service-role key in browser | Full DB compromise | Server-only env/build scan |
| Same event ID with altered body | Integrity conflict | Payload hash + 422 + alert |
| Malicious evidence text/script | Stored XSS | Schema limits and escaped rendering |
| Edge queue theft | Local data exposure/tampering | OS account protection; minimal PII; restricted file permissions |
| Dependency compromise | Build/runtime compromise | Lockfiles, audit, minimal additions, CI review |

## Required security tests before `main`

- Citizen A cannot query Citizen B's household, events, credits, penalties, bills, or disputes.
- Operator cannot call admin review/rules endpoints.
- Browser build contains no service/device secret.
- Invalid, oversized, unauthenticated, old-contract, and replayed payloads fail predictably.
- Duplicate accepted event produces one ledger earn entry.
- Flagged event produces zero penalties until review.
- Audit entries exist for rule change, review, penalty, dispute resolution, credit adjustment, and admin login-sensitive action.
- Logs and exported reports contain no secret or unnecessary contact data.

## Incident response

If a secret or real personal record is exposed: stop the demo/deploy, revoke/rotate the credential, preserve minimal audit evidence, remove the data from active systems, check git history/artifacts, notify PARTH AJMERA and BHUMIKA SINGH RAWAT privately, and only resume after a clean verification. Deleting one visible commit is not sufficient for a leaked secret.
