> **PLAN & STRUCTURE LOCK — v2.0:** This approved scope, stack, repository structure, contracts, ownership map, truth-tier model, and delivery plan must not be changed by contributors or AI agents. Work only inside assigned paths. If a change is necessary, stop and submit a `CHANGE_REQUEST`; only PARTH AJMERA may approve it, followed by an ADR, contract/document updates, and team notification.

# Integration and Demo Troubleshooting

Use this order: preserve the failing `eventId`, identify the first broken boundary, apply the smallest reversible action, retest the canonical fixture, and resume only with honest stored provenance and a matching UI truth badge. Do not redesign the system during an incident.

## Five-minute triage

1. Record time, commit SHA, contract/rules/firmware/edge/model versions, `eventId`, device ID, selected compartment, `eventSource`, `evidenceSource`, UI truth badge, and visible error.
2. Check ESP32 serial state, IR trigger count, sensor quality, and local network.
3. Check edge `/healthz`, SQLite writability, queue counts, camera/model health, and last capture/inference result.
4. Check whether the cloud received the exact edge message and whether the decision/ledger transaction committed.
5. Check authorized REST response before blaming Realtime; then inspect polling/subscription and rendered truth badge.
6. Stop at the first boundary with missing or contradictory evidence.

```text
QR/session
  -> compartment IR + sensors
  -> signed firmware message
  -> edge durable `QUEUED_LOCALLY`
  -> camera capture
  -> `LOCAL_LIVE` inference or explicit ML failure
  -> deterministic decision
  -> cloud `ACKED` + transaction
  -> REST/realtime/poll
  -> truth-labelled UI
```

Processing, decision, and transport are independent. An event can be `ML_PENDING`, `FLAGGED`, and `ACKED` at the same time; do not “fix” one dimension by overwriting another.

## Hardware, QR, and edge failures

| Symptom | Check | Safe action | Owner |
|---|---|---|---|
| ESP32 reboot/brownout | boot reason, supply voltage/current, common ground | disconnect optional loads; use stable supply; retain failure evidence | KRISHNA PANWAR |
| QR does not scan | permission, focus/light, payload format, active identifier | retry once; use authorized seeded fallback; never type or invent another citizen ID | YASHVARDHAN DOBHAL/AASHU JOSHI |
| QR is invalid, expired, or revoked | validation result and audit log | show safe error; issue/activate only through the approved identity flow | AASHU JOSHI/BHUMIKA SINGH RAWAT |
| Wrong compartment fires | IR pin-to-compartment mapping and physical placement | stop collection; correct mapping; rerun five-trigger HIL test | KRISHNA PANWAR |
| Duplicate event from one deposit | debounce interval, interrupt bounce, stable `eventId` | keep first canonical intent; suppress retry duplicate; do not delete audit rows | KRISHNA PANWAR/ADITYA SILSWAL |
| Incomplete event | one IR fired but evidence/capture never completed | expire to `PROCESSING_FAILED` or configured review path; preserve partial evidence; never auto-award or debit | KRISHNA PANWAR/ADITYA SILSWAL |
| Ultrasonic reports impossible fill | empty/full calibration, echo timeout, unit/range | mark that sensor `DEGRADED`/`FAILED`; exclude it from classification | KRISHNA PANWAR |
| Moisture is always 0/max | ADC pin, ground, raw ADC, calibration version | rewire/recalibrate; mark `MISSING/FAILED`; do not infer dry/wet | KRISHNA PANWAR |
| GPS unavailable indoors | fix status, satellites, timestamp, bounds | show `MISSING`/`UNKNOWN`; never substitute an unlabelled coordinate | KRISHNA PANWAR/YASHVARDHAN DOBHAL |
| ESP32 cannot reach edge | SSID/subnet, laptop address/port/firewall | restore trusted LAN/config; use recorded hardware only with `eventSource=RECORDED_HARDWARE` and UI truth badge `RECORDED` | KRISHNA PANWAR/ADITYA SILSWAL |
| Edge returns `401` | device ID, signature inputs, credential version | repair/rotate credential privately; never print it | ADITYA SILSWAL/PARTH AJMERA |
| Edge returns `422` | schema version, enum, unit, required field | compare canonical fixture; fix implementation, not the frozen contract | KRISHNA PANWAR/ADITYA SILSWAL |
| Edge acknowledged but restart lost event | SQLite commit/WAL path, process using wrong DB | stop release; restore last known-good edge version and fix persistence-before-ACK | ADITYA SILSWAL |
| Event remains locally pending | WAN, cloud URL/token, retry schedule, queue error | keep durable row; repair outbound config; use bounded retry | ADITYA SILSWAL |
| Same ID with changed body | payload hashes and caller retry behavior | quarantine as `IDEMPOTENCY_CONFLICT`; never overwrite | ADITYA SILSWAL/AASHU JOSHI |

