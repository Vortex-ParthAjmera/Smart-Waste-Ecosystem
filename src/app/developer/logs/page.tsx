"use client";

import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { DevCard } from "@/components/developer/DevCard";
import { EmptyState } from "@/components/StateViews";
import { apiClient } from "@/lib/api-client";
import { formatDateTime, cn } from "@/lib/utils";

const LEVELS = ["ALL", "INFO", "WARN", "ERROR"] as const;

export default function LogsPage() {
  const [level, setLevel] = useState<(typeof LEVELS)[number]>("ALL");
  const logs = apiClient.getLogs().filter((l) => level === "ALL" || l.level === level);

  return (
    <div>
      <PageHeader title="Safe Logs" description="No PII, no coordinates, no raw evidence - event IDs and outcomes only" className="text-slate-100" />
      <div className="mb-3 flex gap-1">
        {LEVELS.map((l) => (
          <button
            key={l}
            onClick={() => setLevel(l)}
            className={cn(
              "rounded-full border px-2.5 py-1 text-[11px] font-medium",
              level === l ? "border-slate-500 bg-slate-800 text-slate-100" : "border-slate-800 text-slate-500"
            )}
          >
            {l}
          </button>
        ))}
      </div>
      {logs.length === 0 ? (
        <EmptyState title="No log entries at this level" />
      ) : (
        <div className="space-y-1.5 font-mono text-xs">
          {logs.map((l) => (
            <DevCard key={l.id} className="flex items-center gap-3 py-2">
              <span
                className={cn(
                  "shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold",
                  l.level === "ERROR" ? "bg-red-900 text-red-300" : l.level === "WARN" ? "bg-amber-900 text-amber-300" : "bg-slate-800 text-slate-400"
                )}
              >
                {l.level}
              </span>
              <span className="text-slate-500">{formatDateTime(l.timestamp)}</span>
              <span className="flex-1 truncate text-slate-200">{l.message}</span>
            </DevCard>
          ))}
        </div>
      )}
    </div>
  );
}
