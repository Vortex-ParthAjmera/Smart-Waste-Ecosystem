"use client";

import type { CitizenTier } from "@/lib/mock/types";

const tierColors: Record<CitizenTier, string> = {
  BRONZE: "bg-amber-100 text-amber-800 border-amber-300",
  SILVER: "bg-slate-100 text-slate-700 border-slate-300",
  GOLD: "bg-yellow-100 text-yellow-800 border-yellow-300",
  PLATINUM: "bg-purple-100 text-purple-800 border-purple-300",
};

const tierEmoji: Record<CitizenTier, string> = { BRONZE: "🥉", SILVER: "🥈", GOLD: "🥇", PLATINUM: "💎" };

interface BalanceCardProps {
  balance: number;
  tier: CitizenTier;
  segregationScore?: number;
}

export function BalanceCard({ balance, tier, segregationScore }: BalanceCardProps) {
  return (
    <section className="rounded-xl bg-emerald-600 p-6 text-white">
      <p className="text-sm font-medium opacity-80">Your EcoCredits</p>
      <p className="mt-1 text-5xl font-bold tabular-nums">{balance}</p>
      <div className="mt-3 flex items-center gap-2">
        <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${tierColors[tier]}`}>
          {tierEmoji[tier]} {tier}
        </span>
        {segregationScore !== undefined && <span className="text-xs opacity-70">Segregation: {segregationScore}%</span>}
      </div>
    </section>
  );
}
