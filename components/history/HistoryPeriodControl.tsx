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
        "-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-none",
        className
      )}
    >
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={cn(
            "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors",
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
