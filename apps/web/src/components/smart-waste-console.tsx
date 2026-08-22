"use client";

import { useMemo, useState, type CSSProperties } from "react";
import type { AppProjection } from "@/lib/domain/projections";
import { tier2Previews } from "@/fixtures/tier2-preview/previews";
import { EdgeFlowScene } from "./edge-flow-scene";
import { QrCard } from "./qr-card";
import { Timeline } from "./timeline";
import { StatusPill, TruthBadge } from "./truth-badge";

type RoleKey = "citizen" | "municipal" | "developer";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: "▦" },
  { id: "disposals", label: "Disposals", icon: "♻" },
  { id: "ecocredits", label: "EcoCredits", icon: "◈" },
  { id: "verification", label: "Verification", icon: "✓" },
  { id: "edge-queue", label: "Edge Queue", icon: "◧" },
  { id: "ml-evidence", label: "ML Evidence", icon: "◎" },
  { id: "previews", label: "Previews", icon: "▤" }
] as const;

export function SmartWasteConsole({
  projection,
  initialRole = "citizen",
  focus
}: {
  projection: AppProjection;
  initialRole?: RoleKey;
  focus?: "review";
}) {
  const [role, setRole] = useState<RoleKey>(initialRole);
  const [drySessionCount, setDrySessionCount] = useState(0);
  const [fixturePreviewCount, setFixturePreviewCount] = useState(0);
  const selectedEvent = projection.latestEvent;
  const pointsToNext = projection.nextTierAt === null ? 0 : projection.nextTierAt - projection.balance;
  const drySessionActive = drySessionCount > 0;
  const fixturePreviewActive = fixturePreviewCount > 0;

  const roleTitle = useMemo(() => {
    if (role === "citizen") return "Citizen";
    if (role === "municipal") return focus === "review" ? "Municipal Review" : "Municipal Operator";
    return "Developer / IoT";
  }, [focus, role]);

  return (
    <main className="app-shell">
      <aside className="sidebar" aria-label="Primary">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">SGV</span>
          <div>
            <strong>SGV 2.0</strong>
            <span>Smart Waste Ecosystem</span>
          </div>
        </div>
        <nav aria-label="Sections">
          {NAV_ITEMS.map((item) => (
            <a href={`#${item.id}`} key={item.id}>
              <span aria-hidden="true">{item.icon}</span>
              <span>{item.label}</span>
            </a>
          ))}
        </nav>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div className="role-tabs" role="tablist" aria-label="Role views">
            {(["citizen", "municipal", "developer"] as RoleKey[]).map((key) => (
              <button
                aria-pressed={role === key}
                key={key}
                type="button"
                className={role === key ? "selected" : ""}
                onClick={() => setRole(key)}
              >
                {key === "citizen" ? "Citizen" : key === "municipal" ? "Municipal" : "Developer"}
              </button>
            ))}
          </div>
          <div className="truth-row" aria-label="Truth badges used by the product">
            <TruthBadge badge="REAL" />
            <TruthBadge badge="SIMULATED" />
            <TruthBadge badge="PREVIEW/SEEDED" />
          </div>
        </header>

        <section className="hero-band" id="dashboard">
          <div>
            <p className="eyebrow">{roleTitle}</p>
            <h1>{role === "citizen" ? "Your disposal record is traceable and reviewable" : role === "municipal" ? "Verify evidence before value changes" : "Operational truth console"}</h1>
            <p>
              One event ID links QR session, compartment trigger, edge custody, local ML evidence, deterministic rules, review, and ledger.
            </p>
          </div>
          <div className="hero-status">
            <StatusPill tone="ok">Rules {selectedEvent.ml.modelVersion.includes("0.1") ? "rules-2.0.0" : "rules-2.0.0"}</StatusPill>
            <StatusPill tone="info">202 local receipt</StatusPill>
          </div>
        </section>

        <EdgeFlowScene
          decisionState={selectedEvent.decisionState}
          devicesOnline={projection.stats.devicesOnline}
          edgeQueueCount={projection.stats.edgeQueueCount}
          eventId={selectedEvent.eventId}
          pendingReviewCount={projection.stats.pendingReviewCount}
          totalDevices={projection.stats.totalDevices}
          transportState={selectedEvent.transportState}
        />

        <section className="metric-grid" id="edge-queue" aria-label="System metrics">
          <Metric label="EcoCredit balance" value={projection.balance.toString()} detail={`${pointsToNext} to next tier`} />
          <Metric label="Tier" value={projection.tier} detail="Derived from ledger" />
          <Metric label="Pending review" value={projection.stats.pendingReviewCount.toString()} detail="No automatic negative" />
          <Metric label="Devices online" value={`${projection.stats.devicesOnline}/${projection.stats.totalDevices}`} detail="Component-level health" />
          <Metric label="Edge queue" value={projection.stats.edgeQueueCount.toString()} detail="Transport separate from decision" />
        </section>

        <div className="content-grid">
          <section className="main-column">
            {role === "citizen" && <CitizenPanel projection={projection} />}
            {role === "municipal" && (
              <MunicipalPanel
                drySessionActive={drySessionActive}
                drySessionCount={drySessionCount}
                eventId={selectedEvent.eventId}
                onBeginDrySession={() => setDrySessionCount((count) => count + 1)}
                projection={projection}
              />
            )}
            {role === "developer" && (
              <DeveloperPanel
                fixturePreviewActive={fixturePreviewActive}
                fixturePreviewCount={fixturePreviewCount}
                onPreviewFixture={() => setFixturePreviewCount((count) => count + 1)}
                projection={projection}
              />
            )}
          </section>

          <aside className="detail-rail" aria-label="Selected event details">
            <div className="rail-header">
              <h2>Event Evidence</h2>
              <TruthBadge badge={selectedEvent.uiTruthBadge} />
            </div>
            <dl className="detail-list">
              <div><dt>Event</dt><dd>{selectedEvent.eventId}</dd></div>
              <div><dt>Compartment</dt><dd>{selectedEvent.selectedCompartment}</dd></div>
              <div><dt>Hardware source</dt><dd>{selectedEvent.eventSource}</dd></div>
              <div><dt>ML source</dt><dd>{selectedEvent.ml.evidenceSource}</dd></div>
              <div><dt>Model score</dt><dd>{selectedEvent.ml.score === null ? "Unavailable" : `${Math.round(selectedEvent.ml.score * 100)}% ${selectedEvent.ml.confidenceBand}`}</dd></div>
              <div><dt>Moisture</dt><dd>{selectedEvent.moisturePercent === null ? "Not required" : `${selectedEvent.moisturePercent}%`}</dd></div>
              <div><dt>Point effect</dt><dd>{selectedEvent.pointDelta > 0 ? `+${selectedEvent.pointDelta}` : selectedEvent.pointDelta}</dd></div>
            </dl>
            <div className="timeline-stack">
              <Timeline title="Processing" steps={["DISPOSAL_STARTED", "SENSOR_CAPTURED", "ML_PENDING", "SEGREGATION_DECIDED", "COMPLETED"]} active={selectedEvent.processingState} />
              <Timeline title="Decision" steps={["CAPTURED", "EVALUATING", "ACCEPTED", "FLAGGED", "CLOSED"]} active={selectedEvent.decisionState === "ACCEPTED" ? "ACCEPTED" : selectedEvent.decisionState === "FLAGGED" ? "FLAGGED" : "CLOSED"} />
              <Timeline title="Transport" steps={["PENDING", "IN_FLIGHT", "ACKED"]} active={selectedEvent.transportState} />
            </div>
          </aside>
        </div>

        <section className="preview-band" id="previews">
          <div>
            <TruthBadge badge="PREVIEW/SEEDED" />
            <h2>{tier2Previews.truckEta.title}</h2>
            <p>{tier2Previews.truckEta.note}</p>
            <p>{tier2Previews.truckEta.distanceKm} km fixture route, ETA {tier2Previews.truckEta.etaMinutes} min.</p>
          </div>
          <div>
            <TruthBadge badge="PREVIEW/SEEDED" />
            <h2>{tier2Previews.billDiscount.title}</h2>
            <p>{tier2Previews.billDiscount.note}</p>
            <p>{tier2Previews.billDiscount.previewPercent}% illustrative discount from frontend-only fixture.</p>
          </div>
        </section>
      </section>
    </main>
  );
}

