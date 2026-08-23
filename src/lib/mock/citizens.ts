import { Citizen } from "./types";

function tierFor(points: number): Citizen["tier"] {
  if (points >= 2000) return "PLATINUM";
  if (points >= 1000) return "GOLD";
  if (points >= 500) return "SILVER";
  return "BRONZE";
}

export const CITIZENS: Citizen[] = [
  {
    id: "cit_priya_sharma",
    name: "Priya Sharma",
    phone: "+91 98••••••12",
    locality: "Indore, Ward 12",
    pointsBalance: 1240,
    tier: tierFor(1240),
    segregationScore: 92,
    badges: [
      {
        id: "badge_streak_7",
        name: "7-Day Streak",
        description: "Correct segregation for 7 consecutive disposals.",
        earnedAt: "2026-08-10T09:12:00+05:30",
      },
      {
        id: "badge_wet_pro",
        name: "Wet Waste Pro",
        description: "20 correct wet-waste disposals.",
        earnedAt: "2026-07-28T18:40:00+05:30",
      },
      {
        id: "badge_early_bird",
        name: "Early Bird",
        description: "5 disposals before 8 AM.",
        locked: true,
        unlockCriteria: "Dispose before 8 AM five times.",
      },
      {
        id: "badge_century",
        name: "Century",
        description: "100 correct disposals lifetime.",
        locked: true,
        unlockCriteria: "63 more correct disposals to unlock.",
      },
    ],
  },
  {
    id: "cit_arjun_mehta",
    name: "Arjun Mehta",
    phone: "+91 90••••••41",
    locality: "Indore, Ward 12",
    pointsBalance: 640,
    tier: tierFor(640),
    segregationScore: 81,
    badges: [],
  },
];

export const DEMO_CITIZEN_ID = "cit_priya_sharma";

export function getCitizenById(id: string): Citizen | undefined {
  return CITIZENS.find((c) => c.id === id);
}

export function getDemoCitizen(): Citizen {
  const c = getCitizenById(DEMO_CITIZEN_ID);
  if (!c) throw new Error("Demo citizen fixture missing");
  return c;
}

export const TIER_THRESHOLDS: { tier: Citizen["tier"]; min: number; max: number | null }[] = [
  { tier: "BRONZE", min: 0, max: 499 },
  { tier: "SILVER", min: 500, max: 999 },
  { tier: "GOLD", min: 1000, max: 1999 },
  { tier: "PLATINUM", min: 2000, max: null },
];

export function pointsToNextTier(points: number): { nextTier: Citizen["tier"] | null; remaining: number } {
  const current = TIER_THRESHOLDS.find((t) => points >= t.min && (t.max === null || points <= t.max));
  const idx = current ? TIER_THRESHOLDS.indexOf(current) : 0;
  const next = TIER_THRESHOLDS[idx + 1];
  if (!next) return { nextTier: null, remaining: 0 };
  return { nextTier: next.tier, remaining: next.min - points };
}
