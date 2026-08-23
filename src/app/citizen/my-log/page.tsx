import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DisposalLogClient } from "@/components/citizen/DisposalLogClient";

// Server component: the one page backed by real Supabase auth + database,
// rather than the mock/demo layer. No session -> bounce to sign-in and come
// straight back here afterwards.
export default async function MyDisposalLogPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/citizen-login?next=/citizen/my-log");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, full_name")
    .eq("id", user.id)
    .single();

  const displayName = profile?.full_name || profile?.username || user.email || "there";

  return <DisposalLogClient userName={displayName} />;
}
