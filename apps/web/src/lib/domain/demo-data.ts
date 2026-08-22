import type { DisposalEventRecord, HealthState } from "@sgv/contracts";

export interface Citizen {
  citizenId: string;
  displayName: string;
  safeAlias: string;
  householdSuffix: string;
}

export interface PointTransaction {
  transactionId: string;
  eventId: string;
  citizenId: string;
  amount: 10 | -10 | -20;
  reason: "AWARD" | "VIOLATION" | "REVERSAL";
  sourceLabel: string;
  createdAt: string;
}

export interface ReviewCase {
  caseId: string;
  eventId: string;
  reasonCode: string;
  status: "OPEN" | "REVIEW_ACCEPTED" | "REVIEW_NO_ACTION" | "VERIFIED_VIOLATION";
  pointEffect: 10 | 0 | -10 | -20;
  reviewerNote: string;
}

export interface DeviceHealth {
  component: string;
  state: HealthState;
  lastSeenSeconds: number;
  detail: string;
}

export interface CitizenBadge {
  badgeId: string;
  name: string;
  description: string;
  unlocked: boolean;
}

export interface TruckPreview {
  truckId: string;
  zone: string;
  status: "SCHEDULED" | "DISPATCHED" | "ON_ROUTE" | "NEAR_CITIZEN" | "COLLECTION" | "COMPLETED";
  distanceKm: number;
  etaMinutes: number;
}

export interface SystemLog {
  logId: string;
  level: "INFO" | "WARN" | "ERROR";
  source: "DEVICE" | "ML" | "EDGE" | "SYSTEM";
  message: string;
  occurredAt: string;
}

const mlBase = {
  modelVersion: "waste-demo-yolo-compatible-0.1.0",
  weightsHashSuffix: "b81f2a77",
  classMapVersion: "waste-demo-1",
  latencyMs: 840,
  inputHashSuffix: "91ad42ee"
};

export const mainCitizen: Citizen = {
  citizenId: "citizen-main-fictional",
  displayName: "Madhuban Colony Household",
  safeAlias: "GreenMadhuban",
  householdSuffix: "SGV-002"
};

export const citizens: Citizen[] = [
  mainCitizen,
  { citizenId: "citizen-peer-1", displayName: "Peer Citizen 1", safeAlias: "DrySortStar", householdSuffix: "SGV-011" },
  { citizenId: "citizen-peer-2", displayName: "Peer Citizen 2", safeAlias: "CompostPilot", householdSuffix: "SGV-014" },
  { citizenId: "citizen-peer-3", displayName: "Peer Citizen 3", safeAlias: "LedgerLeaf", householdSuffix: "SGV-017" },
  { citizenId: "citizen-peer-4", displayName: "Peer Citizen 4", safeAlias: "QueueClear", householdSuffix: "SGV-021" }
];

