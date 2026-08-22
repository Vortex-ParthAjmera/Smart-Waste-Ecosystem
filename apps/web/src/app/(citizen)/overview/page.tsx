"use client";

import { useEffect, useState } from "react";
import { getCurrentCitizen, getDisposalEventsByCitizen, getPointTransactionsByCitizen } from "@/lib/mock";
import type { Citizen, DisposalEvent, PointTransaction } from "@/lib/mock/types";
import { getTruthBadge, getDecisionLabel } from "@/lib/mock/types";
import { TruthBadge } from "@/components/status/TruthBadge";
import { LoadingState } from "@/components/status/LoadingState";
import { ErrorState } from "@/components/status/ErrorState";

const tierColors: Record<string, string> = {
  BRONZE: "bg-amber-100 text-amber-800 border-amber-300",
  SILVER: "bg-slate-100 text-slate-700 border-slate-300",
  GOLD: "bg-yellow-100 text-yellow-800 border-yellow-300",
  PLATINUM: "bg-purple-100 text-purple-800 border-purple-300",
};

const tierEmoji: Record<string, string> = {
  BRONZE: "🥉",
  SILVER: "🥈",
  GOLD: "🥇",
  PLATINUM: "💎",
};

export default function CitizenOverview() {
  const [citizen, setCitizen] = useState<Citizen | null>(null);
  const [latestEvent, setLatestEvent] = useState<DisposalEvent | null>(null);
  const [latestTxn, setLatestTxn] = useState<PointTransaction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(false);
    try {
      const c = await getCurrentCitizen();
      const events = await getDisposalEventsByCitizen(c.id);
      const txns = await getPointTransactionsByCitizen(c.id);
      setCitizen(c);
      setLatestEvent(events[0] || null);
      setLatestTxn(txns[0] || null);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) return <LoadingState type="card" rows={4} />;
  if (error || !citizen) return <ErrorState onRetry={load} />;

  return (
    <div className="space-y-4">
      {/* EcoCredit Balance */}
      <section className="rounded-xl bg-emerald-600 p-6 text-white">
        <p className="text-sm font-medium opacity-80">Your EcoCredits</p>
        <p className="mt-1 text-5xl font-bold tabular-nums">{citizen.pointsBalance}</p>
        <div className="mt-3 flex items-center gap-2">
          <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${tierColors[citizen.tier]}`}>
            {tierEmoji[citizen.tier]} {citizen.tier}
          </span>
          <span className="text-xs opacity-70">Segregation: {citizen.segregationScore}%</span>
        </div>
      </section>

      {/* Tier Progress */}
      <section className="rounded-xl bg-white p-4 border border-slate-200">
        <p className="text-sm font-medium text-slate-600">Tier Progress</p>
        <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
          <span className={citizen.tier === "BRONZE" ? "font-bold text-emerald-600" : ""}>BRONZE</span>
          <div className="h-1 flex-1 rounded-full bg-slate-200 overflow-hidden">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all"
              style={{ width: `${Math.min((citizen.pointsBalance / 2000) * 100, 100)}%` }}
            />
          </div>
          <span className={citizen.tier === "PLATINUM" ? "font-bold text-emerald-600" : ""}>PLATINUM</span>
        </div>
        <p className="mt-1 text-xs text-slate-400">
          {citizen.tier === "PLATINUM"
            ? "You've reached the top tier!"
            : `${2000 - citizen.pointsBalance} points to PLATINUM`}
        </p>
      </section>

      {/* Latest Event */}
      {latestEvent && (
        <section className="rounded-xl bg-white p-4 border border-slate-200">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-700">Latest Disposal</h2>
            <TruthBadge badge={getTruthBadge(latestEvent.eventSource, latestEvent.mlDetection.evidenceSource)} />
          </div>
          <div className="mt-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Result</span>
              <span className={`text-sm font-medium ${latestEvent.decisionState === "ACCEPTED" ? "text-emerald-600" : latestEvent.decisionState === "FLAGGED" ? "text-amber-600" : "text-slate-600"}`}>
                {getDecisionLabel(latestEvent.decisionState)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Compartment</span>
              <span className={`text-sm font-medium ${latestEvent.selectedCompartment === "WET" ? "text-cyan-600" : "text-amber-600"}`}>
                {latestEvent.selectedCompartment === "WET" ? "💧 Wet" : "📦 Dry"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Waste Type</span>
              <span className="text-sm font-medium text-slate-700">{latestEvent.mlDetection.wasteType}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Points</span>
              <span className={`text-lg font-bold ${latestEvent.pointsAwarded > 0 ? "text-emerald-600" : latestEvent.pointsAwarded < 0 ? "text-red-600" : "text-slate-500"}`}>
                {latestEvent.pointsAwarded > 0 ? "+" : ""}{latestEvent.pointsAwarded}
              </span>
            </div>
          </div>
        </section>
      )}

      {/* Latest Ledger Entry */}
      {latestTxn && (
        <section className="rounded-xl bg-white p-4 border border-slate-200">
          <h2 className="text-sm font-semibold text-slate-700">Latest Ledger Entry</h2>
          <div className="mt-2 space-y-1">
            <p className="text-sm text-slate-600">{latestTxn.reason}</p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <TruthBadge badge={latestTxn.truthBadge} size="sm" />
              <span>{new Date(latestTxn.timestamp).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
            </div>
          </div>
        </section>
      )}

      {/* Badges Preview */}
      {citizen.badges.length > 0 && (
        <section className="rounded-xl bg-white p-4 border border-slate-200">
          <h2 className="text-sm font-semibold text-slate-700">Badges</h2>
          <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
            {citizen.badges.map((badge) => (
              <div
                key={badge.id}
                className={`flex-shrink-0 rounded-lg border p-3 text-center min-w-[100px] ${
                  badge.unlocked ? "border-emerald-200 bg-emerald-50" : "border-slate-200 bg-slate-50 opacity-50"
                }`}
              >
                <div className="text-2xl">{badge.unlocked ? "🏅" : "🔒"}</div>
                <p className="mt-1 text-xs font-medium text-slate-700">{badge.name}</p>
                {!badge.unlocked && <p className="text-[10px] text-slate-400 mt-0.5">{badge.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
