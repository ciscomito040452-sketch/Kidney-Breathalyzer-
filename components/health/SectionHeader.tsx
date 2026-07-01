"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
  size?: "default" | "large";
}

export function SectionHeader({
  title,
  subtitle,
  action,
  className,
  size = "default",
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-start justify-between gap-3 px-1",
        className
      )}
    >
      <div className="min-w-0">
        <h2
          className={cn(
            "tracking-tight text-[var(--text-primary)]",
            size === "large"
              ? "text-section-title"
              : "text-xl font-bold"
          )}
        >
          {title}
        </h2>
        {subtitle && (
          <p className="mt-0.5 text-pinned-caption text-[var(--text-secondary)]">
            {subtitle}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}
