import { WifiOff, Inbox, AlertOctagon, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function LoadingSkeleton({ rows = 3, className }: { rows?: number; className?: string }) {
  return (
    <div className={cn("space-y-3", className)} role="status" aria-label="Loading">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-16 w-full animate-pulse rounded-xl bg-brand-surface-muted" />
      ))}
    </div>
  );
}

export function EmptyState({
  title,
  description,
  icon: Icon = Inbox,
}: {
  title: string;
  description?: string;
  icon?: React.ElementType;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-brand-border px-6 py-10 text-center">
      <Icon className="h-6 w-6 text-brand-muted-fg" aria-hidden />
      <p className="text-sm font-medium text-foreground">{title}</p>
      {description && <p className="max-w-xs text-xs text-brand-muted-fg">{description}</p>}
    </div>
  );
}

export function ErrorState({
  title = "Something went wrong",
  description = "This screen could not load data. Try again.",
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-brand-danger-light bg-brand-danger-light/40 px-6 py-10 text-center">
      <AlertOctagon className="h-6 w-6 text-brand-danger" aria-hidden />
      <p className="text-sm font-medium text-brand-danger">{title}</p>
      <p className="max-w-xs text-xs text-brand-muted-fg">{description}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} className="mt-2">
          <RefreshCw className="h-3.5 w-3.5" /> Retry
        </Button>
      )}
    </div>
  );
}

export function OfflineBanner({ message }: { message?: string }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-brand-warning bg-brand-warning-light px-3 py-2 text-xs font-medium text-brand-warning">
      <WifiOff className="h-4 w-4 shrink-0" aria-hidden />
      <span>{message ?? "Connection is stale. Showing the last data received; retrying in the background."}</span>
    </div>
  );
}
