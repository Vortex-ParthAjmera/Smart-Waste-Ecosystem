"use client";

export default function DeveloperLogs() {
  const logs = [
    { time: "07:15:09", level: "INFO", event: "evt-001", msg: "ACCEPTED +10 — Plastic Bottle DRY" },
    { time: "07:15:08", level: "INFO", event: "evt-001", msg: "Cloud sync ACKED" },
    { time: "07:15:05", level: "INFO", event: "evt-001", msg: "Queued locally — SQLite WAL committed" },
    { time: "07:15:04", level: "INFO", event: "evt-001", msg: "ML received: Plastic Bottle 0.92 HIGH" },
    { time: "07:15:02", level: "INFO", event: "evt-001", msg: "IR_DRY triggered — compartment DRY" },
    { time: "07:15:00", level: "INFO", event: "-", msg: "Heartbeat seq=184" },
    { time: "09:46:01", level: "WARN", event: "evt-003", msg: "FLAGGED — confidence 0.45 LOW" },
    { time: "09:46:01", level: "INFO", event: "evt-003", msg: "Review case rc-001 opened" },
  ];

  const levelColors: Record<string, string> = { INFO: "text-emerald-400", WARN: "text-amber-400", ERROR: "text-red-400" };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-emerald-400">System Logs</h2>
      <div className="rounded-xl bg-slate-900 border border-slate-700 divide-y divide-slate-800 max-h-[60vh] overflow-y-auto">
        {logs.map((l, i) => (
          <div key={i} className="p-2.5 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="text-slate-500 w-16 shrink-0">{l.time}</span>
              <span className={`w-10 shrink-0 ${levelColors[l.level]}`}>{l.level}</span>
              <span className="text-blue-400 shrink-0">{l.event}</span>
            </div>
            <p className="mt-0.5 text-slate-300 ml-28">{l.msg}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
