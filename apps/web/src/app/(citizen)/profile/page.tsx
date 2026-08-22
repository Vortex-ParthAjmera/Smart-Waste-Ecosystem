"use client";

import { useEffect, useState } from "react";
import { getCurrentCitizen } from "@/lib/mock";
import type { Citizen } from "@/lib/mock/types";
import { LoadingState } from "@/components/status/LoadingState";
import { ErrorState } from "@/components/status/ErrorState";

export default function CitizenProfile() {
  const [citizen, setCitizen] = useState<Citizen | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = async () => { setLoading(true); try { setCitizen(await getCurrentCitizen()); } catch { setError(true); } finally { setLoading(false); } };
  useEffect(() => { load(); }, []);

  if (loading) return <LoadingState />;
  if (error || !citizen) return <ErrorState onRetry={load} />;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-slate-800">Profile</h2>
      <div className="rounded-xl bg-white border border-slate-200 p-6 text-center">
        <div className="mx-auto h-20 w-20 rounded-full bg-emerald-100 flex items-center justify-center text-3xl">👤</div>
        <p className="mt-3 text-lg font-bold text-slate-800">{citizen.name}</p>
        <p className="text-sm text-slate-500">{citizen.phone}</p>
        <p className="text-xs text-slate-400 mt-1">Household ID: {citizen.id.toUpperCase()}</p>
      </div>
      <div className="rounded-xl bg-white border border-slate-200 divide-y divide-slate-100">
        <div className="flex items-center justify-between p-4"><span className="text-sm text-slate-600">EcoCredits</span><span className="text-sm font-bold text-emerald-600">{citizen.pointsBalance}</span></div>
        <div className="flex items-center justify-between p-4"><span className="text-sm text-slate-600">Tier</span><span className="text-sm font-medium text-slate-800">{citizen.tier}</span></div>
        <div className="flex items-center justify-between p-4"><span className="text-sm text-slate-600">Segregation Score</span><span className="text-sm font-medium text-slate-800">{citizen.segregationScore}%</span></div>
        <div className="flex items-center justify-between p-4"><span className="text-sm text-slate-600">Badges Earned</span><span className="text-sm font-medium text-slate-800">{citizen.badges.filter(b => b.unlocked).length}/{citizen.badges.length}</span></div>
      </div>
      <p className="text-xs text-center text-slate-400">Profile settings — coming in next update</p>
    </div>
  );
}