export const events: DisposalEventRecord[] = [
  {
    eventId: "evt-live-accepted-001",
    citizenId: mainCitizen.citizenId,
    sessionId: "sess-live-001",
    deviceCode: "ESP32-001",
    selectedCompartment: "DRY",
    triggeredCompartment: "DRY",
    eventSource: "HARDWARE",
    uiTruthBadge: "REAL",
    processingState: "COMPLETED",
    decisionState: "ACCEPTED",
    transportState: "ACKED",
    reasonCodes: ["DRY_CATEGORY_MATCH"],
    pointDelta: 10,
    occurredAt: "2026-08-22T14:28:11.123Z",
    moisturePercent: 18,
    fillPercent: 42,
    gpsFixQuality: "NO_FIX",
    ml: {
      ...mlBase,
      observationId: "obs-live-accepted-001",
      eventId: "evt-live-accepted-001",
      evidenceSource: "LOCAL_LIVE",
      status: "ML_RECEIVED",
      label: "dry-demo-item",
      category: "DRY",
      score: 0.88,
      confidenceBand: "HIGH",
      observedAt: "2026-08-22T14:28:12.020Z"
    }
  },
  {
    eventId: "evt-env-review-002",
    citizenId: mainCitizen.citizenId,
    sessionId: "sess-env-002",
    deviceCode: "ESP32-001",
    selectedCompartment: "DRY",
    triggeredCompartment: "DRY",
    eventSource: "SEEDED",
    uiTruthBadge: "PREVIEW/SEEDED",
    processingState: "COMPLETED",
    decisionState: "REVIEW_ACCEPTED",
    transportState: "ACKED",
    reasonCodes: ["ENVIRONMENTAL_WETTING_SUSPECTED"],
    pointDelta: 10,
    occurredAt: "2026-08-21T11:02:30.000Z",
    moisturePercent: 52,
    fillPercent: 37,
    gpsFixQuality: "NO_FIX",
    ml: {
      ...mlBase,
      observationId: "obs-env-review-002",
      eventId: "evt-env-review-002",
      evidenceSource: "SEEDED",
      status: "ML_RECEIVED",
      label: "dry-demo-item",
      category: "DRY",
      score: 0.78,
      confidenceBand: "MEDIUM",
      observedAt: "2026-08-21T11:02:31.000Z"
    }
  },
  {
    eventId: "evt-mismatch-003",
    citizenId: mainCitizen.citizenId,
    sessionId: "sess-mismatch-003",
    deviceCode: "ESP32-001",
    selectedCompartment: "DRY",
    triggeredCompartment: "DRY",
    eventSource: "SEEDED",
    uiTruthBadge: "PREVIEW/SEEDED",
    processingState: "COMPLETED",
    decisionState: "VERIFIED_VIOLATION",
    transportState: "ACKED",
    reasonCodes: ["CATEGORY_MISMATCH"],
    pointDelta: -10,
    occurredAt: "2026-08-20T16:18:00.000Z",
    moisturePercent: 22,
    fillPercent: 58,
    gpsFixQuality: "NO_FIX",
    ml: {
      ...mlBase,
      observationId: "obs-mismatch-003",
      eventId: "evt-mismatch-003",
      evidenceSource: "SEEDED",
      status: "ML_RECEIVED",
      label: "wet-demo-item",
      category: "WET",
      score: 0.89,
      confidenceBand: "HIGH",
      observedAt: "2026-08-20T16:18:01.000Z"
    }
  },
  {
    eventId: "evt-model-unavailable-004",
    citizenId: mainCitizen.citizenId,
    sessionId: "sess-model-004",
    deviceCode: "ESP32-001",
    selectedCompartment: "WET",
    triggeredCompartment: "WET",
    eventSource: "RECORDED_HARDWARE",
    uiTruthBadge: "RECORDED",
    processingState: "REVIEW_REQUIRED",
    decisionState: "FLAGGED",
    transportState: "ACKED",
    reasonCodes: ["ML_UNAVAILABLE"],
    pointDelta: 0,
    occurredAt: "2026-08-19T09:41:00.000Z",
    moisturePercent: null,
    fillPercent: 63,
    gpsFixQuality: "NO_FIX",
    ml: {
      ...mlBase,
      observationId: "obs-model-unavailable-004",
      eventId: "evt-model-unavailable-004",
      evidenceSource: "RECORDED_ML",
      status: "ML_UNAVAILABLE",
      label: "unavailable",
      category: "UNKNOWN",
      score: null,
      confidenceBand: null,
      latencyMs: null,
      observedAt: "2026-08-19T09:41:02.000Z"
    }
  },
  {
    eventId: "evt-sim-005",
    citizenId: mainCitizen.citizenId,
    sessionId: "sess-sim-005",
    deviceCode: "ESP32-SIM",
    selectedCompartment: "DRY",
    triggeredCompartment: "DRY",
    eventSource: "SIMULATED",
    uiTruthBadge: "SIMULATED",
    processingState: "COMPLETED",
    decisionState: "FLAGGED",
    transportState: "ACKED",
    reasonCodes: ["ML_UNCERTAIN"],
    pointDelta: 0,
    occurredAt: "2026-08-18T12:00:00.000Z",
    moisturePercent: 16,
    fillPercent: 12,
    gpsFixQuality: "UNKNOWN",
    ml: {
      ...mlBase,
      observationId: "obs-sim-005",
      eventId: "evt-sim-005",
      evidenceSource: "SIMULATED",
      status: "ML_RECEIVED",
      label: "unknown-demo-item",
      category: "UNKNOWN",
      score: 0.41,
      confidenceBand: "LOW",
      observedAt: "2026-08-18T12:00:01.000Z"
    }
  }
];

