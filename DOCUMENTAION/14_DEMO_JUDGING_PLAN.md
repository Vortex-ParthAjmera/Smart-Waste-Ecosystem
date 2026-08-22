> **PLAN & STRUCTURE LOCK — v1.0:** This approved scope, stack, repository structure, contracts, ownership map, and delivery plan must not be changed by contributors or AI agents. Work only inside the assigned paths. If a change is necessary, stop and submit a `CHANGE_REQUEST`; only PARTH AJMERA may approve it, followed by an ADR and team notification.

# SGV 2.0 Demo and Judging Plan

| Field | Value |
|---|---|
| Demo owner and final go/no-go | PARTH AJMERA |
| Hardware leads | KRISHNA PANWAR and ADITYA SILSWAL |
| Web/UI lead | YASHVARDHAN DOBHAL |
| Cloud/API/data lead | AASHU JOSHI |
| QA, evidence, and fallback lead | BHUMIKA SINGH RAWAT |
| Core story length | 7 minutes |
| Safe setup/reset window | 10 minutes before judging |
| Demo identities | Household `HH-10452`, Vehicle `SGV-002`, provisioned demo device |
| Product claim | Real ESP32 collection evidence, resilient local edge, auditable EcoCredits, human-reviewed penalties, live municipal visibility |

## 1. What judges must remember

At the end, a judge should be able to repeat three ideas:

1. **One accountable hand-off:** SGV 2.0 links a household, vehicle, operator, waste category, sensor evidence, GPS, and outcome in one event.
2. **Behavior change with fairness:** correct segregation earns auditable EcoCredits; uncertain evidence pauses for a human, so a noisy sensor never becomes an automatic fine.
3. **Built for field reality:** the ESP32 can keep collecting through a local FastAPI/SQLite gateway when the internet fails and reconcile exactly once after reconnecting.

Do not lead with frameworks. Lead with the broken accountability loop, then reveal the architecture only as proof that the solution is feasible.

## 2. Judging thesis

| Likely criterion | SGV 2.0 proof | Concrete artifact |
|---|---|---|
| Problem relevance | Anonymous, mixed, untraceable collection becomes a household-linked event | Before/after opening visual and event provenance screen |
| Innovation | A vehicle-side IoT hand-off combines edge resilience, incentives, and human-in-the-loop governance | Real ESP32 capture; edge pending queue; accepted vs flagged paths |
| Technical depth | Versioned contracts span firmware, FastAPI/SQLite edge, Next.js, Supabase, and pure rules | Correlation trace for one event and architecture backup slide |
| Feasibility | Uses low-cost hardware, local LAN, deterministic rules, and cloud services; no speculative AI dependency | Working hardware slice and bill of materials/stack backup |
| Impact | Improves segregation incentives, fairness, fleet visibility, and auditable municipal operations | EcoCredit ledger, review queue, fleet map, analytics card |
| Scalability | Device/vehicle IDs, idempotent ingestion, shared contracts, multi-ward data model | Device provisioning view and versioned event payload |
| Sustainability | Better source segregation and fewer blind/overflow collections; claims remain prototype-oriented | Outcome/KPI card with measured demo evidence vs pilot target |
| User experience | Citizen, operator, and admin each see only what they need | Three role views, keyboard/mobile-ready citizen screen |
| Trust and safety | Synthetic data, RBAC/RLS, append-only audit, no auto-penalty | Review/audit evidence and negative-access test badge |
| Completeness | Happy path, adverse path, offline recovery, tracking, and limitations are demonstrated | Demo evidence manifest and traceability coverage |

## 3. Demo environment and fixed dataset

### 3.1 Physical layout

- Left: scaled SGV intake/compartment prototype with ESP32, RFID reader or QR fallback, motion/intake sensor, moisture sensor, load cell if calibrated, status LED/display, and safely secured wiring.
- Center: edge laptop on the local LAN, with an operator portal tab and a small gateway health/queue view.
- Right: second screen or split-screen showing citizen and admin portals.
- Keep exposed electronics behind a clear barrier. Do not move, rewire, or power-cycle the hardware while presenting unless the fallback script explicitly calls for it.

### 3.2 Seed records

