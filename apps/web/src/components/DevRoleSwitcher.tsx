"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Code2 } from "lucide-react";
import { cn } from "@/lib/utils";

const ROLES = [
  { label: "Citizen", href: "/citizen" },
  { label: "Municipal", href: "/municipal/scan" },
  { label: "Developer", href: "/developer/health" },
  { label: "Role picker", href: "/" },
];

export function DevRoleSwitcher() {
  const pathname = usePathname();
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 border-t-2 border-dashed border-brand-gold-strong bg-[repeating-linear-gradient(135deg,#fef3c7,#fef3c7_8px,#fffbeb_8px,#fffbeb_16px)] px-2 py-1.5 print:hidden"
      data-devnav="remove-before-launch"
    >
      <div className="mx-auto flex max-w-3xl items-center gap-2 overflow-x-auto">
        <span className="flex shrink-0 items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-brand-gold">
          <Code2 className="h-3 w-3" /> Dev nav
        </span>
        {ROLES.map((r) => (
          <Link
            key={r.href}
            href={r.href}
            className={cn(
              "shrink-0 rounded-full border border-brand-gold-strong/40 px-2.5 py-0.5 text-[11px] font-medium text-brand-gold-strong hover:bg-white/60",
              pathname?.startsWith(r.href) && r.href !== "/" && "bg-white/70"
            )}
          >
            {r.label}
          </Link>
        ))}
        <span className="ml-auto shrink-0 text-[10px] text-brand-gold-strong/70">
          No real auth · UI-only pass
        </span>
      </div>
    </div>
  );
}
