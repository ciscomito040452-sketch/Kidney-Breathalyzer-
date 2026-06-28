import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
  {
    variants: {
      variant: {
        default: "border-transparent bg-accent-primary/10 text-accent-primary",
        low: "border-risk-low/30 bg-risk-low/15 text-risk-low",
        moderate:
          "border-risk-moderate/30 bg-risk-moderate/15 text-risk-moderate",
        high: "border-risk-high/30 bg-risk-high/15 text-risk-high",
        outline: "border-border-subtle text-[var(--text-secondary)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
