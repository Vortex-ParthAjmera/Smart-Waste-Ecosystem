import { ok } from "@/lib/api-client/envelope";
import { buildAppProjection } from "@/lib/domain/projections";

export function GET() {
  const projection = buildAppProjection();
  return ok({
    displaySuffix: projection.citizen.householdSuffix,
    expiresAt: "2026-08-22T18:30:00.000Z",
    rawTokenReturned: false,
    containsPii: false
  });
}
