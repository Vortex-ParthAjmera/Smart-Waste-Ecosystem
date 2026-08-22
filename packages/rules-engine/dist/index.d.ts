import type { Compartment, ConfidenceBand, EventSource, EvidenceSource, WasteCategory } from "@sgv/contracts";
export declare const RULESET_VERSION: "rules-2.0.0";
export interface RuleInput {
    eventId: string;
    selectedCompartment: Compartment;
    triggeredCompartment: Compartment | null;
    eventSource: EventSource;
    evidenceSource: EvidenceSource;
    sessionValid: boolean;
    triggerQualityGood: boolean;
    sensorEvidenceGood: boolean;
    safetyHold: boolean;
    mlStatus: "ML_RECEIVED" | "ML_UNAVAILABLE";
    mlCategory: WasteCategory;
    mlScore: number | null;
    conflictingObjects: boolean;
    dryMoisturePercent: number | null;
}
export interface RuleDecision {
    rulesetVersion: typeof RULESET_VERSION;
    automatedResult: "ACCEPTED" | "FLAGGED";
    immediatePointDelta: 10 | 0;
    reasonCodes: string[];
    confidenceBand: ConfidenceBand | null;
    severeViolationEligible: boolean;
    humanReviewRequired: boolean;
}
export declare function confidenceBand(score: number | null): ConfidenceBand | null;
export declare function uiTruthBadge(eventSource: EventSource, evidenceSource?: EvidenceSource): "SIMULATED" | "REAL" | "RECORDED" | "PREVIEW/SEEDED";
export declare function evaluateDisposal(input: RuleInput): RuleDecision;
export declare function reviewPointDelta(outcome: "REVIEW_ACCEPTED" | "REVIEW_NO_ACTION" | "VERIFIED_VIOLATION", severe: boolean): 10 | 0 | -10 | -20;
export declare function tierForBalance(balance: number): "PLATINUM" | "GOLD" | "SILVER" | "BRONZE";
