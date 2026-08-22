"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, QrCode, History, Coins, Trophy, User, Star, AlertTriangle } from "lucide-react";

const navItems = [
  { href: "/citizen", label: "Home", icon: Home },
  { href: "/citizen/qr", label: "My QR", icon: QrCode },
  { href: "/citizen/disposal", label: "Disposal", icon: Star },
  { href: "/citizen/history", label: "History", icon: History },
  { href: "/citizen/credits", label: "Credits", icon: Coins },
  { href: "/citizen/badges", label: "Badges", icon: Trophy },
  { href: "/citizen/reviews", label: "Disputes", icon: AlertTriangle },
  { href: "/citizen/profile", label: "Profile", icon: User },
];

export default function CitizenLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-lg items-center justify-between px-4">
          <h1 className="text-lg font-bold text-emerald-700">♻️ EcoCredits</h1>
          <span className="text-xs text-slate-400">Citizen Portal</span>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 pb-20 mx-auto w-full max-w-lg px-4 py-4">{children}</main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white" aria-label="Citizen navigation">
        <div className="mx-auto flex max-w-lg">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/citizen" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-1 flex-col items-center gap-1 py-2 text-[10px] font-medium transition-colors",
                  isActive ? "text-emerald-600" : "text-slate-400 hover:text-slate-600"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                <item.icon className="h-5 w-5" aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
