import { CheckCircle2, History, FlaskConical, FileClock } from "lucide-react";
import { cn } from "@/lib/utils";
import { TruthBadgeValue } from "@/lib/mock/types";

const CONFIG: Record<
  TruthBadgeValue,
  { label: string; icon: React.ElementType; classes: string }
> = {
  REAL: {
    label: "REAL",
    icon: CheckCircle2,
    classes: "bg-brand-primary-light text-brand-primary-dark",
  },
  RECORDED: {
    label: "RECORDED",
    icon: History,
    classes: "bg-brand-wet-light text-brand-wet",
  },
  SIMULATED: {
    label: "SIMULATED",
    icon: FlaskConical,
    classes: "bg-brand-gold-light text-brand-gold",
  },
  PREVIEW_SEEDED: {
    label: "PREVIEW/SEEDED",
    icon: FileClock,
    classes: "bg-brand-surface-muted text-brand-muted-fg",
  },
};

export function TruthBadge({ value, className }: { value: TruthBadgeValue; className?: string }) {
  const c = CONFIG[value];
  const Icon = c.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold",
        c.classes,
        className
      )}
    >
      <Icon className="h-3 w-3" aria-hidden />
      {c.label}
    </span>
  );
}
