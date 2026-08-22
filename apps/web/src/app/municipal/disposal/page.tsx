"use client";

import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TruthBadge } from "@/components/TruthBadge";
import { EmptyState } from "@/components/StateViews";
import { useDemoStore } from "@/lib/demoStore";
import { apiClient } from "@/lib/api-client";
import { truthBadgeForEvent } from "@/lib/mock/disposalEvents";
import { formatRelativeTime, cn } from "@/lib/utils";

export default function ActiveDisposalPage() {
  const demo = useDemoStore();
  const citizen = apiClient.getDemoCitizen();
  const event = demo.activeDisposal ?? apiClient.getLatestEventForCitizen(citizen.id);

  return (
    <div className="mx-auto max-w-lg">
      <PageHeader title="Active Disposal" description="What the operator sees while a disposal is underway" />
      {!event ? (
        <EmptyState title="No active disposal" description="This view populates automatically when a citizen disposes at the bin." />
      ) : (
        <Card>
          <CardContent className="space-y-4 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">{citizen.name}</p>
                <p className="text-xs text-brand-muted-fg">{citizen.locality}</p>
              </div>
              <TruthBadge value={truthBadgeForEvent(event.eventSource)} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-brand-surface-muted p-3">
                <p className="text-[11px] text-brand-muted-fg">Selected compartment</p>
                <Badge variant={event.selectedCompartment === "WET" ? "wet" : "dry"} className="mt-1">
                  {event.selectedCompartment}
                </Badge>
              </div>
              <div className="rounded-xl bg-brand-surface-muted p-3">
                <p className="text-[11px] text-brand-muted-fg">ML classification</p>
                <p className="mt-1 text-sm font-medium">{event.mlDetection?.wasteType ?? "Pending / unavailable"}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <div>
                <p className="text-brand-muted-fg">Processing</p>
                <p className="font-medium">{event.processingState.replaceAll("_", " ")}</p>
              </div>
              <div>
                <p className="text-brand-muted-fg">Decision</p>
                <p className="font-medium">{event.decisionState.replaceAll("_", " ")}</p>
              </div>
              <div>
                <p className="text-brand-muted-fg">Transport</p>
                <p className="font-medium">{event.transportState.replaceAll("_", " ")}</p>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-brand-border pt-3">
              <span className="text-xs text-brand-muted-fg">Point effect</span>
              <span className={cn("text-sm font-semibold", event.pointsAwarded > 0 ? "text-brand-primary" : event.pointsAwarded < 0 ? "text-brand-danger" : "text-brand-muted-fg")}>
                {event.processingState === "COMPLETED" ? `${event.pointsAwarded > 0 ? "+" : ""}${event.pointsAwarded} pts` : "Pending…"}
              </span>
            </div>
            <p className="text-[11px] text-brand-muted-fg">Updated {formatRelativeTime(event.timestamp)} · {event.deviceCode}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
