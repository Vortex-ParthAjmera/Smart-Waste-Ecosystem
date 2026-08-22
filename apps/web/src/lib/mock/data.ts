// ============================================================
// Mock Data — realistic Indian citizens and disposal events
// ============================================================
import type {
  Citizen,
  DisposalEvent,
  PointTransaction,
  Device,
  ReviewCase,
  Truck,
  Badge,
  CitizenTier,
} from "./types";

// --- Citizens ---
export const citizens: Citizen[] = [
  {
    id: "cit-001",
    name: "Priya Sharma",
    phone: "+91 98XXX-XX123",
    pointsBalance: 750,
    tier: "SILVER",
    segregationScore: 82,
    badges: [
      { id: "badge-001", name: "Eco Starter", description: "Completed 10 correct disposals", earnedAt: "2026-08-10T10:00:00Z", unlocked: true },
      { id: "badge-002", name: "Segregation Star", description: "Achieved 80%+ segregation score", earnedAt: "2026-08-18T14:30:00Z", unlocked: true },
      { id: "badge-003", name: "Zero Waste Champion", description: "Complete 50 correct disposals", earnedAt: null, unlocked: false },
      { id: "badge-004", name: "Platinum Pioneer", description: "Reach 2000 EcoCredits", earnedAt: null, unlocked: false },
    ],
  },
  {
    id: "cit-002",
    name: "Rahul Verma",
    phone: "+91 97XXX-XX456",
    pointsBalance: 1200,
    tier: "GOLD",
    segregationScore: 91,
    badges: [
      { id: "badge-001", name: "Eco Starter", description: "Completed 10 correct disposals", earnedAt: "2026-08-05T09:00:00Z", unlocked: true },
      { id: "badge-002", name: "Segregation Star", description: "Achieved 80%+ segregation score", earnedAt: "2026-08-12T11:00:00Z", unlocked: true },
    ],
  },
  {
    id: "cit-003",
    name: "Anita Desai",
    phone: "+91 96XXX-XX789",
    pointsBalance: 420,
    tier: "BRONZE",
    segregationScore: 65,
    badges: [
      { id: "badge-001", name: "Eco Starter", description: "Completed 10 correct disposals", earnedAt: "2026-08-15T16:00:00Z", unlocked: true },
    ],
  },
  {
    id: "cit-004",
    name: "Vikram Patel",
    phone: "+91 95XXX-XX012",
    pointsBalance: 2100,
    tier: "PLATINUM",
    segregationScore: 95,
    badges: [
      { id: "badge-001", name: "Eco Starter", description: "Completed 10 correct disposals", earnedAt: "2026-08-01T08:00:00Z", unlocked: true },
      { id: "badge-002", name: "Segregation Star", description: "Achieved 80%+ segregation score", earnedAt: "2026-08-08T10:00:00Z", unlocked: true },
      { id: "badge-004", name: "Platinum Pioneer", description: "Reach 2000 EcoCredits", earnedAt: "2026-08-20T12:00:00Z", unlocked: true },
    ],
  },
  {
    id: "cit-005",
    name: "Meena Kumari",
    phone: "+91 94XXX-XX345",
    pointsBalance: 580,
    tier: "SILVER",
    segregationScore: 78,
    badges: [
      { id: "badge-001", name: "Eco Starter", description: "Completed 10 correct disposals", earnedAt: "2026-08-11T13:00:00Z", unlocked: true },
    ],
  },
  {
    id: "cit-006",
    name: "Suresh Nair",
    phone: "+91 93XXX-XX678",
    pointsBalance: 310,
    tier: "BRONZE",
    segregationScore: 58,
    badges: [],
  },
];

