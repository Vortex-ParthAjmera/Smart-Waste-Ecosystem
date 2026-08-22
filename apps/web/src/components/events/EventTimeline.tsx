"use client";

import { cn } from "@/lib/utils";
import type { ProcessingState, DecisionState, TransportState } from "@/lib/mock/types";

const processingSteps: ProcessingState[] = ["DISPOSAL_STARTED", "SENSOR_CAPTURED", "ML_PENDING", "ML_RECEIVED", "PROCESSING", "SEGREGATION_DECIDED", "COMPLETED"];
const decisionSteps: DecisionState[] = ["CAPTURED", "EVALUATING", "ACCEPTED"];
const transportSteps: TransportState[] = ["QUEUED_LOCALLY", "PENDING", "IN_FLIGHT", "ACKED"];

function StepLine({ steps, current, label }: { steps: string[]; current: string; label: string }) {
  const idx = steps.indexOf(current);
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</p>
      <div className="flex items-center gap-1">
        {steps.map((step, i) => (
          <div key={step} className="flex items-center">
            <div className={cn("h-2 w-2 rounded-full", i < idx ? "bg-emerald-500" : i === idx ? "bg-emerald-400 animate-pulse" : "bg-slate-200")} />
            {i < steps.length - 1 && <div className={cn("h-0.5 w-4", i < idx ? "bg-emerald-500" : "bg-slate-200")} />}
          </div>
        ))}
      </div>
    </div>
  );
}

interface EventTimelineProps {
  processing: ProcessingState;
  decision: DecisionState;
  transport: TransportState;
}

export function EventTimeline({ processing, decision, transport }: EventTimelineProps) {
  return (
    <div className="rounded-xl bg-white border border-slate-200 p-4 space-y-3">
      <StepLine steps={processingSteps} current={processing} label="Processing" />
      <StepLine steps={decisionSteps} current={decision} label="Decision" />
      <StepLine steps={transportSteps} current={transport} label="Transport" />
    </div>
  );
}