| Record | Fixed value | Purpose |
|---|---|---|
| Household | `HH-10452`, display name Aarav, synthetic Ward 12 profile | Memorable citizen story |
| Identifier | Active demo RFID UID plus printed QR fallback | Continuity if reader fails |
| Vehicle | `SGV-002` | Common ID across hardware, gateway, and portals |
| Operator | Seeded operator account assigned to `SGV-002` | Least-privilege operator flow |
| Admin | Seeded municipal reviewer account | Flagged-case decision |
| Starting EcoCredits | `1,250` | Visible exact-once change to `1,300` using a 50-credit rule |
| Accepted event | Clean state generated live | Positive reinforcement story |
| Flagged event | Resettable seed or live mismatch | Human-review story |
| Simulated penalty | INR 100, created only after review | Fair enforcement; explicitly not real billing |
| GPS route | Short local route near the demo venue or clearly labeled fallback trace | Live/stale tracking proof |

All names, addresses, tags, and values are synthetic. The presenter must say this if asked.

### 3.3 Browser tabs, in order

1. Opening problem/value slide or landing page.
2. Operator `/operator` session screen.
3. Edge health/queue view.
4. Citizen `/citizen` dashboard for `HH-10452`.
5. Admin `/admin` review queue.
6. Admin fleet map/event detail/audit trace.
7. Backup architecture, evidence, impact, and roadmap slides.

Use separate browser profiles for roles. Never log out and log back in on stage.

## 4. Seven-minute core run-of-show

| Time | Lead | Action and spoken point | Visible proof | Requirements proved |
|---:|---|---|---|---|
| 0:00-0:35 | PARTH AJMERA | State the broken loop: household segregation is invisible at hand-off, citizens lack feedback, and municipalities lack traceability. Introduce SGV 2.0 as the accountable collection point. | One-line system chain | OUT-01, OUT-02, OUT-06 |
| 0:35-1:05 | PARTH AJMERA | Show the three actors and the vehicle-first boundary. Say explicitly: this is not a household smart bin and not an autonomous sorter. | Citizen/operator/admin overview | PRD scope boundary |
| 1:05-2:10 | KRISHNA PANWAR + ADITYA SILSWAL | Tap Aarav's RFID (or QR fallback), choose wet waste, place the prepared demo sample, and show ESP32 intake/moisture/weight status. | Physical response plus operator session ID | FR-ID-002, FR-COL-001..006 |
| 2:10-2:40 | ADITYA SILSWAL | Point to gateway acknowledgement and persisted event. Briefly disconnect internet after local capture to show `PENDING`; local collection remains usable. | Queue count, online/offline health | FR-EDGE-001..006, NFR-REL-002 |
| 2:40-3:25 | AASHU JOSHI | Reconnect. Show the same event ID become `ACKED` once, then the pure rules explanation returns `ACCEPTED`. | Event trace and rule version/reason | FR-RULE-001..003, FR-AUD-002 |
| 3:25-4:00 | YASHVARDHAN DOBHAL | Switch to Aarav: EcoCredits move from 1,250 to 1,300 exactly once and the collection appears in history. Refresh/replay without another award. | Citizen ledger/event detail | FR-ECO-001..004, FR-CIT-001 |
| 4:00-4:55 | YASHVARDHAN DOBHAL + BHUMIKA SINGH RAWAT | Open the prepared/live mismatch. Show `FLAGGED` and zero penalty. Admin reviews evidence, records a reason, and confirms a simulated violation. | Flagged queue, decision modal, audit | FR-RULE-002, FR-REV-001..002 |
| 4:55-5:25 | BHUMIKA SINGH RAWAT | Show the simulated penalty and citizen dispute action. Emphasize that the original record is retained and every later action is append-only. | Citizen penalty/dispute and audit trail | FR-REV-003, FR-AUD-001 |
| 5:25-6:05 | AASHU JOSHI | Show `SGV-002` on the fleet map with last-update age and fill/device health; pause the feed or show prepared stale state. | Live-to-stale truthful state | FR-TRK-001..003, OUT-05 |
| 6:05-6:35 | PARTH AJMERA | Summarize architecture in one sentence: ESP32 -> LAN FastAPI/SQLite edge -> authenticated cloud -> role portals. Show scale path by adding provisioned vehicles, not changing architecture. | Architecture/data-flow slide | Fixed solution baseline, NFR-MNT-001 |
| 6:35-7:00 | PARTH AJMERA | Close with measured proof and honest limits: real prototype hardware and offline sync; simulated billing and synthetic data; production AI/route optimization are future scope. | Scorecard: events, no duplicates, evidence coverage | G4, NFR-DEM-001 |

