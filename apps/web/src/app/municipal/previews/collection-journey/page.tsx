"use client";

import { PageHeader } from "@/components/PageHeader";
import { PreviewBanner } from "@/components/PreviewBanner";
import { Card, CardContent } from "@/components/ui/card";
import { apiClient } from "@/lib/api-client";
import { cn } from "@/lib/utils";

export default function CollectionJourneyPreviewPage() {
  const stages = apiClient.collectionStages();
  const truck = apiClient.listTrucks()[0];
  const idx = stages.indexOf(truck.stage);

  return (
    <div className="space-y-3">
      <PageHeader title="Collection Journey" />
      <PreviewBanner />
      <Card>
        <CardContent className="p-4">
          <p className="mb-4 text-sm font-medium">{truck.truckId} — {truck.zone}</p>
          <div className="space-y-3">
            {stages.map((s, i) => (
              <div key={s} className="flex items-center gap-3">
                <div className={cn("h-3 w-3 rounded-full", i <= idx ? "bg-brand-primary" : "bg-brand-border")} />
                <span className={cn("text-sm", i <= idx ? "text-foreground" : "text-brand-muted-fg")}>{s.replaceAll("_", " ")}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
