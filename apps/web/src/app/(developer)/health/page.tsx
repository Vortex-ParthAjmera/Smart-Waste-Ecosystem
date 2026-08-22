"use client";

import { useEffect, useState } from "react";
import { getDevice } from "@/lib/mock";
import type { Device } from "@/lib/mock/types";
import { getHealthLabel } from "@/lib/mock/types";
import { LoadingState } from "@/components/status/LoadingState";
import { ErrorState } from "@/components/status/ErrorState";

const healthColors: Record<string, string> = {
  OK: "bg-emerald-500",
  DEGRADED: "bg-amber-500",
  MISSING: "bg-red-500",
  FAILED: "bg-red-600",
  UNKNOWN: "bg-slate-500",
};

export default function DeveloperHealth() {
  const [device, setDevice] = useState<Device | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(false);
    try {
      const d = await getDevice();
      setDevice(d);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) return <LoadingState type="card" rows={3} className="[&]:bg-slate-800" />;
  if (error || !device) return <ErrorState onRetry={load} />;

  return (
    <div className="space-y-4">
      {/* Device Header */}
      <section className="rounded-xl bg-slate-900 border border-slate-700 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-emerald-400">{device.deviceCode}</h2>
            <p className="text-xs text-slate-500">FW: {device.firmwareVersion}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500">Edge Queue</p>
            <p className={`text-lg font-bold ${device.edgeQueueDepth > 0 ? "text-amber-400" : "text-emerald-400"}`}>
              {device.edgeQueueDepth}
            </p>
          </div>
        </div>
        <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
          <span>Cloud: <span className="text-emerald-400 font-medium">{device.cloudSyncStatus}</span></span>
          <span>•</span>
          <span>Last heartbeat: {new Date(device.lastHeartbeat).toLocaleTimeString("en-IN")}</span>
        </div>
      </section>

      {/* Component Health Grid */}
      <section className="rounded-xl bg-slate-900 border border-slate-700 p-4">
        <h3 className="text-sm font-semibold text-slate-300 mb-3">Component Health</h3>
        <div className="space-y-2">
          {device.components.map((comp) => (
            <div key={comp.code} className="flex items-center justify-between rounded-lg bg-slate-800 p-3">
              <div className="flex items-center gap-3">
                <span className={`h-2.5 w-2.5 rounded-full ${healthColors[comp.health]}`} />
                <div>
                  <p className="text-sm font-medium text-slate-200">{comp.name}</p>
                  {comp.lastValue && <p className="text-xs text-slate-500">{comp.lastValue}</p>}
                </div>
              </div>
              <div className="text-right">
                <span className={`text-xs font-medium ${
                  comp.health === "OK" ? "text-emerald-400" : comp.health === "DEGRADED" ? "text-amber-400" : "text-red-400"
                }`}>
                  {getHealthLabel(comp.health)}
                </span>
                <p className="text-[10px] text-slate-600">
                  {new Date(comp.lastSeen).toLocaleTimeString("en-IN")}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
