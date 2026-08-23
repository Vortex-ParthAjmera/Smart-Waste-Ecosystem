"use client";

import Link from "next/link";
import { ArrowRight, Leaf } from "lucide-react";
import { TruthBadge } from "@/components/TruthBadge";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCitizenProfile } from "@/lib/useCitizenProfile";
import { useDisposalHistory } from "@/lib/useDisposalHistory";
import { formatRelativeTime, cn } from "@/lib/utils";
import { TIER_THRESHOLDS, pointsToNextTier } from "@/lib/mock/citizens";
import { Loader2 } from "lucide-react";

const TIER_COLORS: Record<string, string> = {
  BRONZE: "bg-amber-100 text-amber-800",
  SILVER: "bg-slate-200 text-slate-700",
  GOLD: "bg-yellow-100 text-yellow-700",
  PLATINUM: "bg-violet-100 text-violet-700",
};

export default function CitizenOverviewPage() {
  const { profile, loading: profileLoading } = useCitizenProfile();
  const { records, loading: historyLoading } = useDisposalHistory();

  const balance = profile?.pointsBalance ?? 0;
  const tier = profile?.tier ?? "BRONZE";
  const { nextTier, remaining } = pointsToNextTier(balance);
  const latest = records?.[0];

  if (profileLoading) return (
    <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-brand-muted-fg" /></div>
  );

  return (
    <div className="space-y-4">
      {/* Balance card */}
      <Card className="overflow-hidden bg-gradient-to-br from-brand-primary to-brand-primary-dark text-white">
        <CardContent className="p-5">
          <p className="text-xs font-medium text-white/70">EcoCredits balance</p>
          <p className="mono-tabular mt-1 text-4xl font-bold">{balance.toLocaleString("en-IN")}</p>
          <div className="mt-3 flex items-center gap-2">
            <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${TIER_COLORS[tier]}`}>{tier}</span>
            {nextTier && <span className="text-[11px] text-white/70">{remaining} pts to {nextTier}</span>}
          </div>
        </CardContent>
      </Card>

      {/* Tier progress */}
      <Card>
        <CardContent className="p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-brand-muted-fg">Tier progress</p>
          <div className="space-y-1.5">
            {TIER_THRESHOLDS.map((t) => (
              <div key={t.tier} className={cn("flex items-center justify-between rounded-lg px-3 py-1.5 text-xs",
                tier === t.tier ? "bg-brand-primary-light font-semibold text-brand-primary-dark" : "bg-brand-surface-muted text-brand-muted-fg")}>
                <span>{t.tier}</span>
                <span>{t.min}–{t.max ?? "∞"} pts</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Latest disposal */}
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-brand-muted-fg">Latest disposal</p>
        {historyLoading ? (
          <Card><CardContent className="p-4 text-sm text-brand-muted-fg">Loading…</CardContent></Card>
        ) : latest ? (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <Badge variant={latest.compartment === "WET" ? "wet" : "dry"}>{latest.compartment}</Badge>
                <TruthBadge value="REAL" />
              </div>
              <p className="mt-2 text-sm font-medium">{latest.waste_type}</p>
              <p className="text-xs text-brand-muted-fg">{formatRelativeTime(latest.created_at)}</p>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs text-brand-primary font-medium">Accepted</span>
                <span className="text-sm font-semibold text-brand-primary">+{latest.points_earned} pts</span>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card><CardContent className="p-4 text-sm text-brand-muted-fg">No disposals yet. Your history will appear here after your first bin use.</CardContent></Card>
        )}
      </div>

      <Button asChild className="w-full">
        <Link href="/citizen/history">View full history <ArrowRight className="h-4 w-4" /></Link>
      </Button>
    </div>
  );
}
