"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { CitizenNav } from "@/components/citizen/CitizenNav";
import { LogOut } from "lucide-react";
import { useCitizenProfile } from "@/lib/useCitizenProfile";
import { createClient } from "@/lib/supabase/client";

export default function CitizenLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { profile, loading } = useCitizenProfile();

  const firstName = profile?.fullName?.trim().split(/\s+/)[0] ?? "";

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/citizen-login");
    router.refresh();
  }

  return (
    <div className="relative mx-auto min-h-screen max-w-md pb-32">
      <div
        aria-hidden
        className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/waste-bins-bg.jpg')" }}
      />
      <div aria-hidden className="fixed inset-0 -z-10 bg-background/88" />
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-brand-border bg-brand-primary px-4 py-3 text-white">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 p-1">
            <Image src="/logo-emblem.png" alt="Swachh Saathi" width={32} height={32} className="h-full w-full object-contain" />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold">
              {loading ? (
                <span className="inline-block h-3 w-24 animate-pulse rounded bg-white/25" />
              ) : (
                `Hi, ${firstName || "there"}`
              )}
            </p>
            <p className="text-[10px] text-white/70">
              {profile?.locality ?? "Swachh Saathi"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-medium">Citizen</span>
          {profile && (
            <button onClick={signOut} aria-label="Sign out"
              className="rounded-full bg-white/15 p-1.5 transition hover:bg-white/25">
              <LogOut className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </header>
      <main className="px-4 py-4">{children}</main>
      <CitizenNav />
    </div>
  );
}
