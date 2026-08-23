"use client";

import { PageHeader } from "@/components/PageHeader";
import { PreviewBanner } from "@/components/PreviewBanner";
import { Card, CardContent } from "@/components/ui/card";
import { Map } from "lucide-react";

const ZONES = [
  { name: "Ward 9", devices: 6, compliance: 88 },
  { name: "Ward 12", devices: 11, compliance: 92 },
  { name: "Ward 14", devices: 8, compliance: 79 },
];

export default function ZoneManagementPreviewPage() {
  return (
    <div className="space-y-3">
      <PageHeader title="Zone Management" />
      <PreviewBanner />
      {ZONES.map((z) => (
        <Card key={z.name}>
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center gap-2">
              <Map className="h-4 w-4 text-brand-primary" />
              <div>
                <p className="text-sm font-medium">{z.name}</p>
                <p className="text-[11px] text-brand-muted-fg">{z.devices} bins registered</p>
              </div>
            </div>
            <span className="text-sm font-semibold">{z.compliance}% compliance</span>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
