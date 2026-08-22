"use client";

import type { Badge } from "@/lib/mock/types";

interface BadgeCardProps {
  badge: Badge;
}

export function BadgeCard({ badge }: BadgeCardProps) {
  return (
    <div className={`rounded-xl border p-4 text-center min-w-[120px] flex-shrink-0 ${badge.unlocked ? "border-emerald-200 bg-emerald-50" : "border-slate-200 bg-slate-50 opacity-50"}`}>
      <div className="text-3xl">{badge.unlocked ? "🏅" : "🔒"}</div>
      <p className="mt-2 text-sm font-semibold text-slate-700">{badge.name}</p>
      <p className="mt-1 text-xs text-slate-500">{badge.description}</p>
      {badge.earnedAt && (
        <p className="mt-1 text-[10px] text-emerald-600">
          Earned {new Date(badge.earnedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
        </p>
      )}
    </div>
  );
}
