"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft, ArrowRight, User, Lock, Mail, MapPin, Eye, EyeOff, Navigation } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const SYNTHETIC_EMAIL_DOMAIN = "users.smart-waste.local";

export default function CitizenRegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [locality, setLocality] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = username.trim().length >= 3 && password.length >= 6;

  async function detectLocality() {
    if (!navigator.geolocation) { setError("Geolocation not supported."); return; }
    setGpsLoading(true); setError(null);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
          const data = await res.json();
          const parts = [
            data.address?.suburb || data.address?.neighbourhood || data.address?.village,
            data.address?.city || data.address?.town || data.address?.county,
          ].filter(Boolean);
          setLocality(parts.join(", ") || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        } catch { setError("Could not look up location."); }
        finally { setGpsLoading(false); }
      },
      () => { setError("Location access denied. Enter manually."); setGpsLoading(false); }
    );
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setError(null); setLoading(true);

    const supabase = createClient();
    const normalizedUsername = username.trim().toLowerCase();
    const authEmail = email.trim() || `${normalizedUsername}@${SYNTHETIC_EMAIL_DOMAIN}`;

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: authEmail,
      password,
      options: {
        data: {
          username: normalizedUsername,
          full_name: name.trim() || normalizedUsername,
          locality: locality.trim(),
        },
      },
    });

    if (signUpError) {
      setError(signUpError.message.includes("already registered")
        ? "That username or email is already registered."
        : signUpError.message);
      setLoading(false);
      return;
    }

    // If no session returned, email confirmation is required
    if (!data.session) {
      router.push("/citizen-login?message=check_email");
      return;
    }

    router.push("/citizen");
    router.refresh();
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-950 px-6 py-12">
      <Image src="/login-bg.jpg" alt="" fill priority className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/55 to-slate-950/85" />
      <div className="absolute inset-0 bg-gradient-to-tr from-brand-primary-dark/40 via-transparent to-transparent" />

      <Link href="/citizen-login" className="relative z-10 mb-6 flex items-center gap-1.5 self-start text-xs font-medium text-white/70 hover:text-white">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to sign in
      </Link>

      <div className="relative z-10 mb-6 flex flex-col items-center gap-2 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 p-1.5 shadow-xl ring-1 ring-white/25 backdrop-blur-sm">
          <Image src="/logo-emblem.png" alt="Swachh Saathi" width={64} height={64} className="h-full w-full object-contain" />
        </div>
        <p className="text-lg font-semibold text-white">Swachh Saathi</p>
        <p className="text-xs text-white/60">Create your citizen account</p>
      </div>

      <div className="relative z-10 w-full max-w-sm rounded-3xl border border-white/20 bg-white/10 p-6 shadow-2xl shadow-black/40 backdrop-blur-xl">
        <form onSubmit={submit} className="space-y-3.5">
          {[
            { label: "Your name", value: name, setValue: setName, placeholder: "e.g. Rahul Singh", autoComplete: "name" },
            { label: "Username", value: username, setValue: setUsername, placeholder: "min. 3 characters", autoComplete: "username", mono: true },
          ].map(({ label, value, setValue, placeholder, autoComplete, mono }) => (
            <div key={label}>
              <label className="mb-1.5 block text-xs font-medium text-white/80">{label}</label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
                <input value={value} onChange={(e) => setValue(e.target.value)} placeholder={placeholder} autoComplete={autoComplete}
                  className={`w-full rounded-xl border border-white/25 bg-white/10 py-2.5 pl-10 pr-3 text-sm text-white placeholder:text-white/40 outline-none transition focus:border-white/60 focus:bg-white/15 ${mono ? "font-mono" : ""}`} />
              </div>
            </div>
          ))}

          <div>
            <label className="mb-1.5 block text-xs font-medium text-white/80">Email <span className="text-white/40">(optional — for account recovery)</span></label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="you@example.com" autoComplete="email"
                className="w-full rounded-xl border border-white/25 bg-white/10 py-2.5 pl-10 pr-3 text-sm text-white placeholder:text-white/40 outline-none transition focus:border-white/60 focus:bg-white/15" />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-white/80">Locality / Ward <span className="text-white/40">(optional)</span></label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
                <input value={locality} onChange={(e) => setLocality(e.target.value)} placeholder="e.g. Indore, Ward 12"
                  className="w-full rounded-xl border border-white/25 bg-white/10 py-2.5 pl-10 pr-3 text-sm text-white placeholder:text-white/40 outline-none transition focus:border-white/60 focus:bg-white/15" />
              </div>
              <button type="button" onClick={detectLocality} disabled={gpsLoading} title="Detect from GPS"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/25 bg-white/10 text-white/70 transition hover:bg-white/20 disabled:opacity-50">
                {gpsLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Navigation className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-white/80">Password</label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
              <input value={password} onChange={(e) => setPassword(e.target.value)} type={showPassword ? "text" : "password"}
                placeholder="At least 6 characters" autoComplete="new-password"
                className="w-full rounded-xl border border-white/25 bg-white/10 py-2.5 pl-10 pr-10 text-sm text-white placeholder:text-white/40 outline-none transition focus:border-white/60 focus:bg-white/15" />
              <button type="button" onClick={() => setShowPassword((s) => !s)} aria-label={showPassword ? "Hide" : "Show"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/80">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {error && <p className="text-xs font-medium text-red-300">{error}</p>}

          <button type="submit" disabled={!canSubmit || loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-primary py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-emerald-600 disabled:opacity-50">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Create account <ArrowRight className="h-4 w-4" /></>}
          </button>
        </form>
      </div>
    </div>
  );
}
