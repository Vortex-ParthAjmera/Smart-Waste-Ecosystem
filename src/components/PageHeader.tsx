import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  description,
  action,
  className,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-4 flex items-start justify-between gap-3", className)}>
      <div>
        <h1 className="text-lg font-semibold text-foreground">{title}</h1>
        {description && <p className="mt-0.5 text-xs text-brand-muted-fg">{description}</p>}
      </div>
      {action}
    </div>
  );
}
