"use client";

import type { CitizenTier } from "@/lib/mock/types";

const tierThresholds: Record<CitizenTier, { min: number; next: CitizenTier | null }> = {
  BRONZE: { min: 0, next: "SILVER" },
  SILVER: { min: 500, next: "GOLD" },
  GOLD: { min: 1000, next: "PLATINUM" },
  PLATINUM: { min: 2000, next: null },
};

const tierEmoji: Record<CitizenTier, string> = { BRONZE: "🥉", SILVER: "🥈", GOLD: "🥇", PLATINUM: "💎" };

interface TierDisplayProps {
  tier: CitizenTier;
  points: number;
}

export function TierDisplay({ tier, points }: TierDisplayProps) {
  const cfg = tierThresholds[tier];
  const maxTier = 2000;
  const pct = Math.min((points / maxTier) * 100, 100);

  return (
    <section className="rounded-xl bg-white p-4 border border-slate-200">
      <p className="text-sm font-medium text-slate-600">Tier Progress</p>
      <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
        <span className={tier === "BRONZE" ? "font-bold text-emerald-600" : ""}>{tierEmoji.BRONZE} BRONZE</span>
        <div className="h-1 flex-1 rounded-full bg-slate-200 overflow-hidden">
          <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${pct}%` }} />
        </div>
        <span className={tier === "PLATINUM" ? "font-bold text-emerald-600" : ""}>{tierEmoji.PLATINUM} PLATINUM</span>
      </div>
      <p className="mt-1 text-xs text-slate-400">
        {cfg.next ? `${cfg.next === "SILVER" ? 500 : cfg.next === "GOLD" ? 1000 : 2000} pts needed for ${tierEmoji[cfg.next]} ${cfg.next}` : "You've reached the top tier!"}
      </p>
    </section>
  );
}
