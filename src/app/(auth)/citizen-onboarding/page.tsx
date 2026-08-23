"use client";

import { useState, type FormEvent, Suspense } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, ArrowRight, MapPin, Navigation } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function CitizenOnboardingPage() {
  return (
    <Suspense fallback={null}>
      <OnboardingForm />
    </Suspense>
  );
}

function OnboardingForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/citizen";

  const [locality, setLocality] = useState("");
  const [loading, setLoading] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function detectLocality() {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }
    setGpsLoading(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await res.json();
          const parts = [
            data.address?.suburb || data.address?.neighbourhood || data.address?.village,
            data.address?.city || data.address?.town || data.address?.county,
          ].filter(Boolean);
          setLocality(parts.join(", ") || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        } catch {
          setError("Could not look up your location. Enter it manually.");
        } finally {
          setGpsLoading(false);
        }
      },
      () => {
        setError("Location access was denied. Enter your locality manually.");
        setGpsLoading(false);
      }
    );
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/citizen-login"); return; }

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ locality: locality.trim() || "Not specified" })
      .eq("id", user.id);

    if (updateError) {
      setError("Could not save. Try again.");
      setLoading(false);
      return;
    }

    router.push(next);
    router.refresh();
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-950 px-6 py-12">
      <Image src="/login-bg.jpg" alt="" fill priority className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/55 to-slate-950/85" />

      <div className="relative z-10 mb-6 flex flex-col items-center gap-2 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 p-1.5 shadow-xl ring-1 ring-white/25 backdrop-blur-sm">
          <Image src="/logo-emblem.png" alt="Swachh Saathi" width={64} height={64} className="h-full w-full object-contain" />
        </div>
        <p className="text-lg font-semibold text-white">One last step</p>
        <p className="text-xs text-white/60">Tell us your locality so we can connect you to your ward</p>
      </div>

      <div className="relative z-10 w-full max-w-sm rounded-3xl border border-white/20 bg-white/10 p-6 shadow-2xl shadow-black/40 backdrop-blur-xl">
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-white/80">
              Your locality / ward
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
                <input
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                  placeholder="e.g. Indore, Ward 12"
                  className="w-full rounded-xl border border-white/25 bg-white/10 py-2.5 pl-10 pr-3 text-sm text-white placeholder:text-white/40 outline-none transition focus:border-white/60 focus:bg-white/15"
                />
              </div>
              <button
                type="button"
                onClick={detectLocality}
                disabled={gpsLoading}
                title="Detect my location"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/25 bg-white/10 text-white/70 transition hover:bg-white/20 disabled:opacity-50"
              >
                {gpsLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Navigation className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {error && <p className="text-xs font-medium text-red-300">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-primary py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-primary/30 transition hover:bg-emerald-600 disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Continue <ArrowRight className="h-4 w-4" /></>}
          </button>

          <button
            type="button"
            onClick={() => { router.push(next); }}
            className="w-full text-center text-[11px] text-white/40 hover:text-white/60"
          >
            Skip for now
          </button>
        </form>
      </div>
    </div>
  );
}
