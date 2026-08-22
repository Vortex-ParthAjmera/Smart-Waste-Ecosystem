"use client";

interface MLResult { time: string; wasteType: string; category: string; confidence: number; band: string; status: string; }

const mockResults: MLResult[] = [
  { time: "07:15:04", wasteType: "Plastic Bottle", category: "DRY", confidence: 0.92, band: "HIGH", status: "SUPPORTED" },
  { time: "07:14:50", wasteType: "Banana Peels", category: "WET", confidence: 0.88, band: "HIGH", status: "SUPPORTED" },
  { time: "07:13:22", wasteType: "Cardboard Box", category: "DRY", confidence: 0.45, band: "LOW", status: "SUPPORTED" },
  { time: "07:12:10", wasteType: "Unknown Material", category: "UNKNOWN", confidence: 0.0, band: "LOW", status: "UNSUPPORTED" },
  { time: "07:11:05", wasteType: "Mixed Items", category: "UNKNOWN", confidence: 0.0, band: "LOW", status: "MULTIPLE" },
];

const bandColors: Record<string, string> = { HIGH: "text-emerald-400", MEDIUM: "text-amber-400", LOW: "text-red-400" };

export default function DeveloperMLMonitor() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-emerald-400">ML Monitor</h2>
      <div className="rounded-xl bg-slate-900 border border-slate-700 p-3 text-xs text-slate-400">
        Model: waste-net-v2.1 • Hash: a3f2c1 • Source: LOCAL_LIVE
      </div>
      <div className="space-y-2">
        {mockResults.map((r, i) => (
          <div key={i} className="rounded-xl bg-slate-900 border border-slate-700 p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-200">{r.wasteType}</p>
                <p className="text-xs text-slate-500">{r.category} • {r.status}</p>
              </div>
              <div className="text-right">
                <p className={`text-lg font-bold ${bandColors[r.band]}`}>{(r.confidence * 100).toFixed(0)}%</p>
                <p className={`text-xs ${bandColors[r.band]}`}>{r.band}</p>
              </div>
            </div>
            <p className="mt-1 text-[10px] text-slate-600">{r.time}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