for (let index = 6; index <= 20; index += 1) {
  const accepted = index % 5 !== 0;
  events.push({
    eventId: `evt-seeded-${index.toString().padStart(3, "0")}`,
    citizenId: mainCitizen.citizenId,
    sessionId: `sess-seeded-${index.toString().padStart(3, "0")}`,
    deviceCode: "ESP32-001",
    selectedCompartment: index % 2 === 0 ? "DRY" : "WET",
    triggeredCompartment: index % 2 === 0 ? "DRY" : "WET",
    eventSource: "SEEDED",
    uiTruthBadge: "PREVIEW/SEEDED",
    processingState: accepted ? "COMPLETED" : "REVIEW_REQUIRED",
    decisionState: accepted ? "ACCEPTED" : "FLAGGED",
    transportState: index === 10 ? "PENDING" : "ACKED",
    reasonCodes: accepted ? [index % 2 === 0 ? "DRY_CATEGORY_MATCH" : "WET_CATEGORY_MATCH"] : ["ML_UNCERTAIN"],
    pointDelta: accepted ? 10 : 0,
    occurredAt: `2026-08-${String(18 - (index % 7)).padStart(2, "0")}T10:${String(index * 2).padStart(2, "0")}:00.000Z`,
    moisturePercent: index % 2 === 0 ? 24 : null,
    fillPercent: 20 + index,
    gpsFixQuality: "NO_FIX",
    ml: {
      ...mlBase,
      observationId: `obs-seeded-${index.toString().padStart(3, "0")}`,
      eventId: `evt-seeded-${index.toString().padStart(3, "0")}`,
      evidenceSource: "SEEDED",
      status: "ML_RECEIVED",
      label: index % 2 === 0 ? "dry-demo-item" : "wet-demo-item",
      category: index % 2 === 0 ? "DRY" : "WET",
      score: accepted ? 0.74 : 0.44,
      confidenceBand: accepted ? "MEDIUM" : "LOW",
      observedAt: `2026-08-${String(18 - (index % 7)).padStart(2, "0")}T10:${String(index * 2 + 1).padStart(2, "0")}:00.000Z`
    }
  });
}

export const pointTransactions: PointTransaction[] = events
  .filter((event) => event.pointDelta !== 0)
  .map((event) => ({
    transactionId: `txn-${event.eventId}`,
    eventId: event.eventId,
    citizenId: event.citizenId,
    amount: event.pointDelta as 10 | -10 | -20,
    reason: event.pointDelta > 0 ? "AWARD" : "VIOLATION",
    sourceLabel: event.uiTruthBadge,
    createdAt: event.occurredAt
  }));

export const reviewCases: ReviewCase[] = events
  .filter((event) => event.decisionState === "FLAGGED" || event.decisionState.includes("REVIEW") || event.decisionState === "VERIFIED_VIOLATION")
  .map((event, index) => ({
    caseId: `review-${index + 1}`,
    eventId: event.eventId,
    reasonCode: event.reasonCodes[0] ?? "UNCLASSIFIED_EVIDENCE",
    status: event.decisionState === "VERIFIED_VIOLATION" ? "VERIFIED_VIOLATION" : event.decisionState === "REVIEW_ACCEPTED" ? "REVIEW_ACCEPTED" : "OPEN",
    pointEffect: event.pointDelta as 10 | 0 | -10 | -20,
    reviewerNote: event.pointDelta < 0 ? "Verified by fictional municipal reviewer with reason recorded." : "Awaiting or cleared by human review."
  }));

