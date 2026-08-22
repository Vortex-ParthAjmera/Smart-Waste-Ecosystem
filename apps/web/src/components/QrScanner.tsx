"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Camera, CheckCircle2, AlertCircle, Scan, ArrowRight } from "lucide-react";
import { claimQrToken } from "@/lib/demoStore";

export function QrScanner() {
  const [manualToken, setManualToken] = useState("");
  const [status, setStatus] = useState<"IDLE" | "SUCCESS" | "ERROR">("IDLE");
  const [claimedSessionId, setClaimedSessionId] = useState<string | null>(null);

  const handleClaim = (tokenToClaim: string) => {
    if (!tokenToClaim.trim()) return;
    const session = claimQrToken(tokenToClaim.trim());
    if (session) {
      setClaimedSessionId(session.sessionId);
      setStatus("SUCCESS");
    } else {
      setStatus("ERROR");
    }
  };

  const handleSimulateInstantScan = () => {
    const session = claimQrToken("SGV-CIT-DEMO-001");
    if (session) {
      setClaimedSessionId(session.sessionId);
      setStatus("SUCCESS");
    }
  };

  return (
    <Card className="border-brand-primary/20 bg-brand-surface shadow-md">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-xs font-medium text-brand-muted-fg flex items-center gap-1">
            <Scan className="h-3.5 w-3.5 text-brand-primary" /> Municipal Scanner
          </Badge>
          <Badge variant="primary" className="text-[10px]">Bin ESP32-001</Badge>
        </div>

        {/* Viewfinder Mock */}
        <div className="relative h-48 bg-slate-900 rounded-2xl border-2 border-dashed border-brand-primary/40 flex flex-col items-center justify-center p-4 text-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-brand-primary/10 to-transparent pointer-events-none animate-pulse" />
          <Camera className="h-10 w-10 text-brand-primary mb-2" />
          <p className="text-xs text-slate-300 font-medium">Position Citizen QR code in frame</p>
          <p className="text-[10px] text-slate-500 mt-1">Camera auto-focus active</p>
        </div>

        {status === "SUCCESS" && (
          <div className="bg-brand-primary-light/40 border border-brand-primary text-brand-primary-dark rounded-xl p-3 flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            <div>
              <p className="text-xs font-bold">Session Claimed Successfully!</p>
              <p className="text-[11px] font-mono">Session ID: {claimedSessionId}</p>
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
          <label className="text-xs font-medium text-brand-muted-fg">Manual Token Entry</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={manualToken}
              onChange={(e) => setManualToken(e.target.value)}
              placeholder="e.g. SGV-CIT-2026-A1B2"
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
