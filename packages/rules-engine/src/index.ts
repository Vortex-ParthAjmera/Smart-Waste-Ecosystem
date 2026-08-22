/**
 * packages/rules-engine/src/index.ts
 * Deterministic rules-2.0.0 — pure function, no I/O
 *
 * Owner: AASHU JOSHI
 * This is a type/interface stub. Full implementation by Aashu.
 */

export type Compartment = "WET" | "DRY";
export type Category = "WET" | "DRY" | "UNKNOWN";
export type ConfidenceBand = "LOW" | "MEDIUM" | "HIGH";
export type Outcome = "ACCEPTED" | "FLAGGED";
export type Severity = "NONE" | "NORMAL" | "SEVERE";
export type MoistureBand = "NORMAL" | "ELEVATED" | "HIGH";

export interface MLDetectionInput {
  status: "DETECTED" | "NO_DETECTION" | "MULTIPLE_CONFLICTING" | "UNAVAILABLE" | "TIMED_OUT" | "FAILED";
  predictedCategory: Category;
  score: number | null;
  confidenceBand: ConfidenceBand | null;
  detectedLabel: string | null;
}

export interface SensorInput {
  irTriggered: boolean;
  irQuality: "GOOD" | "DEGRADED" | "MISSING" | "FAILED";
  fillPercent: number | null;
  fillQuality: "GOOD" | "DEGRADED" | "MISSING" | "FAILED" | "NOT_APPLICABLE";
  moisturePercent: number | null;
  moistureQuality: "GOOD" | "DEGRADED" | "MISSING" | "FAILED" | "NOT_APPLICABLE";
}

export interface RulesInput {
  selectedCompartment: Compartment;
  sensor: SensorInput;
  ml: MLDetectionInput;
  eventSource: "HARDWARE" | "RECORDED_HARDWARE" | "SIMULATED" | "SEEDED";
}

export interface RulesResult {
  outcome: Outcome;
  suggestedSeverity: Severity;
  reasonCodes: string[];
  pointsDelta: number;
  rulesetVersion: string;
}

/**
 * Evaluate disposal event against rules-2.0.0.
 * Pure function — no database, network, or side effects.
 *
 * Thresholds (immutable):
 *   ML score < 0.60        → LOW
 *   0.60 <= score < 0.85   → MEDIUM
 *   score >= 0.85           → HIGH
 *
 *   Dry moisture < 30%      → NORMAL
 *   30% to 45%              → ELEVATED
 *   > 45%                   → HIGH
 *
 * Matrix:
 *   Supported match + score >= 0.60 + good quality + normal moisture → ACCEPTED +10
 *   No/unsupported/multiple/score < 0.60/unavailable/late → FLAGGED +0
 *   Dry supported + moisture > 45% → FLAGGED, ENVIRONMENTAL_WETTING_SUSPECTED
 *   Opposite category → FLAGGED, CATEGORY_MISMATCH
 *   Wet in dry + score >= 0.85 + moisture > 45 → FLAGGED, SEVERE_WET_IN_DRY
 */
export function evaluateRules(input: RulesInput): RulesResult {
  // TODO: Full implementation by AASHU JOSHI
  // This is the interface contract that Bhumika's tests validate.
  throw new Error("Not implemented — assigned to AASHU JOSHI");
}

export const RULES_VERSION = "rules-2.0.0" as const;
