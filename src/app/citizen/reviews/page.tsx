"use client";

import { useDisposalHistory } from "@/lib/useDisposalHistory";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/StateViews";
import { formatRelativeTime } from "@/lib/utils";
import { Send, Loader2 } from "lucide-react";
import { useState } from "react";

export default function CitizenReviewsPage() {
  const { records, loading } = useDisposalHistory();
  const [submittedIds, setSubmittedIds] = useState<Set<string>>(new Set());

  // Flagged/negative records are eligible for dispute
  const disputable = (records ?? []).filter((r) => r.points_earned < 0);

  return (
    <div>
      <PageHeader title="Reviews & Disputes" />

      {loading && <div className="flex justify-center py-8"><Loader2 className="h-5 w-5 animate-spin text-brand-muted-fg" /></div>}

      {!loading && disputable.length === 0 && (
        <EmptyState title="No reviews or disputes" description="Penalised disposal records will appear here and can be disputed." />
      )}

      <div className="space-y-3">
        {disputable.map((r) => {
          const submitted = submittedIds.has(r.id);
          return (
            <Card key={r.id}>
              <CardContent className="space-y-2 p-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-brand-danger">{r.points_earned} pts</span>
                  <span className="text-[11px] text-brand-muted-fg">{formatRelativeTime(r.created_at)}</span>
                </div>
                <p className="text-sm">{r.waste_type} — {r.compartment} compartment</p>
                <div className={`rounded-lg px-2 py-1 text-[11px] font-medium ${submitted ? "bg-brand-primary-light text-brand-primary-dark" : "bg-brand-surface-muted text-brand-muted-fg"}`}>
                  {submitted ? "Dispute submitted — pending municipal review" : "Eligible for dispute"}
                </div>
                {!submitted && (
                  <Button size="sm" variant="outline" onClick={() => setSubmittedIds(new Set([...submittedIds, r.id]))}>
                    <Send className="h-3.5 w-3.5" /> Submit dispute
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
