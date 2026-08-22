"use client";

import { useState } from "react";
import { injectTestEvent } from "@/lib/mock";
import type { DisposalEvent } from "@/lib/mock/types";
import { getDecisionLabel, getTruthBadge } from "@/lib/mock/types";
import { TruthBadge } from "@/components/status/TruthBadge";

const fixtures = [
  { id: "fix-dry-correct", label: "Dry — Correct Segregation", description: "Plastic Bottle in DRY compartment" },
  { id: "fix-wet-correct", label: "Wet — Correct Segregation", description: "Banana Peels in WET compartment" },
  { id: "fix-dry-flagged", label: "Dry — Low Confidence", description: "Cardboard Box with moisture 52% — FLAGGED" },
  { id: "fix-wet-mismatch", label: "Wet — Category Mismatch", description: "DRY item in WET compartment — FLAGGED" },
];

export default function DeveloperInject() {
  const [selected, setSelected] = useState(fixtures[0].id);
  const [injecting, setInjecting] = useState(false);
  const [result, setResult] = useState<DisposalEvent | null>(null);

  const handleInject = async () => {
    setInjecting(true);
    setResult(null);
    try {
      const event = await injectTestEvent();
      setResult(event);
    } finally {
      setInjecting(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-emerald-400">Inject Test Event</h2>
      <div className="rounded-xl bg-amber-900/30 border border-amber-700 p-3 text-xs text-amber-300">
        ⚠️ Creates a SIMULATED event. No physical QR, IR, sensors, camera, or firmware will be exercised.
      </div>

      <div className="rounded-xl bg-slate-900 border border-slate-700 p-4 space-y-3">
        <h3 className="text-sm font-semibold text-slate-300">Select Fixture</h3>
        {fixtures.map(f => (
          <label key={f.id} className={`flex items-start gap-3 rounded-lg p-3 cursor-pointer transition-colors ${selected === f.id ? "bg-slate-700 border border-emerald-500" : "bg-slate-800 border border-transparent hover:border-slate-600"}`}>
            <input type="radio" name="fixture" value={f.id} checked={selected === f.id} onChange={() => setSelected(f.id)} className="mt-0.5 accent-emerald-500" />
            <div>
              <p className="text-sm font-medium text-slate-200">{f.label}</p>
              <p className="text-xs text-slate-500">{f.description}</p>
            </div>
          </label>
        ))}
      </div>

      <button onClick={handleInject} disabled={injecting} className="w-full rounded-lg bg-emerald-600 py-3 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-50 transition-colors">
        {injecting ? "⏳ Injecting..." : "⚡ Inject Test Event"}
      </button>

      {result && (
        <div className="rounded-xl bg-slate-900 border border-emerald-500 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-emerald-400">Event Injected</h3>
            <TruthBadge badge={getTruthBadge(result.eventSource, result.mlDetection.evidenceSource)} />
          </div>
          <div className="text-xs space-y-1 text-slate-400">
            <p>Event ID: <span className="text-slate-200">{result.eventId}</span></p>
            <p>Compartment: <span className={`font-medium ${result.selectedCompartment === "WET" ? "text-cyan-400" : "text-amber-400"}`}>{result.selectedCompartment}</span></p>
            <p>Waste: <span className="text-slate-200">{result.mlDetection.wasteType}</span></p>
            <p>Result: <span className={`font-medium ${result.decisionState === "ACCEPTED" ? "text-emerald-400" : "text-amber-400"}`}>{getDecisionLabel(result.decisionState)}</span></p>
            <p>Points: <span className="text-emerald-400 font-bold">+{result.pointsAwarded}</span></p>
            <p>Source: <span className="text-amber-400">{result.eventSource}</span> • ML: <span className="text-amber-400">{result.mlDetection.evidenceSource}</span></p>
          </div>
        </div>
      )}
    </div>
  );
}
