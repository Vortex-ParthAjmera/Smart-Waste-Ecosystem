import { CitizenNav } from "@/components/citizen/CitizenNav";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Leaf } from "lucide-react";

export default function CitizenLayout({ children }: { children: React.ReactNode }) {
  return (
    // max-w-md keeps the phone-app feel on mobile; md/lg widen it in stages
    // for tablet and laptop instead of staying pinned to a 448px column.
    <div className="min-h-screen bg-brand-surface-muted md:bg-background">
      <div className="mx-auto min-h-screen max-w-md bg-background pb-32 md:max-w-2xl md:shadow-xl lg:max-w-4xl">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-brand-border bg-brand-primary px-4 py-3 text-white md:px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15">
              <Leaf className="h-4 w-4" />
            </div>
            <div className="leading-tight">
              <p className="text-sm font-semibold">Swachh Saathi</p>
              <p className="text-[10px] text-white/70">Indore Municipal Corporation</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-medium">Citizen</span>
            <ThemeToggle />
          </div>
        </header>
        <main className="px-4 py-4 md:px-6 lg:px-8">{children}</main>
        <CitizenNav />
      </div>
    </div>
  );
}
