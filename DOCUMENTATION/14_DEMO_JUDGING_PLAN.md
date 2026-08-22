> **PLAN & STRUCTURE LOCK — v2.0:** This approved scope, stack, repository structure, contracts, ownership map, truth-tier model, and delivery plan must not be changed by contributors or AI agents. Work only inside assigned paths. If a change is necessary, stop and submit a `CHANGE_REQUEST`; only PARTH AJMERA may approve it, followed by an ADR, contract/document updates, and team notification.

# SGV 2.0 Demo and Judging Plan

| Field | Value |
|---|---|
| Demo owner and final go/no-go | PARTH AJMERA |
| Web/presentation operator | YASHVARDHAN DOBHAL |
| Cloud API/rules explainer | AASHU JOSHI |
| Physical hardware/firmware lead | KRISHNA PANWAR |
| Edge, camera, and local-ML lead | ADITYA SILSWAL |
| Seed, QA, evidence, and fallback lead | BHUMIKA SINGH RAWAT |
| Full core story | 7 minutes 30 seconds; rehearse to <= 7:10 |
| Compact core story | 5 minutes; keep physical, ML, exact-once, fairness, and offline proof |
| Demo identities | fictional main citizen from seed manifest, `SGV-002`, provisioned device/gateway, fixed simulation identity |
| Product claim | Real ESP32 and local ML, offline-safe edge custody, exactly-once points, human review before negative points, and truthful municipal visibility |

## 1. What judges must remember

At the end, a judge should be able to repeat four ideas:

1. **One accountable disposal:** an opaque citizen QR, compartment, sensor/camera evidence, location/time, model provenance, decision, and ledger result share one traceable event.
2. **AI with boundaries:** the pinned local model recognizes only an explicit supported-class allowlist. Low/unknown/conflicting evidence is reviewed; the model cannot deduct points.
3. **Fair incentives:** a valid match earns exactly `+10`; any adverse automated result is `FLAGGED 0`; only an authorized human may append reviewed `-10/-20`, with dispute and audit.
4. **Built for field reality:** sensing, inference, FastAPI validation, and SQLite custody continue without WAN, then synchronize exactly once when connectivity returns.

Lead with the accountability problem and the physical event. Framework names are supporting proof, not the opening pitch.

## 2. Judging thesis

| Likely criterion | SGV 2.0 proof | Artifact to show |
|---|---|---|
| Problem relevance | Anonymous collection becomes a citizen-linked, compartment-specific, auditable event | event detail from opaque QR to ledger |
| Innovation | Low-cost vehicle hardware, offline local vision, durable edge, and human-governed scoring operate as one system | physical event plus local ML and review timeline |
| Technical depth | Versioned contracts cross ESP32, FastAPI/SQLite, local model, Next.js, and Supabase | one `eventId` correlation trace |
| Feasibility | One laptop/phone/ESP32 stack uses pinned artifacts and disclosed fallbacks | BOM, model manifest, measured latency, health screen |
| Reliability | WAN loss and restart do not lose or duplicate accepted events or points | live queue plus reconciliation evidence |
| Trust/fairness | No automatic negative; review reason, actor, dispute, and append-only ledger are visible | environmental-wetting and violation review scenes |
| Security/privacy | Opaque QR, fictional data, least-privilege roles, RLS, redacted logs, non-retained frames | negative-access test and privacy-safe camera view |
| UX | Citizen, municipal, and developer/IoT experiences share one app but expose role-appropriate detail | three prepared browser profiles |
| Completeness | Happy path, uncertainty, human review, offline recovery, diagnostics, and fallbacks are rehearsed | evidence manifest and run-of-show |
| Honesty | Live, recorded, simulated, preview, and roadmap content are never visually confused | permanent source/tier badges |

## 3. Fixed demo environment

### 3.1 Physical layout

