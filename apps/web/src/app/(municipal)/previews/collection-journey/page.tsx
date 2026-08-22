"use client";

import { TruthBadge } from "@/components/status/TruthBadge";

export default function CollectionJourneyPreview() {
  const steps = ["SCHEDULED", "DISPATCHED", "ON ROUTE", "NEAR", "COLLECTION", "COMPLETED"];
  const current = 2;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-800">Collection Journey</h2>
        <TruthBadge badge="PREVIEW/SEEDED" />
      </div>
      <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-700 text-center">Roadmap interface — not connected to a live backend</div>
      <div className="rounded-xl bg-white border border-slate-200 p-4">
        <p className="text-sm font-semibold text-slate-700 mb-3">SGV-001 — Rajiv Nagar Route</p>
        <div className="flex items-center gap-1">
          {steps.map((step, i) => (
            <div key={step} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold ${i < current ? "bg-emerald-500 text-white" : i === current ? "bg-blue-500 text-white animate-pulse" : "bg-slate-200 text-slate-500"}`}>
                  {i + 1}
                </div>
                <p className={`mt-1 text-[9px] text-center ${i === current ? "font-bold text-blue-600" : "text-slate-400"}`}>{step}</p>
              </div>
              {i < steps.length - 1 && <div className={`h-0.5 flex-1 mx-1 ${i < current ? "bg-emerald-500" : "bg-slate-200"}`} />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
