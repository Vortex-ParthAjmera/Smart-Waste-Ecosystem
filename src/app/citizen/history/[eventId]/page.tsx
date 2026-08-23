"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, MapPin, Gauge } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TruthBadge } from "@/components/TruthBadge";
import { EmptyState } from "@/components/StateViews";
import { apiClient } from "@/lib/api-client";
import { truthBadgeForEvent } from "@/lib/mock/disposalEvents";
import { formatDateTime, cn } from "@/lib/utils";

export default function CitizenHistoryDetailPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = use(params);
  const event = apiClient.getEventById(eventId);
  const ledger = event ? apiClient.getLedgerForCitizen(event.citizenId).find((t) => t.eventId === eventId) : undefined;

  if (!event) {
    return (
      <div>
        <PageHeader title="Event not found" />
        <EmptyState title="We couldn't find this event" description="It may have been from a different citizen session." />
        <Link href="/citizen/history" className="mt-3 inline-block text-xs text-brand-primary">
          Back to history
        </Link>
      </div>
    );
  }

  const eligibleForDispute = event.pointsAwarded < 0 && event.decisionState !== "CLOSED";

  return (
    <div>
      <Link href="/citizen/history" className="mb-3 inline-flex items-center gap-1 text-xs text-brand-muted-fg">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to history
      </Link>
      <PageHeader title={event.mlDetection?.wasteType ?? "Disposal event"} description={formatDateTime(event.timestamp)} />

      <div className="space-y-4">
        <Card>
          <CardContent className="space-y-3 p-4">
            <div className="flex items-center justify-between">
              <Badge variant={event.selectedCompartment === "WET" ? "wet" : "dry"}>{event.selectedCompartment} compartment</Badge>
              <TruthBadge value={truthBadgeForEvent(event.eventSource)} />
            </div>
            <div className="flex items-center justify-between border-t border-brand-border pt-3">
              <span className="text-xs text-brand-muted-fg">Decision</span>
              <span className="text-sm font-medium">{event.decisionState.replaceAll("_", " ")}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-brand-muted-fg">Point effect</span>
              <span className={cn("text-sm font-semibold", event.pointsAwarded > 0 ? "text-brand-primary" : event.pointsAwarded < 0 ? "text-brand-danger" : "text-brand-muted-fg")}>
                {event.pointsAwarded > 0 ? "+" : ""}
                {event.pointsAwarded} pts
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-brand-muted-fg">Rule version</span>
              <span className="text-sm font-medium">segregation-rules-v1.4</span>
            </div>
          </CardContent>
        </Card>

        {event.reasonPlain && (
          <Card>
            <CardContent className="p-4">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-brand-muted-fg">Why this result</p>
              <p className="text-sm text-foreground">{event.reasonPlain}</p>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="space-y-3 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-muted-fg">Evidence summary</p>
            <div className="flex items-center gap-2 text-sm">
              <Gauge className="h-4 w-4 text-brand-muted-fg" />
              <span>
                Moisture {event.measurements.moisturePercent.value}% ({event.measurements.moisturePercent.quality.toLowerCase()})
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-brand-muted-fg" />
              <span>{event.location.fixQuality === "GPS" ? "Location confirmed at bin" : "GPS fix unavailable"}</span>
            </div>
            {event.mlDetection && (
              <p className="text-xs text-brand-muted-fg">
                Model {event.mlDetection.modelVersion} · confidence {(event.mlDetection.confidence * 100).toFixed(0)}% ({event.mlDetection.scoreBand.toLowerCase()})
              </p>
            )}
          </CardContent>
        </Card>

        {ledger && (
          <Card>
            <CardContent className="p-4">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-brand-muted-fg">Ledger reference</p>
              <p className="text-sm">{ledger.reason}</p>
              <p className="text-xs text-brand-muted-fg">Transaction {ledger.id}</p>
            </CardContent>
          </Card>
        )}

        {eligibleForDispute && (
          <Button asChild variant="secondary" className="w-full">
            <Link href="/citizen/reviews">Raise a dispute for this entry</Link>
          </Button>
        )}
      </div>
    </div>
  );
}
