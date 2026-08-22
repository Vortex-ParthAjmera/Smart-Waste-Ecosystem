> **PLAN & STRUCTURE LOCK — v1.0:** This approved scope, stack, repository structure, contracts, ownership map, and delivery plan must not be changed by contributors or AI agents. Work only inside the assigned paths. If a change is necessary, stop and submit a `CHANGE_REQUEST`; only PARTH AJMERA may approve it, followed by an ADR and team notification.

# Requirements Traceability Matrix

This matrix prevents “completed” claims without code, tests, and judge-visible evidence. Detailed requirement wording is authoritative in `01_PRODUCT_REQUIREMENTS.md`.

| Requirement group | Owner(s) | Primary implementation path | Required proof | Demo step |
|---|---|---|---|---|
| FR-ID-001..004 | AASHU JOSHI, BHUMIKA SINGH RAWAT, KRISHNA PANWAR | web auth/API, RLS, device registry, firmware ID | RBAC/RLS/device-auth positive and negative tests | Log in three roles; real device heartbeat |
| FR-COL-001..006 | KRISHNA PANWAR, YASHVARDHAN DOBHAL, AASHU JOSHI | firmware sensors/event builder, operator UI, ingestion | HIL serial + contract + degraded/safety tests | RFID/category/intake/sensors shown |
| FR-EDGE-001..006 | ADITYA SILSWAL | `services/edge-gateway/**` | persistence-before-ACK, restart, retry, dead-letter, duplicate tests | Internet off; pending count; later sync |
| FR-RULE-001..003 | AASHU JOSHI | `packages/rules-engine/**` | full decision matrix, deterministic explanation/version | Accepted and flagged result explained |
| FR-REV-001..003 | AASHU JOSHI, YASHVARDHAN DOBHAL, BHUMIKA SINGH RAWAT | admin verification/citizen dispute APIs, UI, schema | RBAC/state/constraint/E2E tests | Officer accepts or confirms; citizen disputes |
| FR-ECO-001..005 | AASHU JOSHI, BHUMIKA SINGH RAWAT, YASHVARDHAN DOBHAL | ledger/RPC, cloud API, credit UI | ledger reconciliation, concurrency/idempotency, adjustment audit | One accepted event changes EcoCredits once |
| FR-CIT-001 | YASHVARDHAN DOBHAL, AASHU JOSHI, BHUMIKA SINGH RAWAT | citizen route group/API/RLS | citizen E2E and cross-household denial | Aarav dashboard/detail |
| FR-OPS-001 | YASHVARDHAN DOBHAL, KRISHNA PANWAR, ADITYA SILSWAL | operator route group + edge/device health | accepted/flagged/degraded/offline E2E | Operator collection screen |
| FR-ADM-001..002 | YASHVARDHAN DOBHAL, AASHU JOSHI, BHUMIKA SINGH RAWAT | admin routes/APIs/analytics SQL | admin E2E and aggregate reconciliation | Fleet, queue, ledger/analytics |
| FR-IOT-001 | YASHVARDHAN DOBHAL, ADITYA SILSWAL, KRISHNA PANWAR | admin IoT-control UI + edge/device health | component failure, stale-state, source-label tests | Exact failed sensor and queue health |
| FR-ML-001 (P1) | PARTH AJMERA, AASHU JOSHI, BHUMIKA SINGH RAWAT, YASHVARDHAN DOBHAL | `scripts/demo/ml/**`, optional import API/table/card | license/privacy gate, RBAC/schema/idempotency/no-side-effect tests | Optional labelled evidence scene after core |
| FR-TRK-001..003 | KRISHNA PANWAR, AASHU JOSHI, YASHVARDHAN DOBHAL | firmware/location ingest/map/table | coordinate bounds, stale clock, role precision tests | Admin exact vs citizen safe location |
| FR-AUD-001..002 | AASHU JOSHI, BHUMIKA SINGH RAWAT, all services | audit table + correlation propagation | mutation coverage and trace search | One event ID traced end-to-end |
| FR-CFG-001 | PARTH AJMERA, AASHU JOSHI, ADITYA SILSWAL, KRISHNA PANWAR | contracts/config/rules versions | v1 accepted, unsupported version rejected | Show versions in evidence view |
| FR-NOT-001 | YASHVARDHAN DOBHAL, AASHU JOSHI | in-app notifications | once-only, role/household E2E | accepted/flagged notification |
| NFR-SEC-001..003 | BHUMIKA SINGH RAWAT, AASHU JOSHI, ADITYA SILSWAL | CI, server/edge validation, secret stores | secret scan, auth abuse, size/rate/input tests | Security slide/evidence if asked |
| NFR-PRV-001 | PARTH AJMERA, YASHVARDHAN DOBHAL, BHUMIKA SINGH RAWAT | seed, views, logging/retention config | data inventory and UI/log inspection | Fictional/minimized identity shown |
| NFR-REL-001..002 | ADITYA SILSWAL, AASHU JOSHI, BHUMIKA SINGH RAWAT | edge outbox, ingestion/ledger transactions | offline soak, replay/concurrency/restart | Disconnect/reconnect without duplicate |
| NFR-PERF-001 | BHUMIKA SINGH RAWAT, ADITYA SILSWAL, AASHU JOSHI | performance scripts/reports | p50/p95/error-rate record | Mention measured, not theoretical target |
| NFR-TRK-001 | KRISHNA PANWAR, YASHVARDHAN DOBHAL, BHUMIKA SINGH RAWAT | location interval and freshness UI | timed HIL and fake-clock test | Live → stale indicator |
| NFR-ACC-001 | YASHVARDHAN DOBHAL, BHUMIKA SINGH RAWAT | all P0 screens | automated scan + keyboard/manual checklist | Keyboard/status clarity if asked |
| NFR-OBS-001 | All, led by BHUMIKA SINGH RAWAT | logs/health/correlation | forced-failure diagnosis + redaction test | Event trace and device/edge health |
| NFR-MNT-001 | BHUMIKA SINGH RAWAT, all module owners | CI/type/contracts/boundary checks | green required workflows | Build/test evidence |
| NFR-DEM-001 | PARTH AJMERA, all | demo assets/runbook | live, recorded-hardware, and backup drills | Seamless labelled fallback |

## Per-task closure record

Every issue/PR adds or links an evidence record:

```md
Requirement IDs:
Implementation paths:
Contract/schema version:
Tests and exact commands:
Evidence links (screenshot/log/receipt/video):
Demo step affected:
Known limitation:
Reviewer sign-off:
```

## Release completeness rules

- All P0 functional and non-functional rows must have merged implementation and passing proof.
- P1 rows may be deferred only by PARTH AJMERA with a visible known limitation.
- A screenshot without a backend assertion does not prove integrity.
- A unit test without real boundary evidence does not prove hardware integration.
- A live demonstration without repeatable test evidence does not prove reliability.
- Requirement IDs, event IDs, code paths, and test evidence must remain linkable in PRs.
