"use client";

import { useEffect, useState } from "react";
import { getDevice } from "@/lib/mock";
import type { Device } from "@/lib/mock/types";
import { getHealthLabel } from "@/lib/mock/types";
import { LoadingState } from "@/components/status/LoadingState";
import { ErrorState } from "@/components/status/ErrorState";

export default function DeveloperDevices() {
  const [device, setDevice] = useState<Device | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = async () => { setLoading(true); try { setDevice(await getDevice()); } catch { setError(true); } finally { setLoading(false); } };
  useEffect(() => { load(); }, []);

  if (loading) return <LoadingState type="list" rows={3} className="[&]:bg-slate-800" />;
  if (error || !device) return <ErrorState onRetry={load} />;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-emerald-400">Devices</h2>
      <div className="rounded-xl bg-slate-900 border border-slate-700 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold text-slate-100">{device.deviceCode}</p>
            <p className="text-xs text-slate-500">{device.firmwareVersion}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500">Queue</p>
            <p className={`font-bold ${device.edgeQueueDepth > 0 ? "text-amber-400" : "text-emerald-400"}`}>{device.edgeQueueDepth}</p>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {device.components.slice(0, 6).map(comp => (
            <div key={comp.code} className="rounded bg-slate-800 p-2 text-center">
              <p className={`text-[10px] font-medium ${comp.health === "OK" ? "text-emerald-400" : "text-amber-400"}`}>{getHealthLabel(comp.health)}</p>
              <p className="text-[9px] text-slate-500 mt-0.5">{comp.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
