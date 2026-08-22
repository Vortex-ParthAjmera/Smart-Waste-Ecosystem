export type Compartment = "WET" | "DRY";
export type WasteCategory = "WET" | "DRY" | "UNKNOWN";
export type EventSource = "HARDWARE" | "RECORDED_HARDWARE" | "SIMULATED" | "SEEDED";
export type EvidenceSource = "LOCAL_LIVE" | "RECORDED_ML" | "SIMULATED" | "SEEDED";
export type UiTruthBadge = "REAL" | "RECORDED" | "SIMULATED" | "PREVIEW/SEEDED";
export type ConfidenceBand = "LOW" | "MEDIUM" | "HIGH";
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
export type TransportState = "PENDING" | "IN_FLIGHT" | "ACKED" | "DEAD_LETTER" | "AUTH_BLOCKED";
export type HealthState = "OK" | "DEGRADED" | "MISSING" | "FAILED" | "UNKNOWN";

export interface MlObservation {
  observationId: string;
  eventId: string;
  evidenceSource: EvidenceSource;
  status: "ML_RECEIVED" | "ML_UNAVAILABLE";
  modelVersion: string;
  weightsHashSuffix: string;
  classMapVersion: string;
  label: string;
  category: WasteCategory;
  score: number | null;
  confidenceBand: ConfidenceBand | null;
  latencyMs: number | null;
  inputHashSuffix: string;
  observedAt: string;
}

export interface DisposalEventRecord {
  eventId: string;
  citizenId: string;
  sessionId: string;
  deviceCode: string;
  selectedCompartment: Compartment;
  triggeredCompartment: Compartment | null;
  eventSource: EventSource;
  uiTruthBadge: UiTruthBadge;
  processingState: ProcessingState;
  decisionState: DecisionState;
  transportState: TransportState;
  reasonCodes: string[];
  pointDelta: number;
  occurredAt: string;
  moisturePercent: number | null;
  fillPercent: number | null;
  gpsFixQuality: "FIX_3D" | "FIX_2D" | "NO_FIX" | "UNKNOWN";
  ml: MlObservation;
}

export interface ApiSuccess<T> {
  data: T;
  meta: { requestId: string };
}

export interface ApiList<T> {
  data: T[];
  page: { nextCursor: string | null; hasMore: boolean };
  meta: { requestId: string };
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: Array<{ path: string; code: string }>;
    retryable: boolean;
  };
  meta: { requestId: string };
}
