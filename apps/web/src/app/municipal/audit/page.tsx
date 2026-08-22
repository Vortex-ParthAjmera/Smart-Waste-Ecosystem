"use client";

import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { TruthBadge } from "@/components/TruthBadge";
import { EmptyState } from "@/components/StateViews";
import { apiClient } from "@/lib/api-client";
import { formatDateTime } from "@/lib/utils";

export default function AuditTrailPage() {
  const cases = apiClient.listAllReviewCases();

  return (
    <div>
      <PageHeader title="Audit Trail" description="Immutable history of every review decision" />
      {cases.length === 0 ? (
        <EmptyState title="No audit entries yet" />
      ) : (
        <div className="space-y-2">
          {cases.map((c) => (
            <Card key={c.caseId}>
              <CardContent className="p-3">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm font-medium">{c.caseId}</span>
                  <TruthBadge value={c.truthBadge} />
                </div>
                <p className="text-xs text-brand-muted-fg">{c.reason}</p>
                <div className="mt-1 flex items-center justify-between text-[11px] text-brand-muted-fg">
                  <span>{c.status.replaceAll("_", " ")}</span>
                  <span>{formatDateTime(c.createdAt)}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
