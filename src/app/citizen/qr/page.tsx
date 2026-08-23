"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { QrCode, ShieldCheck, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { LoadingSkeleton, ErrorState, OfflineBanner } from "@/components/StateViews";
import { useDemoScreenState } from "@/components/ScreenChrome";
import { TruthBadge } from "@/components/TruthBadge";

interface QrProfile {
  id: string;
  fullName: string;
  locality: string | null;
  tier: string;
  pointsBalance: number;
}

export default function CitizenQrPage() {
  const { status, setStatus } = useDemoScreenState();

  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [profile, setProfile] = useState<QrProfile | null>(null);
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [failure, setFailure] = useState<"auth" | "generic" | null>(null);
  // Bumping this re-runs the fetch effect. Cleaner than an imperative
  // reload function, and keeps every setState call inside an async
  // continuation rather than firing synchronously during the effect.
  const [reloadKey, setReloadKey] = useState(0);

  // The payload is minted server-side from the session cookie, so the QR is
  // bound to the account actually signed in on this device. There is no
  // hardcoded citizen id anywhere in this path.
  useEffect(() => {
    let cancelled = false;

    async function loadQr() {
      try {
        const res = await fetch("/api/qr/token", { cache: "no-store" });
        if (cancelled) return;

        if (res.status === 401) {
          setFailure("auth");
          return;
        }
        if (!res.ok) {
          setFailure("generic");
          return;
        }

        const data = (await res.json()) as {
          payload: string;
          expiresAt: number;
          profile: QrProfile;
        };
        if (cancelled) return;

        const url = await QRCode.toDataURL(data.payload, {
          margin: 1,
          width: 320,
          errorCorrectionLevel: "M",
        });
        if (cancelled) return;

        setProfile(data.profile);
        setExpiresAt(data.expiresAt);
        setQrDataUrl(url);
        setFailure(null);
      } catch {
        if (!cancelled) setFailure("generic");
      }
    }

    void loadQr();
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  // Codes carry an expiry. Refresh a minute before it lapses so a citizen
  // holding the screen open at the bin never presents a stale code.
  useEffect(() => {
    if (!expiresAt) return;
    const msUntilRefresh = Math.max(5_000, (expiresAt - 60) * 1000 - Date.now());
    const timer = setTimeout(() => setReloadKey((k) => k + 1), msUntilRefresh);
    return () => clearTimeout(timer);
  }, [expiresAt]);

  function retry() {
    setQrDataUrl(null);
    setFailure(null);
    setReloadKey((k) => k + 1);
  }

  const displayName = profile?.fullName ?? "";

  return (
    <div>
      <PageHeader title="My QR" description="Shown to municipal staff at the collection point" />

      {status === "offline" && (
        <OfflineBanner message="QR could not refresh its rotation key. Showing the last valid code." />
      )}
      {status === "loading" && <LoadingSkeleton rows={1} className="h-64" />}
      {status === "error" && (
        <ErrorState
          title="QR unavailable"
          description="This code could not be generated. Try again in a moment."
          onRetry={() => setStatus("ready")}
        />
      )}

      {(status === "ready" || status === "offline") && (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 p-6">
            {failure === "auth" ? (
              <ErrorState
                title="Sign in to see your QR"
                description="Your session has expired. Sign in again and your personal code will regenerate."
                onRetry={retry}
              />
            ) : failure === "generic" ? (
              <ErrorState
                title="Couldn't generate your QR"
                description="Something interrupted the request. Try again."
                onRetry={retry}
              />
            ) : (
              <>
                <div className="flex h-48 w-48 items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-brand-border bg-brand-surface-muted p-2">
                  {qrDataUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={qrDataUrl}
                      alt={`Scannable QR code for ${displayName}`}
                      className="h-full w-full rounded-lg bg-white object-contain"
                    />
                  ) : (
                    <Loader2 className="h-8 w-8 animate-spin text-brand-muted-fg" />
                  )}
                </div>

                <div className="flex flex-col items-center gap-1">
                  <p className="text-base font-semibold text-foreground">
                    {displayName || <QrCode className="h-5 w-5 text-brand-muted-fg" />}
                  </p>
                  {profile?.locality && (
                    <p className="text-xs text-brand-muted-fg">
                      {profile.locality} · Tier {profile.tier}
                    </p>
                  )}
                  <div className="flex items-center gap-2">{qrDataUrl && <TruthBadge value="REAL" />}</div>
                </div>
              </>
            )}

            <div className="flex items-start gap-2 rounded-xl bg-brand-primary-light px-3 py-2 text-xs text-brand-primary-dark">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
              <p>
                This code carries only your account identifier plus a server-issued signature - no
                name, phone number, or address is encoded. It expires automatically, and copied or
                edited codes won&apos;t pass the municipal scanner&apos;s check.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
