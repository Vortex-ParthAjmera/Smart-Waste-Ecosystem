import { EdgeQueueSnapshot, LogEntry } from "./types";
import { SEEDED_DISPOSAL_EVENTS } from "./disposalEvents";

export const SEEDED_EDGE_QUEUE: EdgeQueueSnapshot = {
  pending: 2,
  inFlight: 1,
  acked: 214,
  authBlocked: 0,
  deadLetter: 0,
  lastSuccessfulSync: new Date(Date.now() - 40_000).toISOString(),
  nextRetry: new Date(Date.now() + 20_000).toISOString(),
  safeErrorCode: null,
};

export const SEEDED_LOGS: LogEntry[] = SEEDED_DISPOSAL_EVENTS.slice(0, 12).map((e, i) => ({
  id: `log_${String(i + 1).padStart(3, "0")}`,
  eventId: e.eventId,
  timestamp: e.timestamp,
  level: e.decisionState === "VERIFIED_VIOLATION" ? "WARN" : "INFO",
  message:
    e.decisionState === "VERIFIED_VIOLATION"
      ? `Event ${e.eventId} closed as verified violation after municipal review.`
      : `Event ${e.eventId} processed to COMPLETED via ${e.transportState}.`,
}));
