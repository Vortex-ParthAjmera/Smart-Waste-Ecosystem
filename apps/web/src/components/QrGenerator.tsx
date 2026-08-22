"use client";

import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QrCode, RefreshCw, Copy, Check } from "lucide-react";
import { generateNewQrToken } from "@/lib/demoStore";

export function QrGenerator() {
  const [tokenData, setTokenData] = useState(() => generateNewQrToken());
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minute countdown

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleRefresh();
          return 300;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleRefresh = () => {
    setTokenData(generateNewQrToken());
    setTimeLeft(300);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(tokenData.token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <Card className="border-brand-primary/20 bg-brand-surface shadow-md">
      <CardContent className="flex flex-col items-center p-6 text-center space-y-4">
        <div className="flex items-center justify-between w-full">
          <Badge variant="outline" className="text-xs font-medium text-brand-muted-fg flex items-center gap-1">
            <QrCode className="h-3.5 w-3.5 text-brand-primary" /> Opaque Citizen QR
          </Badge>
          <Badge variant="secondary" className="font-mono text-xs">
            Expires in {formatTimer(timeLeft)}
          </Badge>
        </div>

        {/* QR Rendering */}
        <div className="relative p-4 bg-white rounded-2xl border-2 border-brand-border shadow-inner flex items-center justify-center">
          <QRCodeSVG
            value={JSON.stringify({
              schemaVersion: "1.1",
              messageType: "CITIZEN_DISPOSAL_TOKEN_V1",
              token: tokenData.token,
              expiresAt: tokenData.expiresAt,
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
          Show this QR code at the smart disposal bin. No identity or phone number is stored in the code.
        </p>

        <Button onClick={handleRefresh} variant="outline" className="w-full flex items-center gap-2">
          <RefreshCw className="h-4 w-4" /> Rotate / Regenerate Code
        </Button>
      </CardContent>
    </Card>
  );
}
