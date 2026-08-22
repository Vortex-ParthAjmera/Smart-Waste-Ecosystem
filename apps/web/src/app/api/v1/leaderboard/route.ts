import { list } from "@/lib/api-client/envelope";
import { buildAppProjection } from "@/lib/domain/projections";

export function GET() {
  return list(buildAppProjection().leaderboard);
}
