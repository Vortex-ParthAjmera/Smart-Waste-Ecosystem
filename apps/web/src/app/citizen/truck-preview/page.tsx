"use client";

import { PageHeader } from "@/components/PageHeader";
import { PreviewBanner } from "@/components/PreviewBanner";
import { EmptyState } from "@/components/StateViews";
import { Card, CardContent } from "@/components/ui/card";
import { apiClient } from "@/lib/api-client";
import { Truck as TruckIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CitizenTruckPreviewPage() {
  const trucks = apiClient.listTrucks();
  const stages = apiClient.collectionStages();
  const truck = trucks[0];

  if (!truck) {
    return (
      <div className="space-y-3">
        <PageHeader title="Truck & ETA Preview" />
        <PreviewBanner />
        <EmptyState
          title="No preview truck available"
          description="Seeded collection data has not been configured for this preview."
        />
      </div>
    );
  }

  const stageIdx = stages.indexOf(truck.stage);

  return (
    <div className="space-y-3">
      <PageHeader title="Truck & ETA Preview" />
      <PreviewBanner />
      <Card>
        <CardContent className="space-y-4 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-primary-light text-brand-primary-dark">
              <TruckIcon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold">{truck.truckId}</p>
              <p className="text-xs text-brand-muted-fg">{truck.status}</p>
            </div>
          </div>
          <div className="flex items-center justify-between rounded-xl bg-brand-surface-muted px-3 py-2 text-xs">
            <span>{truck.distanceKm} km away</span>
            <span className="font-semibold">ETA {truck.etaMinutes} min</span>
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-brand-muted-fg">Collection stepper</p>
            <div className="flex items-center">
              {stages.map((s, i) => (
                <div key={s} className="flex flex-1 flex-col items-center last:flex-none">
                  <div className={cn("h-2.5 w-2.5 rounded-full", i <= stageIdx ? "bg-brand-primary" : "bg-brand-border")} />
                  <span className={cn("mt-1 w-14 text-center text-[8px] leading-tight", i <= stageIdx ? "text-foreground" : "text-brand-muted-fg")}>
                    {s.replace("_", " ")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
