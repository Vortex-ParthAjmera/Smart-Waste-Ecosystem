"use client";

import { useEffect, useState } from "react";
import { getAllDisposalEvents } from "@/lib/mock";
import type { DisposalEvent } from "@/lib/mock/types";
import { getDecisionLabel, getTruthBadge } from "@/lib/mock/types";
import { TruthBadge } from "@/components/status/TruthBadge";
import { LoadingState } from "@/components/status/LoadingState";
import { ErrorState } from "@/components/status/ErrorState";
import { citizens } from "@/lib/mock/data";

export default function MunicipalActiveDisposal() {
  const [events, setEvents] = useState<DisposalEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = async () => { setLoading(true); try { setEvents((await getAllDisposalEvents()).slice(0, 3)); } catch { setError(true); } finally { setLoading(false); } };
  useEffect(() => { load(); }, []);

  if (loading) return <LoadingState type="list" rows={3} />;
  if (error) return <ErrorState onRetry={load} />;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-slate-800">Active Disposal</h2>
      {events.map(event => {
        const c = citizens.find(x => x.id === event.citizenId);
        return (
          <div key={event.eventId} className="rounded-xl bg-white border border-slate-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="font-semibold text-slate-800">{c?.name || "Unknown"}</p>
              <TruthBadge badge={getTruthBadge(event.eventSource)} size="sm" />
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div><span className="text-slate-400">Compartment:</span> <span className={`font-medium ${event.selectedCompartment === "WET" ? "text-cyan-600" : "text-amber-600"}`}>{event.selectedCompartment}</span></div>
              <div><span className="text-slate-400">Waste:</span> <span className="font-medium">{event.mlDetection.wasteType}</span></div>
              <div><span className="text-slate-400">Confidence:</span> <span className="font-medium">{(event.mlDetection.confidence * 100).toFixed(0)}%</span></div>
              <div><span className="text-slate-400">Result:</span> <span className={`font-medium ${event.decisionState === "ACCEPTED" ? "text-emerald-600" : "text-amber-600"}`}>{getDecisionLabel(event.decisionState)}</span></div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
