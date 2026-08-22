"use client";

import { useEffect, useState } from "react";
import { getCurrentCitizen } from "@/lib/mock";
import type { Citizen } from "@/lib/mock/types";
import { BadgeCard } from "@/components/credits/BadgeCard";
import { TierDisplay } from "@/components/credits/TierDisplay";
import { LoadingState } from "@/components/status/LoadingState";
import { ErrorState } from "@/components/status/ErrorState";

export default function CitizenBadges() {
  const [citizen, setCitizen] = useState<Citizen | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = async () => { setLoading(true); try { setCitizen(await getCurrentCitizen()); } catch { setError(true); } finally { setLoading(false); } };
  useEffect(() => { load(); }, []);

  if (loading) return <LoadingState />;
  if (error || !citizen) return <ErrorState onRetry={load} />;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-slate-800">Badges & Tier</h2>
      <TierDisplay tier={citizen.tier} points={citizen.pointsBalance} />
      <div>
        <h3 className="text-sm font-semibold text-slate-700 mb-2">Earned Badges</h3>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {citizen.badges.filter(b => b.unlocked).map(b => <BadgeCard key={b.id} badge={b} />)}
          {citizen.badges.filter(b => b.unlocked).length === 0 && <p className="text-sm text-slate-400">No badges earned yet.</p>}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-slate-700 mb-2">Locked Badges</h3>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {citizen.badges.filter(b => !b.unlocked).map(b => <BadgeCard key={b.id} badge={b} />)}
          {citizen.badges.filter(b => !b.unlocked).length === 0 && <p className="text-sm text-slate-400">All badges unlocked!</p>}
        </div>
      </div>
    </div>
  );
}
