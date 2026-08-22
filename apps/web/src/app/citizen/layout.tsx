import { CitizenNav } from "@/components/citizen/CitizenNav";
import { Leaf } from "lucide-react";

export default function CitizenLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto min-h-screen max-w-md bg-background pb-32">
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-brand-border bg-brand-primary px-4 py-3 text-white">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15">
            <Leaf className="h-4 w-4" />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold">Swachh Saathi</p>
            <p className="text-[10px] text-white/70">Indore Municipal Corporation</p>
          </div>
        </div>
        <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-medium">Citizen</span>
      </header>
      <main className="px-4 py-4">{children}</main>
      <CitizenNav />
    </div>
  );
}
