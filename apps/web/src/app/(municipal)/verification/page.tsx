"use client";

import { useEffect, useState } from "react";
import { getReviewCases } from "@/lib/mock";
import type { ReviewCase } from "@/lib/mock/types";
import { TruthBadge } from "@/components/status/TruthBadge";
import { LoadingState } from "@/components/status/LoadingState";
import { ErrorState } from "@/components/status/ErrorState";
import { citizens } from "@/lib/mock/data";

export default function MunicipalVerification() {
  const [cases, setCases] = useState<ReviewCase[]>([]);
  const [selected, setSelected] = useState<ReviewCase | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = async () => { setLoading(true); try { setCases(await getReviewCases()); } catch { setError(true); } finally { setLoading(false); } };
  useEffect(() => { load(); }, []);

  if (loading) return <LoadingState type="list" rows={4} />;
  if (error) return <ErrorState onRetry={load} />;

  const pending = cases.filter(c => c.status === "PENDING");
  const resolved = cases.filter(c => c.status !== "PENDING");

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-slate-800">Verification Queue</h2>
      <p className="text-xs text-slate-400">{pending.length} pending review</p>

      {/* Queue */}
      <div className="space-y-2">
        {pending.map(c => {
          const citizen = citizens.find(x => x.id === c.citizenId);
          return (
            <button key={c.caseId} onClick={() => setSelected(c)} className={`w-full text-left rounded-xl border p-3 transition-colors ${selected?.caseId === c.caseId ? "border-blue-300 bg-blue-50" : "border-slate-200 bg-white hover:bg-slate-50"}`}>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-700">{citizen?.name || "Unknown"}</p>
                <TruthBadge badge={c.truthBadge} size="sm" />
              </div>
              <p className="mt-1 text-xs text-slate-500 truncate">{c.reason}</p>
              <p className="text-[10px] text-slate-400 mt-1">{new Date(c.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</p>
            </button>
          );
        })}
        {pending.length === 0 && <p className="py-6 text-center text-sm text-slate-400">No pending cases — all clear!</p>}
      </div>

      {/* Case Detail */}
      {selected && (
        <div className="rounded-xl bg-white border border-slate-200 p-4 space-y-3">
          <h3 className="font-semibold text-slate-800">Case Detail</h3>
          <div className="text-sm space-y-1">
            <p><span className="text-slate-400">Case:</span> {selected.caseId}</p>
            <p><span className="text-slate-400">Event:</span> {selected.eventId}</p>
            <p><span className="text-slate-400">Reason:</span> {selected.reason}</p>
            <p><span className="text-slate-400">Source:</span> {selected.eventSource}</p>
          </div>
          <div className="flex gap-2">
            <button className="flex-1 rounded-lg bg-emerald-600 py-2 text-sm font-medium text-white hover:bg-emerald-700">Accept Submission</button>
            <button className="flex-1 rounded-lg bg-red-600 py-2 text-sm font-medium text-white hover:bg-red-700">Confirm Violation</button>
          </div>
        </div>
      )}

      {/* Resolved */}
      {resolved.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-slate-600 mb-2">Resolved</h3>
          {resolved.map(c => (
            <div key={c.caseId} className="rounded-lg bg-slate-50 border border-slate-100 p-3 mb-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-slate-600">{c.caseId}</p>
                <span className={`text-xs font-medium ${c.status === "REVIEW_ACCEPTED" ? "text-emerald-600" : c.status === "VERIFIED_VIOLATION" ? "text-red-600" : "text-slate-500"}`}>{c.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
