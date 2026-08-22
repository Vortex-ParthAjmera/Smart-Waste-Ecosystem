> **PLAN & STRUCTURE LOCK — v1.0:** This approved scope, stack, repository structure, contracts, ownership map, and delivery plan must not be changed by contributors or AI agents. Work only inside the assigned paths. If a change is necessary, stop and submit a `CHANGE_REQUEST`; only PARTH AJMERA may approve it, followed by an ADR and team notification.

# Hackathon Risk Register

Scale: likelihood (L) and impact (I) are Low/Medium/High. P0 threatens core integrity, security, or the judged demo; P1 threatens a major feature; P2 has a workable fallback.

| ID | Risk | L | I | Priority | Owner | Early trigger | Prevention | Tested contingency |
|---|---|---|---|---|---|---|---|---|
| R-01 | ESP32/sensor unavailable or damaged | M | H | P0 | KRISHNA PANWAR | No stable standalone reading by H4 | Inventory at H0, must/should BOM, known-good wiring/artifact | Recorded hardware fixture, honestly labelled |
| R-02 | Power/brownout/noisy readings | H | H | P0 | KRISHNA PANWAR | Reboots/drift during Wi-Fi transmit | Stable supply, common ground, isolation, calibration, soak | Remove optional sensors; degraded mode |
| R-03 | ESP32 cannot reach laptop | M | H | P0 | KRISHNA PANWAR/ADITYA SILSWAL | Heartbeat absent by H4 | Dedicated hotspot, fixed LAN IP/port test | Emulator or recorded payload through edge |
| R-04 | Venue internet fails | H | H | P0 | ADITYA SILSWAL | Cloud health fails/high latency | Durable edge outbox; rehearse offline | Show edge-stored queue then backup recording |
| R-05 | Duplicate event/credit | M | H | P0 | AASHU JOSHI/BHUMIKA SINGH RAWAT | Replayed fixture changes balance | Unique constraints, payload hash, transaction, concurrency test | Stop release; additive correction after fix |
| R-06 | False automatic penalty | M | H | P0 | AASHU JOSHI | Penalty exists without review | State machine/DB constraint; human review invariant | Stop demo writes; reverse additively |
| R-07 | Cross-household data leak | M | H | P0 | BHUMIKA SINGH RAWAT/AASHU JOSHI | Negative RLS test fails | RLS + server ownership checks | Stop deploy; revoke sessions; patch/test |
| R-08 | Contract drift across firmware/edge/cloud | H | H | P0 | PARTH AJMERA | Same fixture parses differently | Freeze v1 first; golden fixture CI; shared review | Roll back implementation to canonical v1 |
| R-09 | Schema migration breaks shared DB | M | H | P0 | BHUMIKA SINGH RAWAT | Reset/seed fails or API 500s | Forward-only migrations, local reset test, no late destructive SQL | Corrective migration/deterministic rebuild |
| R-10 | Team merge conflict/integration delay | H | M | P1 | PARTH AJMERA | Large PR/many shared paths | Fixed owners/branches, small PRs, integrate continuously | Reassign only explicit file/task; feature cut |
| R-11 | AI reorganizes or changes plan | H | H | P0 | PARTH AJMERA/each member | Diff touches forbidden paths | Root AGENTS, allowed paths, one task/chat, human diff review | Reject uncommitted drift; restore scoped work only |
| R-12 | YASHVARDHAN DOBHAL/Cursor works on wrong branch | M | H | P0 | YASHVARDHAN DOBHAL | `git branch --show-current` mismatch | Verify branch before prompt/commit | Stop; do not push; PARTH AJMERA helps isolate changes |
| R-13 | Secrets committed/exposed | M | H | P0 | Everyone/BHUMIKA SINGH RAWAT | Secret scan or visible token | Examples only, gitignore, platform secret stores | Rotate/revoke, inspect history/artifacts |
| R-14 | Realtime/map UI fails | M | M | P2 | YASHVARDHAN DOBHAL | Stale UI/blank map | Poll fallback; coordinate table | Refresh/poll/table view |
| R-15 | Edge queue corruption/disk full | L | H | P0 | ADITYA SILSWAL | DB readiness/disk warning | WAL, safe shutdown, permissions, disk check, backup | Stop worker; backup DB; last-good recovery |
| R-16 | Scope creep (AI/UPI/MQTT/mobile) | H | H | P1 | PARTH AJMERA | P0 incomplete while stretch code starts | Frozen non-goals and H19 feature freeze | Delete/defer unmerged stretch work |
| R-17 | Too many screens, no vertical slice | H | H | P0 | PARTH AJMERA | No end-to-end event by H8 | Gated plan prioritizes hardware→credit path | Cut analytics/polish; keep core three views |
| R-18 | Demo seed/state becomes inconsistent | M | H | P0 | BHUMIKA SINGH RAWAT | Rehearsal counts/balance differ | Deterministic reset/seed and one consumed-event plan | Reset/reseed, rerun golden scenario |
| R-19 | Live demo takes too long | M | M | P1 | PARTH AJMERA | Rehearsal exceeds five minutes | Scripted roles/tabs, fixed narrative, timer | Skip secondary UI; use proof slide/video |
| R-20 | Policy/compliance overclaim | M | M | P1 | PARTH AJMERA | Pitch says certified/official integration | Use “designed to align,” prototype and simulated labels | Correct verbally/on slide; no false claim |
| R-21 | Optional ML causes scope, license, privacy, or runtime failure | H | H | P1 | PARTH AJMERA | Core gate incomplete, license unclear, Colab fails, or image contains personal data | Post-G4 go/no-go, synthetic inputs, manifest/license review, no notebook secrets, recorded artifact | Skip the scene or use `RECORDED_ML`; never delay core demo |

## Decision triggers

- H1: unconfirmed BOM → activate explicit component fallback; do not wait silently.
- H4: no heartbeat → KRISHNA PANWAR/ADITYA SILSWAL pair only on the boundary until green.
- H8: no vertical slice → freeze extra UI/analytics.
- H12: no exactly-once credit → credit feature is P0; all relevant owners pair.
- H16: exception/offline paths fail → cut P1 features.
- H19: feature freeze; only P0/P1 fixes.
- T-60 min: any unstable live dependency → switch to rehearsed fallback before judging.

Risk owners update evidence/trigger status; only PARTH AJMERA changes scope or priority.
