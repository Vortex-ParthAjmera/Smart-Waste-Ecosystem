import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { issueCitizenQr } from "@/lib/qrToken.server";

export const dynamic = "force-dynamic";

// GET /api/qr/token
// Issues a signed QR payload for WHOEVER IS SIGNED IN. The citizen id is read
// from the Supabase session cookie, never from a query parameter - so a user
// cannot request a QR that impersonates another account.
export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "not_authenticated" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, locality, tier, points_balance")
    .eq("id", user.id)
    .single();

  const { payload, expiresAt } = issueCitizenQr(user.id);

  return NextResponse.json(
    {
      payload,
      expiresAt,
      profile: {
        id: user.id,
        fullName: profile?.full_name ?? user.email?.split("@")[0] ?? "Citizen",
        locality: profile?.locality ?? null,
        tier: profile?.tier ?? "BRONZE",
        pointsBalance: profile?.points_balance ?? 0,
      },
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
