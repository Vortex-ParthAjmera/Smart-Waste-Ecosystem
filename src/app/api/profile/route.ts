import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "not_authenticated" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, username, full_name, email, locality, tier, points_balance")
    .eq("id", user.id)
    .single();

  return NextResponse.json({
    id: user.id,
    username: profile?.username ?? null,
    fullName: profile?.full_name ?? user.email?.split("@")[0] ?? "Citizen",
    email: profile?.email ?? user.email ?? null,
    locality: profile?.locality ?? null,
    tier: profile?.tier ?? "BRONZE",
    pointsBalance: profile?.points_balance ?? 0,
  }, { headers: { "Cache-Control": "no-store" } });
}

export async function PATCH(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "not_authenticated" }, { status: 401 });

  let body: Record<string, unknown>;
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const updates: Record<string, string> = {};
  if (typeof body.fullName === "string" && body.fullName.trim()) updates.full_name = body.fullName.trim();
  if (typeof body.locality === "string") updates.locality = body.locality.trim();
  if (typeof body.username === "string" && body.username.trim()) updates.username = body.username.trim().toLowerCase();

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  const { error } = await supabase.from("profiles").update(updates).eq("id", user.id);
  if (error) {
    const msg = error.message.includes("unique") ? "That username is already taken." : error.message;
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
