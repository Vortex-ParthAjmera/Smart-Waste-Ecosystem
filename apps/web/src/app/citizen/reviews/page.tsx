"use client";

import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingSkeleton, EmptyState, ErrorState, OfflineBanner } from "@/components/StateViews";
import { useDemoScreenState, DemoStateToggle } from "@/components/ScreenChrome";
import { apiClient } from "@/lib/api-client";
import { formatDateTime, cn } from "@/lib/utils";
import { Send } from "lucide-react";

export default function CitizenReviewsPage() {
  const { status, setStatus } = useDemoScreenState();
  const [submittedIds, setSubmittedIds] = useState<Set<string>>(new Set());
  const citizen = apiClient.getDemoCitizen();
  const ledger = apiClient.getLedgerForCitizen(citizen.id);
  const disputable = ledger.filter((t) => t.source === "VIOLATION");

  return (
    <div>
      <PageHeader title="Reviews & Disputes" />
      <DemoStateToggle status={status} setStatus={setStatus} />
      {status === "offline" && <OfflineBanner />}
      {status === "loading" && <LoadingSkeleton rows={3} />}
      {status === "error" && <ErrorState onRetry={() => setStatus("ready")} />}
      {(status === "ready" || status === "offline") && (
        disputable.length === 0 ? (
          <EmptyState title="No reviews or disputes" description="Negative ledger entries you can dispute will appear here." />
        ) : (
          <div className="space-y-3">
            {disputable.map((t) => {
              const submitted = submittedIds.has(t.id);
              return (
                <Card key={t.id}>
                  <CardContent className="space-y-2 p-4">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-brand-danger">{t.amount} pts</span>
                      <span className="text-[11px] text-brand-muted-fg">{formatDateTime(t.timestamp)}</span>
                    </div>
                    <p className="text-sm">{t.reason}</p>
                    <div className={cn("rounded-lg px-2 py-1 text-[11px] font-medium", submitted ? "bg-brand-primary-light text-brand-primary-dark" : "bg-brand-surface-muted text-brand-muted-fg")}>
                      {submitted ? "Dispute submitted — pending municipal review" : "Eligible for dispute"}
                    </div>
                    {!submitted && (
                      <Button size="sm" variant="outline" onClick={() => setSubmittedIds(new Set([...submittedIds, t.id]))}>
                        <Send className="h-3.5 w-3.5" /> Submit dispute
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )
      )}
    </div>
  );
}