// --- Disposal Events (15-20 seeded for primary citizen) ---
export const disposalEvents: DisposalEvent[] = [
  {
    eventId: "evt-001", sessionId: "ses-001", citizenId: "cit-001", deviceCode: "ESP32-001",
    timestamp: "2026-08-22T07:15:00Z", eventSource: "HARDWARE", selectedCompartment: "DRY",
    mlDetection: { eventId: "evt-001", status: "SUPPORTED", wasteType: "Plastic Bottle", category: "DRY", confidence: 0.92, scoreBand: "HIGH", evidenceSource: "LOCAL_LIVE", modelVersion: "waste-net-v2.1", weightsHash: "a3f2c1", latencyMs: 1200 },
    measurements: { irConfirmation: { triggered: true, quality: "OK" }, moisturePercent: { value: 12, quality: "OK" }, ultrasonicFill: { wetPercent: 0, dryPercent: 35, quality: "OK" } },
    location: { latitude: 22.7196, longitude: 75.8577, fixQuality: "GPS" },
    processingState: "COMPLETED", decisionState: "ACCEPTED", transportState: "ACKED", pointsAwarded: 10,
  },
  {
    eventId: "evt-002", sessionId: "ses-002", citizenId: "cit-001", deviceCode: "ESP32-001",
    timestamp: "2026-08-21T08:30:00Z", eventSource: "HARDWARE", selectedCompartment: "WET",
    mlDetection: { eventId: "evt-002", status: "SUPPORTED", wasteType: "Banana Peels", category: "WET", confidence: 0.88, scoreBand: "HIGH", evidenceSource: "LOCAL_LIVE", modelVersion: "waste-net-v2.1", weightsHash: "a3f2c1", latencyMs: 980 },
    measurements: { irConfirmation: { triggered: true, quality: "OK" }, moisturePercent: { value: 0, quality: "OK" }, ultrasonicFill: { wetPercent: 42, dryPercent: 0, quality: "OK" } },
    location: { latitude: 22.7201, longitude: 75.8582, fixQuality: "GPS" },
    processingState: "COMPLETED", decisionState: "ACCEPTED", transportState: "ACKED", pointsAwarded: 10,
  },
  {
    eventId: "evt-003", sessionId: "ses-003", citizenId: "cit-001", deviceCode: "ESP32-001",
    timestamp: "2026-08-20T09:45:00Z", eventSource: "HARDWARE", selectedCompartment: "DRY",
    mlDetection: { eventId: "evt-003", status: "SUPPORTED", wasteType: "Cardboard Box", category: "DRY", confidence: 0.45, scoreBand: "LOW", evidenceSource: "LOCAL_LIVE", modelVersion: "waste-net-v2.1", weightsHash: "a3f2c1", latencyMs: 1500 },
    measurements: { irConfirmation: { triggered: true, quality: "OK" }, moisturePercent: { value: 22, quality: "OK" }, ultrasonicFill: { wetPercent: 0, dryPercent: 28, quality: "OK" } },
    location: { latitude: 22.7190, longitude: 75.8570, fixQuality: "GPS" },
    processingState: "COMPLETED", decisionState: "FLAGGED", transportState: "ACKED", pointsAwarded: 0,
  },
  {
    eventId: "evt-004", sessionId: "ses-004", citizenId: "cit-001", deviceCode: "ESP32-001",
    timestamp: "2026-08-19T07:20:00Z", eventSource: "HARDWARE", selectedCompartment: "WET",
    mlDetection: { eventId: "evt-004", status: "SUPPORTED", wasteType: "Vegetable Scraps", category: "WET", confidence: 0.91, scoreBand: "HIGH", evidenceSource: "LOCAL_LIVE", modelVersion: "waste-net-v2.1", weightsHash: "a3f2c1", latencyMs: 870 },
    measurements: { irConfirmation: { triggered: true, quality: "OK" }, moisturePercent: { value: 0, quality: "OK" }, ultrasonicFill: { wetPercent: 55, dryPercent: 0, quality: "OK" } },
    location: { latitude: 22.7205, longitude: 75.8590, fixQuality: "GPS" },
    processingState: "COMPLETED", decisionState: "ACCEPTED", transportState: "ACKED", pointsAwarded: 10,
  },
  {
    eventId: "evt-005", sessionId: "ses-005", citizenId: "cit-001", deviceCode: "ESP32-001",
    timestamp: "2026-08-18T08:10:00Z", eventSource: "HARDWARE", selectedCompartment: "DRY",
    mlDetection: { eventId: "evt-005", status: "SUPPORTED", wasteType: "Newspaper", category: "DRY", confidence: 0.95, scoreBand: "HIGH", evidenceSource: "LOCAL_LIVE", modelVersion: "waste-net-v2.1", weightsHash: "a3f2c1", latencyMs: 650 },
    measurements: { irConfirmation: { triggered: true, quality: "OK" }, moisturePercent: { value: 8, quality: "OK" }, ultrasonicFill: { wetPercent: 0, dryPercent: 45, quality: "OK" } },
    location: { latitude: 22.7188, longitude: 75.8565, fixQuality: "GPS" },
    processingState: "COMPLETED", decisionState: "ACCEPTED", transportState: "ACKED", pointsAwarded: 10,
  },
  {
    eventId: "evt-006", sessionId: "ses-006", citizenId: "cit-001", deviceCode: "ESP32-001",
    timestamp: "2026-08-17T09:00:00Z", eventSource: "HARDWARE", selectedCompartment: "DRY",
    mlDetection: { eventId: "evt-006", status: "SUPPORTED", wasteType: "Plastic Wrapper", category: "DRY", confidence: 0.87, scoreBand: "HIGH", evidenceSource: "LOCAL_LIVE", modelVersion: "waste-net-v2.1", weightsHash: "a3f2c1", latencyMs: 1100 },
    measurements: { irConfirmation: { triggered: true, quality: "OK" }, moisturePercent: { value: 52, quality: "OK" }, ultrasonicFill: { wetPercent: 0, dryPercent: 30, quality: "OK" } },
    location: { latitude: 22.7210, longitude: 75.8575, fixQuality: "GPS" },
    processingState: "COMPLETED", decisionState: "FLAGGED", transportState: "ACKED", pointsAwarded: 0,
  },
  {
    eventId: "evt-007", sessionId: "ses-007", citizenId: "cit-001", deviceCode: "ESP32-001",
    timestamp: "2026-08-16T07:30:00Z", eventSource: "HARDWARE", selectedCompartment: "WET",
    mlDetection: { eventId: "evt-007", status: "SUPPORTED", wasteType: "Tea Leaves", category: "WET", confidence: 0.89, scoreBand: "HIGH", evidenceSource: "LOCAL_LIVE", modelVersion: "waste-net-v2.1", weightsHash: "a3f2c1", latencyMs: 920 },
    measurements: { irConfirmation: { triggered: true, quality: "OK" }, moisturePercent: { value: 0, quality: "OK" }, ultrasonicFill: { wetPercent: 38, dryPercent: 0, quality: "OK" } },
    location: { latitude: 22.7195, longitude: 75.8580, fixQuality: "GPS" },
    processingState: "COMPLETED", decisionState: "ACCEPTED", transportState: "ACKED", pointsAwarded: 10,
  },
  {
    eventId: "evt-008", sessionId: "ses-008", citizenId: "cit-001", deviceCode: "ESP32-001",
    timestamp: "2026-08-15T08:45:00Z", eventSource: "HARDWARE", selectedCompartment: "DRY",
    mlDetection: { eventId: "evt-008", status: "SUPPORTED", wasteType: "Glass Bottle", category: "DRY", confidence: 0.94, scoreBand: "HIGH", evidenceSource: "LOCAL_LIVE", modelVersion: "waste-net-v2.1", weightsHash: "a3f2c1", latencyMs: 780 },
    measurements: { irConfirmation: { triggered: true, quality: "OK" }, moisturePercent: { value: 5, quality: "OK" }, ultrasonicFill: { wetPercent: 0, dryPercent: 52, quality: "OK" } },
    location: { latitude: 22.7200, longitude: 75.8585, fixQuality: "GPS" },
    processingState: "COMPLETED", decisionState: "ACCEPTED", transportState: "ACKED", pointsAwarded: 10,
  },
  {
    eventId: "evt-009", sessionId: "ses-009", citizenId: "cit-001", deviceCode: "ESP32-001",
    timestamp: "2026-08-14T07:15:00Z", eventSource: "HARDWARE", selectedCompartment: "WET",
    mlDetection: { eventId: "evt-009", status: "SUPPORTED", wasteType: "Rice Scraps", category: "WET", confidence: 0.86, scoreBand: "HIGH", evidenceSource: "LOCAL_LIVE", modelVersion: "waste-net-v2.1", weightsHash: "a3f2c1", latencyMs: 1050 },
    measurements: { irConfirmation: { triggered: true, quality: "OK" }, moisturePercent: { value: 0, quality: "OK" }, ultrasonicFill: { wetPercent: 60, dryPercent: 0, quality: "OK" } },
    location: { latitude: 22.7192, longitude: 75.8572, fixQuality: "GPS" },
    processingState: "COMPLETED", decisionState: "ACCEPTED", transportState: "ACKED", pointsAwarded: 10,
  },
  {
    eventId: "evt-010", sessionId: "ses-010", citizenId: "cit-001", deviceCode: "ESP32-001",
    timestamp: "2026-08-13T08:30:00Z", eventSource: "HARDWARE", selectedCompartment: "DRY",
    mlDetection: { eventId: "evt-010", status: "MULTIPLE", wasteType: "Mixed Items", category: "UNKNOWN", confidence: 0.0, scoreBand: "LOW", evidenceSource: "LOCAL_LIVE", modelVersion: "waste-net-v2.1", weightsHash: "a3f2c1", latencyMs: 1300 },
    measurements: { irConfirmation: { triggered: true, quality: "OK" }, moisturePercent: { value: 38, quality: "OK" }, ultrasonicFill: { wetPercent: 0, dryPercent: 40, quality: "OK" } },
    location: { latitude: 22.7208, longitude: 75.8578, fixQuality: "GPS" },
    processingState: "COMPLETED", decisionState: "FLAGGED", transportState: "ACKED", pointsAwarded: 0,
  },
  // Environmental wetting case — flagged, no penalty
  {
    eventId: "evt-011", sessionId: "ses-011", citizenId: "cit-001", deviceCode: "ESP32-001",
    timestamp: "2026-08-12T07:45:00Z", eventSource: "HARDWARE", selectedCompartment: "DRY",
    mlDetection: { eventId: "evt-011", status: "SUPPORTED", wasteType: "Paper Cup", category: "DRY", confidence: 0.82, scoreBand: "MEDIUM", evidenceSource: "LOCAL_LIVE", modelVersion: "waste-net-v2.1", weightsHash: "a3f2c1", latencyMs: 1150 },
    measurements: { irConfirmation: { triggered: true, quality: "OK" }, moisturePercent: { value: 55, quality: "OK" }, ultrasonicFill: { wetPercent: 0, dryPercent: 25, quality: "OK" } },
    location: { latitude: 22.7198, longitude: 75.8568, fixQuality: "GPS" },
    processingState: "COMPLETED", decisionState: "FLAGGED", transportState: "ACKED", pointsAwarded: 0,
  },
  {
    eventId: "evt-012", sessionId: "ses-012", citizenId: "cit-001", deviceCode: "ESP32-001",
    timestamp: "2026-08-11T08:00:00Z", eventSource: "HARDWARE", selectedCompartment: "WET",
    mlDetection: { eventId: "evt-012", status: "SUPPORTED", wasteType: "Fruit Peels", category: "WET", confidence: 0.90, scoreBand: "HIGH", evidenceSource: "LOCAL_LIVE", modelVersion: "waste-net-v2.1", weightsHash: "a3f2c1", latencyMs: 880 },
    measurements: { irConfirmation: { triggered: true, quality: "OK" }, moisturePercent: { value: 0, quality: "OK" }, ultrasonicFill: { wetPercent: 48, dryPercent: 0, quality: "OK" } },
    location: { latitude: 22.7203, longitude: 75.8588, fixQuality: "GPS" },
    processingState: "COMPLETED", decisionState: "ACCEPTED", transportState: "ACKED", pointsAwarded: 10,
  },
  {
    eventId: "evt-013", sessionId: "ses-013", citizenId: "cit-001", deviceCode: "ESP32-001",
    timestamp: "2026-08-10T07:30:00Z", eventSource: "HARDWARE", selectedCompartment: "DRY",
    mlDetection: { eventId: "evt-013", status: "SUPPORTED", wasteType: "Metal Can", category: "DRY", confidence: 0.93, scoreBand: "HIGH", evidenceSource: "LOCAL_LIVE", modelVersion: "waste-net-v2.1", weightsHash: "a3f2c1", latencyMs: 700 },
    measurements: { irConfirmation: { triggered: true, quality: "OK" }, moisturePercent: { value: 3, quality: "OK" }, ultrasonicFill: { wetPercent: 0, dryPercent: 38, quality: "OK" } },
    location: { latitude: 22.7185, longitude: 75.8562, fixQuality: "GPS" },
    processingState: "COMPLETED", decisionState: "ACCEPTED", transportState: "ACKED", pointsAwarded: 10,
  },
  {
    eventId: "evt-014", sessionId: "ses-014", citizenId: "cit-001", deviceCode: "ESP32-001",
    timestamp: "2026-08-09T08:15:00Z", eventSource: "HARDWARE", selectedCompartment: "WET",
    mlDetection: { eventId: "evt-014", status: "SUPPORTED", wasteType: "Fish Bones", category: "WET", confidence: 0.87, scoreBand: "HIGH", evidenceSource: "LOCAL_LIVE", modelVersion: "waste-net-v2.1", weightsHash: "a3f2c1", latencyMs: 950 },
    measurements: { irConfirmation: { triggered: true, quality: "OK" }, moisturePercent: { value: 0, quality: "OK" }, ultrasonicFill: { wetPercent: 52, dryPercent: 0, quality: "OK" } },
    location: { latitude: 22.7206, longitude: 75.8592, fixQuality: "GPS" },
    processingState: "COMPLETED", decisionState: "ACCEPTED", transportState: "ACKED", pointsAwarded: 10,
  },
  {
    eventId: "evt-015", sessionId: "ses-015", citizenId: "cit-001", deviceCode: "ESP32-001",
    timestamp: "2026-08-08T07:45:00Z", eventSource: "HARDWARE", selectedCompartment: "DRY",
    mlDetection: { eventId: "evt-015", status: "UNSUPPORTED", wasteType: "Unknown Material", category: "UNKNOWN", confidence: 0.0, scoreBand: "LOW", evidenceSource: "LOCAL_LIVE", modelVersion: "waste-net-v2.1", weightsHash: "a3f2c1", latencyMs: 1400 },
    measurements: { irConfirmation: { triggered: true, quality: "OK" }, moisturePercent: { value: 18, quality: "OK" }, ultrasonicFill: { wetPercent: 0, dryPercent: 22, quality: "OK" } },
    location: { latitude: 22.7194, longitude: 75.8574, fixQuality: "GPS" },
    processingState: "COMPLETED", decisionState: "FLAGGED", transportState: "ACKED", pointsAwarded: 0,
  },
  // Events for other citizens
  {
    eventId: "evt-016", sessionId: "ses-016", citizenId: "cit-002", deviceCode: "ESP32-001",
    timestamp: "2026-08-22T06:50:00Z", eventSource: "HARDWARE", selectedCompartment: "DRY",
    mlDetection: { eventId: "evt-016", status: "SUPPORTED", wasteType: "Aluminium Foil", category: "DRY", confidence: 0.89, scoreBand: "HIGH", evidenceSource: "LOCAL_LIVE", modelVersion: "waste-net-v2.1", weightsHash: "a3f2c1", latencyMs: 830 },
    measurements: { irConfirmation: { triggered: true, quality: "OK" }, moisturePercent: { value: 2, quality: "OK" }, ultrasonicFill: { wetPercent: 0, dryPercent: 30, quality: "OK" } },
    location: { latitude: 22.7215, longitude: 75.8600, fixQuality: "GPS" },
    processingState: "COMPLETED", decisionState: "ACCEPTED", transportState: "ACKED", pointsAwarded: 10,
  },
];

