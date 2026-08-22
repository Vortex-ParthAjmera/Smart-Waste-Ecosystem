"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  Cpu,
  Radio,
  BrainCircuit,
  ListOrdered,
  ScrollText,
  Stethoscope,
  FlaskConical,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS = [
  { href: "/developer/health", label: "System Health", icon: Activity },
  { href: "/developer/devices", label: "Devices", icon: Cpu },
  { href: "/developer/telemetry", label: "Raw Telemetry", icon: Radio },
  { href: "/developer/ml-monitor", label: "ML Monitor", icon: BrainCircuit },
  { href: "/developer/edge-queue", label: "Edge Queue", icon: ListOrdered },
  { href: "/developer/logs", label: "Safe Logs", icon: ScrollText },
  { href: "/developer/diagnostics", label: "Diagnostics", icon: Stethoscope },
  { href: "/developer/inject", label: "Inject Test Event", icon: FlaskConical },
];

export function DeveloperNav() {
  const pathname = usePathname();
  return (
    <nav className="flex gap-1 overflow-x-auto border-b border-slate-700 bg-slate-900 px-3 py-2 lg:w-56 lg:flex-col lg:overflow-visible lg:border-b-0 lg:border-r lg:px-2 lg:py-4">
      {ITEMS.map((item) => {
        const active = pathname?.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex shrink-0 items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium lg:whitespace-normal",
              active ? "bg-slate-700 text-white" : "text-slate-400 hover:bg-slate-800 hover:text-slate-200",
              item.href === "/developer/inject" && !active && "border border-dashed border-amber-500/50 text-amber-400"
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
