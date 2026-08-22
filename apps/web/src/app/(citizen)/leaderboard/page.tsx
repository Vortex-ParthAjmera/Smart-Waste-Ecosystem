"use client";

import { useEffect, useState } from "react";
import { getLeaderboard } from "@/lib/mock";
import type { LeaderboardEntry } from "@/lib/mock/data";
import { LeaderboardTable } from "@/components/credits/LeaderboardTable";
import { LoadingState } from "@/components/status/LoadingState";
import { ErrorState } from "@/components/status/ErrorState";

export default function CitizenLeaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = async () => { setLoading(true); try { setEntries(await getLeaderboard()); } catch { setError(true); } finally { setLoading(false); } };
  useEffect(() => { load(); }, []);

  if (loading) return <LoadingState type="list" rows={6} />;
  if (error) return <ErrorState onRetry={load} />;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-slate-800">Locality Leaderboard</h2>
      <p className="text-xs text-slate-400">Ranked by EcoCredits — fictional opt-in aliases only</p>
      <LeaderboardTable entries={entries} />
    </div>
  );
}
