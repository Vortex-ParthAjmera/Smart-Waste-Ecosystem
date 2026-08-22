"use client";

import type { LeaderboardEntry } from "@/lib/mock/data";

const tierEmoji: Record<string, string> = { BRONZE: "🥉", SILVER: "🥈", GOLD: "🥇", PLATINUM: "💎" };

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
}

export function LeaderboardTable({ entries }: LeaderboardTableProps) {
  return (
    <div className="space-y-2">
      {entries.map((entry) => (
        <div
          key={entry.rank}
          className={`flex items-center gap-3 rounded-xl border p-3 ${entry.isCurrentUser ? "border-emerald-300 bg-emerald-50" : "border-slate-200 bg-white"}`}
        >
          <span className={`w-8 text-center text-lg font-bold ${entry.rank <= 3 ? "text-amber-500" : "text-slate-400"}`}>
            {entry.rank}
          </span>
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-medium truncate ${entry.isCurrentUser ? "text-emerald-700" : "text-slate-700"}`}>
              {entry.alias} {entry.isCurrentUser && <span className="text-xs text-emerald-500">(You)</span>}
            </p>
            <p className="text-xs text-slate-400">{tierEmoji[entry.tier]} {entry.tier}</p>
          </div>
          <span className="text-lg font-bold text-emerald-600 tabular-nums">{entry.points}</span>
        </div>
      ))}
    </div>
  );
}
