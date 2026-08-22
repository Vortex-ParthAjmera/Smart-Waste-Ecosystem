"use client";

export default function DeveloperEdgeQueue() {
  const statuses = [
    { label: "PENDING", count: 0, color: "text-amber-400" },
    { label: "IN_FLIGHT", count: 0, color: "text-blue-400" },
    { label: "ACKED", count: 15, color: "text-emerald-400" },
    { label: "AUTH_BLOCKED", count: 0, color: "text-red-400" },
    { label: "DEAD_LETTER", count: 0, color: "text-red-500" },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-emerald-400">Edge Queue</h2>
      <div className="grid grid-cols-3 gap-2">
        {statuses.slice(0, 3).map(s => (
          <div key={s.label} className="rounded-xl bg-slate-900 border border-slate-700 p-3 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.count}</p>
            <p className="text-[10px] text-slate-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="rounded-xl bg-slate-900 border border-slate-700 p-4 space-y-2 text-xs">
        <div className="flex justify-between text-slate-400"><span>Last successful sync</span><span className="text-slate-200">07:15:09</span></div>
        <div className="flex justify-between text-slate-400"><span>Next retry</span><span className="text-emerald-400">No pending</span></div>
        <div className="flex justify-between text-slate-400"><span>Cloud status</span><span className="text-emerald-400">Reachable</span></div>
        <div className="flex justify-between text-slate-400"><span>SQLite WAL</span><span className="text-emerald-400">Healthy</span></div>
      </div>
    </div>
  );
}
