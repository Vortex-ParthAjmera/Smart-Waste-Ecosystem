import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const VALID_COMPARTMENTS = ["WET", "DRY"];

export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  // No `.eq("user_id", user.id)` needed — the RLS policy
  // "Users can view their own disposal records" enforces it at the DB level.
  const { data, error } = await supabase
    .from("disposal_records")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { wasteType, compartment, weightGrams, notes } = (body ?? {}) as {
    wasteType?: string;
    compartment?: string;
    weightGrams?: number;
    notes?: string;
  };

  if (!wasteType?.trim()) {
    return NextResponse.json({ error: "wasteType is required." }, { status: 400 });
  }
  if (!compartment || !VALID_COMPARTMENTS.includes(compartment)) {
    return NextResponse.json({ error: "compartment must be WET or DRY." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("disposal_records")
    .insert({
      user_id: user.id,
      waste_type: wasteType.trim(),
      compartment,
      weight_grams:
        typeof weightGrams === "number" && weightGrams > 0 ? Math.round(weightGrams) : null,
      notes: notes?.trim() || null,
      points_earned: 10,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data, { status: 201 });
}
