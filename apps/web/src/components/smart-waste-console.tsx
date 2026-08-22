"use client";

import Link from "next/link";
import { useState, type KeyboardEvent } from "react";
import { useLanguage } from "@/context/language-context";
import type { AppProjection } from "@/lib/domain/projections";
import { LanguageToggle } from "./language-toggle";
import { TruthBadge } from "./truth-badge";
import styles from "./smart-waste-console.module.css";

type Role = "citizen" | "municipal" | "developer";
const ROLES: readonly Role[] = ["citizen", "municipal", "developer"];
const REASON_LABELS: Record<string, string> = {
  DRY_CATEGORY_MATCH: "Dry category matched",
  WET_CATEGORY_MATCH: "Wet category matched",
  ENVIRONMENTAL_WETTING_SUSPECTED: "Environmental wetting reviewed",
  CATEGORY_MISMATCH: "Category mismatch · reviewed",
  ML_UNAVAILABLE: "Camera classification unavailable",
  ML_UNCERTAIN: "Low-confidence result"
};

export function SmartWasteConsole({ projection, initialRole = "citizen", accessRole, focus }: {
  projection: AppProjection;
  initialRole?: Role;
  accessRole?: Role;
  focus?: "review";
}) {
  const [role, setRole] = useState<Role>(initialRole);
  const { t } = useLanguage();

  function moveTab(event: KeyboardEvent<HTMLButtonElement>, current: Role) {
    const index = ROLES.indexOf(current);
    let next: number | undefined;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (index + 1) % ROLES.length;
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (index - 1 + ROLES.length) % ROLES.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = ROLES.length - 1;
    if (next === undefined) return;
    const nextRole = ROLES[next];
    if (!nextRole) return;
    event.preventDefault();
    setRole(nextRole);
    requestAnimationFrame(() => document.getElementById(`role-${nextRole}`)?.focus());
  }

  return (
    <div className={styles.shell}>
      <a className={styles.skip} href="#main-content">Skip to content</a>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link className={styles.brand} href="/" aria-label="SGV 2.0 home">
            <span className={styles.seal}>SGV</span>
            <span><strong>SGV 2.0</strong><small>Smart Waste Ecosystem</small></span>
          </Link>
          <nav className={styles.tabs} role="tablist" aria-label={t("productView")}>
            {ROLES.map((item) => (
              <button
                aria-controls={`panel-${item}`}
                aria-selected={role === item}
                className={role === item ? styles.activeTab : styles.tab}
                id={`role-${item}`}
                key={item}
                onClick={() => setRole(item)}
                onKeyDown={(event) => moveTab(event, item)}
                role="tab"
                tabIndex={role === item ? 0 : -1}
                type="button"
              >{t(item)}</button>
            ))}
          </nav>
          <div className={styles.authActions}>
            <LanguageToggle />
            <Link className={styles.outlineButton} href="/auth?role=municipal">{t("municipalSignIn")}</Link>
            <Link className={styles.greenButton} href="/auth?role=citizen">{t("citizenSignIn")}</Link>
          </div>
        </div>
        <div className={styles.legend} aria-label="Data provenance legend">
          <span><i className={styles.real} />{t("truthReal")}</span>
          <span><i className={styles.sim} />{t("truthSimulated")}</span>
          <span><i className={styles.preview} />{t("truthPreview")}</span>
        </div>
      </header>

      <main className={styles.main} id="main-content">
        <section aria-labelledby="role-citizen" hidden={role !== "citizen"} id="panel-citizen" role="tabpanel">
          <CitizenView projection={projection} />
        </section>
        <section aria-labelledby="role-municipal" hidden={role !== "municipal"} id="panel-municipal" role="tabpanel">
          {accessRole === "municipal" ? <MunicipalView focus={focus} projection={projection} /> : (
            <LockedView href="/auth?role=municipal" marker="M" title="Municipal review queue">
              Sign in with a verified municipal account to inspect disposal decisions, evidence, and review cases for your zone. No operational records load here before authentication.
            </LockedView>
          )}
        </section>
        <section aria-labelledby="role-developer" hidden={role !== "developer"} id="panel-developer" role="tabpanel">
          {accessRole === "developer" ? <DeveloperView projection={projection} /> : (
            <LockedView href="/auth?role=developer" marker="D" title="Developer truth console">
              Device telemetry, edge custody, simulations, and ML evidence are restricted to the developer role. Provenance labels remain attached after sign in.
            </LockedView>
          )}
        </section>
      </main>
    </div>
  );
}