- **Left:** secured wet/dry prototype with one IR and ultrasonic sensor per compartment, dry-path moisture sensor, ESP32, GPS/no-fix indicator, QR stand, stable supply, and prepared waste objects.
- **Center:** edge laptop showing compact health/queue/camera/model status. The camera view includes only the controlled disposal area.
- **Right:** citizen, municipal, reviewer, and developer/IoT browser profiles, or a split-screen if one display is available.
- Electronics stay behind a clear barrier. Only KRISHNA PANWAR touches wiring or power.
- Use a rehearsed switch/fixture to demonstrate a component failure; never pull wet-area wiring unsafely on stage.

### 3.2 Deterministic seed

| Seed requirement | Fixed demo truth |
|---|---|
| Main fictional citizen | 15–25 historical events with a manifest-recorded starting balance `B` |
| Additional citizens | four to six fictional opt-in aliases; no real names/contact data |
| Mixed outcomes | accepted, environmental-wetting, low-confidence, pending review, reviewed `-10/-20`, dispute, degraded, offline, and simulated |
| Ledger | every displayed balance equals the append-only sum; live accepted event changes `B` to `B + 10` once |
| Badge/tier | at least one seeded display derived from approved seed/rule; not an editable balance |
| Vehicle/device | `SGV-002` and one provisioned gateway/ESP32 with recorded versions |
| Simulation identity | fixed fictional citizen/device; all downstream records say `SIMULATED` and are excluded from real metrics |
| Tier 2 | frontend fixtures only, never stored; every surface says `PREVIEW/SEEDED` |

BHUMIKA SINGH RAWAT prints the exact seed counts, main starting balance, expected badge/tier, and hashes before the demo. Presenters use the manifest value rather than memorizing a stale number.

### 3.3 Prepared physical/model cases

- One supported dry item in the model allowlist with a calibrated dry-path moisture reading `<30%`.
- One supported wet item if the allowlist/model and physical hygiene gate pass.
- One controlled environmental-wetting case: supported dry item with moisture `>45%`.
- One opposite-category/severe-mismatch case as a deterministic staged event or permanent `SIMULATED` fallback; never force unreliable waste/camera behavior live.
- One unsupported item/recorded frame to show `UNKNOWN` and review behavior if time permits.

No presenter claims support for `plastic_wrapper`, generic `food_waste`, or any class absent from the frozen allowlist. Live physical events use `eventSource=HARDWARE`; live local inference uses evidence source `LOCAL_LIVE`; the corresponding UI badge is `REAL`. Recorded, simulated, seeded, and preview sources use only the canonical provenance and UI badges defined in `23_BUILD_DOC_V4_RECONCILIATION.md` and the contracts.

### 3.4 Browser tabs and profiles

1. Opening value/actor screen.
2. Citizen profile/QR/history/ledger.
3. Municipal scan and active-disposal timeline.
4. Developer/IoT health, edge queue, camera/model monitor.
5. Admin/reviewer flagged queue and event evidence.
6. Citizen dispute/history result.
7. Architecture, test evidence, limitations, and roadmap.
8. Optional Tier 2 preview, opened only after the scored Tier 1 story.

Never log out and back in on stage. Never project Supabase service dashboards, environment files, camera credentials, or secret-bearing terminals.

## 4. Seven-and-a-half-minute core run-of-show

