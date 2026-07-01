"use client";

import { cn } from "@/lib/utils";

interface IOSSegmentedControlProps<T extends string | number> {
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
  formatLabel?: (value: T) => string;
  className?: string;
}

export function IOSSegmentedControl<T extends string | number>({
  options,
  value,
  onChange,
  formatLabel = (v) => String(v),
  className,
}: IOSSegmentedControlProps<T>) {
  return (
    <div
      className={cn(
        "segmented-track flex gap-0.5 rounded-xl p-1",
        className
      )}
      role="tablist"
    >
      {options.map((option) => {
        const selected = value === option;
        return (
          <button
            key={String(option)}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(option)}
            className={cn(
              "flex-1 rounded-lg py-2 text-sm font-medium transition-all",
              selected
                ? "bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] shadow-sm"
                : "text-[var(--text-secondary)]"
            )}
          >
            {formatLabel(option)}
          </button>
        );
      })}
    </div>
  );
}
