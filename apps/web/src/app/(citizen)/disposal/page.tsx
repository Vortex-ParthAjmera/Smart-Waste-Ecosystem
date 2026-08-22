"use client";

import { useState } from "react";
import { simulateDisposal } from "@/lib/mock";
import type { LiveDisposalState } from "@/lib/mock";
import { OfflineBanner } from "@/components/status/OfflineBanner";

const processingSteps = ["DISPOSAL_STARTED", "SENSOR_CAPTURED", "ML_PENDING", "ML_RECEIVED", "PROCESSING", "SEGREGATION_DECIDED", "COMPLETED"];
const decisionSteps = ["CAPTURED", "EVALUATING", "ACCEPTED"];
const transportSteps = ["QUEUED_LOCALLY", "PENDING", "IN_FLIGHT", "ACKED"];

function TimelineLine({ steps, current, label }: { steps: string[]; current: string; label: string }) {
  const currentIdx = steps.indexOf(current);
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</p>
      <div className="flex items-center gap-1">
        {steps.map((step, i) => (
          <div key={step} className="flex items-center">
            <div
              className={`h-2 w-2 rounded-full ${
                i < currentIdx ? "bg-emerald-500" : i === currentIdx ? "bg-emerald-400 animate-pulse" : "bg-slate-200"
              }`}
            />
            {i < steps.length - 1 && (
              <div className={`h-0.5 w-4 ${i < currentIdx ? "bg-emerald-500" : "bg-slate-200"}`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CitizenDisposal() {
  const [state, setState] = useState<LiveDisposalState | null>(null);
  const [running, setRunning] = useState(false);
  const [completed, setCompleted] = useState(false);

  const startDemo = async () => {
    setRunning(true);
    setCompleted(false);
    setState(null);
    const gen = simulateDisposal();
    for await (const s of gen) {
      setState(s);
    }
    setRunning(false);
    setCompleted(true);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-slate-800">Live Disposal</h2>

      {!running && !completed && (
        <div className="rounded-xl bg-white border border-slate-200 p-6 text-center">
          <p className="text-4xl mb-3">📦</p>
          <p className="text-slate-600">Ready for disposal</p>
          <button
            onClick={startDemo}
            className="mt-4 rounded-lg bg-emerald-600 px-6 py-3 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
          >
            ▶ Start Demo Disposal
          </button>
        </div>
      )}

      {state && (
        <div className="space-y-4">
          {/* Status Message */}
          <div className={`rounded-xl p-4 text-center ${
            completed
              ? state.decisionState === "ACCEPTED"
                ? "bg-emerald-50 border border-emerald-200"
                : "bg-amber-50 border border-amber-200"
              : "bg-white border border-slate-200"
          }`}>
            <p className={`text-lg font-semibold ${
              completed
                ? state.decisionState === "ACCEPTED" ? "text-emerald-700" : "text-amber-700"
                : "text-slate-700"
            }`}>
              {state.message}
            </p>
            {completed && state.pointsAwarded !== undefined && (
              <p className="mt-2 text-3xl font-bold text-emerald-600">+10 EcoCredits</p>
            )}
          </div>

          {/* Three Timelines */}
          <div className="rounded-xl bg-white border border-slate-200 p-4 space-y-3">
            <TimelineLine steps={processingSteps} current={state.processingState} label="Processing" />
            <TimelineLine steps={decisionSteps} current={state.decisionState} label="Decision" />
            <TimelineLine steps={transportSteps} current={state.transportState} label="Transport" />
          </div>

          {/* Restart */}
          {completed && (
            <button
              onClick={startDemo}
              className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Run Again
            </button>
          )}
        </div>
      )}

      <OfflineBanner type="stale" message="Demo mode — using simulated sensor data" />
    </div>
  );
}