If only five minutes are available, remove the deliberate stale-location moment and shorten the architecture/impact close; never remove the accepted, flagged/human-review, or offline proof.

Optional after the scored core (maximum 45 seconds): import a synthetic `MANUAL_COLAB` result, show the provenance-labelled admin evidence card, and state that it cannot change the decision or value ledger. If live inference hesitates, use `RECORDED_ML` or skip immediately.

## 5. Presenter script anchors

Use these short sentences; do not memorize a long speech.

- **Opening:** "Waste may be segregated at home, but at collection the evidence and accountability disappear. SGV 2.0 makes that hand-off traceable."
- **Hardware:** "The citizen still segregates. Our vehicle identifies the household and captures multiple supporting signals; it does not pretend one moisture reading is perfect truth."
- **Edge:** "The truck should not stop because mobile data disappears. The local gateway acknowledges only after durable storage, then synchronizes idempotently."
- **EcoCredits:** "This balance is not a number we edit. It is the sum of append-only ledger entries, and this event can award only once."
- **Review:** "Notice there is still no fine. A mismatch creates a review case; only an authorized human can confirm a simulated violation."
- **Tracking:** "A map marker is trustworthy only with freshness. When updates stop, SGV 2.0 says stale instead of pretending the vehicle is live."
- **Close:** "We connect behavior, edge hardware, fair governance, and municipal visibility in one buildable system."

## 6. Acceptance evidence to capture before judging

Every evidence item gets a timestamp, commit SHA, test environment, owner, and pass/fail result. BHUMIKA SINGH RAWAT maintains the offline evidence folder/manifest; evidence is not invented on stage.

| Evidence ID | Required artifact | Pass condition | Owner |
|---|---|---|---|
| DEMO-E01 | 30-60 second real hardware capture | RFID/QR, intake evidence, sensor validity, and event ID are legible | KRISHNA PANWAR |
| DEMO-E02 | ESP32-to-edge contract log, redacted | Valid v1 payload accepted; secret absent | ADITYA SILSWAL |
| DEMO-E03 | Edge process-kill/restart recording | Acknowledged queued event survives restart | ADITYA SILSWAL |
| DEMO-E04 | Offline reconciliation report | >= 20 unique local events become exactly 20 cloud events with zero duplicates | AASHU JOSHI + BHUMIKA SINGH RAWAT |
| DEMO-E05 | Rules-engine test report | All wet/dry/reject, invalid-data, and safety branches pass | AASHU JOSHI |
| DEMO-E06 | EcoCredit concurrency/idempotency report | Duplicate delivery produces one award | AASHU JOSHI |
| DEMO-E07 | Review/penalty database trace | Penalty cannot exist without authorized recorded review | BHUMIKA SINGH RAWAT |
| DEMO-E08 | RLS/RBAC negative test matrix | Citizen cannot access another household; operator cannot review; anonymous is rejected | BHUMIKA SINGH RAWAT |
| DEMO-E09 | Live/stale tracking capture | Location update age is shown and threshold changes state correctly | YASHVARDHAN DOBHAL |
| DEMO-E10 | Accessibility smoke report | Core controls keyboard-operable; no critical automated finding | YASHVARDHAN DOBHAL + BHUMIKA SINGH RAWAT |
| DEMO-E11 | End-to-end correlation trace | One event ID is found at firmware receipt, edge queue, cloud event, rule result, and ledger/review | PARTH AJMERA |
| DEMO-E12 | Requirements coverage export | Every P0 requirement is `PASS` or has an approved waiver; no unowned gap | PARTH AJMERA + BHUMIKA SINGH RAWAT |

## 7. Pre-demo checklist

### T-24 hours: freeze

- [ ] PARTH AJMERA declares the demo commit and prohibits unapproved dependency, schema, contract, or UI-flow changes.
- [ ] CI, build, firmware tests, edge tests, integration tests, and critical E2E tests pass on the frozen commit.
- [ ] Hardware is mounted, labeled, powered safely, and run for a 30-minute soak.
- [ ] Sensor calibration values and firmware version are recorded.
- [ ] Offline queue/restart/reconnect and duplicate replay are tested on the actual demo laptop.
- [ ] Demo seed/reset script is tested twice from a clean state.
- [ ] Screenshots, local video, static route trace, and evidence manifest are copied to two offline devices.

