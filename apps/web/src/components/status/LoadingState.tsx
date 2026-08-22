import { cn } from "@/lib/utils";

interface LoadingStateProps {
  className?: string;
  rows?: number;
  type?: "card" | "list" | "table";
}

export function LoadingState({ className, rows = 3, type = "card" }: LoadingStateProps) {
  return (
    <div className={cn("animate-pulse space-y-3", className)} role="status" aria-label="Loading">
      <span className="sr-only">Loading...</span>
      {type === "card" &&
        Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="rounded-lg bg-slate-200 p-4 space-y-3">
            <div className="h-4 bg-slate-300 rounded w-3/4" />
            <div className="h-3 bg-slate-300 rounded w-1/2" />
            <div className="h-3 bg-slate-300 rounded w-2/3" />
          </div>
        ))}
      {type === "list" &&
        Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-3">
            <div className="h-10 w-10 rounded-full bg-slate-300" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-slate-300 rounded w-1/3" />
              <div className="h-3 bg-slate-300 rounded w-2/3" />
            </div>
          </div>
        ))}
      {type === "table" &&
        Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex gap-4 p-3">
            <div className="h-4 bg-slate-300 rounded flex-1" />
            <div className="h-4 bg-slate-300 rounded w-1/4" />
            <div className="h-4 bg-slate-300 rounded w-1/6" />
          </div>
        ))}
    </div>
  );
}
