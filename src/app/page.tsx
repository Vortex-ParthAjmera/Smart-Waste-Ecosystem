import Link from "next/link";
import Image from "next/image";
import { Leaf, Building2, TerminalSquare, ChevronRight, Recycle } from "lucide-react";

const LOGO_SRC = "/logo-emblem.png";

const ROLES = [
  {
    href: "/citizen-login",
    label: "Citizen",
    description: "Track disposals, EcoCredits, badges, and your segregation history.",
    icon: Leaf,
    accent: "bg-brand-primary text-white",
  },
  {
    href: "/municipal-login",
    label: "Municipal Staff",
    description: "Scan citizens, monitor live disposals, review disputes, audit history.",
    icon: Building2,
    accent: "bg-brand-primary-dark text-white",
  },
  {
    href: "/developer-login",
    label: "Developer / IoT",
    description: "System health, device telemetry, ML monitor, and test-event injection.",
    icon: TerminalSquare,
    accent: "bg-slate-800 text-white",
  },
];

export default function RolePickerPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950">
      <Image src="/login-bg.jpg" alt="" fill priority className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/55 to-slate-950/85" />
      <div className="absolute inset-0 bg-gradient-to-tr from-brand-primary-dark/40 via-transparent to-transparent" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-md flex-col justify-center gap-6 px-6 py-12">
        <div className="text-center">
          <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 p-2 shadow-xl ring-1 ring-white/25 backdrop-blur-sm">
            <Image src={LOGO_SRC} alt="Swachh Saathi" width={80} height={80} priority className="h-full w-full object-contain" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">Swachh Saathi</h1>
          <p className="mt-1 flex items-center justify-center gap-1.5 text-xs font-medium uppercase tracking-[0.2em] text-emerald-200/80">
            <Recycle className="h-3.5 w-3.5" /> Smart Waste Management Platform
          </p>
          <p className="mt-3 text-sm text-white/70">Choose your workspace to continue</p>
        </div>

        <div className="space-y-3">
          {ROLES.map((r) => {
            const Icon = r.icon;
            return (
              <Link
                key={r.href}
                href={r.href}
                className="group flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 p-4 shadow-xl shadow-black/20 backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/15"
              >
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${r.accent}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">{r.label}</p>
                  <p className="text-xs text-white/60">{r.description}</p>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-white/50 transition group-hover:translate-x-0.5 group-hover:text-white" />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