function Metric({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <section className="metric">
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{detail}</small>
    </section>
  );
}

function CitizenPanel({ projection }: { projection: AppProjection }) {
  return (
    <>
      <CitizenPassport projection={projection} />
      <QrCard suffix={projection.citizen.householdSuffix} />
      <section className="feature-grid" aria-label="Citizen rewards and civic services">
        <RewardBadges projection={projection} />
        <TruckEtaCard projection={projection} />
        <CivicDiscountCard projection={projection} />
      </section>
      <section className="table-panel" id="disposals">
        <div className="section-heading">
          <h2>Recent disposal history</h2>
          <StatusPill tone="neutral">{projection.events.length} fictional records</StatusPill>
        </div>
        <EventRows projection={projection} />
      </section>
      <section className="leaderboard" id="ecocredits">
        <h2>Privacy-safe leaderboard</h2>
        {projection.leaderboard.map((entry) => (
          <div key={entry.alias} className="leader-row">
            <span>{entry.alias}</span>
            <strong>{entry.balance}</strong>
            <TruthBadge badge={entry.source} />
          </div>
        ))}
      </section>
    </>
  );
}

function MunicipalPanel({
  projection,
  drySessionActive,
  drySessionCount,
  eventId,
  onBeginDrySession
}: {
  projection: AppProjection;
  drySessionActive: boolean;
  drySessionCount: number;
  eventId: string;
  onBeginDrySession: () => void;
}) {
  return (
    <>
      <section className="operator-panel">
        <div>
          <p className="eyebrow">QR scan</p>
          <h2>Session ready for {projection.citizen.householdSuffix}</h2>
          <p>Only the safe suffix and session state are visible. Raw QR and PII are not displayed.</p>
          {drySessionActive && (
            <div className="action-result" role="status">
              <StatusPill tone="info">Dry session #{drySessionCount}</StatusPill>
              <span>Operator rehearsal attached to {eventId}; no ledger mutation was made.</span>
            </div>
          )}
        </div>
        <button type="button" onClick={onBeginDrySession}>
          {drySessionActive ? "Log another dry scan" : "Begin dry session"}
        </button>
      </section>
      <MunicipalAnalytics projection={projection} />
      <section className="review-board" id="verification">
        <h2>Verification queue</h2>
        {projection.reviewCases.slice(0, 5).map((reviewCase) => (
          <article key={reviewCase.caseId} className="review-case">
            <div>
              <strong>{reviewCase.reasonCode}</strong>
              <span>{reviewCase.eventId}</span>
            </div>
            <StatusPill tone={reviewCase.pointEffect < 0 ? "bad" : reviewCase.status === "OPEN" ? "warn" : "ok"}>
              {reviewCase.status} {reviewCase.pointEffect === 0 ? "0" : reviewCase.pointEffect > 0 ? `+${reviewCase.pointEffect}` : reviewCase.pointEffect}
            </StatusPill>
          </article>
        ))}
      </section>
    </>
  );
}

