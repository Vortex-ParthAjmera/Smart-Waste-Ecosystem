import { Truck } from "./types";

// [Tier 2 - hardcoded array, never persisted]
export const TRUCKS: Truck[] = [
  {
    truckId: "TRK-07",
    status: "En route to Ward 12 collection point",
    distanceKm: 1.4,
    etaMinutes: 18,
    zone: "Indore Ward 12",
    stage: "ON_ROUTE",
  },
  {
    truckId: "TRK-11",
    status: "Scheduled for Ward 14 market sweep",
    distanceKm: 6.2,
    etaMinutes: 55,
    zone: "Indore Ward 14",
    stage: "SCHEDULED",
  },
];

export const COLLECTION_STAGES: Truck["stage"][] = [
  "SCHEDULED",
  "DISPATCHED",
  "ON_ROUTE",
  "NEAR",
  "COLLECTION",
  "COMPLETED",
];
