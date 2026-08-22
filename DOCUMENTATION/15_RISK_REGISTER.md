> **PLAN & STRUCTURE LOCK — v2.0:** This approved scope, stack, repository structure, contracts, ownership map, truth-tier model, and delivery plan must not be changed by contributors or AI agents. Work only inside assigned paths. If a change is necessary, stop and submit a `CHANGE_REQUEST`; only PARTH AJMERA may approve it, followed by an ADR, contract/document updates, and team notification.

# Hackathon Risk Register

Status: approved risk baseline v2.0

Risk owner/coordinator: PARTH AJMERA

Evidence and release tracking: BHUMIKA SINGH RAWAT

Likelihood (`L`) and impact (`I`) use Low/Medium/High. `P0` threatens safety, integrity, privacy/security, fairness, or the judged Tier 1 demo; `P1` threatens a major Tier 1 capability; `P2` has a safe removal or disclosed fallback.

## 1. Active risks

| ID | Risk | L | I | Priority | Owner | Early trigger | Prevention | Tested contingency |
|---|---|---|---|---|---|---|---|---|
| R-01 | ESP32 or required sensor is unavailable/damaged | M | H | P0 | KRISHNA PANWAR | no stable bench reading by H1 | H0 inventory, standalone tests, spare cables/parts, safe wiring | expose exact failed health; use `RECORDED_HARDWARE`, never claim live |
| R-02 | Brownout, unsafe wiring, or noisy sensor values | H | H | P0 | KRISHNA PANWAR | resets/drift during Wi-Fi or wet-path test | stable supply/common ground, level shifting, isolation, calibration, soak | remove failed component, mark `DEGRADED/MISSING`, use reviewed path |
| R-03 | Wet/dry IR triggers are cross-wired or double-count a deposit | M | H | P0 | KRISHNA PANWAR | wrong compartment or duplicate trigger in HIL | independent pin map/debounce tests, event lockout, labelled wiring | stop live run; repair hardware/firmware; use recorded physical fixture |
| R-04 | Ultrasonic/moisture/GPS is presented as classification truth | M | H | P0 | PARTH AJMERA + KRISHNA PANWAR | UI/pitch says sensor “proves” waste type | contract roles, quality/calibration labels, claims review | correct UI/script; route event to review; remove unsupported claim |
| R-05 | ESP32 cannot reach the edge laptop | M | H | P0 | KRISHNA PANWAR + ADITYA SILSWAL | heartbeat absent or unstable by H4 | isolated hotspot, reserved IP, firewall/port and reconnect rehearsal | show diagnostic; use `RECORDED_HARDWARE` through the edge |
| R-06 | Camera stream is unavailable, stale, or changes address | H | H | P1 | ADITYA SILSWAL | capture timeout/stale hash at preflight | reserved address, keep-awake/power, freshness check, frozen resolution | show failed camera health; use `RECORDED_ML` or human review |
| R-07 | Camera captures a face, QR, address, screen, or bystander | M | H | P0 | ADITYA SILSWAL + PARTH AJMERA | privacy review finds personal/identifier content | controlled background/crop, no default retention, exclude people and screens | stop capture/demo, quarantine/delete per incident process, use privacy-safe recorded input |
| R-08 | Raw frames or camera credentials persist/leak | M | H | P0 | ADITYA SILSWAL + BHUMIKA SINGH RAWAT | file/log/secret scan finds image, URL, or token | retention off, restricted temp path, redaction, cleanup test, secret store | stop service, revoke camera credential, remove exposed data/artifacts, audit before resume |
| R-09 | Model does not support the demonstrated waste label | H | H | P0 | ADITYA SILSWAL + PARTH AJMERA | output/pitch uses class absent from allowlist | freeze class allowlist/map and prepared objects before H0; unsupported -> `UNKNOWN` | switch item/label to supported class or show honest unknown/review; never invent mapping |
| R-10 | Model produces unreliable/conflicting output under demo lighting | H | H | P1 | ADITYA SILSWAL | local test-set confusion or unstable repeated scores | controlled camera/lighting/background, representative local tests, multi-object rules | `FLAGGED 0`; use `RECORDED_ML` with disclosure or human review |
| R-11 | Capture/inference latency exceeds the demo budget | M | H | P1 | ADITYA SILSWAL | 30-trial p95 exceeds 2 seconds | pinned small artifact, frozen resolution, warm-up, measured timeout | switch to `RECORDED_ML` and state the live runtime missed readiness; do not claim live latency |
| R-12 | Wrong/corrupt model, class map, runtime, or artifact drift | M | H | P0 | ADITYA SILSWAL | startup hash/class count differs from manifest | offline pinned files, SHA-256 verification, dependency lock, no runtime download | fail model readiness; restore manifest artifact or use labelled fallback |
| R-13 | Model/dataset/dependency license is incompatible or unclear | M | H | P0 | PARTH AJMERA + ADITYA SILSWAL | no written license decision at PRE-05 | provenance/license inventory before implementation; approved dependency only | block live ML/release claim; replace with approved artifact through change control; recorded fallback also requires approval |
| R-14 | ML result attaches to the wrong event or arrives twice/late | M | H | P0 | ADITYA SILSWAL + AASHU JOSHI | event/capture IDs diverge or duplicate observation appears | stable `eventId`, bounded capture session, unique constraints, timeout and replay tests | flag/quarantine result; never decide/value event; recover using correlated fallback |
| R-15 | WAN/venue internet fails | H | H | P0 | ADITYA SILSWAL | cloud health/latency fails | SQLite outbox, local model artifact, WAN-off rehearsal | F1: demonstrate live local path/queue and recorded cloud completion |
| R-16 | Edge acknowledges before durable commit or loses queue on restart | M | H | P0 | ADITYA SILSWAL | kill-after-`202` test loses row | WAL, `synchronous=FULL`, explicit transaction, process-kill CI | stop release; restore last tagged edge/DB backup and rerun reconciliation |
| R-17 | Edge disk fills, database corrupts, or two workers double-lease | L | H | P0 | ADITYA SILSWAL | readiness/disk/lease test fails | disk thresholds, permissions, one bounded worker/atomic lease, safe shutdown | stop ingest/sync, preserve DB, recover last-good copy, reconcile IDs/hashes |
| R-18 | Cloud timeout/retry duplicates an event or ledger value | M | H | P0 | AASHU JOSHI + BHUMIKA SINGH RAWAT | replay changes row count/balance | stable keys/hashes, atomic claim, unique constraints, transaction and concurrency tests | stop value writes/release; investigate and correct append-only through approved process |
| R-19 | Same ID with changed body is silently accepted | L | H | P0 | ADITYA SILSWAL + AASHU JOSHI | conflict fixture returns success | raw-body hash at edge/cloud, `409 IDEMPOTENCY_CONFLICT`, audit alert | dead-letter/quarantine; block release until canonical behavior passes |
| R-20 | Automation creates `-10/-20` without human review | M | H | P0 | AASHU JOSHI + BHUMIKA SINGH RAWAT | any automated adverse fixture changes ledger negatively | rules output limited to `ACCEPTED`/`FLAGGED`; DB requires verified review before negative entry | disable affected mutation, preserve audit, append approved reversal if needed, block release |
| R-21 | Environmental wetting unfairly becomes misconduct | M | H | P0 | AASHU JOSHI | dry class + moisture >45 yields negative/accepted adverse result | frozen `ENVIRONMENTAL_WETTING_SUSPECTED`, `FLAGGED 0`, reviewer workflow | correct decision/config through approved rules version; no negative until review |
| R-22 | Reviewer role is abused or review/dispute audit is incomplete | M | H | P0 | AASHU JOSHI + BHUMIKA SINGH RAWAT | unauthorized decision or missing actor/reason | server RBAC, RLS, idempotency, state lock, append-only actor/reason/timestamp | revoke session, stop review writes, preserve incident evidence, patch/test |
| R-23 | Citizen or role data leaks across RLS/Realtime | M | H | P0 | BHUMIKA SINGH RAWAT + AASHU JOSHI | cross-household/role negative test passes unexpectedly | RLS plus server ownership/role checks and private invalidation topics | stop deploy, revoke sessions/keys, patch and rerun full authorization matrix |
| R-24 | Phone OTP or Google OAuth fails at venue | H | M | P1 | BHUMIKA SINGH RAWAT + YASHVARDHAN DOBHAL | redirect/SMS/provider preflight fails | approved origins, separate profiles, provider rehearsal, fictional accounts | use pre-created fictional Supabase accounts; never weaken auth/RLS |
| R-25 | Auth/service/device/camera/Wi-Fi secret is exposed | M | H | P0 | everyone; BHUMIKA SINGH RAWAT coordinates | secret scan or projected token | `.env.example`, gitignore, platform stores, redaction, screen discipline | stop demo/deploy, rotate/revoke, inspect history/artifacts, resume only after clean scan |
| R-26 | Simulation masquerades as physical or live ML evidence | M | H | P0 | AASHU JOSHI + YASHVARDHAN DOBHAL | missing `SIMULATED` label or hardware fields appear | system-admin only, post-ingest boundary, fixed identity, feature flag, source constraints, uncroppable badge | disable simulation and remove scene; use recorded proof with explicit disclosure |
| R-27 | Simulation is abused to spam points/metrics | M | H | P0 | AASHU JOSHI + BHUMIKA SINGH RAWAT | changing identity, repeated rows, leaderboard change | idempotency/rate limit, fixed demo identity, audited request, metric exclusion | disable feature flag, revoke session, reset only designated simulated state |
| R-28 | Seed event counts and ledger balance diverge | M | H | P0 | BHUMIKA SINGH RAWAT | reset manifest/count/balance mismatch | deterministic seed, ledger reconciliation assertions, two clean resets | stop rehearsal; reset confirmed demo project and rerun reconciliation |
| R-29 | Seeded alias/leaderboard exposes identity or includes simulation | M | M | P1 | BHUMIKA SINGH RAWAT + YASHVARDHAN DOBHAL | real-like name or simulated row appears | fictional opt-in aliases, no contact/household detail, source-filter test | hide/remove leaderboard; retain private citizen ledger only |
| R-30 | Tier 2 preview gains a hidden backend or loses its label | M | H | P0 | PARTH AJMERA + YASHVARDHAN DOBHAL | schema/API/network diff or cropped label | start only after G6, frontend fixtures only, `PREVIEW/SEEDED` component invariant | remove preview entirely; rerun Tier 1 regression |
| R-31 | Presenter falsely claims unsupported accuracy, live source, government approval, real billing, or scale | M | H | P0 | PARTH AJMERA | rehearsal wording conflicts with evidence/label | claims ledger, script anchors, source badges, Q&A rehearsal | correct immediately, disclose actual source/limit, switch to evidence slide |
| R-32 | Realtime/map fails or displays stale data as live | M | M | P2 | YASHVARDHAN DOBHAL | blank/stale view without age/source | initial REST read, authorized polling, freshness/source labels, table fallback | poll/refetch; show table/no-fix or labelled preview |
| R-33 | Schema migration or RLS change breaks shared demo DB | M | H | P0 | BHUMIKA SINGH RAWAT | clean reset fails or API/RLS regression | forward-only migrations, local rehearsal, one migration owner, no late destructive SQL | stop writes; corrective migration or deterministic demo rebuild |
| R-34 | Firmware/edge/cloud/model contract drift | H | H | P0 | PARTH AJMERA | one canonical fixture parses differently | contract-first shared fixtures, coordinated reviews, no local aliases | roll back consumer to frozen contract; approved change request if genuinely blocked |
| R-35 | Team merge conflict or late integration | H | H | P1 | PARTH AJMERA | large PR, shared-file edits, owner blocked | fixed branches/paths, small PRs, H1/H4/H8/H12/H16/H20 windows | cut optional work, reassign only exact task/path, protect last green integration |
| R-36 | YASHVARDHAN DOBHAL/Cursor edits the wrong branch or structure | M | H | P0 | YASHVARDHAN DOBHAL | branch/path mismatch or alternate frontend appears | verify exact branch before prompt/commit; root AGENTS; scoped prompts and diff review | stop; do not push; isolate allowed diff with PARTH AJMERA; reject structure drift |
| R-37 | Krishna and Aditya shared GitHub account causes attribution, wrong-branch, or credential risk | H | H | P0 | PARTH AJMERA + KRISHNA PANWAR + ADITYA SILSWAL | wrong author/branch, overlapping push, token shared in chat | separate clones/worktrees and fixed branches, local `user.name/email`, PR evidence by human owner, no token disclosure | stop pushes, rotate exposed credential, document/correct attribution forward; do not rewrite shared history without approval |
| R-38 | AI agent changes frozen plan/tree/contracts or edits another owner's path | H | H | P0 | PARTH AJMERA + every member | diff touches forbidden file/path or invents API/table | root `AGENTS.md`, one bounded issue, allowed paths, human full-diff review | reject unmerged drift; reissue smaller task; use change-request process if blocked |
| R-39 | Scope creep prevents Tier 1 freeze | H | H | P0 | PARTH AJMERA | previews/animations/extras begin while a G0–G6 gate is red | Tier 1-only H0–H24, enforced cut order, issue board/gates | remove/defer Tier 2 and polish; pair only on failing critical boundary |
| R-40 | Demo exceeds time or handoffs fail | M | M | P1 | PARTH AJMERA | rehearsal >7:10 or silent debug >20 seconds | fixed tabs/roles/script, two rehearsals, compact version, fallback owner | run compact script, skip badges/previews/secondary analytics, use evidence slide |
| R-41 | Demo laptop/phone/power fails | M | H | P0 | PARTH AJMERA + physical owners | battery/thermal/storage/network warning | mains power, spare cables/bank, keep-awake, offline copies, backup device test | stop unsafe runtime; switch to verified recording/evidence on second device |