export const deviceHealth: DeviceHealth[] = [
  { component: "ESP32 Wi-Fi/LAN", state: "OK", lastSeenSeconds: 8, detail: "Signed heartbeat received from ESP32-001" },
  { component: "Wet IR", state: "OK", lastSeenSeconds: 12, detail: "Independent debounce healthy" },
  { component: "Dry IR", state: "OK", lastSeenSeconds: 9, detail: "Independent debounce healthy" },
  { component: "Wet ultrasonic", state: "OK", lastSeenSeconds: 18, detail: "Fill telemetry only" },
  { component: "Dry ultrasonic", state: "OK", lastSeenSeconds: 18, detail: "Fill telemetry only" },
  { component: "Dry moisture", state: "DEGRADED", lastSeenSeconds: 42, detail: "Calibration due after demo run" },
  { component: "GPS", state: "DEGRADED", lastSeenSeconds: 55, detail: "Indoor NO_FIX reported honestly" },
  { component: "SQLite WAL", state: "OK", lastSeenSeconds: 2, detail: "synchronous=FULL, queue writable" },
  { component: "Local camera", state: "UNKNOWN", lastSeenSeconds: 0, detail: "Configured adapter disabled in seeded mode" },
  { component: "Model manifest", state: "DEGRADED", lastSeenSeconds: 0, detail: "Weights must be provisioned before live ML claim" }
];

export const citizenBadges: CitizenBadge[] = [
  { badgeId: "first-scan", name: "First Scan", description: "Completed the first verified disposal session.", unlocked: true },
  { badgeId: "streak-7", name: "7-Day Streak", description: "Kept correct segregation running for a week.", unlocked: true },
  { badgeId: "gold-tier", name: "Gold Tier", description: "Reach 1,000 EcoCredit points.", unlocked: false },
  { badgeId: "zero-waste-week", name: "Zero Waste Week", description: "Finish a week with no verified violation.", unlocked: false }
];

export const truckPreviews: TruckPreview[] = [
  { truckId: "TRK-001", zone: "Zone 4 · Madhuban Colony", status: "ON_ROUTE", distanceKm: 2.4, etaMinutes: 12 },
  { truckId: "TRK-002", zone: "Zone 2 · Market Road", status: "DISPATCHED", distanceKm: 5.1, etaMinutes: 28 },
  { truckId: "TRK-003", zone: "Zone 7 · Transfer Station", status: "COMPLETED", distanceKm: 0, etaMinutes: 0 }
];

export const systemLogs: SystemLog[] = [
  {
    logId: "log-device-heartbeat",
    level: "INFO",
    source: "DEVICE",
    message: "ESP32-001 heartbeat OK; seven sensor channels reported.",
    occurredAt: "2026-08-22T14:30:00.000Z"
  },
  {
    logId: "log-ml-inference",
    level: "INFO",
    source: "ML",
    message: "Local inference completed for evt-live-accepted-001 in 840ms.",
    occurredAt: "2026-08-22T14:28:12.950Z"
  },
  {
    logId: "log-edge-sync",
    level: "WARN",
    source: "EDGE",
    message: "One queue item pending cloud ACK; decision engine remains isolated.",
    occurredAt: "2026-08-22T14:25:00.000Z"
  },
  {
    logId: "log-moisture-calibration",
    level: "WARN",
    source: "DEVICE",
    message: "Dry moisture sensor calibration due after demo run.",
    occurredAt: "2026-08-22T14:20:00.000Z"
  }
];
