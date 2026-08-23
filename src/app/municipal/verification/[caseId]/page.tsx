"use client";

import { use, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, XCircle } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TruthBadge } from "@/components/TruthBadge";
import { EmptyState } from "@/components/StateViews";
import { apiClient } from "@/lib/api-client";
import { formatDateTime } from "@/lib/utils";

export default function VerificationCaseDetailPage({ params }: { params: Promise<{ caseId: string }> }) {
  const { caseId } = use(params);
  const [decision, setDecision] = useState<"REVIEW_ACCEPTED" | "REVIEW_NO_ACTION" | null>(null);
  const reviewCase = apiClient.getCaseById(caseId);
  const event = reviewCase ? apiClient.getEventById(reviewCase.eventId) : undefined;

  if (!reviewCase || !event) {
    return (
      <div>
        <Link href="/municipal/verification" className="mb-3 inline-flex items-center gap-1 text-xs text-brand-muted-fg">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to queue
        </Link>
        <EmptyState title="Case not found" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg">
      <Link href="/municipal/verification" className="mb-3 inline-flex items-center gap-1 text-xs text-brand-muted-fg">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to queue
      </Link>
      <PageHeader title={`Case ${reviewCase.caseId}`} description={formatDateTime(reviewCase.createdAt)} />

      <div className="space-y-4">
        <Card>
          <CardContent className="space-y-2 p-4">
            <div className="flex items-center justify-between">
              <Badge variant={event.selectedCompartment === "WET" ? "wet" : "dry"}>{event.selectedCompartment} compartment</Badge>
              <TruthBadge value={reviewCase.truthBadge} />
            </div>
            <p className="text-sm">{reviewCase.reason}</p>
            <div className="grid grid-cols-2 gap-2 border-t border-brand-border pt-3 text-xs">
              <div>
                <p className="text-brand-muted-fg">ML classification</p>
                <p className="font-medium">{event.mlDetection?.wasteType ?? "Unavailable"}</p>
              </div>
              <div>
                <p className="text-brand-muted-fg">Confidence</p>
                <p className="font-medium">{event.mlDetection ? `${(event.mlDetection.confidence * 100).toFixed(0)}%` : "N/A"}</p>
              </div>
              <div>
                <p className="text-brand-muted-fg">Moisture reading</p>
                <p className="font-medium">{event.measurements.moisturePercent.value}% ({event.measurements.moisturePercent.quality.toLowerCase()})</p>
              </div>
              <div>
                <p className="text-brand-muted-fg">Current point effect</p>
                <p className="font-medium">{event.pointsAwarded} pts</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {decision ? (
          <Card className={decision === "REVIEW_ACCEPTED" ? "border-brand-primary bg-brand-primary-light/40" : "border-brand-border"}>
            <CardContent className="flex items-center gap-2 p-4 text-sm">
              {decision === "REVIEW_ACCEPTED" ? (
                <CheckCircle2 className="h-4 w-4 text-brand-primary" />
              ) : (
                <XCircle className="h-4 w-4 text-brand-muted-fg" />
              )}
              Case marked as{" "}
              <span className="font-semibold">{decision === "REVIEW_ACCEPTED" ? "review accepted" : "no action needed"}</span>. This
              is a UI-only decision and does not persist after refresh.
            </CardContent>
          </Card>
        ) : (
          <div className="flex gap-2">
            <Button className="flex-1" onClick={() => setDecision("REVIEW_ACCEPTED")}>
              <CheckCircle2 className="h-4 w-4" /> Accept dispute
            </Button>
            <Button variant="outline" className="flex-1" onClick={() => setDecision("REVIEW_NO_ACTION")}>
              <XCircle className="h-4 w-4" /> No action
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
