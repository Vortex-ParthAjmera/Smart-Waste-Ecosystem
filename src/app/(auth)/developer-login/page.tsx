"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, ShieldCheck, ArrowLeft, User, Lock } from "lucide-react";

export default function DeveloperLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");

  function signIn() {
    setLoading(true);
    setTimeout(() => router.push("/developer/health"), 1600);
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-950 px-6 py-12">
      <Image src="/login-bg.jpg" alt="" fill priority className="object-cover opacity-80" />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-950/75 to-slate-950/95" />
      <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/60 via-transparent to-transparent" />

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
        <p className="text-lg font-semibold text-white">Developer / IoT Console</p>
        <p className="flex items-center gap-1 text-xs text-white/60">
          <ShieldCheck className="h-3 w-3" /> Restricted - Developer / System-Admin only
        </p>
      </div>

      <div className="relative z-10 w-full max-w-sm rounded-3xl border border-white/20 bg-white/10 p-6 shadow-2xl shadow-black/40 backdrop-blur-xl">
        {loading ? (
          <div className="flex flex-col items-center gap-2 py-4">
            <Loader2 className="h-6 w-6 animate-spin text-emerald-300" />
            <p className="text-xs text-white/60">Checking role…</p>
          </div>
        ) : (
          <div className="space-y-3.5">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-white/80">Username</label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
                <input
                  value={user}
                  onChange={(e) => setUser(e.target.value)}
                  placeholder="Username"
                  className="w-full rounded-xl border border-white/25 bg-white/10 py-2.5 pl-10 pr-3 text-sm text-white placeholder:text-white/40 outline-none transition focus:border-white/60 focus:bg-white/15"
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-white/80">Password</label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
                <input
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  type="password"
                  placeholder="Password"
                  className="w-full rounded-xl border border-white/25 bg-white/10 py-2.5 pl-10 pr-3 text-sm text-white placeholder:text-white/40 outline-none transition focus:border-white/60 focus:bg-white/15"
                />
              </div>
            </div>
            <button
              onClick={signIn}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-800 py-2.5 text-sm font-semibold text-white shadow-lg shadow-black/30 ring-1 ring-white/10 transition hover:bg-slate-700"
            >
              Sign in
            </button>
            <p className="text-[11px] text-white/50">
              Any credentials succeed after a short delay in this UI-only demo.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
