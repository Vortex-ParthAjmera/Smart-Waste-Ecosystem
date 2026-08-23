"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { MunicipalNav } from "@/components/municipal/MunicipalNav";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function MunicipalLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/municipal-login");
    router.refresh();
  }

  return (
    <div className="relative min-h-screen pb-16">
      <div
        aria-hidden
        className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/waste-bins-bg.jpg')" }}
      />
      <div aria-hidden className="fixed inset-0 -z-10 bg-background/88" />
      <header className="flex items-center justify-between border-b border-brand-border bg-brand-surface px-4 py-3">
        <div className="flex items-center gap-2">
          <Image src="/logo-emblem.png" alt="Swachh Saathi" width={28} height={28} className="h-7 w-7 object-contain" />
          <div>
            <p className="text-sm font-semibold">Municipal Operations</p>
            <p className="text-[10px] text-brand-muted-fg">Indore Municipal Corporation</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-brand-primary-light px-2 py-0.5 text-[10px] font-medium text-brand-primary-dark">Municipal Staff</span>
          <button onClick={signOut} aria-label="Sign out"
            className="rounded-full bg-brand-surface-muted p-1.5 text-brand-muted-fg transition hover:text-foreground">
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </header>
      <div className="flex flex-col lg:flex-row">
        <MunicipalNav />
        <main className="flex-1 p-4">{children}</main>
      </div>
    </div>
  );
}
