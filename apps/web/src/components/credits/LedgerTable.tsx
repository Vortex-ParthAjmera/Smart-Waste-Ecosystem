"use client";

import type { PointTransaction } from "@/lib/mock/types";
import { TruthBadge } from "@/components/status/TruthBadge";
import { getTruthBadge } from "@/lib/mock/types";

interface LedgerTableProps {
  transactions: PointTransaction[];
}

export function LedgerTable({ transactions }: LedgerTableProps) {
  if (transactions.length === 0) return <p className="py-6 text-center text-sm text-slate-400">No transactions yet.</p>;

  return (
    <div className="space-y-2">
      {transactions.map((txn) => (
        <div key={txn.id} className="rounded-lg bg-white border border-slate-200 p-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-sm text-slate-700 truncate">{txn.reason}</p>
              <div className="mt-1 flex items-center gap-2">
                <TruthBadge badge={getTruthBadge(txn.provenance)} size="sm" />
                <span className="text-xs text-slate-400">
                  {new Date(txn.timestamp).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                </span>
              </div>
            </div>
            <span className={`ml-2 text-lg font-bold shrink-0 ${txn.amount > 0 ? "text-emerald-600" : txn.amount < 0 ? "text-red-600" : "text-slate-400"}`}>
              {txn.amount > 0 ? "+" : ""}{txn.amount}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
