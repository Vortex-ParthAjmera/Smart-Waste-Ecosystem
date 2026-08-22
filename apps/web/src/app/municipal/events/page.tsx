"use client";

import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TruthBadge } from "@/components/TruthBadge";
import { EmptyState } from "@/components/StateViews";
import { apiClient } from "@/lib/api-client";
import { truthBadgeForEvent } from "@/lib/mock/disposalEvents";
import { useDemoStore } from "@/lib/demoStore";
import { formatRelativeTime, cn } from "@/lib/utils";

export default function LiveEventsPage() {
  const demo = useDemoStore();
  const citizen = apiClient.getDemoCitizen();
  const seeded = apiClient.getEventsForCitizen(citizen.id);
  const events = [...demo.injectedEvents, ...seeded].slice(0, 20);

  return (
    <div>
      <PageHeader title="Live Events" description="All disposal events across the ward, most recent first" />
      {events.length === 0 ? (
        <EmptyState title="No events yet" />
      ) : (
        <div className="space-y-2">
          {events.map((e) => (
            <Card key={e.eventId}>
              <CardContent className="flex items-center justify-between p-3">
                <div className="flex items-center gap-3">
                  <Badge variant={e.selectedCompartment === "WET" ? "wet" : "dry"}>{e.selectedCompartment}</Badge>
                  <div>
                    <p className="text-sm font-medium">{e.mlDetection?.wasteType ?? "Unclassified"}</p>
                    <p className="text-[11px] text-brand-muted-fg">
                      {formatRelativeTime(e.timestamp)} · {e.decisionState.replaceAll("_", " ")} · {e.deviceCode}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <TruthBadge value={truthBadgeForEvent(e.eventSource)} />
                  <span className={cn("text-sm font-semibold", e.pointsAwarded > 0 ? "text-brand-primary" : e.pointsAwarded < 0 ? "text-brand-danger" : "text-brand-muted-fg")}>
                    {e.pointsAwarded > 0 ? "+" : ""}
                    {e.pointsAwarded}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
