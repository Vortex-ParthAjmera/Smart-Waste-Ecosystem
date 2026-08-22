"use client";

import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TruthBadge } from "@/components/TruthBadge";
import { QrCode, RefreshCw, Copy, Check } from "lucide-react";

interface DemoQrToken {
  token: string;
  expiresAt: string;
}

const DEMO_QR_TOKEN = "SGV-CIT-DEMO-001";
const DEMO_QR_TTL_SECONDS = 300;

function issueDemoQrToken(): DemoQrToken {
  return {
    token: DEMO_QR_TOKEN,
    expiresAt: new Date(Date.now() + DEMO_QR_TTL_SECONDS * 1000).toISOString(),
  };
}

export function QrGenerator() {
  const [tokenData, setTokenData] = useState<DemoQrToken | null>(null);
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(DEMO_QR_TTL_SECONDS);

  useEffect(() => {
    setTokenData(issueDemoQrToken());
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setTokenData(issueDemoQrToken());
          return DEMO_QR_TTL_SECONDS;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleRefresh = () => {
    setTokenData(issueDemoQrToken());
    setTimeLeft(DEMO_QR_TTL_SECONDS);
  };

  const handleCopy = () => {
    if (!tokenData) return;
    navigator.clipboard.writeText(tokenData.token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  if (!tokenData) {
    return (
      <Card className="border-brand-primary/20 bg-brand-surface shadow-md">
        <CardContent className="p-6 text-center" role="status">
          Preparing simulated QR code…
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-brand-primary/20 bg-brand-surface shadow-md">
      <CardContent className="flex flex-col items-center p-6 text-center space-y-4">
        <div className="flex items-center justify-between w-full">
          <Badge variant="outline" className="text-xs font-medium text-brand-muted-fg flex items-center gap-1">
            <QrCode className="h-3.5 w-3.5 text-brand-primary" /> Demo Citizen QR
          </Badge>
          <div className="flex items-center gap-2">
            <TruthBadge value="SIMULATED" />
            <Badge variant="neutral" className="font-mono text-xs">
              Expires in {formatTimer(timeLeft)}
            </Badge>
          </div>
        </div>

        {/* QR Rendering */}
        <div className="relative p-4 bg-white rounded-2xl border-2 border-brand-border shadow-inner flex items-center justify-center">
          <QRCodeSVG
            value={JSON.stringify({
              schemaVersion: "1.1",
              messageType: "CITIZEN_DISPOSAL_TOKEN_V1",
              token: tokenData.token,
              expiresAt: tokenData.expiresAt,
              eventSource: "SIMULATED",
            })}
            size={200}
            level="H"
            includeMargin={true}
          />
        </div>

        <div className="w-full bg-brand-surface-muted rounded-xl p-3 border border-brand-border space-y-1">
          <p className="text-[11px] uppercase tracking-wider text-brand-muted-fg font-semibold">Active Session Token</p>
          <div className="flex items-center justify-between gap-2">
            <p className="font-mono text-xs font-bold text-foreground truncate">{tokenData.token}</p>
            <Button size="sm" variant="ghost" onClick={handleCopy} className="h-7 w-7 p-0 shrink-0">
              {copied ? <Check className="h-3.5 w-3.5 text-brand-primary" /> : <Copy className="h-3.5 w-3.5 text-brand-muted-fg" />}
            </Button>
          </div>
        </div>

        <p className="text-xs text-brand-muted-fg">
          Fixed fictional token for the in-browser demo only. It does not create an authenticated cloud session.
        </p>

        <Button onClick={handleRefresh} variant="outline" className="w-full flex items-center gap-2">
          <RefreshCw className="h-4 w-4" /> Reset Demo Code
        </Button>
      </CardContent>
    </Card>
  );
}
