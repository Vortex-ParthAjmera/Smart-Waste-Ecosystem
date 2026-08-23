"use client";

import { PageHeader } from "@/components/PageHeader";
import { DevCard, DevSectionLabel } from "@/components/developer/DevCard";
import { StatusPill } from "@/components/StatusPill";
import { apiClient } from "@/lib/api-client";
import { useDemoStore, setDeviceComponentOverride } from "@/lib/demoStore";
import { ComponentHealth } from "@/lib/mock/types";
import { cn } from "@/lib/utils";

const BOUNDARIES: { key: string; label: string; hint: (h: ComponentHealth) => string }[] = [
  { key: "esp32Wifi", label: "ESP32 & Wi-Fi/LAN", hint: (h) => (h === "OK" ? "Heartbeat received 8s ago" : "No heartbeat for 42s") },
  { key: "irWet", label: "Wet IR sensor", hint: (h) => (h === "OK" ? "Triggering normally" : "Wet IR has not reported for 42s") },
  { key: "irDry", label: "Dry IR sensor", hint: (h) => (h === "OK" ? "Triggering normally" : "Dry IR has not reported for 42s") },
  { key: "ultraWet", label: "Wet ultrasonic", hint: (h) => (h === "OK" ? "Fill readings nominal" : "Fill readings stale") },
  { key: "ultraDry", label: "Dry ultrasonic", hint: (h) => (h === "OK" ? "Fill readings nominal" : "Fill readings stale") },
  { key: "moisture", label: "Dry-path moisture", hint: (h) => (h === "OK" ? "Calibrated, reading normally" : "Sensor disconnected") },
  { key: "gps", label: "GPS / fix quality", hint: (h) => (h === "OK" ? "3D fix acquired" : "No fix - showing NO_FIX to citizens") },
  { key: "fastapi", label: "FastAPI service", hint: (h) => (h === "OK" ? "p99 latency 84ms" : "Elevated error rate") },
  { key: "sqlite", label: "SQLite WAL", hint: (h) => (h === "OK" ? "Checkpoint healthy" : "WAL growing, checkpoint delayed") },
  { key: "syncWorker", label: "Sync worker", hint: (h) => (h === "OK" ? "Queue draining" : "Backlog increasing") },
  { key: "cloud", label: "Cloud reachability", hint: (h) => (h === "OK" ? "Reachable" : "WAN offline - edge still working locally") },
  { key: "camera", label: "Camera capture", hint: (h) => (h === "OK" ? "Frame received on last event" : "No frame captured") },
  { key: "model", label: "Local model artifact", hint: (h) => (h === "OK" ? "yolov8n-waste-v1.3 · hash verified" : "Hash mismatch or runtime error") },
  { key: "realtime", label: "Supabase Realtime", hint: (h) => (h === "OK" ? "Subscribed" : "Polling fallback active") },
];

export default function SystemHealthPage() {
  const demo = useDemoStore();
  const device = apiClient.getDeviceByCode("ESP32-001")!;

  function healthFor(key: string, fallback: ComponentHealth): ComponentHealth {
    return demo.deviceOverride[key] ?? fallback;
  }

  function toggle(key: string, current: ComponentHealth) {
    setDeviceComponentOverride(key, current === "OK" ? "FAILED" : null);
  }

  return (
    <div>
      <PageHeader
        title="System Health"
        description="Every boundary reported separately - never a single rolled-up status"
        className="text-slate-100"
      />
      <DevSectionLabel>Component-level health · {device.deviceCode}</DevSectionLabel>
      <div className="grid gap-2 sm:grid-cols-2">
        {BOUNDARIES.map((b) => {
          const current = healthFor(b.key, "OK");
          return (
            <DevCard key={b.key} className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-slate-100">{b.label}</p>
                <p className="text-[11px] text-slate-500">{b.hint(current)}</p>
              </div>
              <div className="flex items-center gap-2">
                <StatusPill status={current} />
                <button
                  onClick={() => toggle(b.key, current)}
                  className={cn(
                    "rounded-md border border-slate-700 px-2 py-1 text-[10px] font-medium text-slate-400 hover:bg-slate-800"
                  )}
                >
                  {current === "OK" ? "Simulate offline" : "Restore"}
                </button>
              </div>
            </DevCard>
          );
        })}
      </div>
      <p className="mt-3 text-[11px] text-slate-500">
        Firmware {device.firmwareVersion} · last seen {new Date(device.lastSeen).toLocaleTimeString("en-IN")}
      </p>
    </div>
  );
}
