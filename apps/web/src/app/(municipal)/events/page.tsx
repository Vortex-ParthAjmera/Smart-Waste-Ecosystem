"use client";

import { useEffect, useState } from "react";
import { getAllDisposalEvents } from "@/lib/mock";
import type { DisposalEvent } from "@/lib/mock/types";
import { getDecisionLabel, getTruthBadge } from "@/lib/mock/types";
import { TruthBadge } from "@/components/status/TruthBadge";
import { LoadingState } from "@/components/status/LoadingState";
import { ErrorState } from "@/components/status/ErrorState";
import { citizens } from "@/lib/mock/data";

export default function MunicipalEvents() {
  const [events, setEvents] = useState<DisposalEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(false);
    try {
      const e = await getAllDisposalEvents();
      setEvents(e);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  if (loading) return <LoadingState type="list" rows={5} />;
  if (error) return <ErrorState onRetry={load} />;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-800">Live Events</h2>
        <span className="text-xs text-slate-400">{events.length} events</span>
      </div>
      {events.map((event) => {
        const citizen = citizens.find((c) => c.id === event.citizenId);
        return (
          <div key={event.eventId} className="rounded-xl bg-white border border-slate-200 p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-800">{citizen?.name || "Unknown"}</p>
                <p className="text-xs text-slate-400">{new Date(event.timestamp).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</p>
              </div>
              <TruthBadge badge={getTruthBadge(event.eventSource, event.mlDetection.evidenceSource)} />
            </div>
            <div className="mt-2 flex items-center gap-3 text-sm">
              <span className={`font-medium ${event.selectedCompartment === "WET" ? "text-cyan-600" : "text-amber-600"}`}>
                {event.selectedCompartment === "WET" ? "💧" : "📦"} {event.mlDetection.wasteType}
              </span>
              <span className={`font-medium ${event.decisionState === "ACCEPTED" ? "text-emerald-600" : "text-amber-600"}`}>
                {getDecisionLabel(event.decisionState)}
              </span>
              <span className={`font-bold ${event.pointsAwarded > 0 ? "text-emerald-600" : "text-slate-500"}`}>
                {event.pointsAwarded > 0 ? "+" : ""}{event.pointsAwarded}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
