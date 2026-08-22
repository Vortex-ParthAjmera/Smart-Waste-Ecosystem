"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, QrCode, Recycle, History, Grid2X2 } from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS = [
  { href: "/citizen", label: "Overview", icon: Home },
  { href: "/citizen/qr", label: "My QR", icon: QrCode },
  { href: "/citizen/disposal", label: "Disposal", icon: Recycle },
  { href: "/citizen/history", label: "History", icon: History },
  { href: "/citizen/more", label: "More", icon: Grid2X2 },
];

export function CitizenNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed inset-x-0 bottom-10 z-30 mx-auto max-w-md border-t border-brand-border bg-brand-surface/95 backdrop-blur md:bottom-6 md:max-w-2xl md:rounded-2xl md:border md:shadow-lg lg:max-w-3xl">
      <div className="grid grid-cols-5">
        {ITEMS.map((item) => {
          const active = item.href === "/citizen" ? pathname === "/citizen" : pathname?.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-0.5 py-2 text-[10px] font-medium md:flex-row md:justify-center md:gap-1.5 md:py-3 md:text-xs",
                active ? "text-brand-primary" : "text-brand-muted-fg"
              )}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
