import { list, ok } from "@/lib/api-client/envelope";

export function GET() {
  return list([
    {
      disputeId: "disp-fictional-001",
      eventId: "evt-mismatch-003",
      status: "OPEN",
      reason: "Citizen disputes verified mismatch with additional context.",
      truthBadge: "PREVIEW/SEEDED"
    }
  ]);
}

export async function POST() {
  return ok(
    {
      disputeId: "disp-new-demo",
      status: "OPEN",
      storedRawEvidence: false
    },
    { status: 201 }
  );
}
