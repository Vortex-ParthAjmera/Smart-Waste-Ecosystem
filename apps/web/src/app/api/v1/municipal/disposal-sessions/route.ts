import { ok } from "@/lib/api-client/envelope";
import { buildAppProjection } from "@/lib/domain/projections";

export async function POST() {
  const projection = buildAppProjection();
  return ok(
    {
      sessionId: "sess-live-001",
      eventId: projection.latestEvent.eventId,
      displaySuffix: projection.citizen.householdSuffix,
      selectedCompartment: "DRY",
      expiresAt: "2026-08-22T18:30:00.000Z"
    },
    { status: 201 }
  );
}
