"use client";

import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TruthBadge } from "@/components/TruthBadge";
import { EmptyState } from "@/components/StateViews";
import { apiClient } from "@/lib/api-client";
import { formatRelativeTime } from "@/lib/utils";

export default function VerificationQueuePage() {
  const cases = apiClient.getPendingReviewCases();

  return (
    <div>
      <PageHeader title="Verification Queue" description={`${cases.length} disputes awaiting review`} />
      {cases.length === 0 ? (
        <EmptyState title="Queue is clear" description="No disputes are currently pending review." />
      ) : (
        <div className="space-y-2">
          {cases.map((c) => (
            <Link key={c.caseId} href={`/municipal/verification/${c.caseId}`}>
              <Card>
                <CardContent className="flex items-center justify-between p-3">
                  <div>
                    <div className="mb-1 flex items-center gap-2">
                      <Badge variant={c.category === "WET" ? "wet" : c.category === "DRY" ? "dry" : "neutral"}>{c.category}</Badge>
                      <TruthBadge value={c.truthBadge} />
                    </div>
                    <p className="text-sm font-medium">{c.reason}</p>
                    <p className="text-[11px] text-brand-muted-fg">Opened {formatRelativeTime(c.createdAt)}</p>
                  </div>
                  <Badge variant="warning">{c.status.replaceAll("_", " ")}</Badge>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