function DeveloperPanel({
  projection,
  fixturePreviewActive,
  fixturePreviewCount,
  onPreviewFixture
}: {
  projection: AppProjection;
  fixturePreviewActive: boolean;
  fixturePreviewCount: number;
  onPreviewFixture: () => void;
}) {
  const previewEventId = `sim-${projection.latestEvent.eventId.slice(-8)}-${fixturePreviewCount || 1}`;

  return (
    <>
      <SystemLogPanel projection={projection} />
      <section className="health-grid" id="ml-evidence">
        {projection.deviceHealth.map((component) => (
          <article key={component.component} className="health-card">
            <StatusPill tone={component.state === "OK" ? "ok" : component.state === "FAILED" ? "bad" : "warn"}>{component.state}</StatusPill>
            <h2>{component.component}</h2>
            <p>{component.detail}</p>
            <small>Last seen {component.lastSeenSeconds}s ago</small>
          </article>
        ))}
      </section>
      <section className="simulation-panel">
        <div>
          <p className="eyebrow">Inject Test Event</p>
          <h2>Preview a labelled simulation payload</h2>
          <p>Simulation joins after physical ingress and is permanently labelled SIMULATED. This button previews the payload only.</p>
          {fixturePreviewActive && (
            <div className="action-result" role="status">
              <TruthBadge badge="SIMULATED" />
              <span>{previewEventId} prepared for developer validation without calling production ingestion.</span>
            </div>
          )}
        </div>
        <button type="button" onClick={onPreviewFixture}>
          {fixturePreviewActive ? "Refresh fixture preview" : "Preview fixture payload"}
        </button>
      </section>
    </>
  );
}

