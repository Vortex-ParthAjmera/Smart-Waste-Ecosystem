import { apiError, ok } from "@/lib/api-client/envelope";
import { demoRoleFromRequest, requireRole } from "@/lib/auth/roles";

export async function POST(request: Request, { params }: { params: { disputeId: string } }) {
  const role = demoRoleFromRequest(request);
  if (!requireRole(role, ["VERIFICATION_OFFICER", "SYSTEM_ADMIN"])) {
    return apiError("FORBIDDEN", "Only authorized reviewers may resolve disputes.", 403, false);
  }
  return ok({ disputeId: params.disputeId, status: "RESOLVED", compensatingReversal: false });
}