// --- Point Transactions ---
export const pointTransactions: PointTransaction[] = [
  { id: "txn-001", citizenId: "cit-001", eventId: "evt-001", amount: 10, reason: "Accepted: Correct dry segregation — Plastic Bottle", source: "AWARD", timestamp: "2026-08-22T07:16:00Z", provenance: "HARDWARE", truthBadge: "REAL" },
  { id: "txn-002", citizenId: "cit-001", eventId: "evt-002", amount: 10, reason: "Accepted: Correct wet segregation — Banana Peels", source: "AWARD", timestamp: "2026-08-21T08:31:00Z", provenance: "HARDWARE", truthBadge: "REAL" },
  { id: "txn-003", citizenId: "cit-001", eventId: "evt-003", amount: 0, reason: "Flagged: Low confidence (0.45) — needs officer review", source: "AWARD", timestamp: "2026-08-20T09:46:00Z", provenance: "HARDWARE", truthBadge: "REAL" },
  { id: "txn-004", citizenId: "cit-001", eventId: "evt-004", amount: 10, reason: "Accepted: Correct wet segregation — Vegetable Scraps", source: "AWARD", timestamp: "2026-08-19T07:21:00Z", provenance: "HARDWARE", truthBadge: "REAL" },
  { id: "txn-005", citizenId: "cit-001", eventId: "evt-005", amount: 10, reason: "Accepted: Correct dry segregation — Newspaper", source: "AWARD", timestamp: "2026-08-18T08:11:00Z", provenance: "HARDWARE", truthBadge: "REAL" },
  { id: "txn-006", citizenId: "cit-001", eventId: "evt-006", amount: 0, reason: "Flagged: Environmental wetting suspected — moisture 52%", source: "AWARD", timestamp: "2026-08-17T09:01:00Z", provenance: "HARDWARE", truthBadge: "REAL" },
  { id: "txn-007", citizenId: "cit-001", eventId: "evt-007", amount: 10, reason: "Accepted: Correct wet segregation — Tea Leaves", source: "AWARD", timestamp: "2026-08-16T07:31:00Z", provenance: "HARDWARE", truthBadge: "REAL" },
  { id: "txn-008", citizenId: "cit-001", eventId: "evt-008", amount: 10, reason: "Accepted: Correct dry segregation — Glass Bottle", source: "AWARD", timestamp: "2026-08-15T08:46:00Z", provenance: "HARDWARE", truthBadge: "REAL" },
  { id: "txn-009", citizenId: "cit-001", eventId: "evt-009", amount: 10, reason: "Accepted: Correct wet segregation — Rice Scraps", source: "AWARD", timestamp: "2026-08-14T07:16:00Z", provenance: "HARDWARE", truthBadge: "REAL" },
  { id: "txn-010", citizenId: "cit-001", eventId: "evt-010", amount: 0, reason: "Flagged: Multiple objects detected — needs review", source: "AWARD", timestamp: "2026-08-13T08:31:00Z", provenance: "HARDWARE", truthBadge: "REAL" },
  { id: "txn-011", citizenId: "cit-001", eventId: "evt-011", amount: 0, reason: "Flagged: Environmental wetting — moisture 55% in dry path", source: "AWARD", timestamp: "2026-08-12T07:46:00Z", provenance: "HARDWARE", truthBadge: "REAL" },
  { id: "txn-012", citizenId: "cit-001", eventId: "evt-012", amount: 10, reason: "Accepted: Correct wet segregation — Fruit Peels", source: "AWARD", timestamp: "2026-08-11T08:01:00Z", provenance: "HARDWARE", truthBadge: "REAL" },
  { id: "txn-013", citizenId: "cit-001", eventId: "evt-013", amount: 10, reason: "Accepted: Correct dry segregation — Metal Can", source: "AWARD", timestamp: "2026-08-10T07:31:00Z", provenance: "HARDWARE", truthBadge: "REAL" },
  { id: "txn-014", citizenId: "cit-001", eventId: "evt-014", amount: 10, reason: "Accepted: Correct wet segregation — Fish Bones", source: "AWARD", timestamp: "2026-08-09T08:16:00Z", provenance: "HARDWARE", truthBadge: "REAL" },
  { id: "txn-015", citizenId: "cit-001", eventId: "evt-015", amount: 0, reason: "Flagged: Unsupported class — needs review", source: "AWARD", timestamp: "2026-08-08T07:46:00Z", provenance: "HARDWARE", truthBadge: "REAL" },
];

