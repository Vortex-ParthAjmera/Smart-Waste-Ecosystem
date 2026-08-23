"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { DevCard, DevSectionLabel } from "@/components/developer/DevCard";
import { apiClient } from "@/lib/api-client";
import { formatDateTime } from "@/lib/utils";

interface Reading {
  id: number;
  label: string;
  value: string;
  unit: string;
  quality: "GOOD" | "DEGRADED" | "MISSING";
  calibration: string;
  timestamp: string;
  eventSource: string;
}

function makeReading(id: number): Reading {
  const templates = [
    { label: "IR Wet trigger", value: Math.random() > 0.5 ? "TRUE" : "FALSE", unit: "bool", calibration: "cal-2026.02" },
    { label: "Ultrasonic Wet fill", value: (20 + Math.random() * 40).toFixed(1), unit: "%", calibration: "cal-2026.02" },
    { label: "Moisture", value: (10 + Math.random() * 55).toFixed(1), unit: "%", calibration: "cal-2026.01" },
    { label: "GPS latitude", value: (22.7196 + (Math.random() - 0.5) * 0.001).toFixed(6), unit: "deg", calibration: "n/a" },
    { label: "GPS longitude", value: (75.8577 + (Math.random() - 0.5) * 0.001).toFixed(6), unit: "deg", calibration: "n/a" },
  ];
  const t = templates[id % templates.length];
  return {
    id,
    ...t,
    quality: Math.random() > 0.85 ? "DEGRADED" : "GOOD",
    timestamp: new Date().toISOString(),
    eventSource: "HARDWARE",
  };
}

export default function TelemetryPage() {
  const [readings, setReadings] = useState<Reading[]>(() => Array.from({ length: 8 }, (_, i) => makeReading(i)));
  const device = apiClient.getDeviceByCode("ESP32-001")!;

  useEffect(() => {
    const interval = setInterval(() => {
      setReadings((prev) => [makeReading(Date.now()), ...prev].slice(0, 30));
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <PageHeader title="Raw Telemetry" description={`Live simulated feed from ${device.deviceCode}`} className="text-slate-100" />
      <DevSectionLabel>Scrolling feed</DevSectionLabel>
      <div className="max-h-[70vh] space-y-1.5 overflow-y-auto pr-1">
        {readings.map((r) => (
          <DevCard key={r.id} className="flex items-center justify-between py-2">
            <div>
              <p className="text-xs font-medium text-slate-100">{r.label}</p>
              <p className="text-[10px] text-slate-500">calibration {r.calibration} · {r.eventSource}</p>
            </div>
            <div className="text-right">
              <p className="mono-tabular text-sm text-slate-100">
                {r.value} <span className="text-[10px] text-slate-500">{r.unit}</span>
              </p>
              <p className={r.quality === "GOOD" ? "text-[10px] text-emerald-400" : "text-[10px] text-amber-400"}>
                {r.quality} · {formatDateTime(r.timestamp)}
              </p>
            </div>
          </DevCard>
        ))}
      </div>
    </div>
  );
}