function CitizenPassport({ projection }: { projection: AppProjection }) {
  const progress = projection.nextTierAt === null ? 100 : Math.min(100, Math.round((projection.balance / projection.nextTierAt) * 100));
  const pointsToNext = projection.nextTierAt === null ? 0 : projection.nextTierAt - projection.balance;

  return (
    <section className="citizen-passport">
      <div className="passport-identity">
        <span aria-hidden="true">{projection.citizen.safeAlias.slice(0, 2).toUpperCase()}</span>
        <div>
          <p className="eyebrow">Citizen passport</p>
          <h2>{projection.citizen.displayName}</h2>
          <p>{projection.citizen.safeAlias} · {projection.citizen.householdSuffix}</p>
        </div>
      </div>
      <div className="passport-score">
        <ProgressRing value={projection.accuracyScore} label="Segregation score" />
        <div>
          <strong>{projection.balance.toLocaleString("en-IN")}</strong>
          <span>EcoCredits · {projection.weekEventCount} disposals this week</span>
        </div>
      </div>
      <div className="tier-progress" aria-label={`Tier progress ${progress}%`}>
        <span style={{ width: `${progress}%` }} />
      </div>
      <p className="passport-note">{pointsToNext === 0 ? "Top seeded tier reached in this preview." : `${pointsToNext} points to next tier.`}</p>
    </section>
  );
}

function ProgressRing({ value, label }: { value: number; label: string }) {
  return (
    <div className="progress-ring" style={{ "--progress": `${value}%` } as CSSProperties}>
      <strong>{value}%</strong>
      <span>{label}</span>
    </div>
  );
}

function RewardBadges({ projection }: { projection: AppProjection }) {
  return (
    <section className="reward-card">
      <div className="section-heading">
        <h2>Rewards & badges</h2>
        <StatusPill tone="neutral">{projection.badges.filter((badge) => badge.unlocked).length}/{projection.badges.length}</StatusPill>
      </div>
      <div className="badge-grid">
        {projection.badges.map((badge) => (
          <article className={badge.unlocked ? "badge-tile unlocked" : "badge-tile"} key={badge.badgeId}>
            <span aria-hidden="true">{badge.unlocked ? "★" : "◇"}</span>
            <strong>{badge.name}</strong>
            <small>{badge.description}</small>
          </article>
        ))}
      </div>
    </section>
  );
}

function TruckEtaCard({ projection }: { projection: AppProjection }) {
  const stageOrder = ["SCHEDULED", "DISPATCHED", "ON_ROUTE", "NEAR_CITIZEN", "COLLECTION", "COMPLETED"];
  const activeIndex = Math.max(0, stageOrder.indexOf(projection.activeTruck.status));

  return (
    <section className="service-card">
      <div className="service-card-header">
        <div>
          <p className="eyebrow">Truck tracking</p>
          <h2>{projection.activeTruck.etaMinutes} min ETA</h2>
          <p>{projection.activeTruck.zone} · {projection.activeTruck.distanceKm} km away</p>
        </div>
        <span className="truck-icon" aria-hidden="true">▰</span>
      </div>
      <svg className="route-map" viewBox="0 0 300 90" aria-label={`Route for ${projection.activeTruck.truckId}`}>
        <path d="M12,68 Q86,18 145,45 T288,22" fill="none" stroke="#dbe1db" strokeWidth="5" />
        <path d="M12,68 Q86,18 145,45 T288,22" fill="none" stroke="#076b4d" strokeWidth="5" strokeDasharray="390" strokeDashoffset="126" />
        <circle cx="218" cy="34" r="7" fill="#a96300" />
        <circle cx="288" cy="22" r="6" fill="#076b4d" />
      </svg>
      <div className="route-stages">
        {stageOrder.map((stage, index) => (
          <span className={index <= activeIndex ? "active" : ""} key={stage}>{stage.replace("_", " ")}</span>
        ))}
      </div>
    </section>
  );
}

