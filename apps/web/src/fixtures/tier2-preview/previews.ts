export const tier2Previews = {
  truckEta: {
    title: "Truck & ETA Preview",
    badge: "PREVIEW/SEEDED",
    note: "Roadmap interface - not connected to a live backend.",
    route: ["Depot", "Madhuban Colony", "Gultekdi", "Market Yard"],
    etaMinutes: 18,
    distanceKm: 4.2
  },
  billDiscount: {
    title: "Bill Discount Preview",
    badge: "PREVIEW/SEEDED",
    note: "Illustrative frontend rule only. No billing table or payment provider exists.",
    previewPercent: 7
  }
} as const;
