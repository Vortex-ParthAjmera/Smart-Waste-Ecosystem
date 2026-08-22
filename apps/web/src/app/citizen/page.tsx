"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, ShieldAlert } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { TruthBadge } from "@/components/TruthBadge";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LoadingSkeleton, ErrorState, OfflineBanner } from "@/components/StateViews";
import { useDemoScreenState, DemoStateToggle } from "@/components/ScreenChrome";
import { truthBadgeForEvent } from "@/lib/mock/disposalEvents";
import { pointsToNextTier } from "@/lib/mock/citizens";
import { formatRelativeTime } from "@/lib/utils";
import { useDemoStore } from "@/lib/demoStore";

const TIER_COLORS: Record<string, string> = {
  BRONZE: "bg-amber-100 text-amber-800",
  SILVER: "bg-slate-200 text-slate-700",
  GOLD: "bg-brand-gold-light text-brand-gold",
  PLATINUM: "bg-violet-100 text-violet-700",
};

export default function CitizenOverviewPage() {
  const { status, setStatus } = useDemoScreenState();
  const demo = useDemoStore();
  const citizen = apiClient.getDemoCitizen();
  const balance = apiClient.getBalanceFromLedger(citizen.id);
  const ledger = apiClient.getLedgerForCitizen(citizen.id);
  const latestLedger = ledger[0];
  const seededLatestEvent = apiClient.getLatestEventForCitizen(citizen.id);
  const latestEvent = demo.activeDisposal?.citizenId === citizen.id ? demo.activeDisposal : seededLatestEvent;
  const { nextTier, remaining } = pointsToNextTier(balance);
  const earnedBadge = citizen.badges.find((b) => !b.locked);
  const pendingReview = ledger.find((t) => t.source === "VIOLATION");

  return (
    <div>
      <DemoStateToggle status={status} setStatus={setStatus} />
      {status === "offline" && <OfflineBanner />}
      {status === "loading" && <LoadingSkeleton rows={4} />}
      {status === "error" && <ErrorState onRetry={() => setStatus("ready")} />}
      {(status === "ready" || status === "offline") && (
        <div className="space-y-4">
          <Card className="overflow-hidden bg-gradient-to-br from-brand-primary to-brand-primary-dark text-white">
            <CardContent className="p-5">
              <p className="text-xs font-medium text-white/70">EcoCredits balance</p>
              <p className="mono-tabular mt-1 text-4xl font-bold">{balance.toLocaleString("en-IN")}</p>
              <div className="mt-3 flex items-center gap-2">
                <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${TIER_COLORS[citizen.tier]}`}>
                  {citizen.tier}
                </span>
                {nextTier && (
                  <span className="text-[11px] text-white/70">{remaining} pts to {nextTier}</span>
                )}
              </div>
            </CardContent>
          </Card>

          {pendingReview && (
            <Link href="/citizen/reviews">
              <Card className="border-brand-warning bg-brand-warning-light/40">
                <CardContent className="flex items-center gap-2 p-3">
                  <ShieldAlert className="h-4 w-4 shrink-0 text-brand-warning" />
                  <p className="text-xs text-foreground">
                    You have a review entry you can dispute. Tap to view.
                  </p>
                  <ArrowRight className="ml-auto h-4 w-4 text-brand-muted-fg" />
                </CardContent>
              </Card>
            </Link>
          )}

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-brand-muted-fg">
              Latest disposal
            </p>
            {latestEvent ? (
              <Link href={demo.activeDisposal?.eventId === latestEvent.eventId ? "/citizen/disposal" : `/citizen/history/${latestEvent.eventId}`}>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <Badge variant={latestEvent.selectedCompartment === "WET" ? "wet" : "dry"}>
                        {latestEvent.selectedCompartment}
                      </Badge>
                      <TruthBadge value={truthBadgeForEvent(latestEvent.eventSource)} />
                    </div>
                    <p className="mt-2 text-sm font-medium">
                      {latestEvent.mlDetection?.wasteType ?? "Awaiting classification"}
                    </p>
                    <p className="text-xs text-brand-muted-fg">{formatRelativeTime(latestEvent.timestamp)}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs text-brand-muted-fg">{latestEvent.decisionState.replaceAll("_", " ")}</span>
                      <span
                        className={
                          latestEvent.pointsAwarded > 0
                            ? "text-sm font-semibold text-brand-primary"
                            : latestEvent.pointsAwarded < 0
                            ? "text-sm font-semibold text-brand-danger"
                            : "text-sm font-semibold text-brand-muted-fg"
                        }
                      >
                        {latestEvent.pointsAwarded > 0 ? "+" : ""}
                        {latestEvent.pointsAwarded} pts
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ) : (
              <Card>
                <CardContent className="p-4 text-sm text-brand-muted-fg">No disposals yet.</CardContent>
              </Card>
            )}
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-brand-muted-fg">
              Latest ledger entry
            </p>
            <Card>
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="text-sm font-medium">{latestLedger?.reason ?? "No entries yet"}</p>
                  {latestLedger && (
                    <p className="text-xs text-brand-muted-fg">{formatRelativeTime(latestLedger.timestamp)}</p>
                  )}
                </div>
                {latestLedger && (
                  <span
                    className={
                      latestLedger.amount >= 0 ? "font-semibold text-brand-primary" : "font-semibold text-brand-danger"
                    }
                  >
                    {latestLedger.amount > 0 ? "+" : ""}
                    {latestLedger.amount}
                  </span>
                )}
              </CardContent>
            </Card>
          </div>

          {earnedBadge && (
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-brand-muted-fg">
                Recent badge
              </p>
              <Card>
                <CardContent className="flex items-center gap-3 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-gold-light text-brand-gold">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{earnedBadge.name}</p>
                    <p className="text-xs text-brand-muted-fg">{earnedBadge.description}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {latestEvent && (
            <Button asChild className="w-full">
              <Link href={demo.activeDisposal?.eventId === latestEvent.eventId ? "/citizen/disposal" : `/citizen/history/${latestEvent.eventId}`}>
                Open latest event explanation <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
