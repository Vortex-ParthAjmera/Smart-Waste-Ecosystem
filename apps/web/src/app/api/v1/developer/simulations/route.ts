import { apiError, ok } from "@/lib/api-client/envelope";
import { demoRoleFromRequest, requireRole } from "@/lib/auth/roles";
import { simulationRequestSchema } from "@/lib/validation/simulation";

export async function POST(request: Request) {
  if (process.env.DEMO_SIMULATION_ENABLED !== "true") {
    return apiError("SIMULATION_DISABLED", "Demo simulation is disabled in this environment.", 403, false);
  }

  const role = demoRoleFromRequest(request);
  if (!requireRole(role, ["DEVELOPER", "SYSTEM_ADMIN"])) {
    return apiError("FORBIDDEN", "Only authorized developer/system-admin sessions may inject demo events.", 403, false);
  }

  const parsed = simulationRequestSchema.safeParse(await request.json());
  if (!parsed.success) {
    return apiError("VALIDATION_ERROR", "Fixture request is not allowed.", 422, false);
  }

  return ok(
    {
      eventId: `evt-simulation-${parsed.data.fixtureId}`,
      eventSource: "SIMULATED",
      evidenceSource: "SIMULATED",
      pointEffect: 0,
      auditLogged: true
    },
    { status: 201 }
  );
}
