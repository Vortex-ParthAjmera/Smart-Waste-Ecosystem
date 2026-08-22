"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TruthBadge } from "@/components/TruthBadge";
import { LoadingSkeleton, EmptyState, ErrorState, OfflineBanner } from "@/components/StateViews";
import { useDemoScreenState, DemoStateToggle } from "@/components/ScreenChrome";
import { apiClient } from "@/lib/api-client";
import { truthBadgeForEvent } from "@/lib/mock/disposalEvents";
import { formatRelativeTime, cn } from "@/lib/utils";

type ResultFilter = "ALL" | "POSITIVE" | "FLAGGED" | "NEGATIVE";
type CompartmentFilter = "ALL" | "WET" | "DRY";

export default function CitizenHistoryPage() {
  const { status, setStatus } = useDemoScreenState();
  const [resultFilter, setResultFilter] = useState<ResultFilter>("ALL");
  const [compartmentFilter, setCompartmentFilter] = useState<CompartmentFilter>("ALL");

  const citizen = apiClient.getDemoCitizen();
  const allEvents = apiClient.getEventsForCitizen(citizen.id);

  const events = useMemo(() => {
    return allEvents.filter((e) => {
      if (compartmentFilter !== "ALL" && e.selectedCompartment !== compartmentFilter) return false;
      if (resultFilter === "POSITIVE" && e.pointsAwarded <= 0) return false;
      if (resultFilter === "FLAGGED" && !["FLAGGED", "REVIEW_ACCEPTED"].includes(e.decisionState)) return false;
      if (resultFilter === "NEGATIVE" && e.pointsAwarded >= 0) return false;
      return true;
    });
  }, [allEvents, resultFilter, compartmentFilter]);

  return (
    <div>
      <PageHeader title="History" description={`${allEvents.length} past disposal events`} />
      <DemoStateToggle status={status} setStatus={setStatus} />
      {status === "offline" && <OfflineBanner />}

      <div className="mb-3 flex flex-wrap gap-2">
        {(["ALL", "POSITIVE", "FLAGGED", "NEGATIVE"] as ResultFilter[]).map((f) => (
          <button
            key={f}
            onClick={() => setResultFilter(f)}
            className={cn(
              "rounded-full border px-2.5 py-1 text-[11px] font-medium",
              resultFilter === f ? "border-brand-primary bg-brand-primary-light text-brand-primary-dark" : "border-brand-border text-brand-muted-fg"
            )}
          >
            {f === "ALL" ? "All results" : f.charAt(0) + f.slice(1).toLowerCase()}
          </button>
        ))}
        <span className="mx-1 w-px bg-brand-border" />
        {(["ALL", "WET", "DRY"] as CompartmentFilter[]).map((f) => (
          <button
            key={f}
            onClick={() => setCompartmentFilter(f)}
            className={cn(
              "rounded-full border px-2.5 py-1 text-[11px] font-medium",
              compartmentFilter === f ? "border-brand-primary bg-brand-primary-light text-brand-primary-dark" : "border-brand-border text-brand-muted-fg"
            )}
          >
            {f === "ALL" ? "All types" : f.charAt(0) + f.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {status === "loading" && <LoadingSkeleton rows={6} />}
      {status === "error" && <ErrorState onRetry={() => setStatus("ready")} />}
      {(status === "ready" || status === "offline") && (
        events.length === 0 ? (
          <EmptyState title="No events match these filters" description="Try a different result or waste-type filter." />
        ) : (
          <div className="space-y-2">
            {events.map((e) => (
              <Link key={e.eventId} href={`/citizen/history/${e.eventId}`}>
                <Card>
                  <CardContent className="flex items-center justify-between p-3">
                    <div>
                      <div className="mb-1 flex items-center gap-2">
                        <Badge variant={e.selectedCompartment === "WET" ? "wet" : "dry"}>{e.selectedCompartment}</Badge>
                        <TruthBadge value={truthBadgeForEvent(e.eventSource)} />
                      </div>
                      <p className="text-sm font-medium">{e.mlDetection?.wasteType ?? "Unclassified"}</p>
                      <p className="text-xs text-brand-muted-fg">{formatRelativeTime(e.timestamp)} · {e.decisionState.replaceAll("_", " ")}</p>
                    </div>
                    <span
                      className={cn(
                        "shrink-0 text-sm font-semibold",
                        e.pointsAwarded > 0 ? "text-brand-primary" : e.pointsAwarded < 0 ? "text-brand-danger" : "text-brand-muted-fg"
                      )}
                    >
                      {e.pointsAwarded > 0 ? "+" : ""}
                      {e.pointsAwarded}
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )
      )}
    </div>
  );
}
