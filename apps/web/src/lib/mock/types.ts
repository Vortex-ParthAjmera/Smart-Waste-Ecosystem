// ============================================================
// Mock Data Types — aligned with AGENTS.md v2.0 contract types
// ============================================================

// --- Truth / Provenance ---
export type EventSource = "HARDWARE" | "RECORDED_HARDWARE" | "SIMULATED" | "SEEDED";
export type EvidenceSource = "LOCAL_LIVE" | "RECORDED_ML" | "SIMULATED" | "SEEDED";
export type TruthBadge = "REAL" | "RECORDED" | "SIMULATED" | "PREVIEW/SEEDED";

// --- Waste ---
export type Compartment = "WET" | "DRY";
export type WasteCategory = "WET" | "DRY" | "UNKNOWN";

// --- ML ---
export type MLStatus = "SUPPORTED" | "UNSUPPORTED" | "MULTIPLE" | "UNAVAILABLE" | "TIMEOUT";
export type ScoreBand = "LOW" | "MEDIUM" | "HIGH";

// --- Component health ---
export type ComponentHealth = "OK" | "DEGRADED" | "MISSING" | "FAILED" | "UNKNOWN";

// --- GPS ---
export type FixQuality = "GPS" | "RTC" | "NO_FIX" | "UNKNOWN";

// --- Processing state ---
export type ProcessingState =
  | "DISPOSAL_STARTED"
  | "SENSOR_CAPTURED"
  | "ML_PENDING"
  | "ML_RECEIVED"
  | "ML_UNAVAILABLE"
  | "PROCESSING"
  | "SEGREGATION_DECIDED"
  | "POINTS_CALCULATED"
  | "REVIEW_REQUIRED"
  | "COMPLETED"
  | "PROCESSING_FAILED";

// --- Decision / Review state ---
export type DecisionState =
  | "CAPTURED"
  | "EVALUATING"
  | "ACCEPTED"
  | "FLAGGED"
  | "REVIEW_ACCEPTED"
  | "REVIEW_NO_ACTION"
  | "VERIFIED_VIOLATION"
  | "PENALIZED"
  | "CLOSED";

// --- Transport state ---
export type TransportState =
  | "QUEUED_LOCALLY"
  | "PENDING"
  | "IN_FLIGHT"
  | "ACKED"
  | "DEAD_LETTER"
  | "AUTH_BLOCKED";

// --- Tier ---
export type CitizenTier = "BRONZE" | "SILVER" | "GOLD" | "PLATINUM";

// --- Point source ---
export type PointSource = "AWARD" | "VIOLATION" | "REVERSAL";

// --- Review case status ---
export type ReviewCaseStatus = "PENDING" | "REVIEW_ACCEPTED" | "REVIEW_NO_ACTION" | "VERIFIED_VIOLATION";

// --- Models ---
export interface Citizen {
  id: string;
  name: string;
  phone: string;
  pointsBalance: number;
  tier: CitizenTier;
  segregationScore: number;
  badges: Badge[];
  avatarUrl?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  earnedAt: string | null;
  unlocked: boolean;
}

export interface MLDetection {
  eventId: string;
  status: MLStatus;
  wasteType: string;
  category: WasteCategory;
  confidence: number;
  scoreBand: ScoreBand;
  evidenceSource: EvidenceSource;
  modelVersion: string;
  weightsHash: string;
  latencyMs: number;
}

export interface SensorMeasurements {
  irConfirmation: { triggered: boolean; quality: ComponentHealth };
  moisturePercent: { value: number; quality: ComponentHealth; calibrationVersion?: string };
  ultrasonicFill: { wetPercent: number; dryPercent: number; quality: ComponentHealth };
}

export interface DisposalEvent {
  eventId: string;
  sessionId: string;
  citizenId: string;
  deviceCode: string;
  timestamp: string;
  eventSource: EventSource;
  selectedCompartment: Compartment;
  mlDetection: MLDetection;
  measurements: SensorMeasurements;
  location: { latitude?: number; longitude?: number; fixQuality: FixQuality };
  processingState: ProcessingState;
  decisionState: DecisionState;
  transportState: TransportState;
  pointsAwarded: number;
}

export interface PointTransaction {
  id: string;
  citizenId: string;
  eventId: string;
  amount: number;
  reason: string;
  source: PointSource;
  timestamp: string;
  provenance: EventSource;
  truthBadge: TruthBadge;
}

export interface DeviceComponent {
  name: string;
  code: string;
  health: ComponentHealth;
  lastSeen: string;
  lastValue?: string;
}

export interface Device {
  deviceCode: string;
  firmwareVersion: string;
  components: DeviceComponent[];
  lastHeartbeat: string;
  edgeQueueDepth: number;
  cloudSyncStatus: TransportState;
}

export interface ReviewCase {
  caseId: string;
  eventId: string;
  citizenId: string;
  reason: string;
  eventSource: EventSource;
  truthBadge: TruthBadge;
  createdAt: string;
  status: ReviewCaseStatus;
}

export interface Truck {
  truckId: string;
  status: string;
  distanceKm: number;
  etaMinutes: number;
  route?: string;
}

// --- Helper ---
export function getTierFromBalance(points: number): CitizenTier {
  if (points >= 2000) return "PLATINUM";
  if (points >= 1000) return "GOLD";
  if (points >= 500) return "SILVER";
  return "BRONZE";
}

export function getTruthBadge(eventSource: EventSource, evidenceSource?: EvidenceSource): TruthBadge {
  if (eventSource === "SIMULATED" || evidenceSource === "SIMULATED") return "SIMULATED";
  if (eventSource === "SEEDED" || evidenceSource === "SEEDED") return "PREVIEW/SEEDED";
  if (eventSource === "RECORDED_HARDWARE" || evidenceSource === "RECORDED_ML") return "RECORDED";
  return "REAL";
}

export function getScoreBand(confidence: number): ScoreBand {
  if (confidence >= 0.85) return "HIGH";
  if (confidence >= 0.60) return "MEDIUM";
  return "LOW";
}

export function getDecisionLabel(state: DecisionState): string {
  const labels: Record<DecisionState, string> = {
    CAPTURED: "Captured",
    EVALUATING: "Evaluating...",
    ACCEPTED: "Accepted — Correct Segregation",
    FLAGGED: "Needs Officer Review",
    REVIEW_ACCEPTED: "Review Accepted",
    REVIEW_NO_ACTION: "No Action Taken",
    VERIFIED_VIOLATION: "Verified Violation",
    PENALIZED: "Penalty Applied",
    CLOSED: "Closed",
  };
  return labels[state];
}

export function getHealthLabel(health: ComponentHealth): string {
  const labels: Record<ComponentHealth, string> = {
    OK: "Online",
    DEGRADED: "Degraded",
    MISSING: "Missing",
    FAILED: "Failed",
    UNKNOWN: "Unknown",
  };
  return labels[health];
}
