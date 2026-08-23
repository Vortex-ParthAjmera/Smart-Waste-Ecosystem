"use client";

import { PageHeader } from "@/components/PageHeader";
import { DevCard, DevSectionLabel } from "@/components/developer/DevCard";
import { apiClient } from "@/lib/api-client";
import { useDemoStore } from "@/lib/demoStore";
import { formatDateTime, formatRelativeTime } from "@/lib/utils";
import { Clock, AlertTriangle } from "lucide-react";

export default function EdgeQueuePage() {
  const snapshot = apiClient.getEdgeQueueSnapshot();
  const demo = useDemoStore();
  const inFlightBoost = demo.activeDisposal && demo.activeDisposal.transportState !== "ACKED" ? 1 : 0;
  const ackedBoost = demo.injectedEvents.filter((e) => e.transportState === "ACKED").length;

  const rows = [
    { label: "Pending", value: snapshot.pending, tone: "text-slate-200" },
    { label: "In flight", value: snapshot.inFlight + inFlightBoost, tone: "text-amber-400" },
    { label: "Acked", value: snapshot.acked + ackedBoost, tone: "text-emerald-400" },
    { label: "Auth-blocked", value: snapshot.authBlocked, tone: snapshot.authBlocked > 0 ? "text-red-400" : "text-slate-200" },
    { label: "Dead-letter", value: snapshot.deadLetter, tone: snapshot.deadLetter > 0 ? "text-red-400" : "text-slate-200" },
  ];

  return (
    <div>
      <PageHeader title="Edge Queue Depth" description="Local sync queue between the bin and the cloud" className="text-slate-100" />
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        {rows.map((r) => (
          <DevCard key={r.label} className="text-center">
            <p className={`mono-tabular text-2xl font-bold ${r.tone}`}>{r.value}</p>
            <p className="mt-1 text-[11px] text-slate-500">{r.label}</p>
          </DevCard>
        ))}
      </div>

      <DevSectionLabel>
        <span className="mt-4 block">Sync status</span>
      </DevSectionLabel>
      <DevCard className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-slate-200">
          <Clock className="h-4 w-4 text-slate-500" />
          Last successful sync {formatRelativeTime(snapshot.lastSuccessfulSync)}
        </div>
        <span className="text-[11px] text-slate-500">Next retry {formatDateTime(snapshot.nextRetry)}</span>
      </DevCard>

      {snapshot.safeErrorCode ? (
        <DevCard className="mt-2 flex items-center gap-2 border-amber-700 bg-amber-950/30">
          <AlertTriangle className="h-4 w-4 text-amber-400" />
          <p className="text-xs text-amber-300">Safe error code: {snapshot.safeErrorCode}</p>
        </DevCard>
      ) : (
        <p className="mt-2 text-[11px] text-slate-500">No sync errors reported.</p>
      )}
    </div>
  );
}
