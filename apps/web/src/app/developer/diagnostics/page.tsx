"use client";

import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { DevCard, DevSectionLabel } from "@/components/developer/DevCard";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, XCircle, PlayCircle } from "lucide-react";

interface CheckResult {
  name: string;
  status: "idle" | "running" | "pass" | "fail";
  detail: string;
}

const CHECKS: CheckResult[] = [
  { name: "Wi-Fi connectivity", status: "idle", detail: "" },
  { name: "GPS fix", status: "idle", detail: "" },
  { name: "Camera capture", status: "idle", detail: "" },
  { name: "Local model load", status: "idle", detail: "" },
  { name: "SQLite write test", status: "idle", detail: "" },
  { name: "Cloud reachability", status: "idle", detail: "" },
];

export default function DiagnosticsPage() {
  const [checks, setChecks] = useState<CheckResult[]>(CHECKS);
  const [running, setRunning] = useState(false);

  function runSelfTest() {
    setRunning(true);
    setChecks(CHECKS.map((c) => ({ ...c, status: "running", detail: "" })));
    CHECKS.forEach((c, i) => {
      setTimeout(() => {
        setChecks((prev) => {
          const next = [...prev];
          const pass = c.name !== "GPS fix";
          next[i] = {
            ...c,
            status: pass ? "pass" : "fail",
            detail: pass ? "Responded within expected bounds" : "No GPS fix acquired — check antenna",
          };
          return next;
        });
        if (i === CHECKS.length - 1) setRunning(false);
      }, 500 + i * 350);
    });
  }

  return (
    <div>
      <PageHeader title="Diagnostics" description="One-tap self-test across all onboard subsystems" className="text-slate-100" />
      <Button onClick={runSelfTest} disabled={running} className="mb-4">
        {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <PlayCircle className="h-4 w-4" />}
        {running ? "Running self-test…" : "Run self-test"}
      </Button>
      <DevSectionLabel>Results</DevSectionLabel>
      <div className="space-y-2">
        {checks.map((c) => (
          <DevCard key={c.name} className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-100">{c.name}</p>
              {c.detail && <p className="text-[11px] text-slate-500">{c.detail}</p>}
            </div>
            {c.status === "idle" && <span className="text-[11px] text-slate-600">Not run</span>}
            {c.status === "running" && <Loader2 className="h-4 w-4 animate-spin text-slate-400" />}
            {c.status === "pass" && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
            {c.status === "fail" && <XCircle className="h-4 w-4 text-red-400" />}
          </DevCard>
        ))}
      </div>
    </div>
  );
}
