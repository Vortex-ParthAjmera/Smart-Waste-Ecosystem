> **PLAN & STRUCTURE LOCK — v1.0:** This approved scope, stack, repository structure, contracts, ownership map, and delivery plan must not be changed by contributors or AI agents. Work only inside the assigned paths. If a change is necessary, stop and submit a `CHANGE_REQUEST`; only PARTH AJMERA may approve it, followed by an ADR and team notification.

# SGV 2.0 Documentation Control Centre

Status: approved implementation baseline v1.0  
Project owner and final approver: PARTH AJMERA  
Prepared for: TLE Eliminators, SIH 2026 university-level hackathon  
Folder name: `DOCUMENTAION` is intentionally frozen with this exact spelling.

## Repository identity

- Recommended repository name: `sgv-2-smart-waste-ecosystem`
- GitHub description: `ESP32-powered smart waste collection with offline edge sync, live municipal operations, and auditable citizen credits, verified penalties, and disputes.`
- Visibility: private during development; public only when the team is ready to submit.
- Default branch: `main`
- Integration branch: `integration`

## One-minute project definition

SGV 2.0 turns a municipal garbage vehicle into a connected, auditable collection platform. A real ESP32 reads a citizen identifier and waste sensors. A laptop-hosted FastAPI edge gateway validates and queues events on the local network, then synchronizes them to a Next.js/Supabase cloud platform. Citizens see collection history and EcoCredits; operators see collection status; administrators see live fleet data, verification cases, rules, analytics, penalties, and disputes.

The central fairness rule is immutable: **no uncertain sensor reading may create a financial penalty.** Ambiguous events are flagged for a human officer. Only a confirmed violation can create a simulated penalty or bill item.

## What was reconciled

The old `docs/` folder is evidence and research, not the active implementation authority.

| Source | Treatment in v1.0 |
|---|---|
| Smart Garbage Vehicle PRDs and end-to-end Aarav story | Retained as product evidence and refined into requirements |
| SIH presentation and SGV 2.0 ecosystem deck | Retained as pitch and visual-system evidence |
| Old Next.js/Supabase simulated-hardware plan | Superseded where it conflicts with real ESP32 hardware |
| Old ADR-003, “full hardware simulation” | Superseded by ADR-003B: real ESP32 plus a local edge gateway |
| Household smart-bin/Bluetooth/UPI plan | Reference-only; it is a different product and is outside SGV 2.0 MVP |
| Teammate's “Smart Waste Management & IoT Segregation Platform” workflow | Reconciled into the event model, conditional dual-compartment sensing, IoT-control UX, active/normal dashboard states, and an optional gated YOLO evidence demo |
| Old role mapping | Superseded by the six named owners in `11_TEAM_GITHUB_WORKFLOW.md` |

### Teammate-plan reconciliation decisions

| Proposal | Approved treatment |
|---|---|
| Citizen, municipal, and developer applications | Three role experiences inside the one approved Next.js application; the technical experience is an admin IoT-control area, not a fourth deployment |
| ESP32 directly calling cloud/Supabase | Rejected; every ESP32 message still passes through the offline FastAPI/SQLite gateway |
| Two compartments, two IR sensors, two ultrasonic sensors | Target hardware profile only when all parts pass the H0 inventory/calibration gate; the core contract degrades honestly when a component is missing |
| Opaque citizen QR | Adopted as an identifier option; it contains no Aadhaar number or personal data |
| Aadhaar and Google municipal login | Not claimed in the hackathon MVP; use synthetic Supabase demo accounts and present government identity federation as future integration |
| YOLO through a manual Colab workflow | Optional post-core demo evidence, clearly labelled `MANUAL_COLAB`; it cannot block ingestion, award/revoke credits, or create a penalty |
| Automatic negative points or “high penalty” from sensor/ML output | Rejected; automation returns `ACCEPTED` or `FLAGGED`, and only a human-confirmed violation can create a simulated penalty |
| Locality leaderboards, badges, certificates, and advanced reports | Stretch UX after the judged physical-to-digital loop is green; they may not displace reliability, security, or review work |

## Authority order

When two files appear to disagree, follow this order:

1. PARTH AJMERA's written, approved `CHANGE_REQUEST`.
2. `06_API_IOT_CONTRACT.md` and `05_DATA_SCHEMA.md` for machine/public contracts.
3. `01_PRODUCT_REQUIREMENTS.md` for scope and acceptance criteria.
4. `AGENTS.md` for AI behavior, path ownership, and governance rules.
5. `02_SYSTEM_ARCHITECTURE.md` and `03_TECH_STACK.md` for implementation boundaries.
6. `10_IMPLEMENTATION_PLAN.md` and `11_TEAM_GITHUB_WORKFLOW.md` for delivery.
7. Other files in this folder.
8. The legacy `docs/` folder.

No contributor or AI may resolve a conflict by silently choosing a different design.

## Documentation map

