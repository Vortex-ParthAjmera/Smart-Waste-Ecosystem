"use client";

import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { LoadingSkeleton, ErrorState, OfflineBanner } from "@/components/StateViews";
import { useDemoScreenState, DemoStateToggle } from "@/components/ScreenChrome";
import { apiClient } from "@/lib/api-client";
import { TIER_THRESHOLDS, pointsToNextTier } from "@/lib/mock/citizens";
import { Award, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CitizenBadgesPage() {
  const { status, setStatus } = useDemoScreenState();
  const citizen = apiClient.getDemoCitizen();
  const balance = apiClient.getBalanceFromLedger(citizen.id);
  const { nextTier, remaining } = pointsToNextTier(balance);

  return (
    <div>
      <PageHeader title="Badges & Tier" />
      <DemoStateToggle status={status} setStatus={setStatus} />
      {status === "offline" && <OfflineBanner />}
      {status === "loading" && <LoadingSkeleton rows={4} />}
      {status === "error" && <ErrorState onRetry={() => setStatus("ready")} />}
      {(status === "ready" || status === "offline") && (
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-brand-muted-fg">Tier boundaries</p>
              <div className="space-y-2">
                {TIER_THRESHOLDS.map((t) => (
                  <div
                    key={t.tier}
                    className={cn(
                      "flex items-center justify-between rounded-lg px-3 py-2 text-sm",
                      citizen.tier === t.tier ? "bg-brand-primary-light font-semibold text-brand-primary-dark" : "bg-brand-surface-muted text-brand-muted-fg"
                    )}
                  >
                    <span>{t.tier}</span>
                    <span className="mono-tabular text-xs">
                      {t.min}–{t.max ?? "∞"} pts
                    </span>
                  </div>
                ))}
              </div>
              {nextTier && <p className="mt-2 text-xs text-brand-muted-fg">{remaining} points to {nextTier}</p>}
            </CardContent>
          </Card>

          <p className="text-xs font-semibold uppercase tracking-wide text-brand-muted-fg">Badges</p>
          <div className="grid grid-cols-2 gap-3">
            {citizen.badges.map((b) => (
              <Card key={b.id} className={cn(b.locked && "opacity-60")}>
                <CardContent className="flex flex-col items-center gap-2 p-4 text-center">
                  <div
                    className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-full",
                      b.locked ? "bg-brand-surface-muted text-brand-muted-fg" : "bg-brand-gold-light text-brand-gold"
                    )}
                  >
                    {b.locked ? <Lock className="h-5 w-5" /> : <Award className="h-5 w-5" />}
                  </div>
                  <p className="text-xs font-semibold">{b.name}</p>
                  <p className="text-[10px] text-brand-muted-fg">{b.locked ? b.unlockCriteria : `Earned · ${b.earnedAt ? new Date(b.earnedAt).toLocaleDateString("en-IN") : "demo"}`}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
