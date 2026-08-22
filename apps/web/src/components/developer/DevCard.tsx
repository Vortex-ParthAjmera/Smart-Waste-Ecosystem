import { cn } from "@/lib/utils";

export function DevCard({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("rounded-xl border border-slate-800 bg-slate-900/60 p-4", className)}
      {...props}
    />
  );
}

export function DevSectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">{children}</p>;
}
