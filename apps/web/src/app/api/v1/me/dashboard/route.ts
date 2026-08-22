import { ok } from "@/lib/api-client/envelope";
import { buildAppProjection } from "@/lib/domain/projections";

export function GET() {
  const projection = buildAppProjection();
  return ok({
    citizen: projection.citizen,
    balance: projection.balance,
    tier: projection.tier,
    latestEvent: projection.latestEvent,
    stats: projection.stats
  });
}
