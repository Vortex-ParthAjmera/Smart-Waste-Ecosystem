"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Suspense } from "react";

export default function MunicipalLoginPage() {
  return (
    <Suspense fallback={null}>
      <MunicipalLoginForm />
    </Suspense>
  );
}

function MunicipalLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/municipal/scan";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function continueWithGoogle() {
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
    if (oauthError) {
      setError("Could not start Google sign-in. Try again.");
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-950 px-6 py-12">
      <Image src="/login-bg.jpg" alt="" fill priority className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/55 to-slate-950/85" />
      <div className="absolute inset-0 bg-gradient-to-tr from-brand-primary-dark/40 via-transparent to-transparent" />

      <Link
        href="/"
        className="relative z-10 mb-6 flex items-center gap-1.5 self-start text-xs font-medium text-white/70 hover:text-white"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to workspaces
      </Link>

      <div className="relative z-10 mb-6 flex flex-col items-center gap-2 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 p-1.5 shadow-xl ring-1 ring-white/25 backdrop-blur-sm">
          <Image src="/logo-emblem.png" alt="Swachh Saathi" width={64} height={64} className="h-full w-full object-contain" />
        </div>
        <p className="text-lg font-semibold text-white">Municipal Operations</p>
        <p className="text-xs text-white/60">Sign in with your municipal Google account</p>
      </div>

      <div className="relative z-10 w-full max-w-sm rounded-3xl border border-white/20 bg-white/10 p-6 shadow-2xl shadow-black/40 backdrop-blur-xl">
        {loading ? (
          <div className="flex flex-col items-center gap-2 py-4">
            <Loader2 className="h-6 w-6 animate-spin text-emerald-300" />
            <p className="text-xs text-white/60">Redirecting to Google…</p>
          </div>
        ) : (
          <>
            <button
              onClick={continueWithGoogle}
              className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-white/25 bg-white py-2.5 text-sm font-semibold text-slate-800 shadow-lg transition hover:bg-slate-50"
            >
              <GoogleIcon className="h-4 w-4" />
              Continue with Google
            </button>
            {error && <p className="mt-3 text-center text-xs font-medium text-red-300">{error}</p>}
          </>
        )}
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
