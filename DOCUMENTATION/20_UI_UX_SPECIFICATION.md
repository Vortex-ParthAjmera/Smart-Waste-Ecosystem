> **PLAN & STRUCTURE LOCK — v2.0:** This approved scope, stack, repository structure, contracts, ownership map, truth-tier model, and delivery plan must not be changed by contributors or AI agents. Work only inside assigned paths. If a change is necessary, stop and submit a `CHANGE_REQUEST`; only PARTH AJMERA may approve it, followed by an ADR, contract/document updates, and team notification.

# UI/UX Specification

Owner: YASHVARDHAN DOBHAL
API/data reviewers: AASHU JOSHI and BHUMIKA SINGH RAWAT
Product and truth-label approval: PARTH AJMERA

Goal: a judge can understand what happened, what is live, what is simulated or previewed, and why a decision occurred without guessing.

## 1. Application topology

The product has **one Next.js application and one deployment** with three role experiences:

1. **Citizen:** identity QR, live result, history, EcoCredits, tier/badges, leaderboard, and own review/dispute information.
2. **Municipal:** QR scan, minimal citizen lookup, active disposal, live events, verification, and operational status.
3. **Developer/IoT:** restricted device, sensor, edge, camera/model, telemetry, logs, diagnostics, and test-event tools.

These are not three repositories, native apps, or deployments. Shared layout, auth, typed API client, provenance/truth mapper, error system, and design tokens must remain common.

## 2. Design principles

- Operational clarity before decoration.
- Every fact shows its applicable `eventSource`, `evidenceSource`, freshness, and rendered truth badge where confusion is possible.
- Status uses icon + text + color; never color alone.
- Every async surface has loading, empty, error, stale, offline, and unauthorized behavior.
- Processing, decision, and transport states are displayed separately.
- Sensor and ML evidence explain a decision but never use guilt language.
- Mobile-first citizen/scanner surfaces; desktop-first municipal/developer workspaces; all remain responsive.
- Tier 2 previews are visually polished but permanently and unambiguously labelled.
- No UI computes identity, authorization, points, tier, decision, or penalty authority.

## 3. Mandatory provenance and truth badges

| Context | Stored provenance | UI truth badge | Rule |
|---|---|---|---|
| Real hardware reading | `eventSource=HARDWARE` | `REAL` | Show `HARDWARE` separately; include last-seen age and quality |
| Live local camera/model observation | `evidenceSource=LOCAL_LIVE` | `REAL` | Show `LOCAL_LIVE` separately; include model version, confidence band, and observed time |
| Recorded hardware fallback | `eventSource=RECORDED_HARDWARE` | `RECORDED` | Show `RECORDED_HARDWARE` separately; never use “live” nearby |
| Recorded ML fallback | `evidenceSource=RECORDED_ML` | `RECORDED` | Show `RECORDED_ML` separately; never animate or phrase it as a current capture |
| Injected test event | `eventSource=SIMULATED`; `evidenceSource=SIMULATED` when ML evidence is supplied | `SIMULATED` | Persist provenance through event, ledger/audit, notification, and every card/detail |
| Persisted deterministic Tier 1 demo record | `eventSource=SEEDED`; ML/evidence source is `SEEDED` when supplied | `PREVIEW/SEEDED` | Never present fictional seeded history as a live event |
| Tier 2 frontend fixture | none; it never enters the database | `PREVIEW/SEEDED` | Present in title/header, not removable by the user, and make no feature API/database write |

Badges must remain visible at mobile/desktop widths, in screenshots, and on detail dialogs. Color alone, a tooltip, footer-only disclosure, or a dismissible label is insufficient.

## 4. Navigation

### Citizen experience

`Overview · My QR · Live Disposal · History · EcoCredits · Badges & Tier · Leaderboard · Reviews & Disputes · Profile`

Tier 2 entry, separated and labelled: `Truck & ETA Preview`.

### Municipal experience

`Scan QR · Active Disposal · Live Events · Citizen Lookup · Verification · Device Status · Audit`

Tier 2 entries, grouped under `Previews`: `Fleet Map · Zones · Reports · Collection Journey`.

### Developer/IoT experience

`System Health · Devices · Raw Telemetry · ML Monitor · Edge Queue · Safe Logs · Diagnostics · Inject Test Event`

Only an authorized developer/system-admin session may enter this experience. Hiding the navigation item is not authorization; server routes enforce it.

## 5. Citizen experience

### Overview

Show:

- ledger-derived EcoCredit balance;
- current `BRONZE`/`SILVER`/`GOLD`/`PLATINUM` tier;
- latest event result, UI truth badge, and relevant event/ML provenance;
- latest `+10`, `0`, or authorized reviewed negative entry with plain-language reason;
- one earned seeded badge when applicable;
- pending review/dispute state;
- primary action to open the latest event explanation.

Never gamify a violation, shame a household, or render a loading/failed balance as zero.

### My QR

