import { ok } from "@/lib/api-client/envelope";
import { buildAppProjection } from "@/lib/domain/projections";

export function GET(_request: Request, { params }: { params: { deviceId: string } }) {
  return ok({ deviceId: params.deviceId, components: buildAppProjection().deviceHealth });
}
