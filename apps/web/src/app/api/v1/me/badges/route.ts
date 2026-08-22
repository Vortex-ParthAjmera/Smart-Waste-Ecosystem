import { list } from "@/lib/api-client/envelope";
import { buildAppProjection } from "@/lib/domain/projections";

export function GET() {
  const projection = buildAppProjection();
  return list([
    {
      badgeId: "badge-ledger-starter",
      name: "Ledger Starter",
      reason: `Reached ${projection.tier} tier through reconciled fictional EcoCredits`,
      awardedAt: "2026-08-18T10:00:00.000Z",
      truthBadge: "PREVIEW/SEEDED"
    }
  ]);
}
