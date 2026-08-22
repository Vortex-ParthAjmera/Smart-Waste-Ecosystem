"use client";

import { useEffect, useState } from "react";
import { getCurrentCitizen } from "@/lib/mock";
import type { Citizen } from "@/lib/mock/types";
import { LoadingState } from "@/components/status/LoadingState";
import { ErrorState } from "@/components/status/ErrorState";

export default function CitizenQR() {
  const [citizen, setCitizen] = useState<Citizen | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = async () => {
    setLoading(true);
    try { setCitizen(await getCurrentCitizen()); } catch { setError(true); } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  if (loading) return <LoadingState />;
  if (error || !citizen) return <ErrorState onRetry={load} />;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-slate-800">My QR Code</h2>
      <div className="rounded-2xl bg-white border border-slate-200 p-8 flex flex-col items-center">
        {/* Static QR Code (SVG placeholder) */}
        <div className="w-48 h-48 rounded-xl bg-white border-2 border-slate-800 p-2 flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <rect x="5" y="5" width="25" height="25" fill="black" rx="2" />
            <rect x="70" y="5" width="25" height="25" fill="black" rx="2" />
            <rect x="5" y="70" width="25" height="25" fill="black" rx="2" />
            <rect x="10" y="10" width="15" height="15" fill="white" rx="1" />
            <rect x="75" y="10" width="15" height="15" fill="white" rx="1" />
            <rect x="10" y="75" width="15" height="15" fill="white" rx="1" />
            <rect x="14" y="14" width="7" height="7" fill="black" />
            <rect x="79" y="14" width="7" height="7" fill="black" />
            <rect x="14" y="79" width="7" height="7" fill="black" />
            <rect x="35" y="5" width="5" height="5" fill="black" />
            <rect x="45" y="5" width="5" height="5" fill="black" />
            <rect x="55" y="5" width="5" height="5" fill="black" />
            <rect x="35" y="15" width="5" height="5" fill="black" />
            <rect x="50" y="15" width="5" height="5" fill="black" />
            <rect x="35" y="35" width="5" height="5" fill="black" />
            <rect x="45" y="40" width="10" height="10" fill="black" />
            <rect x="60" y="35" width="5" height="5" fill="black" />
            <rect x="35" y="55" width="5" height="5" fill="black" />
            <rect x="50" y="60" width="5" height="5" fill="black" />
            <rect x="65" y="55" width="5" height="5" fill="black" />
            <rect x="35" y="70" width="5" height="5" fill="black" />
            <rect x="50" y="75" width="5" height="5" fill="black" />
            <rect x="65" y="70" width="5" height="5" fill="black" />
            <rect x="80" y="40" width="15" height="5" fill="black" />
            <rect x="80" y="55" width="15" height="5" fill="black" />
          </svg>
        </div>
        <p className="mt-4 text-sm font-medium text-slate-600">ID: {citizen.id.toUpperCase()}</p>
        <p className="text-xs text-slate-400 mt-1">Show this to the municipal operator</p>
      </div>
      <div className="rounded-xl bg-blue-50 border border-blue-200 p-4 text-sm text-blue-700">
        <p className="font-medium">How it works</p>
        <p className="mt-1">The municipal operator scans this QR to verify your identity and begin a disposal session. No personal information is shared in the QR code.
        </p>
      </div>
    </div>
  );
}