// --- Device ---
export const device: Device = {
  deviceCode: "ESP32-001",
  firmwareVersion: "smart-waste-esp32-1.0.0",
  components: [
    { name: "Wi-Fi / LAN", code: "wifi", health: "OK", lastSeen: "2026-08-22T07:15:05Z" },
    { name: "GPS", code: "gps", health: "OK", lastSeen: "2026-08-22T07:15:03Z", lastValue: "22.7196, 75.8577" },
    { name: "Wet IR Sensor", code: "ir-wet", health: "OK", lastSeen: "2026-08-22T07:14:58Z" },
    { name: "Dry IR Sensor", code: "ir-dry", health: "OK", lastSeen: "2026-08-22T07:15:00Z" },
    { name: "Wet Ultrasonic", code: "ultrasonic-wet", health: "OK", lastSeen: "2026-08-22T07:15:01Z" },
    { name: "Dry Ultrasonic", code: "ultrasonic-dry", health: "OK", lastSeen: "2026-08-22T07:15:02Z" },
    { name: "Moisture Sensor", code: "moisture", health: "OK", lastSeen: "2026-08-22T07:15:03Z" },
    { name: "Camera", code: "camera", health: "OK", lastSeen: "2026-08-22T07:15:04Z" },
    { name: "ML Model", code: "model", health: "OK", lastSeen: "2026-08-22T07:15:04Z", lastValue: "waste-net-v2.1" },
  ],
  lastHeartbeat: "2026-08-22T07:15:05Z",
  edgeQueueDepth: 0,
  cloudSyncStatus: "ACKED",
};

