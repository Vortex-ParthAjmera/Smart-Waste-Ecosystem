import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { DevCard } from "@/components/developer/DevCard";
import { StatusPill } from "@/components/StatusPill";
import { apiClient } from "@/lib/api-client";
import { ComponentHealth } from "@/lib/mock/types";
import { ChevronRight } from "lucide-react";

export default function DevicesPage() {
  const devices = apiClient.listDevices();
  return (
    <div>
      <PageHeader title="Devices" description={`${devices.length} registered smart bins`} className="text-slate-100" />
      <div className="space-y-2">
        {devices.map((d) => {
          const values = Object.values(d.components);
          const failed = values.filter((v) => v === "FAILED").length;
          const overall: ComponentHealth = failed > 0 ? "FAILED" : values.includes("DEGRADED") ? "DEGRADED" : values.includes("MISSING") ? "MISSING" : "OK";
          return (
            <Link key={d.deviceCode} href={`/developer/devices/${d.deviceCode}`}>
              <DevCard className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-100">{d.deviceCode}</p>
                  <p className="text-[11px] text-slate-500">{d.label}</p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusPill status={overall} />
                  <ChevronRight className="h-4 w-4 text-slate-600" />
                </div>
              </DevCard>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
