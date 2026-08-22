import { PointTransaction } from "./types";
import { SEEDED_DISPOSAL_EVENTS } from "./disposalEvents";

function sourceFor(amount: number): PointTransaction["source"] {
  if (amount > 0) return "AWARD";
  if (amount < 0) return "VIOLATION";
  return "REVERSAL";
}

export const SEEDED_POINT_TRANSACTIONS: PointTransaction[] = SEEDED_DISPOSAL_EVENTS.filter(
  (e) => e.pointsAwarded !== 0
).map((e, i) => ({
  id: `ptx_seed_${String(i + 1).padStart(3, "0")}`,
  citizenId: e.citizenId,
  eventId: e.eventId,
  amount: e.pointsAwarded,
  reason: e.reasonPlain ?? (e.pointsAwarded > 0 ? `Correct segregation — ${e.mlDetection?.wasteType ?? "waste"}` : "Segregation violation"),
  source: sourceFor(e.pointsAwarded),
  timestamp: e.timestamp,
  provenance: e.eventSource,
}));

export function getLedgerForCitizen(citizenId: string): PointTransaction[] {
  return SEEDED_POINT_TRANSACTIONS.filter((t) => t.citizenId === citizenId).sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}

export function getBalanceFromLedger(citizenId: string): number {
  return getLedgerForCitizen(citizenId).reduce((sum, t) => sum + t.amount, 0) + 1000; // + starting grant
}
