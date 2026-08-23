import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium",
  {
    variants: {
      variant: {
        neutral: "bg-brand-surface-muted text-foreground border-brand-border",
        primary: "bg-brand-primary-light text-brand-primary-dark border-transparent",
        gold: "bg-brand-gold-light text-brand-gold border-transparent",
        wet: "bg-brand-wet-light text-brand-wet border-transparent",
        dry: "bg-brand-dry-light text-brand-dry border-transparent",
        danger: "bg-brand-danger-light text-brand-danger border-transparent",
        warning: "bg-brand-warning-light text-brand-warning border-transparent",
        outline: "bg-transparent text-brand-muted-fg border-brand-border",
      },
    },
    defaultVariants: { variant: "neutral" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, className }))} {...props} />;
}
