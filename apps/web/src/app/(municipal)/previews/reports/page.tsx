"use client";

import { TruthBadge } from "@/components/status/TruthBadge";

export default function ReportsPreview() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-800">Reports & Analytics</h2>
        <TruthBadge badge="PREVIEW/SEEDED" />
      </div>
      <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-700 text-center">Roadmap interface — not connected to a live backend</div>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-white border border-slate-200 p-4 text-center"><p className="text-2xl font-bold text-emerald-600">847</p><p className="text-xs text-slate-400">Total Disposals</p></div>
        <div className="rounded-xl bg-white border border-slate-200 p-4 text-center"><p className="text-2xl font-bold text-emerald-600">72%</p><p className="text-xs text-slate-400">Segregation Rate</p></div>
        <div className="rounded-xl bg-white border border-slate-200 p-4 text-center"><p className="text-2xl font-bold text-cyan-600">412</p><p className="text-xs text-slate-400">Wet Waste (kg)</p></div>
        <div className="rounded-xl bg-white border border-slate-200 p-4 text-center"><p className="text-2xl font-bold text-amber-600">289</p><p className="text-xs text-slate-400">Dry Waste (kg)</p></div>
      </div>
      <div className="rounded-xl bg-white border border-slate-200 p-4 h-48 flex items-center justify-center text-slate-400 text-sm">
        📈 Charts — recharts integration coming
      </div>
    </div>
  );
}
