import { describe, expect, it } from "vitest";
import { buildAppProjection } from "./projections";

describe("app projections", () => {
  it("reconciles balance from append-only transactions", () => {
    const projection = buildAppProjection();
    const ledgerTotal = projection.events.reduce((sum, event) => sum + event.pointDelta, 0);
    expect(projection.balance).toBe(ledgerTotal);
    expect(projection.events.length).toBeGreaterThanOrEqual(15);
    expect(projection.events.length).toBeLessThanOrEqual(25);
  });

  it("keeps Tier 2 data labelled and separate", () => {
    const projection = buildAppProjection();
    expect(projection.leaderboard.every((entry) => entry.source === "PREVIEW/SEEDED")).toBe(true);
  });
});
