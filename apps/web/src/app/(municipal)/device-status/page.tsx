"use client";

import { useEffect, useState } from "react";
import { getDevice } from "@/lib/mock";
import type { Device } from "@/lib/mock/types";
import { getHealthLabel } from "@/lib/mock/types";
import { LoadingState } from "@/components/status/LoadingState";
import { ErrorState } from "@/components/status/ErrorState";

const healthColors: Record<string, string> = { OK: "bg-emerald-500", DEGRADED: "bg-amber-500", MISSING: "bg-red-500", FAILED: "bg-red-600", UNKNOWN: "bg-slate-400" };

export default function MunicipalDeviceStatus() {
  const [device, setDevice] = useState<Device | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = async () => { setLoading(true); try { setDevice(await getDevice()); } catch { setError(true); } finally { setLoading(false); } };
  useEffect(() => { load(); }, []);

  if (loading) return <LoadingState type="card" rows={2} />;
  if (error || !device) return <ErrorState onRetry={load} />;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-slate-800">Device Status</h2>
      <div className="rounded-xl bg-white border border-slate-200 p-4">
        <div className="flex items-center justify-between">
          <div><p className="font-bold text-slate-800">{device.deviceCode}</p><p className="text-xs text-slate-400">FW: {device.firmwareVersion}</p></div>
          <span className={`text-xs font-medium ${device.edgeQueueDepth > 0 ? "text-amber-600" : "text-emerald-600"}`}>Queue: {device.edgeQueueDepth}</span>
        </div>
      </div>
      <div className="space-y-2">
        {device.components.map(comp => (
          <div key={comp.code} className="flex items-center justify-between rounded-lg bg-white border border-slate-200 p-3">
            <div className="flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full ${healthColors[comp.health]}`} />
              <span className="text-sm font-medium text-slate-700">{comp.name}</span>
            </div>
            <span className={`text-xs font-medium ${comp.health === "OK" ? "text-emerald-600" : comp.health === "DEGRADED" ? "text-amber-600" : "text-red-600"}`}>{getHealthLabel(comp.health)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