## Phone-camera and local-model failures

| Symptom | Check | Safe action | Owner |
|---|---|---|---|
| Phone camera cannot be reached | same LAN, configured URL, phone app state, permission, firewall | use laptop camera; otherwise mark `ML_UNAVAILABLE` and switch to labelled fallback | ADITYA SILSWAL |
| Camera returns old/stale frame | capture timestamp, frame sequence/hash, buffer/cache headers | reject stale frame; request one fresh capture; flag event if budget expires | ADITYA SILSWAL |
| Camera URL redirects or returns unexpected content | configured allowlist, content type/size, destination address | reject request; never follow arbitrary URLs or fetch user-supplied destinations | ADITYA SILSWAL/BHUMIKA SINGH RAWAT |
| Raw frame was saved unexpectedly | retention/debug flags and output path | stop capture, remove only approved temporary artifact safely, run privacy review; keep audit metadata | ADITYA SILSWAL/BHUMIKA SINGH RAWAT |
| Model artifact missing | local path, manifest, offline preflight | use the verified pre-downloaded artifact; otherwise set ML/evidence source to `RECORDED_ML` with truth badge `RECORDED`, or use an explicitly `SIMULATED` event/evidence fixture | ADITYA SILSWAL/PARTH AJMERA |
| Weights hash mismatch | actual SHA-256 vs approved manifest | do not load; quarantine artifact; restore verified copy; record incident | ADITYA SILSWAL/BHUMIKA SINGH RAWAT |
| Unsupported model class | frozen allowlist/class-to-category mapping | map to `UNKNOWN`; event becomes `FLAGGED`; never invent a friendly class | ADITYA SILSWAL/AASHU JOSHI |
| No object detected | frame quality and model output | show “No supported waste detected”; `FLAGGED`, immediate ledger `0` | ADITYA SILSWAL/AASHU JOSHI |
| Multiple conflicting detections | bounded result set, confidence, category conflict | show the conflict to developer/reviewer; `FLAGGED`, no automatic negative points | ADITYA SILSWAL/AASHU JOSHI |
| Inference exceeds timeout | CPU/RAM, input resolution, competing apps, configured budget | cancel/expire safely; mark `ML_UNAVAILABLE`; use fallback rather than blocking edge custody | ADITYA SILSWAL |
| Confidence is below `0.60` | raw finite score and model version | label `LOW`; `FLAGGED`; never call it a calibrated probability | AASHU JOSHI/YASHVARDHAN DOBHAL |
| ML result arrives late or twice | `eventId`, observation ID, processing state, idempotency key | retain one canonical observation; ignore/audit late duplicate; never recalculate a closed ledger silently | ADITYA SILSWAL/AASHU JOSHI |
| `LOCAL_LIVE` shown for a recording | `evidenceSource` and UI truth-badge mapping | stop the demo claim; set `evidenceSource=RECORDED_ML`, render `RECORDED`, and add a regression test | PARTH AJMERA/YASHVARDHAN DOBHAL |

## Cloud, auth, simulation, and UI failures

