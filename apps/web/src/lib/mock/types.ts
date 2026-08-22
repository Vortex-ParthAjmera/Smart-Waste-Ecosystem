// =========================================================================
// Frozen contract types for the Smart Waste Ecosystem — UI-ONLY mock layer.
// These mirror `mock_data_shapes` in the build spec exactly.
// =========================================================================

export type Tier = "BRONZE" | "SILVER" | "GOLD" | "PLATINUM";

export type WasteCompartment = "WET" | "DRY";

export type EventSource =
  | "HARDWARE"
  | "RECORDED_HARDWARE"
  | "SIMULATED"
  | "SEEDED";

export type EvidenceSource =
  | "LOCAL_LIVE"
  | "RECORDED_ML"
  | "SIMULATED"
  | "SEEDED";

// Maps eventSource/evidenceSource -> the exact truth badge vocabulary
export type TruthBadgeValue = "REAL" | "RECORDED" | "SIMULATED" | "PREVIEW_SEEDED";

export type MlStatus =
  | "SUPPORTED"
  | "UNSUPPORTED"
  | "MULTIPLE"
  | "UNAVAILABLE"
  | "TIMEOUT";

export type ScoreBand = "LOW" | "MEDIUM" | "HIGH";

export type SensorQuality = "GOOD" | "DEGRADED" | "MISSING";

export type FixQuality = "GPS" | "NO_FIX";

export type ProcessingState =
  | "DISPOSAL_STARTED"
  | "SENSOR_CAPTURED"
  | "ML_PENDING"
  | "ML_RECEIVED"
  | "PROCESSING"
  | "COMPLETED";

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

export type TransportState =
  | "QUEUED_LOCALLY"
  | "PENDING"
  | "IN_FLIGHT"
  | "ACKED"
  | "DEAD_LETTER"
  | "AUTH_BLOCKED";

export type ComponentHealth = "OK" | "DEGRADED" | "MISSING" | "FAILED" | "UNKNOWN";

export interface Badge {
  id: string;
  name: string;
  description: string;
  earnedAt?: string;
  locked?: boolean;
  unlockCriteria?: string;
}

export interface Citizen {
  id: string;
  name: string;
  phone: string; // masked
  locality: string;
  pointsBalance: number;
  tier: Tier;
  segregationScore: number;
  badges: Badge[];
}

export interface MlDetection {
  eventId: string;
  status: MlStatus;
  wasteType: string;
  category: "WET" | "DRY" | "UNKNOWN";
  confidence: number;
  scoreBand: ScoreBand;
  evidenceSource: EvidenceSource;
  modelVersion: string;
  weightsHash: string;
  latencyMs: number;
}

export interface DisposalEvent {
  eventId: string;
  sessionId: string;
  citizenId: string;
  deviceCode: string;
  timestamp: string;
  eventSource: EventSource;
  selectedCompartment: WasteCompartment;
  mlDetection: {
    status: MlStatus;
    wasteType: string;
    category: "WET" | "DRY" | "UNKNOWN";
    confidence: number;
    scoreBand: ScoreBand;
    evidenceSource: EvidenceSource;
    modelVersion: string;
  } | null;
  measurements: {
    irConfirmation: { triggered: boolean; quality: SensorQuality };
    moisturePercent: { value: number; quality: SensorQuality };
    ultrasonicFill: { wetPercent: number; dryPercent: number; quality: SensorQuality };
  };
  location: { latitude?: number; longitude?: number; fixQuality: FixQuality };
  processingState: ProcessingState;
  decisionState: DecisionState;
  transportState: TransportState;
  pointsAwarded: number;
  reasonCode?: string;
  reasonPlain?: string;
}

export interface PointTransaction {
  id: string;
  citizenId: string;
  eventId: string;
  amount: number;
  reason: string;
  source: "AWARD" | "VIOLATION" | "REVERSAL";
  timestamp: string;
  provenance: EventSource;
}

export interface DeviceComponents {
  wifi: ComponentHealth;
  gps: ComponentHealth;
  irWet: ComponentHealth;
  irDry: ComponentHealth;
  ultrasonicWet: ComponentHealth;
  ultrasonicDry: ComponentHealth;
  moisture: ComponentHealth;
  camera: ComponentHealth;
  model: ComponentHealth;
}

export interface Device {
  deviceCode: string;
  label: string;
  zone: string;
  components: DeviceComponents;
  lastSeen: string;
  firmwareVersion: string;
}

export interface Truck {
  truckId: string;
  status: string;
  distanceKm: number;
  etaMinutes: number;
  zone: string;
  stage:
    | "SCHEDULED"
    | "DISPATCHED"
    | "ON_ROUTE"
    | "NEAR"
    | "COLLECTION"
    | "COMPLETED";
}

export interface ReviewCase {
  caseId: string;
  eventId: string;
  citizenId: string;
  reason: string;
  eventSource: EventSource;
  truthBadge: TruthBadgeValue;
  createdAt: string;
  status: "PENDING" | "REVIEW_ACCEPTED" | "REVIEW_NO_ACTION" | "VERIFIED_VIOLATION";
  ageMinutes: number;
  category: WasteCompartment | "UNKNOWN";
}

export interface LeaderboardEntry {
  alias: string;
  locality: string;
  points: number;
  rank: number;
  isSelf?: boolean;
}

export interface EdgeQueueSnapshot {
  pending: number;
  inFlight: number;
  acked: number;
  authBlocked: number;
  deadLetter: number;
  lastSuccessfulSync: string;
  nextRetry: string;
  safeErrorCode: string | null;
}

export interface LogEntry {
  id: string;
  eventId: string;
  timestamp: string;
  level: "INFO" | "WARN" | "ERROR";
  message: string;
}