| Time | Lead | Scene and spoken point | Visible proof |
|---:|---|---|---|
| 0:00–0:35 | PARTH AJMERA | Explain the broken hand-off: segregation evidence, feedback, and accountability disappear at collection. | one-line physical-to-ledger chain |
| 0:35–1:00 | YASHVARDHAN DOBHAL | Show the fictional citizen's reconciled history/balance and opaque QR. State that the QR contains no PII. | seed count, ledger sum, QR privacy label |
| 1:00–2:10 | KRISHNA PANWAR | Municipal operator scans QR, selects `DRY`, and deposits the supported item. The dry IR triggers independently; real fill/moisture/GPS-or-no-fix and health appear. | physical action and live sensor evidence |
| 2:10–2:55 | ADITYA SILSWAL | Edge commits before `202`, captures the event-correlated frame, and runs the pinned allowlisted model locally as `LOCAL_LIVE`. Briefly disable WAN after local custody to prove sensing/inference continue. | `eventId`, queue row, `REAL` badge, camera/model hash suffix, score band, WAN offline |
| 2:55–3:40 | AASHU JOSHI | Restore WAN. The same event syncs once, rules-2.0.0 returns `ACCEPTED`, and one `+10` entry commits. Replay/refetch does not change the balance again. | transport `ACKED`, reason code, `B -> B+10`, duplicate-safe receipt |
| 3:40–4:45 | BHUMIKA SINGH RAWAT + YASHVARDHAN DOBHAL | Open the prepared environmental-wetting event: supported dry class but moisture `>45%`. Show `FLAGGED`, `0`, then an authorized reviewer clears it and appends `+10`. | `ENVIRONMENTAL_WETTING_SUSPECTED`, evidence, actor/reason/audit |
| 4:45–5:40 | AASHU JOSHI + BHUMIKA SINGH RAWAT | Open the staged mismatch: automation is still `FLAGGED 0`; a human verifies normal `-10` or severe wet-in-dry `-20`. Show the citizen dispute and immutable original record. | review decision, negative ledger row, dispute/audit |
| 5:40–6:25 | ADITYA SILSWAL | Show component-level health and one rehearsed camera/sensor/model failure. Use fallback/injection only if required; show evidence source `RECORDED_ML` with badge `RECORDED`, or source/badge `SIMULATED`. | exact failed component, recovery, uncroppable source badge |
| 6:25–6:55 | PARTH AJMERA | Summarize the trust architecture: ESP32 -> LAN FastAPI/SQLite + local ML -> authenticated cloud -> one role-separated web app. | architecture and one-event correlation trace |
| 6:55–7:30 | PARTH AJMERA | Close with measured evidence and limits: one prototype, allowlisted classes, fictional data, reviewed point consequences, no real billing/fines, no production-scale claim. | scorecard, model/QA manifest, Tier 3 roadmap |

The prepared environmental-wetting/mismatch records may come from deterministic seed or the permanently labelled demo simulation. State their source aloud. Never imply that a seeded or simulated event was the just-completed physical event.

### Compact five-minute version

Keep scenes 0:00–3:40, compress environmental wetting plus one human review to 45 seconds, show the offline/health proof in 25 seconds, and close. Remove badge/leaderboard, Tier 2, extra dispute navigation, and secondary charts. Do not remove the real physical event, local ML, durable edge, exact-once `+10`, or review-before-negative explanation.

## 5. System-admin simulation scene

Use simulation only after at least one real physical-ingress event has been shown or its pre-demo evidence has been explicitly disclosed.

Required visible behavior:

1. system-admin authenticates;
2. UI shows `DEMO SIMULATION` before confirmation;
3. request uses a fixed fictional identity and idempotency key;
4. processing joins after the physical-ingress boundary;
5. every timeline, event, ledger, notification, log, and Realtime update shows `SIMULATED`;
6. simulation cannot claim IR, sensor, firmware, live camera, or live model evidence;
7. audit shows actor, fixture, request, and outcome;
8. real-hardware proof counts and leaderboard metrics exclude it.

If any label disappears or the fixed identity changes, do not use simulation on stage.

## 6. Presenter script anchors

- **Opening:** “Waste may be segregated at home, but at collection the evidence and accountability disappear. SGV 2.0 makes that hand-off traceable.”
- **Hardware:** “The selected compartment triggers its own sensor path; fill is operational telemetry, and moisture is supporting evidence—not guilt.”
- **Local ML:** “This pinned model runs on our laptop without internet and recognizes only this published allowlist. Anything else becomes unknown and goes to review.”
- **Edge:** “The truck can keep working when mobile data disappears because FastAPI acknowledges only after SQLite has durable custody.”
- **Points:** “This balance is the sum of immutable entries. A qualifying event earns `+10` once, even if the network retries it.”
- **Fairness:** “The AI never subtracts points. It can only accept or flag; a named human reviewer must verify any `-10` or `-20`, and the citizen may dispute it.”
- **Environmental wetting:** “High moisture on a dry-looking item is uncertainty, not automatic misconduct. We hold it at zero until a human checks the context.”
- **Simulation:** “This is visibly simulated downstream recovery. It exercises the same post-ingest logic but is not hardware evidence.”
- **Close:** “We connect physical evidence, offline intelligence, fair governance, and municipal visibility without hiding uncertainty.”