## 2. Decision triggers

| Time/gate | Trigger | Mandatory decision |
|---|---|---|
| Before H0 | hardware, camera, model artifact/class/license, or auth fallback unconfirmed | assign tested fallback and blocker; do not silently start dependent work |
| H4 / G1 | no signed heartbeat, durable edge receipt, or clean DB/RLS baseline | pair only the responsible boundary owners; freeze cosmetic UI |
| H8 / G2 | no real QR/compartment/sensor -> durable edge event | stop cloud polish/ML UI; repair physical-ingress boundary |
| H12 / G3 | no idempotent cloud truth or role isolation | stop value/review features; repair contract/transaction/RLS |
| H16 / G4 | live local model not allowlisted, offline, correlated, or within latency budget; accepted +10 not exact-once | select honest model fallback for presentation and continue repairing Tier 1; no Tier 2 |
| H20 / G5 | fairness, review-before-negative, seed, simulation, or WAN/restart proof fails | enter defect-only mode; cut all previews and polish |
| H24 / G6 | any Tier 1 P0/P1 remains | do not declare Tier 1 frozen; use H24–H26 for repairs and skip Tier 2 |
| H26 / G7 | preview has hidden backend or bad label | delete preview; do not alter backend/schema to save it |
| T-60 minutes | any live dependency is unstable or evidence/source label is uncertain | PARTH AJMERA selects rehearsed fallback before judging |

## 3. Risk operating rules

1. Each owner updates likelihood, trigger evidence, and contingency rehearsal at every integration window.
2. A fallback reduces demo risk but does not convert `RECORDED_HARDWARE`, `RECORDED_ML`, `SIMULATED`, `SEEDED`, or `PREVIEW/SEEDED` into a live claim.
3. P0 integrity, safety, privacy, RLS, idempotency, fairness, source-labelling, and license risks cannot be accepted for cosmetic schedule reasons.
4. Only PARTH AJMERA changes scope/priority, activates a fallback, approves a `CHANGE_REQUEST`, or declares go/no-go.
5. Risk mitigation never authorizes destructive Git/database/device operations, secret disclosure, history rewriting, or edits outside assigned paths.
