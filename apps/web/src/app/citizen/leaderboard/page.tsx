"use client";

import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { LoadingSkeleton, ErrorState, OfflineBanner } from "@/components/StateViews";
import { useDemoScreenState, DemoStateToggle } from "@/components/ScreenChrome";
import { apiClient } from "@/lib/api-client";
import { cn } from "@/lib/utils";
import { Trophy } from "lucide-react";

export default function CitizenLeaderboardPage() {
  const { status, setStatus } = useDemoScreenState();
  const board = apiClient.getLeaderboard();

  return (
    <div>
      <PageHeader title="Leaderboard" description="Indore, Ward 12 — opt-in aliases only" />
      <DemoStateToggle status={status} setStatus={setStatus} />
      {status === "offline" && <OfflineBanner />}
      {status === "loading" && <LoadingSkeleton rows={6} />}
      {status === "error" && <ErrorState onRetry={() => setStatus("ready")} />}
      {(status === "ready" || status === "offline") && (
        <div className="space-y-2">
          {board.map((entry) => (
            <Card key={entry.alias} className={cn(entry.isSelf && "border-brand-primary bg-brand-primary-light/40")}>
              <CardContent className="flex items-center gap-3 p-3">
                <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold", entry.rank <= 3 ? "bg-brand-gold-light text-brand-gold" : "bg-brand-surface-muted text-brand-muted-fg")}>
                  {entry.rank <= 3 ? <Trophy className="h-4 w-4" /> : entry.rank}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{entry.alias}{entry.isSelf && " (you)"}</p>
                  <p className="text-[11px] text-brand-muted-fg">{entry.locality}</p>
                </div>
                <span className="mono-tabular text-sm font-semibold">{entry.points.toLocaleString("en-IN")}</span>
              </CardContent>
            </Card>
          ))}
          <p className="pt-1 text-center text-[10px] text-brand-muted-fg">
            Household ID, legal name, address, and event evidence are never shown here.
          </p>
        </div>
      )}
    </div>
  );
}