- Show an opaque QR and safe short identifier only.
- Do not embed/display name, phone, address, balance, Aadhaar number, or role in the QR.
- Provide accessible text explaining that municipal staff scan it to begin a disposal session.
- Expired/revoked/unavailable state blocks use and gives a safe retry/help path.
- Screenshots and logs must not expose any secret or raw lookup value beyond the approved display suffix.

### Live disposal

Present three aligned timelines, never one overloaded progress bar:

```text
Processing: DISPOSAL_STARTED -> SENSOR_CAPTURED -> ML_PENDING -> ... -> COMPLETED
Decision:   CAPTURED -> EVALUATING -> ACCEPTED | FLAGGED -> review outcome
Transport:  QUEUED_LOCALLY -> PENDING -> IN_FLIGHT -> ACKED
```

Show selected compartment, evidence quality, friendly ML observation when authorized for citizen display, current result, point effect, applicable provenance, truth badge, and freshness. `QUEUED_LOCALLY` must say “Saved on the local system; cloud result pending,” never “Accepted.”

### History and detail

History rows show date/time, selected compartment, friendly result, point effect, UI truth badge, relevant provenance, and review state. Detail adds event timeline, evidence summary, applied rule version, reason codes translated to plain language, ledger reference, and dispute action when eligible. Raw payload/model hashes stay in developer/reviewer views.

### EcoCredits, badges, tiers, and leaderboard

- Balance is derived from append-only entries.
- `+10` is shown only for a qualifying accepted/review-accepted event.
- `-10`/`-20` is shown only with an authorized verified-violation reason and review link.
- `FLAGGED` shows immediate `0` and “Needs human review,” not a negative balance animation.
- Ledger row includes amount, reason, related event, propagated event provenance, truth badge, status, and time.
- Tier boundaries and “points to next tier” use the server projection.
- Badge card includes name, reason, awarded date, and seeded/demo disclosure where applicable.
- Leaderboard uses fictional opt-in aliases only; it never reveals household ID, legal name, address, phone, or exact event evidence.

## 6. Municipal experience

### QR scan and citizen lookup

The mobile scanner has clear camera-permission, scanning, validating, invalid/revoked, network, and success states. Successful validation shows only the minimum safe citizen/household summary and an explicit action to begin the session. No arbitrary household browsing is available from the scanner.

### Active disposal

Normal municipal mode shows recent events, open reviews, and operational warnings. A real session switches to a focused active state showing:

- opaque citizen/display suffix and selected compartment;
- wet/dry IR trigger;
- moisture and both fill-sensor qualities;
- GPS/no-fix and device heartbeat;
- edge durable receipt and cloud state;
- camera/model state, friendly label, confidence band, ML/evidence source, and truth badge;
- deterministic decision and point effect.

Completion, failure, or configured timeout returns to normal mode and clears session-only live data. Do not leave an old frame or sensor reading presented as current.

### Live events and verification

Live feed is initially loaded through authorized REST and updated through authorized Realtime invalidation/refetch or polling fallback. Every row has `eventId` suffix, time, event source, relevant ML/evidence source, truth badge, processing/decision/transport states, and point effect.

Verification uses a two-column desktop layout:

- left: ordered queue with age, selected/detected category, reason, event source, truth badge, and evidence health;
- right: citizen-safe summary, event timeline, sensor calibration/quality, ML label/model/confidence/evidence source, rule version, and prior review history.

Actions are `Accept submission` and `Confirm verified violation`. Confirmation requires reason, dialog, actor acknowledgement, and displays the configured `-10`/`-20` append-only effect. No direct “deduct points” control exists.

## 7. Developer/IoT experience

This restricted experience is the operational truth console, not a public fourth product.

### System health

Show each boundary separately:

- ESP32 and Wi-Fi/LAN;
- wet IR and dry IR;
- wet ultrasonic and dry ultrasonic;
- dry-path moisture;
- GPS/fix quality;
- FastAPI, SQLite WAL, sync worker, cloud reachability;
- phone/laptop camera capture;
- local model artifact/hash/class map/runtime;
- Supabase/API/Realtime or polling state.

Each component shows `OK`, `DEGRADED`, `MISSING`, `FAILED`, or `UNKNOWN`, plus applicable observation provenance, last-seen age, version, and safe reason. Say “Dry IR has not reported for 42 s,” not “IoT failed.”

### Raw telemetry and ML monitor

- Raw sensor readings are developer-only and display unit, quality, calibration version, timestamps, and the parent event's `eventSource`.
- ML card displays friendly label and technical label, mapped category, confidence number and `LOW/MEDIUM/HIGH`, model/version/hash suffix, capture/inference times, `evidenceSource`, and the mapped UI truth badge.
- Confidence is called a model score, not a calibrated probability.
- No detection, unsupported class, conflicting multiple objects, stale frame, timeout, and hash mismatch have distinct states.
- Raw images are not displayed from persisted storage because frames are not retained by default.

