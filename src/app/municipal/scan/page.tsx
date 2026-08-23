"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import jsQR from "jsqr";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/StateViews";
import { TruthBadge } from "@/components/TruthBadge";
import { Camera, CheckCircle2, ScanLine, VideoOff, ShieldAlert, Loader2 } from "lucide-react";
import { setScannedCitizen } from "@/lib/demoStore";
import { looksLikeSwachhSaathiQr } from "@/lib/qrToken";

interface ScannedCitizen {
  id: string;
  name: string;
  locality: string;
  tier: string;
  pointsBalance: number;
}

type ScanState =
  | "idle" // camera not requested yet
  | "requesting" // getUserMedia permission prompt is in flight
  | "scanning" // camera live, decoding frames
  | "resolving" // code decoded, waiting on the server lookup
  | "found" // verified against Supabase
  | "invalid" // decoded but not a valid Swachh Saathi code
  | "denied" // permission was refused
  | "unavailable" // no camera on this device, or API unsupported
  | "error"; // camera opened but something else went wrong

const MAX_DECODE_DIM = 480;

const INVALID_COPY: Record<string, { title: string; description: string }> = {
  expired: {
    title: "This QR code has expired",
    description:
      "Codes rotate for security. Ask the citizen to reopen My QR in their app so it refreshes, then scan again.",
  },
  unknown_citizen: {
    title: "No matching citizen account",
    description:
      "The signature is valid but no profile exists for it - the account may have been deleted. Ask the citizen to sign in again.",
  },
  bad_signature: {
    title: "This code wasn't issued by Swachh Saathi",
    description:
      "The signature doesn't check out, so this is a copied, edited, or screenshotted code. Ask the citizen to open My QR in their app.",
  },
  malformed: {
    title: "Not a Swachh Saathi QR code",
    description:
      "This looks like an unrelated QR code. Ask the citizen to open My QR in their app and try again.",
  },
};

