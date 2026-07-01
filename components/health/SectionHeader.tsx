"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  action?: ReactNode;
  className?: string;
}

export function SectionHeader({ title, action, className }: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 px-1",
        className
      )}
    >
      <h2 className="text-xl font-semibold tracking-tight text-[var(--text-primary)]">
        {title}
      </h2>
      {action}
    </div>
  );
}
