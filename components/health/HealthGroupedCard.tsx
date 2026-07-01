"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface HealthGroupedCardProps {
  children: ReactNode;
  className?: string;
  variant?: "grouped" | "elevated";
}

export function HealthGroupedCard({
  children,
  className,
  variant = "grouped",
}: HealthGroupedCardProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl",
        variant === "grouped" ? "app-card app-card--grouped" : "app-card app-card--elevated",
        className
      )}
    >
      {children}
    </div>
  );
}

export function HealthGroupedDivider() {
  return <div className="mx-4 h-px bg-[var(--border-subtle)]" aria-hidden />;
}