### Edge queue, logs, and diagnostics

Show `PENDING`, `IN_FLIGHT`, `ACKED`, `AUTH_BLOCKED`, and `DEAD_LETTER` counts, last successful sync, next retry, and safe error code. Logs are bounded, structured, redacted, correlated by `eventId`, and never reveal tokens, full QR values, PII, or camera credentials.

### Inject Test Event

- Button is visible only to authorized developer/system-admin users.
- Disabled state explains when `DEMO_SIMULATION_ENABLED` is false.
- Confirmation states that physical QR, IR, sensors, camera, and firmware will **not** be exercised.
- Fixture chooser contains approved deterministic fictional scenarios only.
- Result persists with `eventSource=SIMULATED`, uses `evidenceSource=SIMULATED` when ML evidence is supplied, renders the UI truth badge `SIMULATED`, and links to the normal downstream event/decision/ledger/UI trace.
- Rate-limit, conflict, and unavailable responses have explicit UI states; repeated clicking never creates repeated value effects.

## 8. Tier 2 preview surfaces

Tier 2 work begins only after the Tier 1 freeze gate. All preview content lives in the approved frontend fixture path and must not cause a feature-specific network request.

| Preview | Allowed behavior | Forbidden behavior |
|---|---|---|
| Truck route/map/ETA | animate a frozen route and show static distance/ETA | live GPS subscription, geofencing, `truck_locations` endpoint/table |
| Multi-truck/multi-zone | render two or three fictional fixture cards | fleet/zone persistence or CRUD |
| Bill-discount calculator | display preview percentage derived client-side from the real point total and a fixed labelled preview rule | billing/discount table, invoice mutation, claim of municipal approval |
| Full reports/analytics | render precomputed charts from a frozen seeded fixture | live aggregation endpoint or query marketed as live analytics |
| Collection journey stepper | animate a fixture through scheduled/on-route/near/collection/completed | GPS-driven state or dispatch workflow |

Every preview header includes `PREVIEW/SEEDED` plus “Roadmap interface — not connected to a live backend.” A Tier 2 fixture stays in frontend memory/static assets and never creates a database row. If a judge asks, the presenter points to the Tier 1 evidence instead of implying otherwise.

## 9. Friendly ML language

| Technical state | User-facing label |
|---|---|
| supported `plastic`-type dry allowlist class | Approved manifest display name, such as “Plastic item” |
| supported wet allowlist class | Approved manifest display name, such as “Food/organic item” only if the model truly supports it |
| unsupported class | “Unknown waste type” |
| confidence `<0.60` | “Low-confidence result — needs review” |
| multiple conflicting categories | “Multiple/conflicting items detected — needs review” |
| `ML_UNAVAILABLE` | “Camera classification unavailable — needs review” |
| `ENVIRONMENTAL_WETTING_SUSPECTED` | “Dry item detected with high moisture — environmental wetting needs review” |

Do not invent labels like `plastic_wrapper` or `food_waste` unless the approved class map contains them. Do not show “AI correct/incorrect” as the final authority.

## 10. Visual and interaction direction

- Civic operations aesthetic: calm off-white/slate surfaces, deep green primary, amber warning, red only for physical danger or confirmed adverse state.
- Use clear numeric typography for fill, moisture, confidence, points, queue counts, and freshness.
- Use one shared badge/status component so truth labels cannot drift between screens.
- Dense developer/municipal tables remain readable; rounded cards are used sparingly.
- Motion never implies liveness. Tier 2 animation retains its preview badge.
- Respect reduced motion; provide a static alternative for animated previews.

## 11. Accessibility acceptance

- Keyboard reaches every action, scanner fallback, dialog, filter, and fixture selector; focus is visible.
- Forms and camera permissions have labels, descriptions, inline errors, and an error summary.
- Minimum touch target is approximately 44 px on citizen/municipal mobile surfaces.
- Contrast meets WCAG AA for normal text and status labels.
- Tables have headers; charts and maps have text/table alternatives.
- Live changes use non-disruptive announcements; safety alerts may be assertive.
- Provenance/truth-tier meaning is available as text, not color, icon, hover, or animation alone.

## 12. Required PR evidence

YASHVARDHAN DOBHAL attaches:

- desktop and mobile screenshots for every touched surface;
- loading, empty, invalid, unauthorized, error, stale/offline, and fallback states where applicable;
- event/ML provenance and UI truth/tier badges at the smallest supported viewport;
- browser network evidence that Tier 2 previews make no feature API call;
- scanner permission/invalid QR states for QR work;
- no/multiple/low-confidence/model-unavailable cards for ML work;
- disabled/authorized/replayed states for simulation work;
- keyboard and accessible-name evidence for critical actions.

Cursor, Freebuff, or another coding agent may implement only the assigned issue and paths. It may not redesign navigation, remove truth labels, create a Tier 2 backend, split the app into deployments, or change contract/state vocabulary.
