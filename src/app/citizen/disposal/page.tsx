"use client";

import { CheckCircle2, Circle, Loader2, PlayCircle } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/StateViews";
import { TruthBadge } from "@/components/TruthBadge";
import { useDemoStore, injectTestEvent, getFixtures } from "@/lib/demoStore";
import { truthBadgeForEvent } from "@/lib/mock/disposalEvents";
import { cn, formatRelativeTime } from "@/lib/utils";
import {
  ProcessingState,
  DecisionState,
  TransportState,
} from "@/lib/mock/types";

const PROCESSING_STEPS: ProcessingState[] = [
  "DISPOSAL_STARTED",
  "SENSOR_CAPTURED",
  "ML_PENDING",
  "ML_RECEIVED",
  "COMPLETED",
];
const DECISION_STEPS: DecisionState[] = ["CAPTURED", "EVALUATING", "ACCEPTED"];
const TRANSPORT_STEPS: TransportState[] = ["QUEUED_LOCALLY", "PENDING", "IN_FLIGHT", "ACKED"];

function stepIndex<T extends string>(steps: T[], current: T): number {
  const idx = steps.indexOf(current);
  return idx === -1 ? steps.length - 1 : idx;
}

function Timeline<T extends string>({
  label,
  steps,
  current,
  labelFor,
}: {
  label: string;
  steps: T[];
  current: T;
  labelFor?: (s: T) => string;
}) {
  const idx = stepIndex(steps, current);
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-brand-muted-fg">{label}</p>
      <div className="flex items-center">
        {steps.map((s, i) => (
          <div key={s} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-1">
              {i < idx ? (
                <CheckCircle2 className="h-5 w-5 text-brand-primary" />
              ) : i === idx ? (
                <Loader2 className="h-5 w-5 animate-spin text-brand-gold-strong" />
              ) : (
                <Circle className="h-5 w-5 text-brand-border" />
              )}
              <span className={cn("w-16 text-center text-[9px] leading-tight", i <= idx ? "text-foreground" : "text-brand-muted-fg")}>
                {(labelFor?.(s) ?? s).replaceAll("_", " ")}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={cn("mx-1 h-0.5 flex-1 rounded", i < idx ? "bg-brand-primary" : "bg-brand-border")} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function LiveDisposalPage() {
  const demo = useDemoStore();
  const event = demo.activeDisposal;
  const fixtures = getFixtures();

  return (
    <div>
      <PageHeader title="Live Disposal" description="Real-time view of your current disposal event" />

      {!event ? (
        <div className="space-y-4">
          <EmptyState
            title="No disposal in progress"
            description="This screen lights up automatically the moment a disposal starts at the smart bin."
          />
  
        </div>
      ) : (
        <div className="space-y-5">
          {event.transportState === "QUEUED_LOCALLY" && (
            <div className="rounded-xl border border-brand-warning bg-brand-warning-light px-3 py-2 text-xs font-medium text-brand-warning">
              Saved on the local system; cloud result pending.
            </div>
          )}

          <Card>
            <CardContent className="space-y-5 p-4">
              <div className="flex items-center justify-between">
                <Badge variant={event.selectedCompartment === "WET" ? "wet" : "dry"}>
                  {event.selectedCompartment} compartment
                </Badge>
                <TruthBadge value={truthBadgeForEvent(event.eventSource)} />
              </div>

              <Timeline label="Processing" steps={PROCESSING_STEPS} current={event.processingState} />
              <Timeline
                label="Decision"
                steps={DECISION_STEPS}
                current={
                  event.decisionState === "FLAGGED" || event.decisionState === "REVIEW_ACCEPTED"
                    ? "EVALUATING"
                    : event.decisionState === "ACCEPTED"
                    ? "ACCEPTED"
                    : (event.decisionState as (typeof DECISION_STEPS)[number])
                }
                labelFor={(s) => (s === "ACCEPTED" && event.decisionState === "FLAGGED" ? "FLAGGED" : s)}
              />
              <Timeline label="Transport" steps={TRANSPORT_STEPS} current={event.transportState} />

              <div className="grid grid-cols-2 gap-3 border-t border-brand-border pt-4 text-xs">
                <div>
                  <p className="text-brand-muted-fg">Evidence quality</p>
                  <p className="font-medium">{event.measurements.irConfirmation.quality}</p>
                </div>
                <div>
                  <p className="text-brand-muted-fg">ML label</p>
                  <p className="font-medium">
                    {event.mlDetection?.status === "SUPPORTED"
                      ? event.mlDetection.wasteType
                      : event.processingState === "COMPLETED" || event.processingState === "ML_RECEIVED"
                      ? "Unavailable"
                      : "Pending…"}
                  </p>
                </div>
                <div>
                  <p className="text-brand-muted-fg">Result</p>
                  <p className="font-medium">{event.decisionState.replaceAll("_", " ")}</p>
                </div>
                <div>
                  <p className="text-brand-muted-fg">Point effect</p>
                  <p className={cn("font-semibold", event.processingState !== "COMPLETED" && "text-brand-muted-fg")}>
                    {event.processingState === "COMPLETED"
                      ? `${event.pointsAwarded > 0 ? "+" : ""}${event.pointsAwarded} pts`
                      : "Pending…"}
                  </p>
                </div>
              </div>

              <p className="text-[11px] text-brand-muted-fg">
                Updated {formatRelativeTime(event.timestamp)} · Device {event.deviceCode}
              </p>
            </CardContent>
          </Card>


        </div>
      )}
    </div>
  );
}
