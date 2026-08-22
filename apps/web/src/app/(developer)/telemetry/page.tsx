"use client";

import { useState, useEffect } from "react";

interface Reading { time: string; type: string; value: string; quality: string; }

const mockReadings: Reading[] = [
  { time: "07:15:05", type: "IR_DRY", value: "TRIGGERED", quality: "GOOD" },
  { time: "07:15:04", type: "MOISTURE", value: "12.4%", quality: "GOOD" },
  { time: "07:15:03", type: "ULTRASONIC_DRY", value: "35.2%", quality: "GOOD" },
  { time: "07:15:02", type: "ULTRASONIC_WET", value: "0.0%", quality: "GOOD" },
  { time: "07:15:01", type: "GPS", value: "22.7196, 75.8577", quality: "GPS" },
  { time: "07:15:00", type: "HEARTBEAT", value: "seq=184", quality: "GOOD" },
  { time: "07:14:58", type: "IR_WET", value: "NOT_TRIGGERED", quality: "GOOD" },
  { time: "07:14:55", type: "WIFI", value: "Connected", quality: "GOOD" },
];

export default function DeveloperTelemetry() {
  const [readings, setReadings] = useState<Reading[]>(mockReadings);

  useEffect(() => {
    const interval = setInterval(() => {
      const newReading: Reading = {
        time: new Date().toLocaleTimeString("en-IN", { hour12: false }),
        type: ["MOISTURE", "ULTRASONIC_DRY", "IR_DRY", "GPS"][Math.floor(Math.random() * 4)],
        value: `${(Math.random() * 100).toFixed(1)}%`,
        quality: Math.random() > 0.9 ? "DEGRADED" : "GOOD",
      };
      setReadings(prev => [newReading, ...prev].slice(0, 20));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-emerald-400">Raw Telemetry</h2>
      <div className="rounded-xl bg-slate-900 border border-slate-700 divide-y divide-slate-800 max-h-[60vh] overflow-y-auto">
        {readings.map((r, i) => (
          <div key={i} className="flex items-center gap-3 p-2.5 text-xs font-mono">
            <span className="text-slate-500 w-16 shrink-0">{r.time}</span>
            <span className="text-emerald-400 w-28 shrink-0">{r.type}</span>
            <span className="text-slate-200 flex-1">{r.value}</span>
            <span className={`w-16 text-right ${r.quality === "GOOD" ? "text-emerald-500" : "text-amber-400"}`}>{r.quality}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
