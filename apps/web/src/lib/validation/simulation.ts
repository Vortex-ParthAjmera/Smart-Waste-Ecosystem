import { z } from "zod";

export const simulationRequestSchema = z.object({
  fixtureId: z.enum(["dry-low-confidence", "environmental-wetting", "severe-wet-in-dry"]),
  reason: z.string().min(5).max(180)
});
