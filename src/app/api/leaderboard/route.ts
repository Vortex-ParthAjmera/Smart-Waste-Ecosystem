import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Public leaderboard — aliases only. No names, no emails.
  const { data, error } = await supabase
    .from("profiles")
    .select("id, username, full_name, locality, points_balance, tier")
    .order("points_balance", { ascending: false })
    .limit(20);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const entries = (data ?? []).map((p, i) => ({
    rank: i + 1,
    alias: p.username ? `@${p.username}` : (p.full_name?.split(" ")[0] + " " + (p.full_name?.split(" ")[1]?.[0] ?? "") + ".").trim(),
    locality: p.locality ?? "Unknown ward",
    points: p.points_balance ?? 0,
    tier: p.tier ?? "BRONZE",
    isSelf: p.id === user?.id,
  }));

  return NextResponse.json(entries, { headers: { "Cache-Control": "no-store" } });
}
