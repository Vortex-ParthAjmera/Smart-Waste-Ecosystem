"use client";

import { QrCode, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { LoadingSkeleton, ErrorState, OfflineBanner } from "@/components/StateViews";
import { useDemoScreenState, DemoStateToggle } from "@/components/ScreenChrome";
import { apiClient } from "@/lib/api-client";

export default function CitizenQrPage() {
  const { status, setStatus } = useDemoScreenState();
  const citizen = apiClient.getDemoCitizen();
  const shortId = citizen.id.slice(-8).toUpperCase();

  return (
    <div>
      <PageHeader title="My QR" description="Shown to municipal staff at the collection point" />
      <DemoStateToggle status={status} setStatus={setStatus} />
      {status === "offline" && <OfflineBanner message="QR could not refresh its rotation key. Showing the last valid code." />}
      {status === "loading" && <LoadingSkeleton rows={1} className="h-64" />}
      {status === "error" && <ErrorState title="QR unavailable" description="This code could not be generated. Try again in a moment." onRetry={() => setStatus("ready")} />}
      {(status === "ready" || status === "offline") && (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 p-6">
            <div className="flex h-48 w-48 items-center justify-center rounded-2xl border-2 border-dashed border-brand-border bg-brand-surface-muted">
              <QrCode className="h-28 w-28 text-foreground" strokeWidth={1} />
            </div>
            <p className="mono-tabular text-sm font-semibold tracking-widest text-foreground">SW-{shortId}</p>
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
