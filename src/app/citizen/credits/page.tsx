"use client";

import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { TruthBadge } from "@/components/TruthBadge";
import { EmptyState } from "@/components/StateViews";
import { useCitizenProfile } from "@/lib/useCitizenProfile";
import { useDisposalHistory } from "@/lib/useDisposalHistory";
import { formatRelativeTime, cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export default function CitizenCreditsPage() {
  const { profile, loading: profileLoading } = useCitizenProfile();
  const { records, loading: historyLoading } = useDisposalHistory();

  const balance = profile?.pointsBalance ?? 0;

  return (
    <div>
      <PageHeader title="EcoCredits" description="Points earned from verified disposals" />

      {profileLoading ? (
        <div className="flex justify-center py-8"><Loader2 className="h-5 w-5 animate-spin text-brand-muted-fg" /></div>
      ) : (
        <Card className="mb-4 bg-brand-gold-light">
          <CardContent className="p-4">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs text-brand-gold">Available balance</p>
                <p className="mono-tabular text-3xl font-bold text-brand-gold">{balance.toLocaleString("en-IN")}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-brand-gold/70">Tier</p>
                <p className="text-sm font-bold text-brand-gold">{profile?.tier ?? "BRONZE"}</p>
              </div>
            </div>
            <div className="mt-2 flex items-center gap-1.5">
              <TruthBadge value="REAL" />
              <span className="text-[11px] text-brand-gold/70">Live balance from Supabase</span>
            </div>
          </CardContent>
        </Card>
      )}

      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-brand-muted-fg">Ledger</p>

      {historyLoading && <div className="flex justify-center py-4"><Loader2 className="h-5 w-5 animate-spin text-brand-muted-fg" /></div>}

      {!historyLoading && (records?.length ?? 0) === 0 && (
        <EmptyState title="No entries yet" description="Points will appear here after your first disposal." />
      )}

      <div className="space-y-2">
        {records?.map((r) => (
          <Card key={r.id}>
            <CardContent className="flex items-center justify-between p-3">
              <div>
                <p className="text-sm font-medium">{r.waste_type}</p>
                <div className="mt-1 flex items-center gap-2">
                  <TruthBadge value="REAL" />
                  <span className="text-[11px] text-brand-muted-fg">{formatRelativeTime(r.created_at)}</span>
                </div>
              </div>
              <span className={cn("shrink-0 font-semibold", r.points_earned >= 0 ? "text-brand-primary" : "text-brand-danger")}>
                {r.points_earned > 0 ? "+" : ""}{r.points_earned}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
