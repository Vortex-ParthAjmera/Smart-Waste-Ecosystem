> **PLAN & STRUCTURE LOCK — v1.0:** This approved scope, stack, repository structure, contracts, ownership map, and delivery plan must not be changed by contributors or AI agents. Work only inside the assigned paths. If a change is necessary, stop and submit a `CHANGE_REQUEST`; only PARTH AJMERA may approve it, followed by an ADR and team notification.

# UI/UX Specification

Owner: YASHVARDHAN DOBHAL  
Data/acceptance reviewers: AASHU JOSHI and BHUMIKA SINGH RAWAT  
Goal: a judge can understand live state, fairness, and impact without explanation, while every actor sees only what they need.

## Design principles

- Operational clarity before decoration.
- Status uses icon + text + color; never color alone.
- Real, recorded, and simulated data are visibly labelled.
- Every async surface has loading, empty, error, stale, and offline states.
- Sensor evidence explains a decision but does not imply certainty.
- Mobile-first citizen pages; desktop-first admin/operator dashboards; both responsive.
- Use one shared spacing, color, typography, table, form, dialog, and feedback system.

## Navigation

### Citizen

`Overview · Collections · EcoCredits · Penalties & Bills · Disputes · Vehicle Tracker · Profile`

### Operator

`Collection · Device Health · Pending Sync · Vehicle Status`

### Admin

`Overview · Live Fleet · Collections · Verification · Citizens · Vehicles & Devices · IoT Control · EcoCredits · Penalties & Disputes · Rules · Reports · Audit`

## Citizen overview

Top summary: EcoCredit balance, last collection result, pending dispute/penalty, assigned vehicle state. The primary action opens the latest collection explanation. Do not gamify penalties or shame households.

Collection detail displays event time/category/vehicle, source label, evidence health, decision and plain-language explanation, reward ledger reference, review state, and dispute action when eligible. Raw technical payload stays in an admin-only expandable audit view.

## Operator collection screen

One linear workflow:

```text
READY → IDENTIFIER → HOUSEHOLD CONFIRMATION → CATEGORY → INTAKE/SENSORS → EDGE STORED → CLOUD RESULT
```

The screen must always show device online/degraded, network online/offline, pending sync count, active vehicle, and emergency alerts. `EDGE STORED` is not displayed as `ACCEPTED`; final status comes from cloud processing.

## Admin overview

Above-the-fold dashboard contains:

- Collections today and accepted/flagged counts.
- Verification backlog.
- EcoCredits issued and verified penalties (separate units).
- Vehicles online/stale/offline.
- Pending edge sync and critical safety/device alerts.
- Ward compliance trend labelled as prototype data.

Use one map plus a table fallback, not decorative charts everywhere. Clicking a metric opens the filtered operational list.

### Normal and active states

Normal dashboards prioritize KPIs, recent events, alerts, fleet freshness, and trends. During an active collection, the operator/admin surface temporarily prioritizes the citizen-safe identifier, selected compartment, IR intake phase, current sensor qualities, edge/cloud state, and eventual decision; completion returns it to normal without leaving stale “live” data.

### Admin IoT-control screen

Show ESP32, Wi-Fi/LAN, edge API, SQLite queue, cloud sync, GPS, moisture, load cell, IR1/IR2, and wet/dry ultrasonic status as `ONLINE`, `DEGRADED`, `MISSING`, `STALE`, or `OFFLINE`, with last-seen age and source. Say “Moisture sensor disconnected,” not “IoT failed.” Optional ML is a separate card with `MANUAL_COLAB`/`RECORDED_ML`, model/confidence/provenance, and “Supporting evidence only.”

## Verification workspace

Two-column desktop layout:

- Left: ordered queue with age, category, reason, device health.
- Right: household-safe summary, event timeline, sensor evidence/calibration/source, rule version/explanation, prior review history.

Actions are `Accept submission` and `Confirm violation`. Confirming requires reason, confirmation dialog, and explicit acknowledgement that it creates a simulated penalty. No one-click penalty button exists outside a flagged case.

## EcoCredit UX

- Always call the MVP unit `EcoCredits` or `points`, never rupees/cash.
- Ledger displays earn/redemption request/adjustment/reversal with signed amount, reason, source event, status, date.
- Balance and ledger must reconcile; a loading balance never shows zero as if authoritative.
- Redemption action clearly says simulated and returns a trackable request status.
- Admin adjustment requires reason and creates an additive ledger entry.

## State vocabulary

Use exact canonical values from contracts and `19_GLOSSARY.md`. User-facing labels may be friendly but must map one-to-one, e.g. `FLAGGED` → “Needs officer review,” not “Violation.”

## Visual direction

- Civic operations aesthetic: calm off-white/slate surfaces, deep green primary, amber warning, red only for danger/confirmed adverse state.
- Clear numeric typography for weights, fill, credits, and queue counts.
- Rounded cards used sparingly; dense admin tables remain readable.
- Waste category icons and text remain consistent across every portal.
- Demo mode source badge is persistent and cannot be cropped from the evidence panel.

## Accessibility acceptance

- Keyboard reaches every action/dialog and focus is visible.
- Forms have labels, descriptions, and inline/server error summary.
- Minimum touch target about 44 px on citizen/operator mobile surfaces.
- Contrast meets WCAG AA targets for normal text/status.
- Tables have headers; charts have text/table alternatives.
- Live updates use non-disruptive announcements; safety alert is assertive.
- Respect reduced motion.

## Required screen evidence in PRs

YASHVARDHAN DOBHAL attaches desktop and mobile screenshots for touched surfaces, plus loading/empty/error/offline where relevant. Admin verification PR includes accepted and confirm-violation dialogs. Cursor may implement only the issue's listed pages/components and may not redesign navigation, contracts, folders, or product copy globally.
