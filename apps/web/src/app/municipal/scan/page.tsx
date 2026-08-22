"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import jsQR from "jsqr";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/StateViews";
import { TruthBadge } from "@/components/TruthBadge";
import { Camera, CheckCircle2, ScanLine, VideoOff } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import type { Citizen } from "@/lib/mock/types";

type ScanState =
  | "idle" // camera not requested yet
  | "requesting" // getUserMedia permission prompt is in flight
  | "scanning" // camera live, decoding frames
  | "found" // a QR code was decoded
  | "denied" // permission was refused
  | "unavailable" // no camera on this device, or API unsupported
  | "error"; // camera opened but something else went wrong

const QR_PREFIX = "smartwaste://citizen/";
// Downscale each frame before handing it to the decoder — keeps getImageData
// fast enough to run every animation frame on a mid-range phone.
const MAX_DECODE_DIM = 480;

export default function ScanCitizenPage() {
  const [state, setState] = useState<ScanState>("idle");
  const [citizen, setCitizen] = useState<Citizen | null>(null);
  const [unrecognizedCode, setUnrecognizedCode] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);

  const stopCamera = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }, []);

  // Always release the camera when the operator navigates away.
  useEffect(() => stopCamera, [stopCamera]);

  function resolveScannedCitizen(decodedText: string) {
    if (decodedText.startsWith(QR_PREFIX)) {
      const id = decodedText.slice(QR_PREFIX.length);
      const match = apiClient.getCitizenById(id);
      if (match) {
        setUnrecognizedCode(false);
        setCitizen(match);
        return;
      }
    }
    // Not a Smart Waste citizen code (or an ID we don't have on file) — fall
    // back to the demo citizen so the rest of the flow still has someone to
    // show, but say so plainly rather than pretending it matched.
    setUnrecognizedCode(true);
    setCitizen(apiClient.getDemoCitizen());
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
        if (code && code.data) {
          stopCamera();
          resolveScannedCitizen(code.data);
          setState("found");
          return;
        }
      }
    }
    rafRef.current = requestAnimationFrame(tick);
  }

  async function startCamera() {
    setState("requesting");

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
    setCitizen(null);
    setUnrecognizedCode(false);
    setState("idle");
  }

  return (
    <div className="mx-auto max-w-md lg:max-w-3xl">
      <PageHeader title="Scan Citizen" description="Point the operator camera at the citizen's QR code" />
      <Card>
        <CardContent className="flex flex-col items-center gap-4 p-6 lg:flex-row lg:items-start lg:gap-8 lg:p-8">
          <div className="relative flex h-64 w-64 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-brand-border bg-black lg:h-72 lg:w-72">
            {/* Video element stays mounted (just hidden) whenever we're not
                actively scanning, so the ref is always attached by the time
                startCamera() runs. */}
            <video
              ref={videoRef}
              muted
              playsInline
              className={
                state === "scanning" ? "h-full w-full object-cover" : "hidden"
              }
            />
            <canvas ref={canvasRef} className="hidden" />

            {state === "scanning" && (
              <div className="pointer-events-none absolute inset-6 rounded-xl border-2 border-white/80" />
            )}
            {state === "idle" && <Camera className="h-14 w-14 text-brand-muted-fg" />}
            {state === "requesting" && <ScanLine className="h-14 w-14 animate-pulse text-brand-muted-fg" />}
            {state === "found" && <CheckCircle2 className="h-14 w-14 text-brand-primary" />}
            {(state === "denied" || state === "unavailable" || state === "error") && (
              <VideoOff className="h-14 w-14 text-brand-muted-fg" />
            )}
          </div>

          <div className="flex w-full flex-col items-center gap-4 lg:flex-1 lg:items-stretch lg:justify-center lg:gap-4 lg:self-stretch">
            {state === "idle" && (
              <Button onClick={startCamera} className="w-full lg:max-w-xs">
                <Camera className="h-4 w-4" /> Turn on camera to scan
              </Button>
            )}

            {state === "requesting" && (
              <p className="text-xs text-brand-muted-fg lg:text-left">Waiting for camera permission…</p>
            )}

            {state === "scanning" && (
              <div className="w-full space-y-2 text-center lg:max-w-xs lg:text-left">
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
                title="Couldn't open the camera"
                description="Something interrupted the camera stream. Try again."
                onRetry={startCamera}
              />
            )}

            {state === "found" && citizen && (
              <div className="w-full space-y-3 lg:max-w-xs">
                <div className="flex items-center justify-center gap-2 lg:justify-start">
                  <TruthBadge value="REAL" />
                  <span className="text-[11px] text-brand-muted-fg">decoded from live camera</span>
                </div>
                {unrecognizedCode && (
                  <p className="text-center text-[11px] text-brand-muted-fg lg:text-left">
                    That code isn&apos;t a recognized Smart Waste ID — showing the demo citizen for this preview.
                  </p>
                )}
                <div className="rounded-xl bg-brand-primary-light p-3 text-center lg:text-left">
                  <p className="text-sm font-semibold text-brand-primary-dark">{citizen.name}</p>
                  <p className="text-xs text-brand-primary-dark/70">{citizen.locality} · Tier {citizen.tier}</p>
                </div>
                <Button asChild className="w-full">
                  <Link href="/municipal/disposal">Continue to active disposal</Link>
                </Button>
                <Button variant="outline" size="sm" onClick={reset} className="w-full">
                  Scan another
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
