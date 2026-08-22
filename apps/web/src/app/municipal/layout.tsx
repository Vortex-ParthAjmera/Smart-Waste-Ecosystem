import { MunicipalNav } from "@/components/municipal/MunicipalNav";
import { Building2 } from "lucide-react";

export default function MunicipalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background pb-16">
      <header className="flex items-center justify-between border-b border-brand-border bg-brand-surface px-4 py-3">
        <div className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-brand-primary" />
          <div>
            <p className="text-sm font-semibold text-foreground">Municipal Operations</p>
            <p className="text-[10px] text-brand-muted-fg">Indore Municipal Corporation</p>
          </div>
        </div>
        <span className="rounded-full bg-brand-primary-light px-2.5 py-0.5 text-[10px] font-semibold text-brand-primary-dark">Municipal Staff</span>
      </header>
      <div className="flex flex-col lg:flex-row">
        <MunicipalNav />
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
