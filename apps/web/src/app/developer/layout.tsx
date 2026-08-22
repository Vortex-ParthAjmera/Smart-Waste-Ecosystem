import { DeveloperNav } from "@/components/developer/DeveloperNav";
import { TerminalSquare } from "lucide-react";

export default function DeveloperLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 pb-16 text-slate-100">
      <header className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
        <div className="flex items-center gap-2">
          <TerminalSquare className="h-5 w-5 text-amber-400" />
          <div>
            <p className="text-sm font-semibold text-slate-100">Developer / IoT Console</p>
            <p className="text-[10px] text-slate-500">Restricted access · System-Admin session</p>
          </div>
        </div>
        <span className="rounded-full border border-slate-700 bg-slate-800 px-2.5 py-0.5 text-[10px] font-medium text-slate-300">
          UI & Device Simulation
        </span>
      </header>
      <div className="flex flex-col lg:flex-row">
        <DeveloperNav />
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
