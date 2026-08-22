"use client";

import { useEffect, useState } from "react";
import { getCurrentCitizen, getDisposalEventsByCitizen } from "@/lib/mock";
import type { DisposalEvent } from "@/lib/mock/types";
import { getDecisionLabel, getTruthBadge } from "@/lib/mock/types";
import { TruthBadge } from "@/components/status/TruthBadge";
import { LoadingState } from "@/components/status/LoadingState";
import { ErrorState } from "@/components/status/ErrorState";
import { EmptyState } from "@/components/status/EmptyState";

export default function CitizenReviews() {
  const [flagged, setFlagged] = useState<DisposalEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const c = await getCurrentCitizen();
      const events = await getDisposalEventsByCitizen(c.id);
      setFlagged(events.filter(e => e.decisionState === "FLAGGED" || e.decisionState === "REVIEW_ACCEPTED" || e.decisionState === "VERIFIED_VIOLATION"));
    } catch { setError(true); } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  if (loading) return <LoadingState type="list" rows={3} />;
  if (error) return <ErrorState onRetry={load} />;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-slate-800">Reviews & Disputes</h2>
      {flagged.length === 0 ? (
        <EmptyState title="No pending reviews" description="All your disposals have been processed without issues." />
      ) : (
        <div className="space-y-2">
          {flagged.map(event => (
            <div key={event.eventId} className="rounded-xl bg-white border border-slate-200 p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-700">{event.mlDetection.wasteType}</p>
                  <p className="text-xs text-slate-400">{new Date(event.timestamp).toLocaleDateString("en-IN", { dateStyle: "medium" })}</p>
                </div>
                <TruthBadge badge={getTruthBadge(event.eventSource)} />
              </div>
              <p className={`mt-2 text-sm font-medium ${event.decisionState === "FLAGGED" ? "text-amber-600" : "text-slate-600"}`}>
                {getDecisionLabel(event.decisionState)}
              </p>
              <div className="mt-3 flex gap-2">
                <button className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-200">View Details</button>
                {event.decisionState === "FLAGGED" && <button className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-100">Submit Dispute</button>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
