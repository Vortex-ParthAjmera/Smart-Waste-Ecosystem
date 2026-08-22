import { list } from "@/lib/api-client/envelope";

export function GET() {
  return list([{ disputeId: "disp-fictional-001", eventId: "evt-mismatch-003", status: "OPEN", source: "PREVIEW/SEEDED" }]);
}
