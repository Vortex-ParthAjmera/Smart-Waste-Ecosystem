import { apiError, ok } from "@/lib/api-client/envelope";
import { demoRoleFromRequest, requireRole } from "@/lib/auth/roles";

export async function POST(request: Request, { params }: { params: { caseId: string } }) {
  const role = demoRoleFromRequest(request);
  if (!requireRole(role, ["VERIFICATION_OFFICER", "SYSTEM_ADMIN"])) {
    return apiError("FORBIDDEN", "Only authorized reviewers may record review decisions.", 403, false);
  }
  return ok({
    caseId: params.caseId,
    status: "REVIEW_ACCEPTED",
    pointEffect: 10,
    appendOnly: true
  });
}