function CivicDiscountCard({ projection }: { projection: AppProjection }) {
  return (
    <section className="service-card civic-card">
      <p className="eyebrow">Civic discount</p>
      <h2>{projection.civicDiscount.percent}% preview</h2>
      <p>Derived from the seeded EcoCredit balance and clearly marked as preview-only.</p>
      <dl className="bill-breakdown">
        <div><dt>Base sanitation cess</dt><dd>₹{projection.civicDiscount.baseCess}</dd></div>
        <div><dt>EcoCredit discount</dt><dd>-₹{projection.civicDiscount.discountAmount}</dd></div>
        <div><dt>Preview payable</dt><dd>₹{projection.civicDiscount.payable}</dd></div>
      </dl>
    </section>
  );
}

function MunicipalAnalytics({ projection }: { projection: AppProjection }) {
  const maxWaste = Math.max(...projection.weeklyWasteTrend.map((item) => item.wet + item.dry));
  const trendPoints = projection.accuracyTrend
    .map((item, index) => {
      const x = (index / Math.max(1, projection.accuracyTrend.length - 1)) * 220;
      const y = 90 - ((item.value - 60) / 40) * 80;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <section className="analytics-panel">
      <div className="section-heading">
        <h2>Waste analytics</h2>
        <StatusPill tone="neutral">Seeded 7–14 day view</StatusPill>
      </div>
      <div className="analytics-grid">
        <div className="bar-chart" aria-label="Wet versus dry composition">
          {projection.weeklyWasteTrend.map((item) => (
            <div className="bar-day" key={item.day}>
              <div>
                <span className="wet-bar" style={{ height: `${(item.wet / maxWaste) * 100}%` }} />
                <span className="dry-bar" style={{ height: `${(item.dry / maxWaste) * 100}%` }} />
              </div>
              <small>{item.day}</small>
            </div>
          ))}
        </div>
        <div className="accuracy-chart">
          <svg viewBox="0 0 220 100" role="img" aria-label="Segregation accuracy trend">
            <polyline points={trendPoints} fill="none" stroke="#076b4d" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            {projection.accuracyTrend.map((item, index) => {
              const x = (index / Math.max(1, projection.accuracyTrend.length - 1)) * 220;
              const y = 90 - ((item.value - 60) / 40) * 80;
              return <circle cx={x} cy={y} fill="#076b4d" key={item.label} r="4" />;
            })}
          </svg>
          <div>
            <strong>{projection.accuracyScore}%</strong>
            <span>current segregation score</span>
          </div>
        </div>
        <div className="mix-card">
          <strong>{projection.wetDryMix.wetPercent}% wet</strong>
          <span>{projection.wetDryMix.wet} wet events · {projection.wetDryMix.dry} dry events</span>
          <div className="mix-meter"><span style={{ width: `${projection.wetDryMix.wetPercent}%` }} /></div>
        </div>
      </div>
    </section>
  );
}

function SystemLogPanel({ projection }: { projection: AppProjection }) {
  return (
    <section className="system-log-panel">
      <div className="section-heading">
        <h2>System logs</h2>
        <StatusPill tone="info">{projection.systemLogs.length} entries</StatusPill>
      </div>
      <div className="log-list">
        {projection.systemLogs.map((log) => (
          <article className={`log-row log-${log.level.toLowerCase()}`} key={log.logId}>
            <span>{log.level}</span>
            <div>
              <strong>{log.source}</strong>
              <p>{log.message}</p>
            </div>
            <time>{new Date(log.occurredAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</time>
          </article>
        ))}
      </div>
    </section>
  );
}

function EventRows({ projection }: { projection: AppProjection }) {
  return (
    <div className="event-list">
      {projection.events.slice(0, 8).map((event) => (
        <article key={event.eventId} className="event-row">
          <div>
            <strong>{event.selectedCompartment} disposal</strong>
            <span>{new Date(event.occurredAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</span>
          </div>
          <TruthBadge badge={event.uiTruthBadge} />
          <StatusPill tone={event.decisionState === "ACCEPTED" || event.decisionState === "REVIEW_ACCEPTED" ? "ok" : event.pointDelta < 0 ? "bad" : "warn"}>
            {event.pointDelta > 0 ? `+${event.pointDelta} EcoCredits` : event.pointDelta < 0 ? `${event.pointDelta} reviewed` : "0 needs review"}
          </StatusPill>
          <span className="reason-code">{event.reasonCodes[0]}</span>
        </article>
      ))}
    </div>
  );
}