function CitizenView({ projection }: { projection: AppProjection }) {
  const event = projection.latestEvent;
  const { t } = useLanguage();
  const pointsToNext = projection.nextTierAt === null ? 0 : projection.nextTierAt - projection.balance;
  const qrCells = Array.from({ length: 81 }, (_, index) => (index * 7 + projection.citizen.householdSuffix.length * 3) % 5 !== 0);
  return (
    <>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <div className={styles.labelRow}><span className={styles.eyebrow}>Chain of custody · {event.eventId}</span><TruthBadge badge={event.uiTruthBadge} /></div>
          <h1>Your disposal record is traceable, end to end.</h1>
          <p>One event ID links the QR session, compartment sensor, edge custody, local ML evidence, the rules that decided it, and the ledger entry it produced. Nothing here is a black box.</p>
          <div className={styles.heroMeta}><span>RULES rules-2.0.0</span><span>·</span><span>{event.transportState === "ACKED" ? "Cloud acknowledged" : "Saved locally · cloud pending"}</span></div>
        </div>
        <article className={styles.ticket} aria-label={`Trace receipt for ${event.eventId}`}>
          <div className={styles.ticketTop}><span>{event.eventId}</span><strong>{event.decisionState}</strong></div>
          <ol className={styles.chain}>
            {["Bin", "Edge", "Rules", "Review", "Ledger"].map((step, index) => <li key={step}><b>{index + 1}</b><span>{step}</span></li>)}
          </ol>
          <p>Model score {event.ml.score === null ? "unavailable" : `${Math.round(event.ml.score * 100)}% ${event.ml.confidenceBand?.toLowerCase()}`} · Moisture {event.moisturePercent === null ? "not required" : `${event.moisturePercent}%`} · Point effect {signed(event.pointDelta)}</p>
        </article>
      </section>

      <section className={styles.stats} aria-label="Citizen summary">
        <Stat value={projection.balance.toString()} label={`${t("ecoCredits")} · ${projection.tier}`} />
        <Stat value={pointsToNext.toString()} label={pointsToNext ? "Points to next tier" : "Top seeded tier reached"} />
        <Stat value={projection.stats.pendingReviewCount.toString()} label="Pending review" />
        <Stat value={`${projection.stats.devicesOnline}/${projection.stats.totalDevices}`} label="Components healthy" />
      </section>

      <section className={styles.twoCol}>
        <article className={styles.card}>
          <CardTitle kicker="Opaque identity" title="My QR pass"><TruthBadge badge="PREVIEW/SEEDED" /></CardTitle>
          <div className={styles.qrBox}>
            <div className={styles.qr} aria-hidden="true">{qrCells.map((filled, index) => <i className={filled ? styles.qrOn : styles.qrOff} key={index} />)}</div>
            <div><strong>Display suffix {projection.citizen.householdSuffix}</strong><p>Seeded visual preview. A production QR contains no name, address, phone, balance, or role.</p></div>
          </div>
        </article>
        <article className={styles.card}>
          <CardTitle kicker="Citizen rewards" title="Rewards & badges"><span className={styles.count}>{projection.badges.filter((badge) => badge.unlocked).length}/{projection.badges.length}</span></CardTitle>
          <div className={styles.badges}>{projection.badges.map((badge) => <div className={badge.unlocked ? styles.badgeOn : styles.badgeOff} key={badge.badgeId}><span>{badge.unlocked ? "★" : "◇"}</span><strong>{badge.name}</strong><small>{badge.unlocked ? "Complete" : badge.description}</small></div>)}</div>
        </article>
      </section>

      <section className={styles.history}>
        <div className={styles.sectionTitle}><div><span>Append-only ledger</span><h2>Recent disposal history</h2></div><small>{projection.events.length} fictional records</small></div>
        <div className={styles.historyGrid}>{projection.events.slice(0, 6).map((item) => (
          <article className={styles.stub} key={item.eventId}>
            <TruthBadge badge={item.uiTruthBadge} /><strong className={item.pointDelta < 0 ? styles.down : item.pointDelta > 0 ? styles.up : styles.flat}>{signed(item.pointDelta)}</strong>
            <h3>{item.selectedCompartment} disposal</h3><p>{shortDate(item.occurredAt)} · {friendlyReason(item.reasonCodes[0])}</p>
          </article>
        ))}</div>
      </section>

      <section className={styles.twoCol}>
        <article className={styles.card}>
          <CardTitle kicker="Fictional aliases only" title="Privacy-safe leaderboard"><TruthBadge badge="PREVIEW/SEEDED" /></CardTitle>
          <ol className={styles.leaders}>{projection.leaderboard.slice(0, 4).map((entry, index) => <li key={entry.alias}><span><i>{index + 1}</i>{entry.alias}</span><strong>{entry.balance}</strong></li>)}</ol>
        </article>
        <article className={styles.card}>
          <CardTitle kicker="Roadmap interface · no live backend" title="Truck tracking"><TruthBadge badge="PREVIEW/SEEDED" /></CardTitle>
          <div className={styles.eta}><strong>{projection.activeTruck.etaMinutes} min</strong><span>{projection.activeTruck.zone}<br />{projection.activeTruck.distanceKm} km fixture distance</span></div>
          <div className={styles.progress}><i /></div>
          <ol className={styles.route}>{["Scheduled", "Dispatched", "On route", "Near you", "Collected"].map((step, index) => <li className={index <= 2 ? styles.routeOn : undefined} key={step}>{step}</li>)}</ol>
        </article>
      </section>
    </>
  );
}