// --- Review Cases ---
export const reviewCases: ReviewCase[] = [
  { caseId: "rc-001", eventId: "evt-003", citizenId: "cit-001", reason: "Low confidence (0.45) — model uncertain about Cardboard Box", eventSource: "HARDWARE", truthBadge: "REAL", createdAt: "2026-08-20T09:46:00Z", status: "PENDING" },
  { caseId: "rc-002", eventId: "evt-006", citizenId: "cit-001", reason: "Environmental wetting suspected — moisture 52% in DRY path", eventSource: "HARDWARE", truthBadge: "REAL", createdAt: "2026-08-17T09:01:00Z", status: "REVIEW_ACCEPTED" },
  { caseId: "rc-003", eventId: "evt-010", citizenId: "cit-001", reason: "Multiple objects detected — mixed waste in DRY compartment", eventSource: "HARDWARE", truthBadge: "REAL", createdAt: "2026-08-13T08:31:00Z", status: "PENDING" },
  { caseId: "rc-004", eventId: "evt-011", citizenId: "cit-001", reason: "Environmental wetting — moisture 55% in DRY path for Paper Cup", eventSource: "HARDWARE", truthBadge: "REAL", createdAt: "2026-08-12T07:46:00Z", status: "PENDING" },
  { caseId: "rc-005", eventId: "evt-015", citizenId: "cit-001", reason: "Unsupported class — Unknown Material not in allowlist", eventSource: "HARDWARE", truthBadge: "REAL", createdAt: "2026-08-08T07:46:00Z", status: "REVIEW_NO_ACTION" },
];

