"use client";

import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TruthBadge } from "@/components/TruthBadge";
import { EmptyState } from "@/components/StateViews";
import { formatRelativeTime, cn } from "@/lib/utils";
import { useDisposalHistory } from "@/lib/useDisposalHistory";
import { Loader2 } from "lucide-react";

type CompartmentFilter = "ALL" | "WET" | "DRY";

export default function CitizenHistoryPage() {
  const { records, loading } = useDisposalHistory();
  const [compartmentFilter, setCompartmentFilter] = useState<CompartmentFilter>("ALL");

  const filtered = (records ?? []).filter((r) =>
    compartmentFilter === "ALL" ? true : r.compartment === compartmentFilter
  );

  return (
    <div>
      <PageHeader title="Disposal History" description={`${records?.length ?? 0} total disposals`} />

      <div className="mb-3 flex gap-2">
        {(["ALL", "WET", "DRY"] as CompartmentFilter[]).map((f) => (
          <button key={f} onClick={() => setCompartmentFilter(f)}
            className={cn("rounded-full border px-3 py-1 text-[11px] font-medium",
              compartmentFilter === f ? "border-brand-primary bg-brand-primary-light text-brand-primary-dark" : "border-brand-border text-brand-muted-fg")}>
            {f === "ALL" ? "All" : f.charAt(0) + f.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {loading && <div className="flex justify-center py-8"><Loader2 className="h-5 w-5 animate-spin text-brand-muted-fg" /></div>}

      {!loading && filtered.length === 0 && (
        <EmptyState title="No disposals yet" description="Your disposal history will appear here after your first bin use." />
      )}

      <div className="space-y-2">
        {filtered.map((r) => (
          <Card key={r.id}>
            <CardContent className="flex items-center justify-between p-3">
              <div>
                <div className="mb-1 flex items-center gap-2">
                  <Badge variant={r.compartment === "WET" ? "wet" : "dry"}>{r.compartment}</Badge>
                  <TruthBadge value="REAL" />
                </div>
                <p className="text-sm font-medium">{r.waste_type}</p>
                <p className="text-xs text-brand-muted-fg">
                  {formatRelativeTime(r.created_at)}{r.weight_grams ? ` · ${r.weight_grams}g` : ""}
                </p>
              </div>
              <span className="shrink-0 text-sm font-semibold text-brand-primary">+{r.points_earned}</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