## 7. Acceptance evidence before judging

Every artifact includes timestamp, commit SHA, environment, versions/hashes, owner, and pass/fail. BHUMIKA SINGH RAWAT maintains an offline evidence manifest.

| ID | Required artifact | Pass condition | Owner |
|---|---|---|---|
| DEMO-E01 | physical assembly and HIL capture | QR, independent IR, fill/moisture/GPS health, stable `eventId` | KRISHNA PANWAR |
| DEMO-E02 | signed ESP32-to-edge receipt | valid v1 message commits before `202`; secret/QR value redacted | ADITYA SILSWAL |
| DEMO-E03 | edge kill/restart plus WAN outage | acknowledged row, camera/model result, and queue survive/recover truthfully | ADITYA SILSWAL |
| DEMO-E04 | model manifest and offline run | correct hash/class map/license, WAN-off inference, supported/unknown tests | ADITYA SILSWAL + PARTH AJMERA |
| DEMO-E05 | latency report | >=30 warm trials; capture+inference p95 <=2 seconds or fallback selected | ADITYA SILSWAL |
| DEMO-E06 | rules/fairness report | accepted +10; environmental wetting `FLAGGED 0`; no automatic negative | AASHU JOSHI |
| DEMO-E07 | idempotency/concurrency report | retry/timeout creates one event/decision/ledger effect | AASHU JOSHI + BHUMIKA SINGH RAWAT |
| DEMO-E08 | review/dispute trace | -10/-20 impossible without authorized verified review; dispute/audit append-only | BHUMIKA SINGH RAWAT |
| DEMO-E09 | RLS/RBAC matrix | cross-household, cross-role, Realtime, and simulation access violations denied | BHUMIKA SINGH RAWAT |
| DEMO-E10 | seed reconciliation | 15–25 main events, 4–6 others, exact ledger sum, badges/aliases/source labels | BHUMIKA SINGH RAWAT |
| DEMO-E11 | simulation boundary | fixed identity, system-admin, post-ingest, idempotent/audited, permanently `SIMULATED` | AASHU JOSHI + YASHVARDHAN DOBHAL |
| DEMO-E12 | UI/accessibility/source truth | role flows work by keyboard/mobile and source/tier labels cannot be cropped | YASHVARDHAN DOBHAL |
| DEMO-E13 | end-to-end correlation | one real `eventId` found at firmware, edge, ML, cloud, rules, ledger, and UI | PARTH AJMERA |
| DEMO-E14 | fallback recording | timestamped same-commit F1–F4 recovery available offline | BHUMIKA SINGH RAWAT |

## 8. Pre-demo checklist

### T-24 hours — freeze

- [ ] Tier 1 G6 is green; optional Tier 2 G7 is green or previews are removed.
- [ ] Full CI, HIL, model/camera, offline/restart, idempotency, RLS, fairness, seed, and E2E evidence pass on the frozen commit.
- [ ] Hardware/camera/network complete a 30-minute soak.
- [ ] Model, class map, runtime, license decision, firmware, edge, schema, ruleset, seed, and web versions/hashes are recorded.
- [ ] Two deterministic resets and two timed rehearsals pass.
- [ ] Fallback video/evidence and presentation exist on two offline devices.

### T-2 hours — venue rehearsal