### T-2 hours: venue rehearsal

- [ ] Confirm local hotspot/LAN works without venue internet.
- [ ] Reserve/record edge gateway address and confirm ESP32 reconnect behavior.
- [ ] Confirm Vercel/Supabase reachability, credentials, browser profiles, and system clock.
- [ ] Run the seven-minute script with a stopwatch; target 6:30-6:45 to retain recovery time.
- [ ] Reset EcoCredit starting balance, review queue, disputes, GPS route, and edge SQLite demo state using the approved reset procedure.
- [ ] Verify RFID tag and printed QR backup; place a spare USB cable/power bank and prepared waste samples.

### T-10 minutes: go/no-go

- [ ] Frozen commit SHA displayed in evidence manifest.
- [ ] ESP32 heartbeat `ONLINE`; enabled sensors have known validity/calibration state.
- [ ] Edge shows cloud reachable, `pending=0`, `dead_letter=0`, and enough disk space.
- [ ] `HH-10452` shows exactly 1,250 EcoCredits and the prepared flagged case is in the expected state.
- [ ] Operator, citizen, and admin browser sessions are authenticated and on their first screens.
- [ ] Live GPS or the explicitly labeled fallback route is ready.
- [ ] Backup video opens locally with audio muted by default.
- [ ] PARTH AJMERA assigns the active fallback level and says "go".

## 8. Demo fallback ladder

Fallbacks preserve honesty and the same product narrative. Never claim a recording or simulated stream is live.

| Level | Trigger | Response | Exact disclosure |
|---|---|---|---|
| F0 - Full live | Hardware, LAN, edge, and cloud healthy | Run the core script | "This is the live end-to-end prototype." |
| F1 - Hardware live, cloud unavailable | Venue internet/cloud fails but local LAN works | Show live ESP32 -> edge, offline queue/restart; use local recording/screens for cloud outcomes | "The hardware and offline path are live; these cloud screens are a recorded run from the frozen build." |
| F2 - Hardware input unavailable | RFID/sensor/GPS fails but gateway/web works | Use signed, pre-captured v1 fixtures through edge; show hardware diagnostic and prior HIL evidence | "The hardware fault is visible. We are replaying a captured device payload through the same validated contract." |
| F3 - App/cloud unavailable | Web deployment or auth fails | Play the local end-to-end video and inspect offline evidence/test report | "The service is unavailable at the venue; this is a timestamped run of the same commit, followed by its evidence." |
| F4 - Total presentation failure | Power/display/network blocks all live systems | Deliver three-minute verbal pitch with printed architecture/results and optional battery-powered hardware indication | "We cannot safely run the system here; these are the verified pre-demo results and limitations." |

### Failure ownership during the demo

- PARTH AJMERA keeps speaking and decides whether to switch levels.
- KRISHNA PANWAR touches physical wiring/power only.
- ADITYA SILSWAL diagnoses firmware/edge/LAN only.
- AASHU JOSHI diagnoses API/Supabase only.
- YASHVARDHAN DOBHAL controls browser/UI only.
- BHUMIKA SINGH RAWAT opens evidence/video and records the incident.

No more than 20 seconds may be spent silently debugging on stage.

## 9. Reset and repeatability protocol

The approved reset operation must be scripted under `scripts/`; manual database editing immediately before judging is prohibited.

Reset must:

1. Verify the environment is the demo project, not any future real environment.
2. Archive the prior run's event IDs for evidence.
3. Restore the synthetic household and role accounts.
4. Restore EcoCredit ledger/balance to the documented seed state through a safe seed transaction.
5. Restore one unresolved flagged case and remove only designated disposable demo-run records.
6. Restore `SGV-002` status and route fixture.
7. Clear/recreate only the designated edge demo queue with an explicit confirmation flag.
8. Print a manifest of final counts and hashes so BHUMIKA SINGH RAWAT can compare expected state.

Run the reset no more than necessary. Destructive production-wide commands and broad table truncation are forbidden.

## 10. Judge Q&A bank

