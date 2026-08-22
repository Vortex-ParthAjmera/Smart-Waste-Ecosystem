import { list } from "@/lib/api-client/envelope";

export function GET() {
  return list([
    { level: "INFO", eventId: "evt-live-accepted-001", message: "Cloud sync ACKED", redacted: true },
    { level: "WARN", eventId: "evt-model-unavailable-004", message: "Recorded ML fallback requires review", redacted: true }
  ]);
}