- [ ] Isolated LAN works with WAN disabled and addresses remain stable.
- [ ] Camera view contains no person/PII; model and recorded fallback work offline.
- [ ] Vercel/Supabase, sessions, redirect providers, and fallback accounts work.
- [ ] Prepared dry, environmental-wetting, mismatch, and unsupported objects/fixtures are ready.
- [ ] One live script and one forced-failure script finish inside the target time.
- [ ] No pending code, dependency, migration, model, class-map, or seed change exists.

### T-10 minutes — go/no-go

- [ ] Frozen commit/tag and evidence manifest are open.
- [ ] Seed counts/balance match the manifest.
- [ ] Edge queue and disk are healthy; staged queue state is documented.
- [ ] ESP32 and enabled components are current; degraded/no-fix states are explicit.
- [ ] Camera frame is fresh; model hash/class map match; fallback opens offline.
- [ ] All role profiles are authenticated and on their first tab.
- [ ] Simulation is disabled until its scene; Tier 2 labels are visible if previews remain.
- [ ] PARTH AJMERA records the chosen fallback level and says “go.”

## 9. Fallback ladder and exact disclosure

| Level | Trigger | Response | Presenter disclosure |
|---|---|---|---|
| F0 — full live | all paths healthy | run core | “This is the live end-to-end prototype.” |
| F1 — WAN/cloud down | hardware/edge/camera/model healthy | show real local flow and queue; use recorded cloud completion | “The physical and offline local path are live; this cloud completion is recorded from the frozen build.” |
| F2 — camera/model down | hardware/edge/cloud healthy | show health failure; use `RECORDED_ML` as `FLAGGED 0` pending review | “The sensing path is live; this model result is the disclosed recorded fallback and requires review.” |
| F3 — hardware down | edge/cloud/UI healthy | show diagnostic; use `RECORDED_HARDWARE` fixture or `SIMULATED` downstream event | “This input is recorded/simulated and is not counted as live hardware.” |
| F4 — app/auth down | local path healthy | show local event/inference/queue then timestamped full recording | “The hosted app is unavailable; this is verified evidence from the same release commit.” |
| F5 — total live failure | power/display/network unsafe | stop live system; use offline recording and printed proof | “We cannot safely run it here; these are the verified pre-demo results and limitations.” |

### Failure ownership

- PARTH AJMERA keeps speaking and selects the fallback.
- KRISHNA PANWAR alone handles hardware/power.
- ADITYA SILSWAL handles LAN, edge, camera, and model.
- AASHU JOSHI handles cloud API/rules.
- YASHVARDHAN DOBHAL handles browser/UI.
- BHUMIKA SINGH RAWAT opens evidence/fallback and records the incident.

Do not debug silently for more than 20 seconds.

## 10. Reset and repeatability

Use only the approved reset operation. It must verify the demo project, archive prior IDs, restore the deterministic fictional seed and starting balance, reset designated disposable events/edge rows, retain source labels, and print expected counts/hashes. It must never hand-edit a ledger balance, review, audit, or source field.

After a live event, compare:

- seed manifest starting balance vs ledger-derived balance;
- one new physical event ID;
- one accepted `+10` or one `FLAGGED 0` result;
- no duplicate ML observation or ledger effect;
- queue returned to its expected count;
- simulation and preview rows remain excluded from real proof.

## 11. Judge Q&A bank

