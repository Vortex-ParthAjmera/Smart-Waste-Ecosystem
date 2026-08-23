"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ScanLine,
  Activity,
  Radio,
  UserSearch,
  ShieldAlert,
  ScrollText,
  Cpu,
  Truck,
  Map,
  BarChart3,
  Route,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const SECTIONS = [
  {
    label: "Operator",
    items: [
      { href: "/municipal/scan", label: "Scan Citizen", icon: ScanLine },
      { href: "/municipal/disposal", label: "Active Disposal", icon: Activity },
      { href: "/municipal/events", label: "Live Events", icon: Radio },
      { href: "/municipal/lookup", label: "Citizen Lookup", icon: UserSearch },
    ],
  },
  {
    label: "Reviewer",
    items: [
      { href: "/municipal/verification", label: "Verification Queue", icon: ShieldAlert },
      { href: "/municipal/audit", label: "Audit Trail", icon: ScrollText },
      { href: "/municipal/device-status", label: "Device Status", icon: Cpu },
    ],
  },
  {
    label: "Previews",
    items: [
      { href: "/municipal/previews/fleet-map", label: "Fleet Map", icon: Truck, preview: true },
      { href: "/municipal/previews/zones", label: "Zone Management", icon: Map, preview: true },
      { href: "/municipal/previews/reports", label: "Reports", icon: BarChart3, preview: true },
      { href: "/municipal/previews/collection-journey", label: "Collection Journey", icon: Route, preview: true },
    ],
  },
];

export function MunicipalNav() {
  const pathname = usePathname();
  return (
    <nav className="w-full shrink-0 border-b border-brand-border bg-brand-surface px-3 py-2 lg:w-60 lg:border-b-0 lg:border-r lg:px-3 lg:py-4">
      {SECTIONS.map((section) => (
        <div key={section.label} className="mb-3">
          <p className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-wide text-brand-muted-fg">{section.label}</p>
          <div className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
            {section.items.map((item) => {
              const active = pathname?.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex shrink-0 items-center gap-2 whitespace-nowrap rounded-lg px-2.5 py-2 text-xs font-medium",
                    active ? "bg-brand-primary-light text-brand-primary-dark" : "text-brand-muted-fg hover:bg-brand-surface-muted"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {item.label}
                  {"preview" in item && item.preview && <Badge variant="warning" className="ml-auto">P</Badge>}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}