// --- Trucks (Tier 2) ---
export const trucks: Truck[] = [
  { truckId: "SGV-001", status: "ON ROUTE", distanceKm: 2.4, etaMinutes: 12 },
  { truckId: "SGV-002", status: "COLLECTING", distanceKm: 0.8, etaMinutes: 3 },
  { truckId: "SGV-003", status: "RETURNING", distanceKm: 5.1, etaMinutes: 25 },
];

// --- Leaderboard ---
export interface LeaderboardEntry {
  rank: number;
  alias: string;
  points: number;
  tier: CitizenTier;
  isCurrentUser: boolean;
}

export const leaderboard: LeaderboardEntry[] = [
  { rank: 1, alias: "GreenWarrior_42", points: 2100, tier: "PLATINUM", isCurrentUser: false },
  { rank: 2, alias: "EcoChampion_7", points: 1200, tier: "GOLD", isCurrentUser: false },
  { rank: 3, alias: "CleanStreet_99", points: 750, tier: "SILVER", isCurrentUser: true },
  { rank: 4, alias: "WasteHero_15", points: 580, tier: "SILVER", isCurrentUser: false },
  { rank: 5, alias: "SegregationPro_3", points: 420, tier: "BRONZE", isCurrentUser: false },
  { rank: 6, alias: "RecycleKing_88", points: 310, tier: "BRONZE", isCurrentUser: false },
];
