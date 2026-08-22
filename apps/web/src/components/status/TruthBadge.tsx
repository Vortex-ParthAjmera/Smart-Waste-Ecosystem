"use client";

import { cn } from "@/lib/utils";
import type { TruthBadge as TruthBadgeType } from "@/lib/mock/types";

interface TruthBadgeProps {
  badge: TruthBadgeType;
  className?: string;
  size?: "sm" | "md";
}

const badgeConfig: Record<TruthBadgeType, { label: string; icon: string; classes: string }> = {
  REAL: { label: "REAL", icon: "🟢", classes: "bg-emerald-100 text-emerald-800 border-emerald-300" },
  RECORDED: { label: "RECORDED", icon: "🔵", classes: "bg-blue-100 text-blue-800 border-blue-300" },
  SIMULATED: { label: "SIMULATED", icon: "🟠", classes: "bg-amber-100 text-amber-800 border-amber-300" },
  "PREVIEW/SEEDED": { label: "PREVIEW", icon: "🟣", classes: "bg-purple-100 text-purple-800 border-purple-300" },
};

export function TruthBadge({ badge, className, size = "sm" }: TruthBadgeProps) {
  const config = badgeConfig[badge];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border font-medium",
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm",
        config.classes,
        className
      )}
      role="status"
      aria-label={`Data source: ${config.label}`}
    >
      <span aria-hidden="true">{config.icon}</span>
      {config.label}
    </span>
  );
}
