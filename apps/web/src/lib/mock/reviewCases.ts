import { ReviewCase } from "./types";
import { SEEDED_DISPOSAL_EVENTS, truthBadgeForEvent } from "./disposalEvents";

const flaggedEvents = SEEDED_DISPOSAL_EVENTS.filter((e) =>
  ["FLAGGED", "REVIEW_ACCEPTED", "VERIFIED_VIOLATION"].includes(e.decisionState)
);

export const REVIEW_CASES: ReviewCase[] = flaggedEvents.map((e, i) => {
  const minutesAgo = Math.round((Date.now() - new Date(e.timestamp).getTime()) / 60000);
  let status: ReviewCase["status"] = "PENDING";
  if (e.decisionState === "REVIEW_ACCEPTED") status = "REVIEW_ACCEPTED";
  if (e.decisionState === "VERIFIED_VIOLATION") status = "VERIFIED_VIOLATION";
  return {
    caseId: `case_${String(i + 1).padStart(3, "0")}`,
    eventId: e.eventId,
    citizenId: e.citizenId,
    reason: e.reasonPlain ?? "Flagged for manual review",
    eventSource: e.eventSource,
    truthBadge: truthBadgeForEvent(e.eventSource),
    createdAt: e.timestamp,
    status,
    ageMinutes: minutesAgo,
    category: e.selectedCompartment,
  };
});

export function getPendingReviewCases(): ReviewCase[] {
  return REVIEW_CASES.filter((c) => c.status === "PENDING").sort((a, b) => b.ageMinutes - a.ageMinutes);
}

export function getCaseById(caseId: string): ReviewCase | undefined {
  return REVIEW_CASES.find((c) => c.caseId === caseId);
}
