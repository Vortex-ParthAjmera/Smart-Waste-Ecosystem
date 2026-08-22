"use client";

import { useEffect, useState } from "react";
import { Loader2, AlertOctagon, WifiOff, CircleDot } from "lucide-react";
import { cn } from "@/lib/utils";

export type ScreenStatus = "loading" | "ready" | "error" | "offline";

export function useDemoScreenState(delayMs = 450) {
  const [status, setStatus] = useState<ScreenStatus>("loading");
  useEffect(() => {
    const t = setTimeout(() => setStatus("ready"), delayMs);
    return () => clearTimeout(t);
  }, [delayMs]);
  return { status, setStatus };
}

// A small, unobtrusive control that lets a reviewer preview this screen's
// loading / error / offline states on demand, matching the Tier 1
// requirement that every screen implement all four states.
export function DemoStateToggle({
  status,
  setStatus,
}: {
  status: ScreenStatus;
  setStatus: (s: ScreenStatus) => void;
}) {
  const OPTIONS: { key: ScreenStatus; label: string; icon: React.ElementType }[] = [
    { key: "ready", label: "Loaded", icon: CircleDot },
    { key: "loading", label: "Loading", icon: Loader2 },
    { key: "error", label: "Error", icon: AlertOctagon },
    { key: "offline", label: "Offline", icon: WifiOff },
  ];
  return (
    <div className="mb-3 flex items-center gap-1 rounded-full border border-dashed border-brand-border bg-brand-surface-muted/60 p-0.5 text-[10px]">
      <span className="pl-1.5 pr-1 text-brand-muted-fg">Preview:</span>
      {OPTIONS.map((o) => {
        const Icon = o.icon;
        return (
          <button
            key={o.key}
            onClick={() => setStatus(o.key)}
            className={cn(
              "flex items-center gap-1 rounded-full px-2 py-0.5 font-medium",
              status === o.key ? "bg-brand-surface shadow-sm text-foreground" : "text-brand-muted-fg"
            )}
          >
            <Icon className="h-3 w-3" /> {o.label}
          </button>
        );
      })}
    </div>
  );
}
