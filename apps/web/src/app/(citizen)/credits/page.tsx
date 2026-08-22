"use client";

import { useEffect, useState } from "react";
import { getCurrentCitizen, getPointTransactionsByCitizen } from "@/lib/mock";
import type { Citizen, PointTransaction } from "@/lib/mock/types";
import { BalanceCard } from "@/components/credits/BalanceCard";
import { TierDisplay } from "@/components/credits/TierDisplay";
import { LedgerTable } from "@/components/credits/LedgerTable";
import { LoadingState } from "@/components/status/LoadingState";
import { ErrorState } from "@/components/status/ErrorState";

export default function CitizenCredits() {
  const [citizen, setCitizen] = useState<Citizen | null>(null);
  const [txns, setTxns] = useState<PointTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const c = await getCurrentCitizen();
      const t = await getPointTransactionsByCitizen(c.id);
      setCitizen(c);
      setTxns(t);
    } catch { setError(true); } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  if (loading) return <LoadingState type="card" rows={3} />;
  if (error || !citizen) return <ErrorState onRetry={load} />;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-slate-800">EcoCredits</h2>
      <BalanceCard balance={citizen.pointsBalance} tier={citizen.tier} segregationScore={citizen.segregationScore} />
      <TierDisplay tier={citizen.tier} points={citizen.pointsBalance} />
      <div>
        <h3 className="text-sm font-semibold text-slate-700 mb-2">Transaction Ledger</h3>
        <p className="text-xs text-slate-400 mb-3">Append-only — entries are never modified or deleted</p>
        <LedgerTable transactions={txns} />
      </div>
    </div>
  );
}