| File | Use |
|---|---|
| `README.md` | Complete repository README; copy to the repository root |
| `AGENTS.md` | The **only** master context file to copy to the root and feed Freebuff, Cursor, or another coding AI |
| `01_PRODUCT_REQUIREMENTS.md` | Product scope, users, requirement IDs, non-goals, acceptance |
| `02_SYSTEM_ARCHITECTURE.md` | Edge/cloud architecture, components, data flow, offline behavior |
| `03_TECH_STACK.md` | Frozen technologies, rationale, version policy, rejected alternatives |
| `04_REPOSITORY_STRUCTURE.md` | Exact folder tree, path ownership, dependency directions |
| `05_DATA_SCHEMA.md` | ERD, tables, enums, constraints, RLS, ledger invariants |
| `06_API_IOT_CONTRACT.md` | Edge and cloud endpoints, JSON payloads, errors, idempotency |
| `07_HARDWARE_FIRMWARE.md` | BOM tiers, safe wiring baseline, firmware states, calibration |
| `08_EDGE_GATEWAY.md` | FastAPI local server, SQLite queue, retry, health, operations |
| `09_SECURITY_PRIVACY.md` | Trust boundaries, RBAC/RLS, device identity, secrets, privacy |
| `10_IMPLEMENTATION_PLAN.md` | Hour-by-hour work gates, dependencies, owners, freeze |
| `11_TEAM_GITHUB_WORKFLOW.md` | Named branches, approvals, PR rules, branch protection |
| `12_TEST_STRATEGY.md` | Automated, hardware, integration, security, and demo tests |
| `13_DEPLOYMENT_RUNBOOK.md` | Local/cloud setup, environment variables, release and rollback |
| `14_DEMO_JUDGING_PLAN.md` | Judge-ready narrative, timing, proof, fallback demo |
| `15_RISK_REGISTER.md` | Risk owners, triggers, prevention, contingency |
| `16_ARCHITECTURE_DECISIONS.md` | Immutable decision record and change governance |
| `17_REQUIREMENTS_TRACEABILITY.md` | Requirement-to-owner-to-code-to-test-to-demo mapping |
| `18_TROUBLESHOOTING.md` | Fast incident diagnosis during integration and demo |
| `19_GLOSSARY.md` | Canonical names, states, acronyms, and forbidden ambiguities |
| `20_UI_UX_SPECIFICATION.md` | Screen inventory, navigation, dashboard and credit UX rules |
| `21_ML_INTEGRATION.md` | Optional YOLO evidence workflow, provenance, confidence, security, and fallback |
| `22_WASTE_DECISION_POINTS.md` | Exact deterministic decision, human-review, EcoCredit, and simulated-penalty rules |

## Non-negotiable execution rules

1. Do not rename, move, add, or delete a top-level folder without approved change control.
2. Do not change the MVP, stack, schema, API payloads, branch ownership, or milestones inside a coding task.
3. Work only in the issue's `Allowed paths`.
4. `packages/contracts/**` is contract-first shared infrastructure. PARTH AJMERA approves changes before code is written.
5. Sensors are evidence, not proof. The rules engine can accept or flag; it cannot directly fine.
6. EcoCredits are simulated points in the MVP. No real UPI transfer or municipal charge is permitted.
7. An event replay must never create a second collection event, credit, or penalty.
8. No direct push to `main` or `integration`; no force-push; no bypassing red CI.
9. Never commit real citizen data or credentials.
10. A human must inspect `git diff` before every commit and PR.

## Correct creation order

1. PARTH AJMERA creates the GitHub repository using the name and description above.
2. Copy this folder's `README.md` and `AGENTS.md` to the repository root.
3. Create the exact tree in `04_REPOSITORY_STRUCTURE.md` on `main`; commit it as the baseline.
4. Create `integration` from that baseline.
5. Create all six `team/*` branches from `integration`, not from unrelated local copies.
6. Configure branch protection and CODEOWNERS before feature work.
7. Create one issue per task with owner, allowed paths, acceptance criteria, and test evidence.
8. Each member checks out only their branch. YASHVARDHAN DOBHAL must confirm Cursor shows `team/yashvardhan-dobhal-web-ui` before prompting it.
9. Finish the H0-H4 vertical foundation before building extra screens.

## Change request format

```md
CHANGE_REQUEST: CR-###
Requested by:
Blocked task:
Current approved rule/contract:
Why the task cannot fit it:
Smallest proposed change:
Files/contracts affected:
Migration and test impact:
Fallback if rejected:
```

Until PARTH AJMERA writes `APPROVED`, the answer is no and the current plan remains active. Approval must produce an ADR, documentation version update, and a team-channel notification before implementation.

## Baseline completion test

This documentation pack is ready to execute when every member can answer all five questions without guessing:

1. Which branch and paths do I own?
2. Which requirement and issue am I implementing?
3. Which contract version and payload am I consuming?
4. Which automated or physical evidence proves my task works?
5. Who reviews and merges my PR?
