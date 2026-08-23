import { CheckCircle2, AlertTriangle, XCircle, HelpCircle, MinusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { ComponentHealth } from "@/lib/mock/types";

const CONFIG: Record<ComponentHealth, { icon: React.ElementType; classes: string }> = {
  OK: { icon: CheckCircle2, classes: "bg-brand-primary-light text-brand-primary-dark" },
  DEGRADED: { icon: AlertTriangle, classes: "bg-brand-warning-light text-brand-warning" },
  MISSING: { icon: MinusCircle, classes: "bg-brand-surface-muted text-brand-muted-fg" },
  FAILED: { icon: XCircle, classes: "bg-brand-danger-light text-brand-danger" },
  UNKNOWN: { icon: HelpCircle, classes: "bg-brand-surface-muted text-brand-muted-fg" },
};

export function StatusPill({ status, label, className }: { status: ComponentHealth; label?: string; className?: string }) {
  const c = CONFIG[status];
  const Icon = c.icon;
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold", c.classes, className)}>
      <Icon className="h-3 w-3" aria-hidden />
      {label ?? status}
    </span>
  );
}
