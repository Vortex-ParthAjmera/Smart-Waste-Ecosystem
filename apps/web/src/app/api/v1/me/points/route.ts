import { ok } from "@/lib/api-client/envelope";
import { buildAppProjection } from "@/lib/domain/projections";
import { pointTransactions } from "@/lib/domain/demo-data";

export function GET() {
  const projection = buildAppProjection();
  return ok({
    balance: projection.balance,
    tier: projection.tier,
    transactions: pointTransactions
  });
}
