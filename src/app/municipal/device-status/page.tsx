"use client";

import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { StatusPill } from "@/components/StatusPill";
import { apiClient } from "@/lib/api-client";
import { ComponentHealth } from "@/lib/mock/types";
import { formatRelativeTime } from "@/lib/utils";

export default function MunicipalDeviceStatusPage() {
  const devices = apiClient.listDevices();

  return (
    <div>
      <PageHeader title="Device Status" description="Read-only view of bin health for field coordination" />
      <div className="space-y-2">
        {devices.map((d) => {
          const values = Object.values(d.components);
          const overall: ComponentHealth = values.includes("FAILED")
            ? "FAILED"
            : values.includes("DEGRADED")
            ? "DEGRADED"
            : values.includes("MISSING")
            ? "MISSING"
            : "OK";
          return (
            <Card key={d.deviceCode}>
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="text-sm font-medium">{d.label}</p>
                  <p className="text-xs text-brand-muted-fg">{d.zone} · last seen {formatRelativeTime(d.lastSeen)}</p>
                </div>
                <StatusPill status={overall} />
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
