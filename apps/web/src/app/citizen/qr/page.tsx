"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { QrCode, ShieldCheck, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { LoadingSkeleton, ErrorState, OfflineBanner } from "@/components/StateViews";
import { useDemoScreenState, DemoStateToggle } from "@/components/ScreenChrome";
import { TruthBadge } from "@/components/TruthBadge";
import { apiClient } from "@/lib/api-client";

// The QR encodes a small, opaque payload — never the citizen's name, phone,
// or address. Municipal staff's camera scanner decodes this string client-side
// and resolves it back to a citizen record (see /municipal/scan).
function citizenQrPayload(citizenId: string) {
  return `smartwaste://citizen/${citizenId}`;
}

export default function CitizenQrPage() {
  const { status, setStatus } = useDemoScreenState();
  const citizen = apiClient.getDemoCitizen();
  const shortId = citizen.id.slice(-8).toUpperCase();

  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [genFailed, setGenFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setQrDataUrl(null);
    setGenFailed(false);
    QRCode.toDataURL(citizenQrPayload(citizen.id), {
      margin: 1,
      width: 320,
      errorCorrectionLevel: "M",
    })
      .then((url) => {
        if (!cancelled) setQrDataUrl(url);
      })
      .catch(() => {
        if (!cancelled) setGenFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [citizen.id]);

  return (
    <div>
      <PageHeader title="My QR" description="Shown to municipal staff at the collection point" />
      <DemoStateToggle status={status} setStatus={setStatus} />
      {status === "offline" && <OfflineBanner message="QR could not refresh its rotation key. Showing the last valid code." />}
      {status === "loading" && <LoadingSkeleton rows={1} className="h-64" />}
      {status === "error" && <ErrorState title="QR unavailable" description="This code could not be generated. Try again in a moment." onRetry={() => setStatus("ready")} />}
      {(status === "ready" || status === "offline") && (
        <Card className="md:mx-auto md:max-w-md">
          <CardContent className="flex flex-col items-center gap-4 p-6 md:p-8">
            <div className="flex h-48 w-48 items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-brand-border bg-brand-surface-muted p-2 md:h-64 md:w-64">
              {qrDataUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={qrDataUrl}
                  alt={`Scannable QR code for ${citizen.name}`}
                  className="h-full w-full rounded-lg bg-white object-contain"
                />
              ) : genFailed ? (
                <QrCode className="h-24 w-24 text-brand-muted-fg" strokeWidth={1} />
              ) : (
                <Loader2 className="h-8 w-8 animate-spin text-brand-muted-fg" />
              )}
            </div>
            <div className="flex items-center gap-2">
              <p className="mono-tabular text-sm font-semibold tracking-widest text-foreground">SW-{shortId}</p>
              {qrDataUrl && <TruthBadge value="REAL" />}
            </div>
            <div className="flex items-start gap-2 rounded-xl bg-brand-primary-light px-3 py-2 text-xs text-brand-primary-dark">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
              <p>
                This code carries only a short, opaque identifier — no name, phone number, or address is
                encoded. Municipal staff scan it at the bin to link your disposal safely.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
