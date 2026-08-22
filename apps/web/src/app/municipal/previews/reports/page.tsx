"use client";

import { PageHeader } from "@/components/PageHeader";
import { PreviewBanner } from "@/components/PreviewBanner";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

const METRICS = [
  { label: "Total disposals (30d)", value: "18,204" },
  { label: "Segregation accuracy", value: "87.3%" },
  { label: "Active EcoCredits issued", value: "142,900" },
  { label: "Disputes resolved", value: "96%" },
];

export default function ReportsPreviewPage() {
  return (
    <div className="space-y-3">
      <PageHeader title="Reports" />
      <PreviewBanner />
      <div className="grid grid-cols-2 gap-3">
        {METRICS.map((m) => (
          <Card key={m.label}>
            <CardContent className="p-4">
              <p className="text-[11px] text-brand-muted-fg">{m.label}</p>
              <p className="mono-tabular mt-1 text-xl font-bold">{m.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardContent className="flex h-40 items-center justify-center p-4 text-brand-muted-fg">
          <BarChart3 className="h-8 w-8" />
          <span className="ml-2 text-xs">Chart rendering not wired up in this UI-only pass</span>
        </CardContent>
      </Card>
    </div>
  );
}
