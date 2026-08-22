import { tierForBalance } from "@sgv/rules-engine";
import { citizenBadges, citizens, deviceHealth, events, mainCitizen, pointTransactions, reviewCases, systemLogs, truckPreviews } from "./demo-data";

export function buildAppProjection() {
  const balance = pointTransactions
    .filter((transaction) => transaction.citizenId === mainCitizen.citizenId)
    .reduce((total, transaction) => total + transaction.amount, 0);

  const mainEvents = events
    .filter((event) => event.citizenId === mainCitizen.citizenId)
    .sort((left, right) => right.occurredAt.localeCompare(left.occurredAt));
  const latestEvent = mainEvents[0];
  if (!latestEvent) {
    throw new Error("Demo seed must include at least one main-citizen event.");
  }

  const pendingReviewCount = reviewCases.filter((reviewCase) => reviewCase.status === "OPEN").length;
  const acceptedCount = mainEvents.filter((event) => event.decisionState === "ACCEPTED" || event.decisionState === "REVIEW_ACCEPTED").length;
  const scoredEvents = mainEvents.filter((event) => event.decisionState !== "FLAGGED" && event.uiTruthBadge !== "SIMULATED");
  const positiveEvents = scoredEvents.filter((event) => event.pointDelta > 0).length;
  const wetCount = mainEvents.filter((event) => event.selectedCompartment === "WET").length;
  const dryCount = mainEvents.filter((event) => event.selectedCompartment === "DRY").length;
  const weekEventCount = mainEvents.filter((event) => event.occurredAt >= "2026-08-16T00:00:00.000Z").length;
  const activeTruck = truckPreviews.find((truck) => truck.status === "ON_ROUTE") ?? truckPreviews[0] ?? {
    truckId: "TRK-FALLBACK",
    zone: "Seeded zone unavailable",
    status: "SCHEDULED" as const,
    distanceKm: 0,
    etaMinutes: 0
  };
  const civicDiscountPercent = Math.min(25, Math.round(balance / 80));
  const weeklyWasteTrend = [
    { day: "Mon", wet: 38, dry: 52 },
    { day: "Tue", wet: 41, dry: 47 },
    { day: "Wed", wet: 35, dry: 58 },
    { day: "Thu", wet: 44, dry: 49 },
    { day: "Fri", wet: 39, dry: 61 },
    { day: "Sat", wet: 52, dry: 45 },
    { day: "Sun", wet: 48, dry: 40 }
  ];
  const accuracyTrend = [
    { label: "D1", value: 71 },
    { label: "D3", value: 75 },
    { label: "D5", value: 78 },
    { label: "D7", value: 80 },
    { label: "D9", value: 84 },
    { label: "D11", value: 86 },
    { label: "D14", value: 89 }
  ];

  return {
    citizen: mainCitizen,
    citizens,
    balance,
    tier: tierForBalance(balance),
    nextTierAt: balance < 500 ? 500 : balance < 1000 ? 1000 : balance < 2000 ? 2000 : null,
    accuracyScore: scoredEvents.length === 0 ? 100 : Math.round((positiveEvents / scoredEvents.length) * 100),
    weekEventCount,
    wetDryMix: {
      wet: wetCount,
      dry: dryCount,
      wetPercent: mainEvents.length === 0 ? 0 : Math.round((wetCount / mainEvents.length) * 100),
      dryPercent: mainEvents.length === 0 ? 0 : Math.round((dryCount / mainEvents.length) * 100)
    },
    badges: citizenBadges,
    activeTruck,
    trucks: truckPreviews,
    civicDiscount: {
      percent: civicDiscountPercent,
      baseCess: 1200,
      discountAmount: Math.round((1200 * civicDiscountPercent) / 100),
      payable: 1200 - Math.round((1200 * civicDiscountPercent) / 100)
    },
    weeklyWasteTrend,
    accuracyTrend,
    systemLogs,
    latestEvent,
    events: mainEvents,
    reviewCases,
    deviceHealth,
    leaderboard: citizens.map((citizen, index) => ({
      alias: citizen.safeAlias,
      balance: Math.max(80, balance - index * 35),
      source: "PREVIEW/SEEDED" as const
    })),
    stats: {
      acceptedCount,
      pendingReviewCount,
      edgeQueueCount: mainEvents.filter((event) => event.transportState !== "ACKED").length,
      devicesOnline: deviceHealth.filter((health) => health.state === "OK").length,
      totalDevices: deviceHealth.length
    }
  };
}

export type AppProjection = ReturnType<typeof buildAppProjection>;