| Symptom | Check | Safe action | Owner |
|---|---|---|---|
| Cloud `401/403` | gateway token/session/role/expiry | restore or rotate approved credential; never bypass authorization | AASHU JOSHI/PARTH AJMERA |
| Phone OTP does not arrive | Supabase provider, rate limit, network, configured fictional phone | use the pre-created fictional citizen fallback account and disclose auth fallback | AASHU JOSHI/PARTH AJMERA |
| Google OAuth redirect fails | provider configuration, callback URL, cookies, network | use the pre-created fictional municipal account; do not change roles manually in DB | AASHU JOSHI/PARTH AJMERA |
| Developer access denied correctly | caller role and route policy | do not weaken the guard; log in with the approved developer/system-admin account | AASHU JOSHI |
| Database/API `5xx` | request ID, server log, migration/version state | reproduce with fixture; rollback web or add a forward corrective migration | AASHU JOSHI/BHUMIKA SINGH RAWAT |
| Credit appears twice | event/ledger unique constraints, retry response | stop release; preserve rows; P0 integrity fix and concurrency regression | AASHU JOSHI/BHUMIKA SINGH RAWAT |
| Automatic mismatch created `-10/-20` | review decision link and transaction caller | stop writes; this is P0; reverse additively and require `VERIFIED_VIOLATION` | AASHU JOSHI/BHUMIKA SINGH RAWAT |
| Simulation button returns disabled | `DEMO_SIMULATION_ENABLED`, role, environment | enable only in the approved demo environment; never remove the flag guard | PARTH AJMERA/AASHU JOSHI |
| Simulation returns `401/403/429` | developer role, session, rate limit | use authorized account or wait for limit; never call the route anonymously | AASHU JOSHI |
| Injected event changes a real citizen | fixture identity, `eventSource`, transaction scope | stop release; revert only via audited compensation; lock simulation to fixed fictional IDs and `eventSource=SIMULATED` | AASHU JOSHI/BHUMIKA SINGH RAWAT |
| Duplicate simulation produces two effects | idempotency key/body hash and unique constraints | stop release; fix same-key replay before demo | AASHU JOSHI/BHUMIKA SINGH RAWAT |
| UI is stale | initial REST request, authorized Realtime, reconnect/poll | switch to approved polling/refetch; keep last-seen age visible | YASHVARDHAN DOBHAL |
| Tier 2 preview calls a live feature API or writes to the database | browser network log, database audit, and route implementation | remove the route/call/write; restore approved frontend fixture and permanent `PREVIEW/SEEDED` label; never insert a `SEEDED` event merely to power Tier 2 | YASHVARDHAN DOBHAL/PARTH AJMERA |
| Preview/simulated badge is absent or hidden | provenance-to-truth mapping, responsive/cropped view | block release until the permanent text badge is visible at all required widths | YASHVARDHAN DOBHAL/BHUMIKA SINGH RAWAT |

## Edge transport states

- `PENDING`: durably stored and waiting for an attempt or retry time.
- `IN_FLIGHT`: leased by one worker for one bounded attempt.
- `ACKED`: matching cloud receipt persisted.
- `AUTH_BLOCKED`: credential/configuration repair required; no aggressive retry.
- `DEAD_LETTER`: terminal/manual remediation; never silently deleted.

An expired `IN_FLIGHT` lease returns to `PENDING`. Never run uncontrolled gateway processes against the same SQLite file.

## Diagnostic evidence

Use committed scripts and canonical fixtures when they exist; never paste tokens, camera credentials, or citizen data into commands, screenshots, issues, or AI chats. Collect:

- the same `eventId` at every boundary;
- payload/model hashes and contract/rules/model versions;
- processing, decision, and transport states separately;
- `eventSource`, `evidenceSource`, rendered UI truth badge, and fallback disclosure;
- row/ledger counts before and after replay;
- capture and inference timestamps/latency;
- the first safe error code, not a screenshot of a later symptom.

## Demo recovery order

1. Preserve the screen, `eventId`, event source, ML/evidence source, UI truth badge, and timestamps.
2. Use REST refetch/polling if only Realtime failed.
3. Keep real sensor and edge custody live if WAN failed.
4. Use `RECORDED_ML` only if camera/model failed; render the UI truth badge `RECORDED`.
5. Use `RECORDED_HARDWARE` only if physical input failed; render the UI truth badge `RECORDED`.
6. Use developer injection only with `eventSource=SIMULATED`, `evidenceSource=SIMULATED` when ML evidence is supplied, and UI truth badge `SIMULATED`; it does not prove physical ingress.
7. Use a prepared video/evidence bundle if the application is unavailable.
8. PARTH AJMERA states exactly which layer is live, recorded, simulated, or previewed.

Do not spend more than the rehearsed recovery budget debugging on stage.

## Escalation

- Security, privacy, duplicate value, automatic negative points, or cross-household access: stop merges/deploy/demo writes; PARTH AJMERA and BHUMIKA SINGH RAWAT lead.
- Hardware/firmware: KRISHNA PANWAR leads; ADITYA SILSWAL provides edge/camera boundary evidence.
- Edge, camera, local ML, or cloud handoff: ADITYA SILSWAL leads until a valid cloud request exists; AASHU JOSHI leads after it exists.
- Auth/API/rules: AASHU JOSHI leads; BHUMIKA SINGH RAWAT verifies data/RLS effects.
- UI-only: YASHVARDHAN DOBHAL leads after the authorized response, stored provenance fields, and rendered truth badge are verified.
- Scope, contract, folder, or tier question: stop and submit `CHANGE_REQUEST` to PARTH AJMERA.