| Question | Concise answer | Proof |
|---|---|---|
| “Can your model identify every type of waste?” | No. This build recognizes a frozen supported-class allowlist. Unsupported, conflicting, or low-score items become `UNKNOWN` and go to review. | class map/model manifest and unknown test |
| “Is confidence an accuracy probability?” | No. It is the model's score. We show LOW/MEDIUM/HIGH bands and do not call it calibrated probability. | UI label and threshold tests |
| “Can AI subtract points?” | No. Automation may award a valid `+10` or flag with `0`. Only an authorized verified human decision may append `-10/-20`. | rules and database constraint trace |
| “What about a dry item that is wet from rain?” | High moisture plus a dry visual class becomes environmental-wetting review with `0`, not punishment. A reviewer may clear it and award `+10`. | environmental-wetting scene |
| “What happens without internet?” | Sensing, camera capture, local inference, validation, and SQLite custody continue on the LAN. Cloud sync resumes with the same idempotency key. | live queue/restart evidence |
| “How do you prevent duplicate points?” | Message and domain IDs, payload hashes, transactions, and unique ledger constraints return the stored result for an exact retry. | duplicate/concurrency report |
| “Is Inject Test Event real hardware?” | No. It joins after physical ingest, is fixed-identity and permanently `SIMULATED`, and is excluded from hardware metrics. | simulation UI/audit |
| “Do you store camera images?” | Frames are not retained by default. We store bounded provenance/hashes; debug retention is controlled, synthetic/consented, and expires. | config and privacy test |
| “Are these citizens and penalties real?” | No. All citizens, points, reviews, and disputes are fictional prototype data; there is no real fine, payment, or government integration. | seed manifest and limitations |
| “Why FastAPI locally?” | It validates and durably stores the physical event even when WAN fails, and it safely orchestrates event-correlated local inference. | SQLite/restart trace |
| “Why HTTP rather than MQTT?” | Signed LAN HTTP/JSON is simpler to test and recover in 30 hours; MQTT is roadmap, not a hidden dependency. | frozen architecture/contract |
| “How do previews differ from real features?” | Every preview is frontend-seeded, permanently labelled, and has no dedicated database/API. | network/schema check and label |

## 12. Claims discipline

### Safe claims

- “The prototype demonstrates…”
- “This prepared item is in our frozen supported-class allowlist…”
- “On this demo laptop, our recorded p95 was…”
- “The model produced a score; deterministic rules and human review govern the value outcome…”
- “This event is live hardware,” “this result is recorded,” or “this card is simulated/preview,” according to the visible source.

### Prohibited claims

- “100% accurate,” “recognizes all waste,” “full confidence,” or “proves misconduct.”
- “AI fines citizens” or any claim that a sensor/model creates a negative value without review.
- “DPDP compliant,” “government approved,” “Aadhaar integrated,” or “legally issues fines.”
- “Works fully without internet” without clarifying that hosted cloud/UI wait for WAN.
- “Live GPS/model/hardware” while a recorded, no-fix, simulated, or preview source is active.
- “Real rewards, UPI, discounts, billing, or payments.”
- “Production ready,” “city scale,” or unsupported class/model-performance claims.

## 13. Rehearsal scorecard

Score `0 = failed`, `1 = disclosed fallback`, `2 = clean live`. Integrity/truth items cannot be waived by a high total.

| Dimension | Max | Release threshold |
|---|---:|---:|
| Clear problem and vehicle-first scope | 4 | 3 |
| Safe physical QR/dual-compartment sensing | 6 | 5, no safety failure |
| Durable edge and offline/restart recovery | 6 | 5 |
| Local camera/model allowlist, correlation, latency, fallback | 6 | 5, no privacy/license failure |
| Accepted exact-once `+10` | 6 | 5 |
| Environmental wetting and human review before `-10/-20` | 6 | 5, zero automatic negative |
| RLS/role separation and audit/dispute | 4 | 4 |
| Role UX, accessibility, and source/tier labels | 4 | 3 |
| Evidence, reset repeatability, and claims accuracy | 6 | 5 |
| Timing, handoffs, and Q&A | 4 | 3 |
| **Total** | **52** | **43**, with every mandatory truth/integrity condition met |

PARTH AJMERA declares `GO LIVE`, `GO WITH FALLBACK`, or `NO-GO LIVE — VERIFIED RECORDING`. A fallback decision does not authorize unlabelled simulation or last-minute scope changes.

## 14. Final close

“SGV 2.0 makes the moment of collection accountable. We demonstrated real compartment sensing, allowlisted offline vision, durable local custody, duplicate-safe `+10` rewards, human review before any negative points, and role-safe municipal visibility. It is a practical, honest path from a blind collection hand-off to a fair and auditable waste ecosystem.”
