// =========================================================================
// Typed API client. Every UI component reads through this file, never
// directly from src/lib/mock/*. When the real backend is ready, replace
// each function body below with a Supabase / REST call — component code
// does not need to change. See SETUP.md "Wiring up the real backend later".
// =========================================================================

import { getCitizenById, getDemoCitizen, DEMO_CITIZEN_ID } from "@/lib/mock/citizens";
import {
  getEventsForCitizen,
  getEventById,
  getLatestEventForCitizen,
} from "@/lib/mock/disposalEvents";
import { getLedgerForCitizen, getBalanceFromLedger } from "@/lib/mock/pointTransactions";
import { DEVICES, getDeviceByCode } from "@/lib/mock/devices";
import { LEADERBOARD } from "@/lib/mock/leaderboard";
import { TRUCKS, COLLECTION_STAGES } from "@/lib/mock/trucks";
import { getPendingReviewCases, getCaseById, REVIEW_CASES } from "@/lib/mock/reviewCases";
import { SEEDED_EDGE_QUEUE, SEEDED_LOGS } from "@/lib/mock/edgeQueue";

export const apiClient = {
  getDemoCitizen,
  getCitizenById,
  getEventsForCitizen,
  getEventById,
  getLatestEventForCitizen,
  getLedgerForCitizen,
  getBalanceFromLedger,
  listDevices: () => DEVICES,
  getDeviceByCode,
  getLeaderboard: () => LEADERBOARD,
  listTrucks: () => TRUCKS,
  collectionStages: () => COLLECTION_STAGES,
  getPendingReviewCases,
  getCaseById,
  listAllReviewCases: () => REVIEW_CASES,
  getEdgeQueueSnapshot: () => SEEDED_EDGE_QUEUE,
  getLogs: () => SEEDED_LOGS,
  DEMO_CITIZEN_ID,
};
