import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { PreviewBanner } from "@/components/PreviewBanner";
import { Card, CardContent } from "@/components/ui/card";
import { Truck, Map, BarChart3, Route, ChevronRight } from "lucide-react";

const PREVIEW_LINKS = [
  { href: "/municipal/previews/fleet-map", label: "Fleet Map", icon: Truck, desc: "Live truck positioning and route ETA" },
  { href: "/municipal/previews/zones", label: "Zone Management", icon: Map, desc: "Ward-level bin coverage and compliance stats" },
  { href: "/municipal/previews/reports", label: "Reports & Analytics", icon: BarChart3, desc: "30-day compliance, accuracy, and credit metrics" },
  { href: "/municipal/previews/collection-journey", label: "Collection Journey", icon: Route, desc: "Step-by-step route dispatch tracking" },
];

export default function PreviewsIndexPage() {
  return (
    <div className="space-y-4 max-w-xl">
      <PageHeader title="Tier 2 Previews" description="Frontend-only static interfaces permanently marked PREVIEW/SEEDED" />
      <PreviewBanner />
      <Card>
        <CardContent className="divide-y divide-brand-border p-0">
          {PREVIEW_LINKS.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className="flex items-center gap-3 p-4 hover:bg-brand-surface-muted transition-colors">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-gold-light text-brand-gold">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{item.label}</p>
                  <p className="text-xs text-brand-muted-fg">{item.desc}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-brand-muted-fg" />
              </Link>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
