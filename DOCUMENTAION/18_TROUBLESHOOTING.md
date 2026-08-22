> **PLAN & STRUCTURE LOCK — v1.0:** This approved scope, stack, repository structure, contracts, ownership map, and delivery plan must not be changed by contributors or AI agents. Work only inside the assigned paths. If a change is necessary, stop and submit a `CHANGE_REQUEST`; only PARTH AJMERA may approve it, followed by an ADR and team notification.

# Integration and Demo Troubleshooting

Use this order: identify the failing boundary, preserve evidence, apply the smallest reversible action, retest the golden fixture, then resume. Do not redesign the system during an incident.

## Five-minute triage

1. Capture time, commit SHA, firmware/edge/contract versions, event ID, device ID, and visible error.
2. Check device serial state.
3. Check edge `/healthz` readiness details and queue counts.
4. Check cloud health and ingestion receipt by event ID.
5. Check database row/ledger count and UI request/realtime state.
6. Decide the first boundary where expected evidence disappears.

```text
sensor -> firmware event -> `QUEUED_LOCALLY` -> cloud `ACKED` -> DB transaction -> realtime/poll -> UI
```

## Common failures

| Symptom | Check | Safe action | Owner |
|---|---|---|---|
| ESP32 reboot loop/brownout | Serial boot reason, supply voltage/current | Disconnect optional loads; use stable supply; revert wiring | KRISHNA PANWAR |
| RFID not detected | 3.3 V, SPI pins, antenna distance, standalone sketch | Reseat; test seeded tag; use labelled QR fallback | KRISHNA PANWAR |
| Moisture always 0/max | ADC1 pin, common ground, raw logs, corrosion | Rewire/calibrate; mark sensor degraded | KRISHNA PANWAR |
| Weight drifts | Mechanical mounting, tare, HX711 wiring | Stabilize platform; retare; document tolerance | KRISHNA PANWAR |
| ESP32 cannot reach edge | Same SSID/subnet, laptop IP/port/firewall | Correct configured LAN IP; test hotspot; restart only edge | KRISHNA PANWAR/ADITYA SILSWAL |
| Edge returns 401 | Device ID/secret registration | Rotate/re-enter local secret; never print it | ADITYA SILSWAL/PARTH AJMERA |
| Edge returns 422 | Contract version/field/range | Compare golden fixture and schema; fix assigned implementation, not contract | KRISHNA PANWAR/ADITYA SILSWAL |
| Event ACKed but not cloud synced | Internet, token, cloud URL, pending/error queue | Keep queued; fix outbound config; trigger bounded retry | ADITYA SILSWAL |
| Duplicate ID mismatch | Same ID with changed payload | Quarantine; create new legitimate event only for new intent; audit | ADITYA SILSWAL/AASHU JOSHI |
| Cloud 401/403 | Gateway token/role/expiry | Verify server secret and registration; rotate if exposed | AASHU JOSHI/PARTH AJMERA |
| Cloud 500 | request ID, server log, migration state | Reproduce with fixture; rollback web or add corrective migration | AASHU JOSHI/BHUMIKA SINGH RAWAT |
| Credit appears twice | Event/ledger unique constraints and transaction | Stop release; preserve rows; P0 fix before resume | AASHU JOSHI/BHUMIKA SINGH RAWAT |
| Flagged event created penalty | State transition/service path | Stop release; P0 fix; reverse additively, keep audit | AASHU JOSHI/BHUMIKA SINGH RAWAT |
| Citizen sees another household | RLS/server ownership check | Stop deploy; revoke sessions; P0 security fix | BHUMIKA SINGH RAWAT/AASHU JOSHI |
| UI stale | Network request, realtime auth, DB row | Switch to polling/refresh; fix subscription after demo | YASHVARDHAN DOBHAL |
| Map blank | Tile network/CSP/container size | Show coordinate/fleet table fallback | YASHVARDHAN DOBHAL |
| Migration failed | Applied versions/error SQL | Do not edit applied migration; create corrective migration or reset fictional DB | BHUMIKA SINGH RAWAT |
| Cursor changed many folders | `git diff --name-only`, current branch | Stop agent; do not commit; retain only scoped changes via approved review | YASHVARDHAN DOBHAL/PARTH AJMERA |
| Merge conflict | latest integration and path owner | Ask both owners; resolve on source branch; rerun all gates | PARTH AJMERA |
| Colab/model unavailable or import rejected | G4 status, license gate, artifact schema/source, admin session | Switch to `RECORDED_ML` or skip optional scene; never debug it during the core demo | PARTH AJMERA/AASHU JOSHI |

## Edge queue states

- `PENDING`: safely stored, not attempted or ready to retry.
- `IN_FLIGHT`: claimed by one sync worker with lease.
- `ACKED`: cloud receipt stored.
- `DEAD_LETTER`: non-transient/manual attention; never silently deleted.

If `IN_FLIGHT` remains after gateway crash, an expired lease returns it to retry. Never run two uncontrolled gateway processes against the same SQLite file.

## Golden diagnostic requests

Use committed scripts/fixtures when implemented; never paste tokens into shell history or screenshots.

```bash
npm run health
npm run test:contracts
npm run replay:golden
npm run test:integration -- --event accepted-v1
```

If these root commands do not exist yet, the foundation task must create them. Do not invent different commands in every module.

## Demo recovery order

1. Preserve the current screen/event ID.
2. Use refresh/polling if only realtime failed.
3. Use table if only map tiles failed.
4. Use recorded hardware fixture if physical hardware failed; label it.
5. Use local edge/offline proof if internet failed.
6. Use backup video if core infrastructure failed.
7. Explain the exact resilience path; do not spend the judging window live-debugging.

## Escalation

- P0 security/integrity/data loss: stop all merges/deploy/demo writes; PARTH AJMERA + BHUMIKA SINGH RAWAT lead.
- Hardware boundary: KRISHNA PANWAR leads; ADITYA SILSWAL supplies edge evidence.
- Edge/cloud sync: ADITYA SILSWAL leads until cloud request exists; AASHU JOSHI after it exists.
- UI-only: YASHVARDHAN DOBHAL leads after API response is verified.
- Scope/contract/tree question: stop and submit `CHANGE_REQUEST` to PARTH AJMERA.
