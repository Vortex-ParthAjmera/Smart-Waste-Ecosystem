"use client";

import { useEffect, useState } from "react";
import { getCurrentCitizen, getDisposalEventsByCitizen } from "@/lib/mock";
import type { DisposalEvent } from "@/lib/mock/types";
import { getDecisionLabel, getTruthBadge } from "@/lib/mock/types";
import { TruthBadge } from "@/components/status/TruthBadge";
import { LoadingState } from "@/components/status/LoadingState";
import { ErrorState } from "@/components/status/ErrorState";

export default function CitizenHistory() {
  const [events, setEvents] = useState<DisposalEvent[]>([]);
  const [filter, setFilter] = useState<"all" | "accepted" | "flagged" | "wet" | "dry">("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(false);
    try {
      const c = await getCurrentCitizen();
      const e = await getDisposalEventsByCitizen(c.id);
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

  const filtered = events.filter((e) => {
    if (filter === "accepted") return e.decisionState === "ACCEPTED";
    if (filter === "flagged") return e.decisionState === "FLAGGED";
    if (filter === "wet") return e.selectedCompartment === "WET";
    if (filter === "dry") return e.selectedCompartment === "DRY";
    return true;
  });

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-bold text-slate-800">Disposal History</h2>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {(["all", "accepted", "flagged", "wet", "dry"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex-shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              filter === f
                ? "bg-emerald-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Event List */}
      {filtered.length === 0 ? (
        <p className="py-8 text-center text-sm text-slate-400">No events match this filter.</p>
      ) : (
        <div className="space-y-2">
          {filtered.map((event) => (
            <div key={event.eventId} className="rounded-xl bg-white border border-slate-200 p-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium ${event.selectedCompartment === "WET" ? "text-cyan-600" : "text-amber-600"}`}>
                      {event.selectedCompartment === "WET" ? "💧" : "📦"} {event.mlDetection.wasteType}
                    </span>
                    <TruthBadge badge={getTruthBadge(event.eventSource, event.mlDetection.evidenceSource)} size="sm" />
                  </div>
                  <p className="mt-1 text-xs text-slate-400">
                    {new Date(event.timestamp).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`text-lg font-bold ${event.pointsAwarded > 0 ? "text-emerald-600" : event.pointsAwarded < 0 ? "text-red-600" : "text-slate-400"}`}>
                    {event.pointsAwarded > 0 ? "+" : ""}{event.pointsAwarded}
                  </span>
                  <p className={`text-xs font-medium ${event.decisionState === "ACCEPTED" ? "text-emerald-600" : "text-amber-600"}`}>
                    {getDecisionLabel(event.decisionState)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
