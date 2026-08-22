"use client";

import Link from "next/link";
import { useState, type KeyboardEvent } from "react";
import { useLanguage } from "@/context/language-context";
import type { AppProjection } from "@/lib/domain/projections";
import { LanguageToggle } from "./language-toggle";
import { TruthBadge } from "./truth-badge";
import styles from "./smart-waste-console.module.css";

type Role = "citizen" | "municipal" | "developer";
type TranslateFn = ReturnType<typeof useLanguage>["t"];
const ROLES: readonly Role[] = ["citizen", "municipal", "developer"];
const REASON_KEYS: Record<string, Parameters<TranslateFn>[0]> = {
  DRY_CATEGORY_MATCH: "reasonDryMatch",
  WET_CATEGORY_MATCH: "reasonWetMatch",
  ENVIRONMENTAL_WETTING_SUSPECTED: "reasonEnvWetting",
  CATEGORY_MISMATCH: "reasonMismatch",
  ML_UNAVAILABLE: "reasonMlUnavailable",
  ML_UNCERTAIN: "reasonMlUncertain"
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
      <a className={styles.skip} href="#main-content">{t("skipToContent")}</a>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link className={styles.brand} href="/" aria-label={`${t("brandName")} home`}>
            <span className={styles.seal}>SGV</span>
            <span><strong>{t("brandName")}</strong><small>{t("brandTagline")}</small></span>
          </Link>
          {accessRole ? (
            <div className={styles.authActions}>
              <Link className={styles.backLink} href="/console">{t("backToProductView")}</Link>
              <LanguageToggle />
            </div>
          ) : (
            <>
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
            </>
          )}
        </div>
        <div className={styles.legend} aria-label={t("dataProvenanceLegend")}>
          <span><i className={styles.real} />{t("truthReal")}</span>
          <span><i className={styles.sim} />{t("truthSimulated")}</span>
          <span><i className={styles.preview} />{t("truthPreview")}</span>
        </div>
      </header>

      <main className={styles.main} id="main-content">
        {accessRole ? (
          accessRole === "municipal" ? <MunicipalView focus={focus} projection={projection} /> :
          accessRole === "developer" ? <DeveloperView projection={projection} /> :
          <CitizenView projection={projection} />
        ) : (
          <>
            <section aria-labelledby="role-citizen" hidden={role !== "citizen"} id="panel-citizen" role="tabpanel">
              <CitizenView projection={projection} />
            </section>
            <section aria-labelledby="role-municipal" hidden={role !== "municipal"} id="panel-municipal" role="tabpanel">
              <LockedView href="/auth?role=municipal" marker="M" title={t("municipalLockedTitle")}>
                {t("municipalLockedBody")}
              </LockedView>
            </section>
            <section aria-labelledby="role-developer" hidden={role !== "developer"} id="panel-developer" role="tabpanel">
              <LockedView href="/auth?role=developer" marker="D" title={t("developerLockedTitle")}>
                {t("developerLockedBody")}
              </LockedView>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

function CitizenView({ projection }: { projection: AppProjection }) {
  const event = projection.latestEvent;
  const { t } = useLanguage();
  const [redeemed, setRedeemed] = useState(false);
  const pointsToNext = projection.nextTierAt === null ? 0 : projection.nextTierAt - projection.balance;
  const qrCells = Array.from({ length: 81 }, (_, index) => (index * 7 + projection.citizen.householdSuffix.length * 3) % 5 !== 0);
  const ownEventIds = new Set(projection.events.map((item) => item.eventId));
  const disputableCase = projection.reviewCases.find((item) => item.status === "OPEN" && ownEventIds.has(item.eventId));
  return (
    <>
      {disputableCase && (
        <div className={styles.alert} role="status">
          <span>!</span>
          <div>
            <h3>{t("disputeAlertTitle")}</h3>
            <p>{signed(disputableCase.pointEffect)} · {friendlyReason(disputableCase.reasonCode, t)} — {t("disputeAlertBody")}</p>
          </div>
        </div>
      )}
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <div className={styles.labelRow}><span className={styles.eyebrow}>{t("chainOfCustody")} · {event.eventId}</span><TruthBadge badge={event.uiTruthBadge} /></div>
          <h1>{t("citizenHeroTitle")}</h1>
          <p>{t("citizenHeroLead")}</p>
          <div className={styles.heroMeta}><span>RULES rules-2.0.0</span><span>·</span><span>{event.transportState === "ACKED" ? t("cloudAcknowledged") : t("savedLocallyCloudPending")}</span></div>
        </div>
        <article className={styles.ticket} aria-label={`${t("traceReceiptFor")} ${event.eventId}`}>
          <div className={styles.ticketTop}><span>{event.eventId}</span><strong>{event.decisionState}</strong></div>
          <ol className={styles.chain}>
            {[t("stepBin"), t("stepEdge"), t("stepRules"), t("stepReview"), t("stepLedger")].map((step, index) => <li key={step}><b>{index + 1}</b><span>{step}</span></li>)}
          </ol>
          <p>{t("modelScore")} {event.ml.score === null ? t("scoreUnavailable") : `${Math.round(event.ml.score * 100)}% ${event.ml.confidenceBand?.toLowerCase()}`} · {t("moisture")} {event.moisturePercent === null ? t("moistureNotRequired") : `${event.moisturePercent}%`} · {t("pointEffect")} {signed(event.pointDelta)}</p>
        </article>
      </section>

      <section className={styles.stats} aria-label="Citizen summary">
        <Stat value={projection.balance.toString()} label={`${t("ecoCredits")} · ${projection.tier}`} />
        <Stat value={pointsToNext.toString()} label={pointsToNext ? t("pointsToNextTier") : t("topSeededTierReached")} />
        <Stat value={projection.stats.pendingReviewCount.toString()} label={t("pendingReview")} />
        <Stat value={`${projection.stats.devicesOnline}/${projection.stats.totalDevices}`} label={t("componentsHealthy")} />
      </section>

      <section className={styles.twoCol}>
        <article className={styles.card}>
          <CardTitle kicker={t("weeklyImpactKicker")} title={t("weeklyImpactTitle")}>{null}</CardTitle>
          <div className={styles.mixRow}>
            <div className={styles.mixTrack}>
              <span className={styles.mixWet} style={{ width: `${projection.wetDryMix.wetPercent}%` }} />
              <span className={styles.mixDry} style={{ width: `${projection.wetDryMix.dryPercent}%` }} />
            </div>
          </div>
          <div className={styles.mixLegend}>
            <span><i className={styles.mixWet} />{t("wetShare")} {projection.wetDryMix.wetPercent}%</span>
            <span><i className={styles.mixDry} />{t("dryShare")} {projection.wetDryMix.dryPercent}%</span>
          </div>
          <div className={styles.discountRow}><strong>{projection.accuracyScore}%</strong><span>{t("sortingAccuracy")}</span></div>
          <div className={styles.cessLine}><span>{t("disposalsThisWeek")}</span><span>{projection.weekEventCount}</span></div>
        </article>
        <article className={styles.card}>
          <CardTitle kicker={t("civicDiscountKicker")} title={t("civicDiscountTitle")}>{null}</CardTitle>
          <div className={styles.discountRow}><strong>{projection.civicDiscount.percent}%</strong><span>{t("civicDiscountApplied")}</span></div>
          <div className={styles.cessLine}><span>{t("civicCessBase")}</span><span>₹{projection.civicDiscount.baseCess}</span></div>
          <div className={styles.cessLine}><span>{t("civicCessPayable")}</span><span>₹{projection.civicDiscount.payable}</span></div>
          {redeemed ? (
            <p className={styles.redeemNote}>{t("redeemSimulatedNote")}</p>
          ) : (
            <button className={styles.redeemButton} onClick={() => setRedeemed(true)} type="button">{t("redeemCreditsCta")}</button>
          )}
        </article>
      </section>

      <section className={styles.twoCol}>
        <article className={styles.card}>
          <CardTitle kicker={t("opaqueIdentityKicker")} title={t("myQrPassTitle")}><TruthBadge badge="PREVIEW/SEEDED" /></CardTitle>
          <div className={styles.qrBox}>
            <div className={styles.qr} aria-hidden="true">{qrCells.map((filled, index) => <i className={filled ? styles.qrOn : styles.qrOff} key={index} />)}</div>
            <div><strong>{t("displaySuffix")} {projection.citizen.householdSuffix}</strong><p>{t("qrPrivacyNote")}</p></div>
          </div>
        </article>
        <article className={styles.card}>
          <CardTitle kicker={t("citizenRewardsKicker")} title={t("rewardsBadgesTitle")}><span className={styles.count}>{projection.badges.filter((badge) => badge.unlocked).length}/{projection.badges.length}</span></CardTitle>
          <div className={styles.badges}>{projection.badges.map((badge) => <div className={badge.unlocked ? styles.badgeOn : styles.badgeOff} key={badge.badgeId}><span>{badge.unlocked ? "★" : "◇"}</span><strong>{badge.name}</strong><small>{badge.unlocked ? t("badgeComplete") : badge.description}</small></div>)}</div>
        </article>
      </section>

      <section className={styles.history}>
        <div className={styles.sectionTitle}><div><span>{t("appendOnlyLedger")}</span><h2>{t("recentDisposalHistory")}</h2></div><small>{projection.events.length} {t("fictionalRecords")}</small></div>
        <div className={styles.historyGrid}>{projection.events.slice(0, 6).map((item) => (
          <article className={styles.stub} key={item.eventId}>
            <TruthBadge badge={item.uiTruthBadge} /><strong className={item.pointDelta < 0 ? styles.down : item.pointDelta > 0 ? styles.up : styles.flat}>{signed(item.pointDelta)}</strong>
            <h3>{item.selectedCompartment} {t("disposalSuffix")}</h3><p>{shortDate(item.occurredAt)} · {friendlyReason(item.reasonCodes[0], t)}</p>
          </article>
        ))}</div>
      </section>

      <section className={styles.twoCol}>
        <article className={styles.card}>
          <CardTitle kicker={t("fictionalAliasesOnly")} title={t("privacySafeLeaderboard")}><TruthBadge badge="PREVIEW/SEEDED" /></CardTitle>
          <ol className={styles.leaders}>{projection.leaderboard.slice(0, 4).map((entry, index) => <li key={entry.alias}><span><i>{index + 1}</i>{entry.alias}</span><strong>{entry.balance}</strong></li>)}</ol>
        </article>
        <article className={styles.card}>
          <CardTitle kicker={t("roadmapInterfaceKicker")} title={t("truckTrackingTitle")}><TruthBadge badge="PREVIEW/SEEDED" /></CardTitle>
          <div className={styles.eta}><strong>{projection.activeTruck.etaMinutes} min</strong><span>{projection.activeTruck.zone}<br />{projection.activeTruck.distanceKm} {t("kmFixtureDistance")}</span></div>
          <div className={styles.progress}><i /></div>
          <ol className={styles.route}>{[t("routeScheduled"), t("routeDispatched"), t("routeOnRoute"), t("routeNearYou"), t("routeCollected")].map((step, index) => <li className={index <= 2 ? styles.routeOn : undefined} key={step}>{step}</li>)}</ol>
        </article>
      </section>
    </>
  );
}

function MunicipalView({ projection, focus }: { projection: AppProjection; focus: "review" | undefined }) {
  const { t } = useLanguage();
  return (
    <>
      <RoleHero marker="M" eyebrow={focus ? t("humanReviewWorkspace") : t("municipalOperatorWorkspace")} title={focus ? t("verifyEvidenceTitle") : t("bindDisposalTitle")} />
      <section className={styles.stats}><Stat value={projection.reviewCases.filter((item) => item.status === "OPEN").length.toString()} label={t("openReviews")} /><Stat value={projection.events.length.toString()} label={t("fictionalEvents")} /><Stat value={`${projection.stats.devicesOnline}/${projection.stats.totalDevices}`} label={t("componentsHealthy")} /><Stat value={projection.stats.edgeQueueCount.toString()} label={t("cloudAckPending")} /></section>
      <section className={styles.reviewGrid}>
        <article className={styles.card}>
          <CardTitle kicker={t("orderedReviewQueueKicker")} title={t("verificationTitle")}><span className={styles.count}>{projection.reviewCases.length} {t("casesSuffix")}</span></CardTitle>
          <div className={styles.reviewList}>{projection.reviewCases.slice(0, 7).map((item) => <div className={styles.reviewRow} key={item.caseId}><span><strong>{friendlyReason(item.reasonCode, t)}</strong><small>{item.eventId}</small></span><b>{item.status.replaceAll("_", " ")} · {signed(item.pointEffect)}</b></div>)}</div>
        </article>
        <article className={styles.card}>
          <CardTitle kicker={t("selectedEvidenceKicker")} title={projection.latestEvent.eventId}><TruthBadge badge={projection.latestEvent.uiTruthBadge} /></CardTitle>
          <dl className={styles.evidence}><div><dt>{t("compartmentLabel")}</dt><dd>{projection.latestEvent.selectedCompartment}</dd></div><div><dt>{t("eventSourceLabel")}</dt><dd>{projection.latestEvent.eventSource}</dd></div><div><dt>{t("mlSourceLabel")}</dt><dd>{projection.latestEvent.ml.evidenceSource}</dd></div><div><dt>{t("ruleLabel")}</dt><dd>rules-2.0.0</dd></div><div><dt>{t("immediateEffectLabel")}</dt><dd>{signed(projection.latestEvent.pointDelta)}</dd></div></dl>
        </article>
      </section>
    </>
  );
}

function DeveloperView({ projection }: { projection: AppProjection }) {
  const { t } = useLanguage();
  return (
    <>
      <RoleHero marker="D" eyebrow={t("restrictedOperationalTruth")} title={t("developerHeroTitle")} />
      <section className={styles.health}>{projection.deviceHealth.map((item) => <article className={styles.healthCard} key={item.component}><span className={item.state === "OK" ? styles.healthOk : styles.healthWarn}>{item.state}</span><h2>{item.component}</h2><p>{item.detail}</p><small>{t("lastSeen")} {item.lastSeenSeconds}{t("secondsAgo")}</small></article>)}</section>
      <article className={styles.card}><CardTitle kicker={t("boundedRedactedKicker")} title={t("systemLogsTitle")}><span className={styles.count}>{projection.systemLogs.length}</span></CardTitle><div className={styles.logs}>{projection.systemLogs.map((log) => <div key={log.logId}><b>{log.level}</b><span><strong>{log.source}</strong><small>{log.message}</small></span><time>{shortTime(log.occurredAt)}</time></div>)}</div></article>
    </>
  );
}

function LockedView({ marker, title, href, children }: { marker: string; title: string; href: string; children: React.ReactNode }) {
  const { t } = useLanguage();
  return <section className={styles.locked}><span>{marker}</span><small>{t("authenticatedRoleSurface")}</small><h1>{title}</h1><p>{children}</p><Link className={marker === "M" ? styles.blueButton : styles.greenButton} href={href}>{marker === "M" ? t("municipalSignIn") : t("developerSignIn")}</Link></section>;
}

function RoleHero({ marker, eyebrow, title }: { marker: string; eyebrow: string; title: string }) {
  const { t } = useLanguage();
  return <section className={styles.roleHero}><span>{marker}</span><div><small>{eyebrow}</small><h1>{title}</h1><p>{t("provenanceExplainer")}</p></div></section>;
}

function Stat({ value, label }: { value: string; label: string }) { return <article className={styles.stat}><strong>{value}</strong><span>{label}</span></article>; }
function CardTitle({ kicker, title, children }: { kicker: string; title: string; children: React.ReactNode }) { return <div className={styles.cardTitle}><div><span>{kicker}</span><h2>{title}</h2></div>{children}</div>; }
function signed(value: number) { return value > 0 ? `+${value}` : value.toString(); }
function friendlyReason(reason: string | undefined, t: TranslateFn) { if (!reason) return t("evidencePendingReview"); const key = REASON_KEYS[reason]; return key ? t(key) : reason.replaceAll("_", " ").toLowerCase(); }
function shortDate(value: string) { return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", timeZone: "Asia/Kolkata" }).format(new Date(value)); }
function shortTime(value: string) { return new Intl.DateTimeFormat("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Asia/Kolkata" }).format(new Date(value)); }
