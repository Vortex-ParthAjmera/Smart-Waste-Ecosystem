import { describe, expect, it } from "vitest";
import { confidenceBand, evaluateDisposal, reviewPointDelta, tierForBalance } from "../src";

const base = {
  eventId: "event-1",
  selectedCompartment: "DRY" as const,
  triggeredCompartment: "DRY" as const,
  eventSource: "HARDWARE" as const,
  evidenceSource: "LOCAL_LIVE" as const,
  sessionValid: true,
  triggerQualityGood: true,
  sensorEvidenceGood: true,
  safetyHold: false,
  mlStatus: "ML_RECEIVED" as const,
  mlCategory: "DRY" as const,
  mlScore: 0.86,
  conflictingObjects: false,
  dryMoisturePercent: 18
};

describe("rules-2.0.0", () => {
  it("uses exact confidence bands", () => {
    expect(confidenceBand(0.59999)).toBe("LOW");
    expect(confidenceBand(0.6)).toBe("MEDIUM");
    expect(confidenceBand(0.84999)).toBe("MEDIUM");
    expect(confidenceBand(0.85)).toBe("HIGH");
    expect(confidenceBand(Number.NaN)).toBeNull();
  });

  it("accepts supported matching dry evidence and awards exactly ten", () => {
    expect(evaluateDisposal(base)).toMatchObject({
      automatedResult: "ACCEPTED",
      immediatePointDelta: 10,
      reasonCodes: ["DRY_CATEGORY_MATCH"]
    });
  });

  it("flags uncertain evidence with zero immediate points", () => {
    expect(evaluateDisposal({ ...base, mlScore: 0.2 })).toMatchObject({
      automatedResult: "FLAGGED",
      immediatePointDelta: 0,
      reasonCodes: ["ML_UNCERTAIN"]
    });
  });

  it("flags environmental wetting without an automatic negative", () => {
    expect(evaluateDisposal({ ...base, dryMoisturePercent: 55 })).toMatchObject({
      automatedResult: "FLAGGED",
      immediatePointDelta: 0,
      reasonCodes: ["ENVIRONMENTAL_WETTING_SUSPECTED"]
    });
  });

  it("keeps negative values behind human review", () => {
    expect(reviewPointDelta("VERIFIED_VIOLATION", false)).toBe(-10);
    expect(reviewPointDelta("VERIFIED_VIOLATION", true)).toBe(-20);
    expect(reviewPointDelta("REVIEW_NO_ACTION", true)).toBe(0);
  });

  it("projects tiers from ledger-derived balance", () => {
    expect(tierForBalance(499)).toBe("BRONZE");
    expect(tierForBalance(500)).toBe("SILVER");
    expect(tierForBalance(1000)).toBe("GOLD");
    expect(tierForBalance(2000)).toBe("PLATINUM");
  });
});
