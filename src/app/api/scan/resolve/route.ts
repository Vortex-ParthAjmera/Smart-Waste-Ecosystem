import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { verifyCitizenQr } from "@/lib/qrToken.server";

export const dynamic = "force-dynamic";

// POST /api/scan/resolve   body: { raw: "<decoded QR string>" }
//
// This is the replacement for the old client-side lookup that read from
// src/lib/mock/citizens.ts and therefore always answered "Priya Sharma".
// Here the id comes out of a signature-verified payload and the name comes
// out of Postgres, so the operator sees the person actually standing there.
export async function POST(request: Request) {
  let raw: unknown;
  try {
    ({ raw } = await request.json());
  } catch {
    return NextResponse.json({ status: "invalid", reason: "malformed" }, { status: 400 });
  }

  if (typeof raw !== "string" || raw.length === 0 || raw.length > 512) {
    return NextResponse.json({ status: "invalid", reason: "malformed" }, { status: 400 });
  }

  const verified = verifyCitizenQr(raw);
  if (!verified.ok) {
    // 200, not 4xx: "this is not one of our codes" is a normal scan outcome,
    // not a transport failure. The scanner UI branches on `status`.
    return NextResponse.json({ status: "invalid", reason: verified.reason });
  }

  const supabase = await createClient();

  // get_scan_card is SECURITY DEFINER (see 0002_scan_identity.sql). It is the
  // only way to read another user's row, and it returns just these fields.
  const { data, error } = await supabase.rpc("get_scan_card", {
    citizen_id: verified.citizenId,
  });

  if (error) {
    console.error("[scan/resolve] rpc failed:", error.message);
    return NextResponse.json({ status: "error", reason: "lookup_failed" }, { status: 500 });
  }

  const card = Array.isArray(data) ? data[0] : data;
  if (!card) {
    // Valid signature but no profile - e.g. the account was deleted.
    return NextResponse.json({ status: "invalid", reason: "unknown_citizen" });
  }

  return NextResponse.json(
    {
      status: "found",
      citizen: {
        id: card.id,
        name: card.full_name,
        locality: card.locality,
        tier: card.tier,
        pointsBalance: card.points_balance,
      },
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
