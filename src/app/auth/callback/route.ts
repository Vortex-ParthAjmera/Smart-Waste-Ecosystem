import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/citizen";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Check if the profile needs onboarding (new Google user, no locality yet)
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("locality, full_name")
          .eq("id", user.id)
          .single();

        // New Google user with no locality — send them to onboarding
        // unless they're heading to the municipal app
        if (!profile?.locality && !next.startsWith("/municipal")) {
          return NextResponse.redirect(`${origin}/citizen-onboarding?next=${encodeURIComponent(next)}`);
        }
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/citizen-login?error=auth_callback_failed`);
}
