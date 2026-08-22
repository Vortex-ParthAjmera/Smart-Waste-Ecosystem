// ============================================================
// Mock Data Access Layer — the seam for real API replacement
// ============================================================
import type { Citizen, DisposalEvent, PointTransaction, Device, ReviewCase, Truck } from "./types";
import type { LeaderboardEntry } from "./data";
import { citizens, disposalEvents, pointTransactions, device, reviewCases, trucks, leaderboard } from "./data";

// Simulated network delay
function delay(ms: number = 800): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// --- Citizen ---
export async function getCitizenById(id: string): Promise<Citizen | undefined> {
  await delay();
  return citizens.find((c) => c.id === id);
}

export async function getCurrentCitizen(): Promise<Citizen> {
  await delay();
  return citizens[0]; // Priya Sharma is the demo user
}

// --- Disposal Events ---
export async function getDisposalEventsByCitizen(citizenId: string): Promise<DisposalEvent[]> {
  await delay();
  return disposalEvents
    .filter((e) => e.citizenId === citizenId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export async function getDisposalEventById(eventId: string): Promise<DisposalEvent | undefined> {
  await delay();
  return disposalEvents.find((e) => e.eventId === eventId);
}

export async function getAllDisposalEvents(): Promise<DisposalEvent[]> {
  await delay();
  return [...disposalEvents].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

// --- Point Transactions ---
export async function getPointTransactionsByCitizen(citizenId: string): Promise<PointTransaction[]> {
  await delay();
  return pointTransactions
    .filter((t) => t.citizenId === citizenId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

// --- Device ---
export async function getDevice(): Promise<Device> {
  await delay(500);
  return { ...device };
}

// --- Review Cases ---
export async function getReviewCases(): Promise<ReviewCase[]> {
  await delay();
  return [...reviewCases].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getReviewCaseById(caseId: string): Promise<ReviewCase | undefined> {
  await delay();
  return reviewCases.find((r) => r.caseId === caseId);
}

// --- Trucks (Tier 2) ---
export async function getTrucks(): Promise<Truck[]> {
  await delay(400);
  return [...trucks];
}

// --- Leaderboard ---
export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  await delay(600);
  return [...leaderboard];
}

// --- Live Disposal Simulation ---
export interface LiveDisposalState {
  processingState: string;
  decisionState: string;
  transportState: string;
  message: string;
  pointsAwarded?: number;
}

export async function* simulateDisposal(): AsyncGenerator<LiveDisposalState> {
  const steps: LiveDisposalState[] = [
    { processingState: "DISPOSAL_STARTED", decisionState: "CAPTURED", transportState: "QUEUED_LOCALLY", message: "Waiting for disposal..." },
    { processingState: "SENSOR_CAPTURED", decisionState: "CAPTURED", transportState: "QUEUED_LOCALLY", message: "Sensor detected activity — IR trigger confirmed" },
    { processingState: "ML_PENDING", decisionState: "EVALUATING", transportState: "QUEUED_LOCALLY", message: "Classifying waste type..." },
    { processingState: "ML_RECEIVED", decisionState: "EVALUATING", transportState: "PENDING", message: "Classification received — evaluating rules..." },
    { processingState: "PROCESSING", decisionState: "EVALUATING", transportState: "IN_FLIGHT", message: "Syncing to cloud..." },
    { processingState: "SEGREGATION_DECIDED", decisionState: "ACCEPTED", transportState: "ACKED", message: "Plastic Bottle detected — Correct Dry Waste" },
    { processingState: "COMPLETED", decisionState: "ACCEPTED", transportState: "ACKED", message: "+10 EcoCredits awarded!", pointsAwarded: 10 },
  ];

  for (const step of steps) {
    await delay(1500);
    yield step;
  }
}

// --- Inject Test Event (Developer) ---
export async function injectTestEvent(): Promise<DisposalEvent> {
  await delay(2000);
  const event: DisposalEvent = {
    eventId: `sim-${Date.now()}`,
    sessionId: `sim-ses-${Date.now()}`,
    citizenId: "cit-001",
    deviceCode: "ESP32-001",
    timestamp: new Date().toISOString(),
    eventSource: "SIMULATED",
    selectedCompartment: "DRY",
    mlDetection: {
      eventId: `sim-${Date.now()}`,
      status: "SUPPORTED",
      wasteType: "Plastic Bottle",
      category: "DRY",
      confidence: 0.91,
      scoreBand: "HIGH",
      evidenceSource: "SIMULATED",
      modelVersion: "waste-net-v2.1",
      weightsHash: "a3f2c1",
      latencyMs: 1100,
    },
    measurements: {
      irConfirmation: { triggered: true, quality: "OK" },
      moisturePercent: { value: 10, quality: "OK" },
      ultrasonicFill: { wetPercent: 0, dryPercent: 32, quality: "OK" },
    },
    location: { latitude: 22.7196, longitude: 75.8577, fixQuality: "GPS" },
    processingState: "COMPLETED",
    decisionState: "ACCEPTED",
    transportState: "ACKED",
    pointsAwarded: 10,
  };
  return event;
}
