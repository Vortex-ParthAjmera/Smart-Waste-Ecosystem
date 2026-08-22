"use client";

import { useState } from "react";
import { citizens } from "@/lib/mock/data";
import { TruthBadge } from "@/components/status/TruthBadge";

export default function MunicipalScan() {
  const [scanned, setScanned] = useState(false);
  const [validating, setValidating] = useState(false);

  const simulateScan = async () => {
    setValidating(true);
    await new Promise(r => setTimeout(r, 1500));
    setScanned(true);
    setValidating(false);
  };

  const reset = () => { setScanned(false); };

  if (scanned) {
    const citizen = citizens[0];
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-800">Citizen Verified</h2>
        <div className="rounded-xl bg-white border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center text-xl">👤</div>
            <div>
              <p className="font-bold text-slate-800">{citizen.name}</p>
              <p className="text-sm text-slate-500">ID: {citizen.id.toUpperCase()}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg bg-slate-50 p-2"><p className="text-slate-400 text-xs">EcoCredits</p><p className="font-bold text-emerald-600">{citizen.pointsBalance}</p></div>
            <div className="rounded-lg bg-slate-50 p-2"><p className="text-slate-400 text-xs">Tier</p><p className="font-bold text-slate-800">{citizen.tier}</p></div>
            <div className="rounded-lg bg-slate-50 p-2"><p className="text-slate-400 text-xs">Segregation</p><p className="font-bold text-slate-800">{citizen.segregationScore}%</p></div>
            <div className="rounded-lg bg-slate-50 p-2"><p className="text-slate-400 text-xs">Recent</p><p className="font-medium text-slate-600">3/5 correct</p></div>
          </div>
          <TruthBadge badge="REAL" />
          <button onClick={reset} className="mt-4 w-full rounded-lg bg-slate-100 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200">Scan Another</button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-slate-800">Scan QR</h2>
      <div className="rounded-xl bg-slate-900 aspect-square flex flex-col items-center justify-center text-white relative overflow-hidden">
        <div className="absolute inset-8 border-2 border-dashed border-emerald-400 rounded-xl" />
        <div className="absolute top-8 left-8 w-8 h-8 border-t-2 border-l-2 border-emerald-400" />
        <div className="absolute top-8 right-8 w-8 h-8 border-t-2 border-r-2 border-emerald-400" />
        <div className="absolute bottom-8 left-8 w-8 h-8 border-b-2 border-l-2 border-emerald-400" />
        <div className="absolute bottom-8 right-8 w-8 h-8 border-b-2 border-r-2 border-emerald-400" />
        <p className="text-sm text-slate-400 relative z-10">{validating ? "Validating..." : "Point camera at citizen QR"}</p>
      </div>
      <button onClick={simulateScan} disabled={validating} className="w-full rounded-lg bg-blue-600 py-3 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors">
        {validating ? "⏳ Scanning..." : "📱 Tap to Simulate Scan"}
      </button>
    </div>
  );
}
