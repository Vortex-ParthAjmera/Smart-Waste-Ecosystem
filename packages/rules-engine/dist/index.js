export const RULESET_VERSION = "rules-2.0.0";
export function confidenceBand(score) {
    if (score === null || !Number.isFinite(score) || score < 0 || score > 1)
        return null;
    if (score < 0.6)
        return "LOW";
    if (score < 0.85)
        return "MEDIUM";
    return "HIGH";
}
export function uiTruthBadge(eventSource, evidenceSource) {
    if (eventSource === "HARDWARE" && (!evidenceSource || evidenceSource === "LOCAL_LIVE"))
        return "REAL";
    if (eventSource === "RECORDED_HARDWARE" || evidenceSource === "RECORDED_ML")
        return "RECORDED";
    if (eventSource === "SIMULATED" || evidenceSource === "SIMULATED")
        return "SIMULATED";
    return "PREVIEW/SEEDED";
}
function accepted(reasonCode, band) {
    return {
        rulesetVersion: RULESET_VERSION,
        automatedResult: "ACCEPTED",
        immediatePointDelta: 10,
        reasonCodes: [reasonCode],
        confidenceBand: band,
        severeViolationEligible: false,
        humanReviewRequired: false
    };
}
function flagged(reasonCode, band, severeViolationEligible = false) {
    return {
        rulesetVersion: RULESET_VERSION,
        automatedResult: "FLAGGED",
        immediatePointDelta: 0,
        reasonCodes: [reasonCode],
        confidenceBand: band,
        severeViolationEligible,
        humanReviewRequired: true
    };
}
export function evaluateDisposal(input) {
    const band = confidenceBand(input.mlScore);
    const provenancePairs = new Set([
        "HARDWARE:LOCAL_LIVE",
        "RECORDED_HARDWARE:RECORDED_ML",
        "SIMULATED:SIMULATED",
        "SEEDED:SEEDED"
    ]);
    if (input.safetyHold)
        return flagged("SAFETY_HOLD", band);
    if (!input.sessionValid)
        return flagged("IDENTITY_OR_SESSION_INVALID", band);
    if (!input.triggeredCompartment)
        return flagged("INTAKE_NOT_CONFIRMED", band);
    if (input.triggeredCompartment !== input.selectedCompartment)
        return flagged("COMPARTMENT_TRIGGER_MISMATCH", band);
    if (!input.triggerQualityGood || !input.sensorEvidenceGood)
        return flagged("EVIDENCE_INSUFFICIENT", band);
    if (input.mlStatus === "ML_UNAVAILABLE")
        return flagged("ML_UNAVAILABLE", band);
    if (!provenancePairs.has(`${input.eventSource}:${input.evidenceSource}`))
        return flagged("PROVENANCE_MISMATCH", band);
    if (input.evidenceSource === "RECORDED_ML")
        return flagged("RECORDED_ML_REQUIRES_REVIEW", band);
    if (input.mlCategory === "UNKNOWN" || input.conflictingObjects || band === null || band === "LOW")
        return flagged("ML_UNCERTAIN", band);
    const highMoisture = input.dryMoisturePercent !== null && input.dryMoisturePercent > 45;
    if (input.selectedCompartment === "DRY" && input.mlCategory === "WET" && highMoisture) {
        return flagged("SEVERE_WET_IN_DRY_SUSPECTED", band, true);
    }
    if (input.mlCategory !== input.selectedCompartment)
        return flagged("CATEGORY_MISMATCH", band);
    if (input.selectedCompartment === "DRY" && input.mlCategory === "DRY" && highMoisture) {
        return flagged("ENVIRONMENTAL_WETTING_SUSPECTED", band);
    }
    if (input.selectedCompartment === "DRY" && input.mlCategory === "DRY")
        return accepted("DRY_CATEGORY_MATCH", band);
    if (input.selectedCompartment === "WET" && input.mlCategory === "WET")
        return accepted("WET_CATEGORY_MATCH", band);
    return flagged("UNCLASSIFIED_EVIDENCE", band);
}
export function reviewPointDelta(outcome, severe) {
    if (outcome === "REVIEW_ACCEPTED")
        return 10;
    if (outcome === "REVIEW_NO_ACTION")
        return 0;
    return severe ? -20 : -10;
}
export function tierForBalance(balance) {
    if (balance >= 2000)
        return "PLATINUM";
    if (balance >= 1000)
        return "GOLD";
    if (balance >= 500)
        return "SILVER";
    return "BRONZE";
}