function MunicipalView({ projection, focus }: { projection: AppProjection; focus: "review" | undefined }) {
  return (
    <>
      <RoleHero marker="M" eyebrow={focus ? "Human review workspace" : "Municipal operator workspace"} title={focus ? "Verify evidence before value changes." : "Bind each disposal to one accountable session."} />
      <section className={styles.stats}><Stat value={projection.reviewCases.filter((item) => item.status === "OPEN").length.toString()} label="Open reviews" /><Stat value={projection.events.length.toString()} label="Fictional events" /><Stat value={`${projection.stats.devicesOnline}/${projection.stats.totalDevices}`} label="Components healthy" /><Stat value={projection.stats.edgeQueueCount.toString()} label="Cloud ACK pending" /></section>
      <section className={styles.reviewGrid}>
        <article className={styles.card}>
          <CardTitle kicker="Ordered review queue" title="Verification"><span className={styles.count}>{projection.reviewCases.length} cases</span></CardTitle>
          <div className={styles.reviewList}>{projection.reviewCases.slice(0, 7).map((item) => <div className={styles.reviewRow} key={item.caseId}><span><strong>{friendlyReason(item.reasonCode)}</strong><small>{item.eventId}</small></span><b>{item.status.replaceAll("_", " ")} · {signed(item.pointEffect)}</b></div>)}</div>
        </article>
        <article className={styles.card}>
          <CardTitle kicker="Selected evidence" title={projection.latestEvent.eventId}><TruthBadge badge={projection.latestEvent.uiTruthBadge} /></CardTitle>
          <dl className={styles.evidence}><div><dt>Compartment</dt><dd>{projection.latestEvent.selectedCompartment}</dd></div><div><dt>Event source</dt><dd>{projection.latestEvent.eventSource}</dd></div><div><dt>ML source</dt><dd>{projection.latestEvent.ml.evidenceSource}</dd></div><div><dt>Rule</dt><dd>rules-2.0.0</dd></div><div><dt>Immediate effect</dt><dd>{signed(projection.latestEvent.pointDelta)}</dd></div></dl>
        </article>
      </section>
    </>
  );
}

function DeveloperView({ projection }: { projection: AppProjection }) {
  return (
    <>
      <RoleHero marker="D" eyebrow="Restricted operational truth" title="See every boundary without hiding degraded states." />
      <section className={styles.health}>{projection.deviceHealth.map((item) => <article className={styles.healthCard} key={item.component}><span className={item.state === "OK" ? styles.healthOk : styles.healthWarn}>{item.state}</span><h2>{item.component}</h2><p>{item.detail}</p><small>Last seen {item.lastSeenSeconds}s ago</small></article>)}</section>
      <article className={styles.card}><CardTitle kicker="Bounded and redacted" title="System logs"><span className={styles.count}>{projection.systemLogs.length}</span></CardTitle><div className={styles.logs}>{projection.systemLogs.map((log) => <div key={log.logId}><b>{log.level}</b><span><strong>{log.source}</strong><small>{log.message}</small></span><time>{shortTime(log.occurredAt)}</time></div>)}</div></article>
    </>
  );
}

function LockedView({ marker, title, href, children }: { marker: string; title: string; href: string; children: React.ReactNode }) {
  const { t } = useLanguage();
  return <section className={styles.locked}><span>{marker}</span><small>Authenticated role surface</small><h1>{title}</h1><p>{children}</p><Link className={marker === "M" ? styles.blueButton : styles.greenButton} href={href}>{marker === "M" ? t("municipalSignIn") : t("developerSignIn")}</Link></section>;
}

function RoleHero({ marker, eyebrow, title }: { marker: string; eyebrow: string; title: string }) {
  return <section className={styles.roleHero}><span>{marker}</span><div><small>{eyebrow}</small><h1>{title}</h1><p>Sensor and model output are evidence. Provenance, transport, decision, and human review remain separate.</p></div></section>;
}

function Stat({ value, label }: { value: string; label: string }) { return <article className={styles.stat}><strong>{value}</strong><span>{label}</span></article>; }
function CardTitle({ kicker, title, children }: { kicker: string; title: string; children: React.ReactNode }) { return <div className={styles.cardTitle}><div><span>{kicker}</span><h2>{title}</h2></div>{children}</div>; }
function signed(value: number) { return value > 0 ? `+${value}` : value.toString(); }
function friendlyReason(reason: string | undefined) { return reason ? (REASON_LABELS[reason] ?? reason.replaceAll("_", " ").toLowerCase()) : "Evidence pending review"; }
function shortDate(value: string) { return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", timeZone: "Asia/Kolkata" }).format(new Date(value)); }
function shortTime(value: string) { return new Intl.DateTimeFormat("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Asia/Kolkata" }).format(new Date(value)); }
