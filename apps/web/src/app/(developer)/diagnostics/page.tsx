"use client";

export default function DeveloperDiagnostics() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-emerald-400">Diagnostics</h2>
      <div className="rounded-xl bg-slate-900 border border-slate-700 p-4 space-y-3 text-xs">
        <div className="flex justify-between text-slate-400"><span>Uptime</span><span className="text-slate-200">2h 14m 33s</span></div>
        <div className="flex justify-between text-slate-400"><span>Free heap</span><span className="text-emerald-400">142 KB</span></div>
        <div className="flex justify-between text-slate-400"><span>Stack used</span><span className="text-slate-200">8.2 KB / 8 KB</span></div>
        <div className="flex justify-between text-slate-400"><span>WiFi RSSI</span><span className="text-emerald-400">-42 dBm</span></div>
        <div className="flex justify-between text-slate-400"><span>NTP offset</span><span className="text-slate-200">+12ms</span></div>
        <div className="flex justify-between text-slate-400"><span>SQLite WAL size</span><span className="text-slate-200">24 KB</span></div>
        <div className="flex justify-between text-slate-400"><span>Model runtime</span><span className="text-emerald-400">1.1s avg</span></div>
        <div className="flex justify-between text-slate-400"><span>Camera FPS</span><span className="text-slate-200">15 fps</span></div>
      </div>
      <div className="rounded-xl bg-slate-900 border border-slate-700 p-4">
        <h3 className="text-sm font-semibold text-slate-300 mb-2">System Test</h3>
        <button className="w-full rounded-lg bg-emerald-600 py-2 text-sm font-medium text-white hover:bg-emerald-500">Run Health Check</button>
      </div>
    </div>
  );
}
