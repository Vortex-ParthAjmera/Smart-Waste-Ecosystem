"use client";

export default function MunicipalAudit() {
  const logs = [
    { id: "aud-001", action: "SCAN_QR", actor: "Operator #3", detail: "Scanned citizen cit-001", time: "07:15:00" },
    { id: "aud-002", action: "DISPOSAL_STARTED", actor: "System", detail: "Session ses-001 opened for cit-001", time: "07:15:02" },
    { id: "aud-003", action: "EVENT_INGESTED", actor: "ESP32-001", detail: "evt-001 queued locally", time: "07:15:05" },
    { id: "aud-004", action: "EVENT_SYNCED", actor: "Edge Gateway", detail: "evt-001 synced to cloud", time: "07:15:08" },
    { id: "aud-005", action: "RULES_EVALUATED", actor: "rules-2.0.0", detail: "evt-001 ACCEPTED +10", time: "07:15:09" },
    { id: "aud-006", action: "REVIEW_CREATED", actor: "System", detail: "rc-001 opened for evt-003 (low confidence)", time: "09:46:01" },
    { id: "aud-007", action: "REVIEW_RESOLVED", actor: "Officer #1", detail: "rc-002 REVIEW_ACCEPTED", time: "10:20:00" },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-slate-800">Audit Trail</h2>
      <p className="text-xs text-slate-400">Append-only — entries are never modified or deleted</p>
      <div className="space-y-1">
        {logs.map(log => (
          <div key={log.id} className="flex items-start gap-3 rounded-lg bg-white border border-slate-100 p-3">
            <span className="text-xs font-mono text-slate-400 mt-0.5 shrink-0">{log.time}</span>
            <div>
              <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600">{log.action}</span>
              <p className="mt-0.5 text-xs text-slate-600">{log.detail}</p>
              <p className="text-[10px] text-slate-400">by {log.actor}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