| Question | Concise answer | Proof to open if requested |
|---|---|---|
| "Can moisture really classify waste?" | No single sensor is treated as truth. Moisture, intake, weight validity, declared category, and data quality feed explainable rules; uncertainty is reviewed by a human. | Flagged event reason and rules tests |
| "Why not AI?" | The core solves accountability with explainable evidence. Our optional labelled notebook demonstrates the integration shape, but an unvalidated model cannot decide guilt; production camera AI needs representative data, evaluation, monitoring, privacy, and licensing work. | Optional ML evidence card and limitations |
| "What happens without internet?" | ESP32 uses the local LAN; FastAPI validates and SQLite persists before acknowledgement. It later retries with stable idempotency keys. | Live queue plus DEMO-E03/E04 |
| "How do you avoid duplicate rewards?" | Event and ledger idempotency are enforced at the database boundary; retries return the existing canonical result. | Concurrency test and ledger row |
| "Can a sensor fine someone?" | No. Automation can accept or flag only. A role-authorized human records evidence and reason before a simulated penalty can exist. | Review trace and constraint test |
| "Are EcoCredits real money?" | In v1 they are auditable prototype points. Redemption and municipal billing are simulated; real payouts require an authorized provider and policy review. | Ledger UI and limitation statement |
| "How is citizen privacy protected?" | Synthetic demo data, minimum operator disclosure, RLS/server role checks, precise GPS limited by role, and append-only audits. | Role comparison and negative-access matrix |
| "How does this scale?" | Each device and vehicle is provisioned, contracts are versioned, sync is idempotent and concurrently processed, and the cloud schema is multi-vehicle/ward. Production capacity testing remains future work. | Device/event IDs and architecture slide |
| "Why FastAPI locally and Next.js in cloud?" | They solve different constraints: FastAPI/Pydantic gives a small reliable hardware gateway with SQLite; Next.js unifies portals and cloud APIs. JSON contracts keep the boundary explicit. | Contract parity test |
| "Why HTTP instead of MQTT?" | LAN HTTP/JSON is easier to integrate, test, and recover within the hackathon. MQTT remains a compatible stretch transport, not an MVP dependency. | Edge endpoint and scope table |
| "Is this a smart bin?" | No. It is a smart garbage vehicle collection platform. Households segregate waste; identity and evidence are captured at the vehicle hand-off. | Product boundary slide |
| "What would a pilot require?" | Municipal policy approval, field calibration, DPIA/privacy and retention decisions, stronger device provisioning, operational support, security testing, and authorized billing/reward integrations. | Risk register/roadmap |

## 11. Claims discipline

### Safe claims

- "The prototype demonstrates..."
- "Our test on the demo network measured..."
- "The architecture is designed to..."
- "The system records supporting evidence and routes uncertainty to a human..."

### Prohibited claims without external proof

- "100% accurate waste detection," "eliminates mixed waste," or "guarantees compliance."
- "DPDP compliant," "government approved," or "legally issues fines."
- "Production-ready for every municipality" or unmeasured city-scale throughput.
- "AI-powered" when the v1 decision is deterministic rules.
- "Live GPS" when a prerecorded/simulated fallback is active.
- "Real payments/billing" for the simulated EcoCredit and penalty flows.

## 12. Rehearsal scorecard and release decision

Score each item `0 = failed`, `1 = works with fallback`, `2 = clean live`. P0 safety/truth items cannot be waived merely by a high total.

| Dimension | Max | Release threshold |
|---|---:|---:|
| Clear problem and vehicle-first scope | 4 | 3 |
| Hardware capture and physical safety | 6 | 4, with no safety failure |
| Offline durability and exact-once reconciliation | 6 | 5 |
| Accepted/EcoCredit journey | 6 | 5 |
| Flagged/human-review/dispute journey | 6 | 5, with zero auto-penalty |
| Tracking freshness truthfulness | 4 | 3 |
| Portal usability and role separation | 4 | 3 |
| Evidence availability and claims accuracy | 6 | 5 |
| Timing, hand-offs, and Q&A | 4 | 3 |
| **Total** | **46** | **36** |

PARTH AJMERA declares `GO`, `GO WITH FALLBACK F1/F2`, or `NO-GO`. A no-go means the team presents the verified fallback; it does not authorize last-minute scope or structure changes.

## 13. Final 20-second close

"SGV 2.0 makes the moment of collection accountable. We demonstrated real edge hardware, offline-safe synchronization, exactly-once EcoCredits, human review before a simulated penalty, and truthful fleet tracking. It is a practical path from a blind garbage truck to a fair, connected municipal service - without pretending that one sensor or an unvalidated AI model can make legal decisions."
