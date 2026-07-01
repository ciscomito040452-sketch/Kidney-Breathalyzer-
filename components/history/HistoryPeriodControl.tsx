"use client";

import { cn } from "@/lib/utils";

interface HistoryPeriodControlProps<T extends string> {
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
  formatLabel: (value: T) => string;
  className?: string;
}

export function HistoryPeriodControl<T extends string>({
  options,
  value,
  onChange,
  formatLabel,
  className,
}: HistoryPeriodControlProps<T>) {
  return (
    <div
      className={cn(
        "segmented-track -mx-1 overflow-x-auto rounded-xl p-1 scrollbar-none",
        className
      )}
      role="tablist"
    >
      <div className="flex min-w-min gap-0.5">
        {options.map((option) => {
          const selected = value === option;
          return (
            <button
              key={option}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => onChange(option)}
              className={cn(
                "shrink-0 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all sm:text-sm",
                selected
                  ? "bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] shadow-sm"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              )}
            >
              {formatLabel(option)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
