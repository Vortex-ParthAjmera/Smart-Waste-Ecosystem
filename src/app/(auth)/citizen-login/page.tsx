"use client";

import { Suspense, useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, ArrowLeft, ArrowRight, User, Lock, Eye, EyeOff } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function CitizenLoginPage() {
  return (
    <Suspense fallback={null}>
      <CitizenLoginForm />
    </Suspense>
  );
}

function CitizenLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/citizen";
  const message = searchParams.get("message");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState<"google" | "credentials" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = username.trim().length > 0 && password.length > 0;

  async function submitCredentials(e: FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setError(null); setLoading("credentials");

    const supabase = createClient();
    const { data: email, error: lookupError } = await supabase.rpc("get_email_for_username", { uname: username.trim().toLowerCase() });

    if (lookupError || !email) {
      setError("Incorrect username or password.");
      setLoading(null); return;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) { setError("Incorrect username or password."); setLoading(null); return; }

    router.push(next); router.refresh();
  }

  async function submitGoogle() {
    setError(null); setLoading("google");
    const supabase = createClient();
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}` },
    });
    if (oauthError) { setError("Could not start Google sign-in."); setLoading(null); }
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-950 px-6 py-12">
      <Image src="/login-bg.jpg" alt="" fill priority className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/55 to-slate-950/85" />
      <div className="absolute inset-0 bg-gradient-to-tr from-brand-primary-dark/40 via-transparent to-transparent" />

      <Link href="/" className="relative z-10 mb-6 flex items-center gap-1.5 self-start text-xs font-medium text-white/70 hover:text-white">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to workspaces
      </Link>

      <div className="relative z-10 mb-6 flex flex-col items-center gap-2 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 p-1.5 shadow-xl ring-1 ring-white/25 backdrop-blur-sm">
          <Image src="/logo-emblem.png" alt="Swachh Saathi" width={64} height={64} className="h-full w-full object-contain" />
        </div>
        <p className="text-lg font-semibold text-white">Swachh Saathi</p>
        <p className="text-xs text-white/60">Citizen sign-in</p>
      </div>

      <div className="relative z-10 w-full max-w-sm rounded-3xl border border-white/20 bg-white/10 p-6 shadow-2xl shadow-black/40 backdrop-blur-xl">
        {message === "check_email" && (
          <div className="mb-4 rounded-xl bg-brand-primary/20 px-3 py-2 text-xs text-white">
            Check your email to confirm your account, then sign in here.
          </div>
        )}

        <button type="button" onClick={submitGoogle} disabled={loading !== null}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/25 bg-white py-2.5 text-sm font-semibold text-slate-800 shadow-lg transition hover:bg-white/90 disabled:opacity-60">
          {loading === "google" ? <Loader2 className="h-4 w-4 animate-spin" /> : <GoogleIcon className="h-4 w-4" />}
          Continue with Google
        </button>

        <div className="my-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-white/20" />
          <span className="text-[10px] font-medium uppercase tracking-wide text-white/40">or</span>
          <div className="h-px flex-1 bg-white/20" />
        </div>

        <form onSubmit={submitCredentials} className="space-y-3.5">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-white/80">Username</label>
            <div className="relative">
              <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
              <input value={username} onChange={(e) => setUsername(e.target.value)} type="text" placeholder="your_username" autoComplete="username"
                className="w-full rounded-xl border border-white/25 bg-white/10 py-2.5 pl-10 pr-3 text-sm text-white placeholder:text-white/40 outline-none transition focus:border-white/60 focus:bg-white/15" />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-white/80">Password</label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
              <input value={password} onChange={(e) => setPassword(e.target.value)} type={showPassword ? "text" : "password"}
                placeholder="Enter your password" autoComplete="current-password"
                className="w-full rounded-xl border border-white/25 bg-white/10 py-2.5 pl-10 pr-10 text-sm text-white placeholder:text-white/40 outline-none transition focus:border-white/60 focus:bg-white/15" />
              <button type="button" onClick={() => setShowPassword((s) => !s)} aria-label={showPassword ? "Hide" : "Show"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/80">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {error && <p className="text-xs font-medium text-red-300">{error}</p>}

          <button type="submit" disabled={!canSubmit || loading !== null}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-primary py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-emerald-600 disabled:opacity-50">
            {loading === "credentials" ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Sign in <ArrowRight className="h-4 w-4" /></>}
          </button>
        </form>

        <p className="mt-4 text-center text-[11px] text-white/50">
          New here?{" "}
          <Link href="/citizen-register" className="font-medium text-white/80 underline underline-offset-2">Create an account</Link>
        </p>
      </div>
    </div>
  );
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.85A11 11 0 0 0 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.43.34-2.09V7.06H2.18A11 11 0 0 0 1 12c0 1.77.43 3.45 1.18 4.94l3.66-2.85z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1a11 11 0 0 0-9.82 6.06l3.66 2.85C6.71 7.31 9.14 5.38 12 5.38z" fill="#EA4335"/>
    </svg>
  );
}
