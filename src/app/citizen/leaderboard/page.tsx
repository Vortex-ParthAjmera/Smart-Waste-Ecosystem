"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/StateViews";
import { Trophy, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LeaderboardEntry {
  rank: number;
  alias: string;
  locality: string;
  points: number;
  tier: string;
  isSelf: boolean;
}

export default function CitizenLeaderboardPage() {
  const [board, setBoard] = useState<LeaderboardEntry[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/leaderboard", { cache: "no-store" })
      .then((r) => r.ok ? r.json() : [])
      .then(setBoard)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <PageHeader title="Leaderboard" description="Top EcoCredit earners in your platform" />

      {loading && <div className="flex justify-center py-8"><Loader2 className="h-5 w-5 animate-spin text-brand-muted-fg" /></div>}

      {!loading && (board?.length ?? 0) === 0 && (
        <EmptyState title="Leaderboard is empty" description="Be the first to log a disposal and appear here." />
      )}

      <div className="space-y-2">
        {board?.map((entry) => (
          <Card key={entry.rank} className={cn(entry.isSelf && "border-brand-primary bg-brand-primary-light/40")}>
            <CardContent className="flex items-center gap-3 p-3">
              <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                entry.rank <= 3 ? "bg-brand-gold-light text-brand-gold" : "bg-brand-surface-muted text-brand-muted-fg")}>
                {entry.rank <= 3 ? <Trophy className="h-4 w-4" /> : entry.rank}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{entry.alias}{entry.isSelf && " (you)"}</p>
                <p className="text-[11px] text-brand-muted-fg">{entry.locality}</p>
              </div>
              <div className="text-right">
                <p className="mono-tabular text-sm font-semibold">{entry.points.toLocaleString("en-IN")}</p>
                <p className="text-[10px] text-brand-muted-fg">{entry.tier}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <p className="mt-3 text-center text-[10px] text-brand-muted-fg">
        Aliases only — no names or personal details shown.
      </p>
    </div>
  );
}
