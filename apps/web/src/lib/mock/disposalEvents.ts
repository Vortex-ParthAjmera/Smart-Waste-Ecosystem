import { DisposalEvent, TruthBadgeValue } from "./types";
import { DEMO_CITIZEN_ID } from "./citizens";

export function truthBadgeForEvent(source: DisposalEvent["eventSource"]): TruthBadgeValue {
  switch (source) {
    case "HARDWARE":
      return "REAL";
    case "RECORDED_HARDWARE":
      return "RECORDED";
    case "SIMULATED":
      return "SIMULATED";
    case "SEEDED":
      return "PREVIEW_SEEDED";
  }
}

const WASTE_ITEMS: { name: string; category: "WET" | "DRY" }[] = [
  { name: "Banana Peels", category: "WET" },
  { name: "Vegetable Peels", category: "WET" },
  { name: "Cooked Rice Scraps", category: "WET" },
  { name: "Tea Leaves", category: "WET" },
  { name: "Plastic Bottle", category: "DRY" },
  { name: "Cardboard Box", category: "DRY" },
  { name: "Newspaper Bundle", category: "DRY" },
  { name: "Milk Pouch", category: "DRY" },
  { name: "Glass Bottle", category: "DRY" },
];

function iso(daysAgo: number, hour: number, minute: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

function makeSeededEvent(i: number, opts: {
  daysAgo: number;
  hour: number;
  minute: number;
  compartment: "WET" | "DRY";
  itemIdx: number;
  confidence: number;
  points: number;
  decisionState: DisposalEvent["decisionState"];
  reasonCode?: string;
  reasonPlain?: string;
  moistureQuality?: "GOOD" | "DEGRADED" | "MISSING";
}): DisposalEvent {
  const fallbackItem = WASTE_ITEMS[0];
  if (!fallbackItem) throw new Error("Waste item fixture catalog is empty");
  const item = WASTE_ITEMS[opts.itemIdx % WASTE_ITEMS.length] ?? fallbackItem;
  const ts = iso(opts.daysAgo, opts.hour, opts.minute);
  return {
    eventId: `evt_seed_${String(i).padStart(3, "0")}`,
    sessionId: `sess_seed_${String(i).padStart(3, "0")}`,
    citizenId: DEMO_CITIZEN_ID,
    deviceCode: "ESP32-001",
    timestamp: ts,
    eventSource: "SEEDED",
    selectedCompartment: opts.compartment,
    mlDetection: {
      status: "SUPPORTED",
      wasteType: item.name,
      category: item.category,
      confidence: opts.confidence,
      scoreBand: opts.confidence >= 0.8 ? "HIGH" : opts.confidence >= 0.6 ? "MEDIUM" : "LOW",
      evidenceSource: "SEEDED",
      modelVersion: "yolov8n-waste-v1.3",
    },
    measurements: {
      irConfirmation: { triggered: true, quality: "GOOD" },
      moisturePercent: { value: opts.compartment === "WET" ? 62 : 18, quality: opts.moistureQuality ?? "GOOD" },
      ultrasonicFill: { wetPercent: 34, dryPercent: 41, quality: "GOOD" },
    },
    location: { latitude: 22.7196, longitude: 75.8577, fixQuality: "GPS" },
    processingState: "COMPLETED",
    decisionState: opts.decisionState,
    transportState: "ACKED",
    pointsAwarded: opts.points,
    ...(opts.reasonCode === undefined ? {} : { reasonCode: opts.reasonCode }),
    ...(opts.reasonPlain === undefined ? {} : { reasonPlain: opts.reasonPlain }),
  };
}

export const SEEDED_DISPOSAL_EVENTS: DisposalEvent[] = [
  makeSeededEvent(1, { daysAgo: 0, hour: 8, minute: 12, compartment: "WET", itemIdx: 0, confidence: 0.94, points: 10, decisionState: "ACCEPTED" }),
  makeSeededEvent(2, { daysAgo: 0, hour: 19, minute: 40, compartment: "DRY", itemIdx: 4, confidence: 0.91, points: 10, decisionState: "ACCEPTED" }),
  makeSeededEvent(3, { daysAgo: 1, hour: 8, minute: 5, compartment: "WET", itemIdx: 2, confidence: 0.88, points: 10, decisionState: "ACCEPTED" }),
  makeSeededEvent(4, { daysAgo: 1, hour: 20, minute: 2, compartment: "DRY", itemIdx: 5, confidence: 0.55, points: 0, decisionState: "FLAGGED", reasonCode: "LOW_ML_CONFIDENCE", reasonPlain: "Detection confidence was below the review threshold, so no penalty was applied — this is flagged for manual review only." }),
  makeSeededEvent(5, { daysAgo: 2, hour: 7, minute: 50, compartment: "WET", itemIdx: 1, confidence: 0.9, points: 10, decisionState: "ACCEPTED" }),
  makeSeededEvent(6, { daysAgo: 2, hour: 18, minute: 15, compartment: "DRY", itemIdx: 6, confidence: 0.87, points: 10, decisionState: "ACCEPTED" }),
  makeSeededEvent(7, { daysAgo: 3, hour: 9, minute: 0, compartment: "DRY", itemIdx: 0, confidence: 0.82, points: -10, decisionState: "REVIEW_ACCEPTED", reasonCode: "WRONG_COMPARTMENT_WET_IN_DRY", reasonPlain: "Wet-category waste (banana peels) was placed in the dry compartment. Reviewed and accepted as correctly detected." }),
  makeSeededEvent(8, { daysAgo: 3, hour: 21, minute: 30, compartment: "WET", itemIdx: 3, confidence: 0.85, points: 10, decisionState: "ACCEPTED" }),
  makeSeededEvent(9, { daysAgo: 4, hour: 8, minute: 22, compartment: "WET", itemIdx: 0, confidence: 0.7, points: 10, decisionState: "ACCEPTED", reasonCode: "ENVIRONMENTAL_MOISTURE_NO_PENALTY", reasonPlain: "Elevated moisture was traced to recent rain exposure at the bin, not incorrect segregation. No penalty applied.", moistureQuality: "DEGRADED" }),
  makeSeededEvent(10, { daysAgo: 4, hour: 19, minute: 5, compartment: "DRY", itemIdx: 7, confidence: 0.93, points: 10, decisionState: "ACCEPTED" }),
  makeSeededEvent(11, { daysAgo: 5, hour: 8, minute: 40, compartment: "DRY", itemIdx: 8, confidence: 0.89, points: 10, decisionState: "ACCEPTED" }),
  makeSeededEvent(12, { daysAgo: 5, hour: 20, minute: 55, compartment: "WET", itemIdx: 2, confidence: 0.91, points: 10, decisionState: "ACCEPTED" }),
  makeSeededEvent(13, { daysAgo: 6, hour: 7, minute: 30, compartment: "DRY", itemIdx: 4, confidence: 0.4, points: -20, decisionState: "VERIFIED_VIOLATION", reasonCode: "REPEAT_MISCLASSIFICATION", reasonPlain: "A municipal reviewer confirmed a second consecutive misclassification in the same week." },
  ),
  makeSeededEvent(14, { daysAgo: 6, hour: 18, minute: 10, compartment: "WET", itemIdx: 1, confidence: 0.86, points: 10, decisionState: "ACCEPTED" }),
  makeSeededEvent(15, { daysAgo: 7, hour: 8, minute: 0, compartment: "WET", itemIdx: 3, confidence: 0.79, points: 10, decisionState: "ACCEPTED" }),
  makeSeededEvent(16, { daysAgo: 7, hour: 19, minute: 45, compartment: "DRY", itemIdx: 6, confidence: 0.9, points: 10, decisionState: "ACCEPTED" }),
  makeSeededEvent(17, { daysAgo: 8, hour: 8, minute: 18, compartment: "WET", itemIdx: 0, confidence: 0.92, points: 10, decisionState: "ACCEPTED" }),
  makeSeededEvent(18, { daysAgo: 9, hour: 20, minute: 25, compartment: "DRY", itemIdx: 8, confidence: 0.88, points: 10, decisionState: "ACCEPTED" }),
];

export function getEventsForCitizen(citizenId: string): DisposalEvent[] {
  return SEEDED_DISPOSAL_EVENTS.filter((e) => e.citizenId === citizenId).sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}

export function getEventById(eventId: string): DisposalEvent | undefined {
  return SEEDED_DISPOSAL_EVENTS.find((e) => e.eventId === eventId);
}

export function getLatestEventForCitizen(citizenId: string): DisposalEvent | undefined {
  return getEventsForCitizen(citizenId)[0];
}
