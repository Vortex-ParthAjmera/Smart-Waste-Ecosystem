"use client";

import { TruthBadge } from "@/components/status/TruthBadge";
import { trucks } from "@/lib/mock/data";

export default function FleetMapPreview() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-800">Fleet Map</h2>
        <TruthBadge badge="PREVIEW/SEEDED" />
      </div>
      <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-700 text-center">Roadmap interface — not connected to a live backend</div>
      <div className="rounded-xl bg-slate-100 border border-slate-200 h-64 flex items-center justify-center text-slate-500 text-sm">
        🗺️ Leaflet map with truck markers — coming in Tier 2
      </div>
      {trucks.map(t => (
        <div key={t.truckId} className="rounded-xl bg-white border border-slate-200 p-3 flex items-center justify-between">
          <div><p className="text-sm font-medium">{t.truckId}</p><p className="text-xs text-slate-400">{t.status}</p></div>
          <p className="text-xs text-slate-500">{t.distanceKm}km • ETA {t.etaMinutes}m</p>
        </div>
      ))}
    </div>
  );
}
