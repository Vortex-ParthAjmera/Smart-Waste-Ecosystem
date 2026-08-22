"use client";

import { useEffect, useState } from "react";
import { getTrucks } from "@/lib/mock";
import type { Truck } from "@/lib/mock/types";
import { TruthBadge } from "@/components/status/TruthBadge";
import { LoadingState } from "@/components/status/LoadingState";
import { ErrorState } from "@/components/status/ErrorState";

export default function TruckPreview() {
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = async () => { setLoading(true); try { setTrucks(await getTrucks()); } catch { setError(true); } finally { setLoading(false); } };
  useEffect(() => { load(); }, []);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState onRetry={load} />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-800">Truck & ETA</h2>
        <TruthBadge badge="PREVIEW/SEEDED" />
      </div>
      <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-700 text-center">
        Roadmap interface — not connected to a live backend
      </div>
      {trucks.map(t => (
        <div key={t.truckId} className="rounded-xl bg-white border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-slate-800">{t.truckId}</p>
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">{t.status}</span>
          </div>
          <div className="mt-2 flex gap-4 text-sm text-slate-600">
            <span>📍 {t.distanceKm} km</span>
            <span>⏱️ ETA {t.etaMinutes} min</span>
          </div>
        </div>
      ))}
      <div className="rounded-xl bg-slate-100 border border-slate-200 p-8 text-center text-sm text-slate-500">
        🗺️ Map view — coming with Tier 2 Leaflet integration
      </div>
    </div>
  );
}
