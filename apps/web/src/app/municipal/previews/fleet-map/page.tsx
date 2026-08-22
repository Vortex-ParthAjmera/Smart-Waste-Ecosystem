"use client";

import { PageHeader } from "@/components/PageHeader";
import { PreviewBanner } from "@/components/PreviewBanner";
import { Card, CardContent } from "@/components/ui/card";
import { apiClient } from "@/lib/api-client";
import { Truck as TruckIcon, MapPin } from "lucide-react";

export default function FleetMapPreviewPage() {
  const trucks = apiClient.listTrucks();
  return (
    <div className="space-y-3">
      <PageHeader title="Fleet Map" />
      <PreviewBanner />
      <Card>
        <CardContent className="p-4">
          <div className="relative flex h-64 items-center justify-center rounded-xl bg-brand-surface-muted border border-brand-border">
            <MapPin className="h-8 w-8 text-brand-muted-fg" />
            <p className="absolute bottom-3 text-[11px] text-brand-muted-fg">Map rendering not wired up in this UI-only pass</p>
          </div>
        </CardContent>
      </Card>
      <div className="space-y-2">
        {trucks.map((t) => (
          <Card key={t.truckId}>
            <CardContent className="flex items-center justify-between p-3">
              <div className="flex items-center gap-2">
                <TruckIcon className="h-4 w-4 text-brand-primary" />
                <div>
                  <p className="text-sm font-medium">{t.truckId}</p>
                  <p className="text-[11px] text-brand-muted-fg">{t.zone}</p>
                </div>
              </div>
              <span className="text-xs font-medium">{t.stage.replaceAll("_", " ")}</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
