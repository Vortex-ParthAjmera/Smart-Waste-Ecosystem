"use client";

import { TruthBadge } from "@/components/status/TruthBadge";

export default function ZonesPreview() {
  const zones = [
    { name: "Ward 12 — Rajiv Nagar", compliance: 78, trucks: 2, status: "Active" },
    { name: "Ward 15 — Vijay Nagar", compliance: 85, trucks: 1, status: "Active" },
    { name: "Ward 8 — Palasia", compliance: 62, trucks: 1, status: "Scheduled" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-800">Zone Overview</h2>
        <TruthBadge badge="PREVIEW/SEEDED" />
      </div>
      <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-700 text-center">Roadmap interface — not connected to a live backend</div>
      <div className="space-y-3">
        {zones.map(z => (
          <div key={z.name} className="rounded-xl bg-white border border-slate-200 p-4">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-slate-800">{z.name}</p>
              <span className="text-xs font-medium text-slate-500">{z.status}</span>
            </div>
            <div className="mt-2 flex gap-4 text-sm">
              <span>📊 {z.compliance}% compliance</span>
              <span>🚛 {z.trucks} trucks</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
