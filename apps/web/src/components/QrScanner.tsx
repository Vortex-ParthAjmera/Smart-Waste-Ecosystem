"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TruthBadge } from "@/components/TruthBadge";
import { Camera, CheckCircle2, AlertCircle, Scan, ArrowRight } from "lucide-react";

const DEMO_QR_TOKEN = "SGV-CIT-DEMO-001";

export function QrScanner() {
  const [manualToken, setManualToken] = useState("");
  const [status, setStatus] = useState<"IDLE" | "SUCCESS" | "ERROR">("IDLE");
  const [claimedSessionId, setClaimedSessionId] = useState<string | null>(null);

  const handleClaim = (tokenToClaim: string) => {
    const token = tokenToClaim.trim();
    if (!token) return;

    if (token === DEMO_QR_TOKEN) {
      setClaimedSessionId(`sess_sim_${crypto.randomUUID()}`);
      setStatus("SUCCESS");
    } else {
      setClaimedSessionId(null);
      setStatus("ERROR");
    }
  };

  const handleSimulateInstantScan = () => {
    handleClaim(DEMO_QR_TOKEN);
  };

  return (
    <Card className="border-brand-primary/20 bg-brand-surface shadow-md">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-xs font-medium text-brand-muted-fg flex items-center gap-1">
            <Scan className="h-3.5 w-3.5 text-brand-primary" /> Municipal Scanner
          </Badge>
          <div className="flex items-center gap-2">
            <TruthBadge value="SIMULATED" />
            <Badge variant="primary" className="text-[10px]">Bin ESP32-001</Badge>
          </div>
        </div>

        {/* Viewfinder Mock */}
        <div className="relative h-48 bg-slate-900 rounded-2xl border-2 border-dashed border-brand-primary/40 flex flex-col items-center justify-center p-4 text-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-brand-primary/10 to-transparent pointer-events-none animate-pulse" />
          <Camera className="h-10 w-10 text-brand-primary mb-2" />
          <p className="text-xs text-slate-300 font-medium">Position the fictional demo QR code in frame</p>
          <p className="text-[10px] text-slate-500 mt-1">Camera viewfinder is simulated</p>
        </div>

        {status === "SUCCESS" && (
          <div className="bg-brand-primary-light/40 border border-brand-primary text-brand-primary-dark rounded-xl p-3 flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            <div>
              <p className="text-xs font-bold">Simulated Session Created</p>
              <p className="text-[11px] font-mono">Demo session ID: {claimedSessionId}</p>
              <p className="text-[11px]">No authenticated cloud session was created.</p>
            </div>
          </div>
        )}

        {status === "ERROR" && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-600 rounded-xl p-3 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <div>
              <p className="text-xs font-bold">Invalid or Expired Token</p>
              <p className="text-[11px]">Please request the citizen to regenerate their QR code.</p>
            </div>
          </div>
        )}

        {/* Manual Input Fallback */}
        <div className="space-y-2 pt-2 border-t border-brand-border">
          <label className="text-xs font-medium text-brand-muted-fg">Manual demo token entry</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={manualToken}
              onChange={(e) => setManualToken(e.target.value)}
              placeholder={DEMO_QR_TOKEN}
              className="flex-1 bg-brand-surface-muted border border-brand-border rounded-xl px-3 py-2 text-xs font-mono outline-none focus:border-brand-primary"
            />
            <Button size="sm" onClick={() => handleClaim(manualToken)}>
              Claim <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </div>
        </div>

        <Button variant="secondary" onClick={handleSimulateInstantScan} className="w-full text-xs">
          Simulate Instant Citizen Scan (Demo Token)
        </Button>
      </CardContent>
    </Card>
  );
}
