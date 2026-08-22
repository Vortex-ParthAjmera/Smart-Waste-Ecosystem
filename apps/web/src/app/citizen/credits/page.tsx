"use client";

import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TruthBadge } from "@/components/TruthBadge";
import { LoadingSkeleton, EmptyState, ErrorState, OfflineBanner } from "@/components/StateViews";
import { useDemoScreenState, DemoStateToggle } from "@/components/ScreenChrome";
import { apiClient } from "@/lib/api-client";
import { truthBadgeForEvent } from "@/lib/mock/disposalEvents";
import { formatDateTime, cn } from "@/lib/utils";
import { CheckCircle2, Gift } from "lucide-react";

export default function CitizenCreditsPage() {
  const { status, setStatus } = useDemoScreenState();
  const [redeemed, setRedeemed] = useState(false);
  const citizen = apiClient.getDemoCitizen();
  const balance = apiClient.getBalanceFromLedger(citizen.id);
  const ledger = apiClient.getLedgerForCitizen(citizen.id);

  return (
    <div>
      <PageHeader title="EcoCredits" description="Derived from your append-only points ledger" />
      <DemoStateToggle status={status} setStatus={setStatus} />
      {status === "offline" && <OfflineBanner />}
      {status === "loading" && <LoadingSkeleton rows={5} />}
      {status === "error" && <ErrorState onRetry={() => setStatus("ready")} />}
      {(status === "ready" || status === "offline") && (
        <div className="space-y-4">
          <Card className="bg-brand-gold-light">
            <CardContent className="p-4">
              <p className="text-xs text-brand-gold">Available balance</p>
              <p className="mono-tabular text-3xl font-bold text-brand-gold">{balance.toLocaleString("en-IN")}</p>
              {redeemed ? (
                <p className="mt-2 flex items-center gap-1 text-xs font-medium text-brand-primary">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Redemption request submitted — trackable in your ledger.
                </p>
              ) : (
                <Button size="sm" variant="gold" className="mt-2" onClick={() => setRedeemed(true)}>
                  <Gift className="h-3.5 w-3.5" /> Redeem credits (simulated)
                </Button>
              )}
            </CardContent>
          </Card>

          <p className="text-xs font-semibold uppercase tracking-wide text-brand-muted-fg">Ledger</p>
          {ledger.length === 0 ? (
            <EmptyState title="No ledger entries yet" />
          ) : (
            <div className="space-y-2">
              {ledger.map((t) => (
                <Card key={t.id}>
                  <CardContent className="flex items-center justify-between p-3">
                    <div>
                      <p className="text-sm font-medium">{t.reason}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <TruthBadge value={truthBadgeForEvent(t.provenance)} />
                        <span className="text-[11px] text-brand-muted-fg">{formatDateTime(t.timestamp)}</span>
                      </div>
                    </div>
                    <span className={cn("shrink-0 font-semibold", t.amount >= 0 ? "text-brand-primary" : "text-brand-danger")}>
                      {t.amount > 0 ? "+" : ""}
                      {t.amount}
                    </span>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
