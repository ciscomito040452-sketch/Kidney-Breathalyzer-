"use client";

import { cn } from "@/lib/utils";

interface SegmentedControlProps<T extends string | number> {
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
  formatLabel?: (value: T) => string;
  className?: string;
}

export function SegmentedControl<T extends string | number>({
  options,
  value,
  onChange,
  formatLabel = (v) => String(v),
  className,
}: SegmentedControlProps<T>) {
  return (
    <div className={cn("flex gap-2", className)}>
      {options.map((option) => (
        <button
          key={String(option)}
          type="button"
          onClick={() => onChange(option)}
          className={cn(
            "flex-1 rounded-full py-2 text-sm font-medium transition-colors",
            value === option
              ? "bg-accent-primary text-white"
              : "bg-surface text-[var(--text-secondary)]"
          )}
        >
          {formatLabel(option)}
        </button>
      ))}
    </div>
  );
}
