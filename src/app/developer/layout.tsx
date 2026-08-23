import Image from "next/image";
import { DeveloperNav } from "@/components/developer/DeveloperNav";

export default function DeveloperLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen pb-16 text-slate-100">
      <div
        aria-hidden
        className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/waste-bins-bg.jpg')" }}
      />
      <div aria-hidden className="fixed inset-0 -z-10 bg-slate-950/90" />
      <header className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
        <div className="flex items-center gap-2">
          <Image src="/logo-emblem.png" alt="Swachh Saathi" width={28} height={28} className="h-7 w-7 object-contain" />
          <div>
            <p className="text-sm font-semibold">Developer / IoT Console</p>
            <p className="text-[10px] text-slate-500">Restricted access · System-Admin session</p>
          </div>
        </div>
        <span className="rounded-full border border-slate-700 bg-slate-800 px-2 py-0.5 text-[10px] font-medium text-slate-300">
          UI-only pass
        </span>
      </header>
      <div className="flex flex-col lg:flex-row">
        <DeveloperNav />
        <main className="flex-1 p-4">{children}</main>
      </div>
    </div>
  );
}
