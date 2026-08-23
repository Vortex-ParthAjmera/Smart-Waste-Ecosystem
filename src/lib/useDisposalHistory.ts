"use client";

import { useCallback, useEffect, useState } from "react";

export interface DisposalRecord {
  id: string;
  waste_type: string;
  compartment: "WET" | "DRY";
  weight_grams: number | null;
  notes: string | null;
  points_earned: number;
  created_at: string;
}

export function useDisposalHistory() {
  const [records, setRecords] = useState<DisposalRecord[] | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchRecords = useCallback(async () => {
    try {
      const res = await fetch("/api/disposal", { cache: "no-store" });
      setRecords(res.ok ? await res.json() : []);
    } catch {
      setRecords([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void fetchRecords(); }, [fetchRecords]);

  return { records, loading, refresh: fetchRecords };
}
