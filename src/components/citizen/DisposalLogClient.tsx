"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, LogOut, Database } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatRelativeTime } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

// Field names match the Postgres columns (snake_case) returned by
// /api/disposal, which selects straight from the `disposal_records` table.
interface DisposalRecord {
  id: string;
  waste_type: string;
  compartment: "WET" | "DRY";
  weight_grams: number | null;
  notes: string | null;
  points_earned: number;
  created_at: string;
}

export function DisposalLogClient({ userName }: { userName: string }) {
  const router = useRouter();
  const [records, setRecords] = useState<DisposalRecord[] | null>(null);
  const [wasteType, setWasteType] = useState("");
  const [compartment, setCompartment] = useState<"WET" | "DRY">("WET");
  const [weightGrams, setWeightGrams] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadRecords() {
    const res = await fetch("/api/disposal");
    if (res.ok) setRecords(await res.json());
  }

  useEffect(() => {
    loadRecords();
  }, []);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!wasteType.trim()) return;
    setSubmitting(true);
    setError(null);

    const res = await fetch("/api/disposal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        wasteType: wasteType.trim(),
        compartment,
        weightGrams: weightGrams ? Number(weightGrams) : undefined,
      }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error || "Could not save that record.");
      setSubmitting(false);
      return;
    }

    setWasteType("");
    setWeightGrams("");
    await loadRecords();
    setSubmitting(false);
  }

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/citizen-login");
    router.refresh();
  }

  const totalPoints = records?.reduce((sum, r) => sum + r.points_earned, 0) ?? 0;

  return (
    <div>
      <PageHeader
        title="My Disposal Log"
        description={`Signed in as ${userName} · stored in Supabase`}
        action={
          <button
            onClick={signOut}
            className="flex items-center gap-1 text-xs font-medium text-brand-muted-fg hover:text-foreground"
          >
            <LogOut className="h-3.5 w-3.5" /> Sign out
          </button>
        }
      />

      <Card className="mb-4 border-brand-primary/30 bg-brand-primary/5">
        <CardContent className="flex items-center gap-3 p-4">
          <Database className="h-4 w-4 text-brand-primary" />
          <p className="text-xs text-brand-muted-fg">
            Every entry below is a real row in Supabase, tied to your account — not demo
            data. <span className="font-medium text-foreground">{totalPoints} pts</span> earned
            across {records?.length ?? 0} logged disposals.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardContent className="p-4">
          <form onSubmit={submit} className="space-y-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-brand-muted-fg">
                What did you dispose of?
              </label>
              <input
                value={wasteType}
                onChange={(e) => setWasteType(e.target.value)}
                placeholder="e.g. Vegetable peels"
                className="w-full rounded-lg border border-brand-border bg-transparent px-3 py-2 text-sm outline-none focus:border-brand-primary"
              />
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="mb-1 block text-xs font-medium text-brand-muted-fg">
                  Compartment
                </label>
                <div className="flex gap-2">
                  {(["WET", "DRY"] as const).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCompartment(c)}
                      className={`flex-1 rounded-lg border py-2 text-xs font-medium transition ${
                        compartment === c
                          ? "border-brand-primary bg-brand-primary text-white"
                          : "border-brand-border text-brand-muted-fg"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
              <div className="w-28">
                <label className="mb-1 block text-xs font-medium text-brand-muted-fg">
                  Weight (g)
                </label>
                <input
                  value={weightGrams}
                  onChange={(e) => setWeightGrams(e.target.value)}
                  type="number"
                  min={0}
                  placeholder="optional"
                  className="w-full rounded-lg border border-brand-border bg-transparent px-3 py-2 text-sm outline-none focus:border-brand-primary"
                />
              </div>
            </div>

            {error && <p className="text-xs font-medium text-red-500">{error}</p>}

            <Button type="submit" disabled={submitting || !wasteType.trim()} className="w-full gap-1.5">
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              Log disposal
            </Button>
          </form>
        </CardContent>
      </Card>

      <p className="mb-2 text-xs font-medium text-brand-muted-fg">Your history</p>

      {records === null && (
        <div className="flex justify-center py-8">
          <Loader2 className="h-5 w-5 animate-spin text-brand-muted-fg" />
        </div>
      )}

      {records?.length === 0 && (
        <Card>
          <CardContent className="p-6 text-center text-xs text-brand-muted-fg">
            No disposals logged yet — add your first one above.
          </CardContent>
        </Card>
      )}

      <div className="space-y-2">
        {records?.map((r) => (
          <Card key={r.id}>
            <CardContent className="flex items-center justify-between p-3.5">
              <div>
                <p className="text-sm font-medium">{r.waste_type}</p>
                <p className="text-[11px] text-brand-muted-fg">
                  {formatRelativeTime(r.created_at)}
                  {r.weight_grams ? ` · ${r.weight_grams}g` : ""}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={r.compartment === "WET" ? "wet" : "dry"}>{r.compartment}</Badge>
                <span className="text-xs font-semibold text-brand-gold">+{r.points_earned}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
