"use client";

import { usePreferences } from "@/components/providers/PreferencesProvider";
import { getSensorStatusLabel } from "@/lib/i18n/labels";
import type { SensorStatus } from "@/lib/sensors/status";
import { cn } from "@/lib/utils";

interface SensorStatusPillProps {
  status: SensorStatus;
  className?: string;
}

export function SensorStatusPill({ status, className }: SensorStatusPillProps) {
  const { locale } = usePreferences();
  const elevated = status === "elevated";

  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
        elevated
          ? "bg-accent-primary/12 text-accent-primary"
          : "text-[var(--text-secondary)] ring-1 ring-border-subtle",
        className
      )}
    >
      {getSensorStatusLabel(locale, status)}
    </span>
  );
}