export default function ScanCitizenPage() {
  const [state, setState] = useState<ScanState>("idle");
  const [citizen, setCitizen] = useState<ScannedCitizen | null>(null);
  const [invalidReason, setInvalidReason] = useState<string>("malformed");

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  // Guards against the decode loop firing a second lookup while the first
  // request is still in flight.
  const busyRef = useRef(false);

  const stopCamera = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }, []);

  useEffect(() => stopCamera, [stopCamera]);

  // The decoded string is sent to the server, which verifies the HMAC and
  // looks the citizen up in Postgres. The browser never decides who this is -
  // that is precisely what used to make every scan resolve to the same
  // hardcoded demo fixture.
  async function resolveScannedCitizen(decodedText: string) {
    setState("resolving");

    try {
      const res = await fetch("/api/scan/resolve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ raw: decodedText }),
      });

      const data = await res.json();

      if (data.status === "found") {
        setCitizen(data.citizen);
        setScannedCitizen(data.citizen.id);
        setState("found");
        return;
      }

      setCitizen(null);
      setScannedCitizen(null);

      if (data.status === "invalid") {
        setInvalidReason(typeof data.reason === "string" ? data.reason : "malformed");
        setState("invalid");
      } else {
        setState("error");
      }
    } catch {
      setCitizen(null);
      setScannedCitizen(null);
      setState("error");
    }
  }

  function tick() {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) {
      rafRef.current = requestAnimationFrame(tick);
      return;
    }

    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      const scale = Math.min(1, MAX_DECODE_DIM / Math.max(video.videoWidth, video.videoHeight));
      const w = Math.max(1, Math.round(video.videoWidth * scale));
      const h = Math.max(1, Math.round(video.videoHeight * scale));
      canvas.width = w;
      canvas.height = h;

      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (ctx) {
        ctx.drawImage(video, 0, 0, w, h);
        const imageData = ctx.getImageData(0, 0, w, h);
        const code = jsQR(imageData.data, w, h, { inversionAttempts: "dontInvert" });

        if (code?.data && !busyRef.current) {
          // Cheap structural check first: a supermarket barcode or a Wi-Fi QR
          // shouldn't cost a network round trip.
          if (!looksLikeSwachhSaathiQr(code.data)) {
            busyRef.current = true;
            stopCamera();
            setCitizen(null);
            setScannedCitizen(null);
            setInvalidReason("malformed");
            setState("invalid");
            return;
          }

          busyRef.current = true;
          stopCamera();
          void resolveScannedCitizen(code.data);
          return;
        }
      }
    }

    rafRef.current = requestAnimationFrame(tick);
  }

  async function startCamera() {
    setState("requesting");
    busyRef.current = false;

    if (!navigator.mediaDevices?.getUserMedia) {
      setState("unavailable");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      });
      streamRef.current = stream;

      const video = videoRef.current;
      if (video) {
        video.srcObject = stream;
        await video.play().catch(() => {
          /* some browsers reject play() if the user navigated away mid-await */
        });
      }

      setState("scanning");
      rafRef.current = requestAnimationFrame(tick);
    } catch (err) {
      stopCamera();
      const name = err instanceof DOMException ? err.name : "";
      if (name === "NotAllowedError" || name === "SecurityError") {
        setState("denied");
      } else if (name === "NotFoundError" || name === "OverconstrainedError") {
        setState("unavailable");
      } else {
        setState("error");
      }
    }
  }

  function reset() {
    stopCamera();
    busyRef.current = false;
    setCitizen(null);
    setScannedCitizen(null);
    setState("idle");
  }

  const invalidCopy = INVALID_COPY[invalidReason] ?? INVALID_COPY.malformed;

  return (
    <div className="mx-auto max-w-md">
      <PageHeader title="Scan Citizen" description="Point the operator camera at the citizen's QR code" />
      <Card>
        <CardContent className="flex flex-col items-center gap-4 p-6">
          <div className="relative flex h-64 w-64 items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-brand-border bg-black">
            <video
              ref={videoRef}
              muted
              playsInline
              className={state === "scanning" ? "h-full w-full object-cover" : "hidden"}
            />
            <canvas ref={canvasRef} className="hidden" />

            {state === "scanning" && (
              <div className="pointer-events-none absolute inset-6 rounded-xl border-2 border-white/80" />
            )}
            {state === "idle" && <Camera className="h-14 w-14 text-brand-muted-fg" />}
            {state === "requesting" && <ScanLine className="h-14 w-14 animate-pulse text-brand-muted-fg" />}
            {state === "resolving" && <Loader2 className="h-14 w-14 animate-spin text-brand-muted-fg" />}
            {state === "found" && <CheckCircle2 className="h-14 w-14 text-brand-primary" />}
            {state === "invalid" && <ShieldAlert className="h-14 w-14 text-brand-danger" />}
            {(state === "denied" || state === "unavailable" || state === "error") && (
              <VideoOff className="h-14 w-14 text-brand-muted-fg" />
            )}
          </div>

          {state === "idle" && (
            <Button onClick={startCamera} className="w-full">
              <Camera className="h-4 w-4" /> Turn on camera to scan
            </Button>
          )}

          {state === "requesting" && (
            <p className="text-xs text-brand-muted-fg">Waiting for camera permission…</p>
          )}

          {state === "resolving" && (
            <p className="text-xs text-brand-muted-fg">Verifying code with the server…</p>
          )}

          {state === "scanning" && (
            <div className="w-full space-y-2 text-center">
              <p className="text-xs text-brand-muted-fg">Hold the QR code inside the frame</p>
              <Button variant="outline" size="sm" onClick={reset} className="w-full">
                Cancel
              </Button>
            </div>
          )}

          {state === "denied" && (
            <ErrorState
              title="Camera permission denied"
              description="Enable camera access for this site in your browser or phone settings, then try again."
              onRetry={startCamera}
            />
          )}

          {state === "unavailable" && (
            <ErrorState
              title="No camera available"
              description="This device has no usable camera, or the browser doesn't support camera access here (it requires HTTPS or localhost)."
              onRetry={startCamera}
            />
          )}

          {state === "error" && (
            <ErrorState
              title="Couldn't complete the scan"
              description="The camera stream or the verification request was interrupted. Try again."
              onRetry={startCamera}
            />
          )}

          {state === "found" && citizen && (
            <div className="w-full space-y-3">
              <div className="flex items-center justify-center gap-2">
                <TruthBadge value="REAL" />
                <span className="text-[11px] text-brand-muted-fg">verified · resolved from database</span>
              </div>
              <div className="rounded-xl bg-brand-primary-light p-3 text-center">
                <p className="text-sm font-semibold text-brand-primary-dark">{citizen.name}</p>
                <p className="text-xs text-brand-primary-dark/70">
                  {citizen.locality} · Tier {citizen.tier} · {citizen.pointsBalance} pts
                </p>
              </div>
              <Button asChild className="w-full">
                <Link href="/municipal/disposal">Continue to active disposal</Link>
              </Button>
              <Button variant="outline" size="sm" onClick={reset} className="w-full">
                Scan another
              </Button>
            </div>
          )}

          {state === "invalid" && (
            <div className="w-full space-y-3">
              <ErrorState
                title={invalidCopy.title}
                description={invalidCopy.description}
                onRetry={startCamera}
              />
              <Button variant="outline" size="sm" onClick={reset} className="w-full">
                Cancel
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
