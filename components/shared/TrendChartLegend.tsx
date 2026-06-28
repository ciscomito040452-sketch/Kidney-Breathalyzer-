"use client";

import { usePreferences } from "@/components/providers/PreferencesProvider";
import { getSensorUILabels } from "@/lib/i18n/labels";

export function TrendChartLegend() {
  const { locale } = usePreferences();
  const sensorUi = getSensorUILabels(locale);

  const items = [
    {
      label: sensorUi.ammonia.label,
      colorClass: "bg-accent-primary",
    },
    {
      label: sensorUi.acetone.label,
      colorClass: "bg-accent-secondary",
    },
  ] as const;

  return (
    <div
      className="flex flex-wrap items-center gap-x-4 gap-y-1"
      aria-label={items.map((item) => item.label).join(", ")}
    >
      {items.map((item) => (
        <span
          key={item.label}
          className="inline-flex items-center gap-1.5 text-xs text-[var(--text-secondary)]"
        >
          <span
            className={`h-2.5 w-2.5 shrink-0 rounded-full ${item.colorClass}`}
            aria-hidden
          />
          {item.label}
        </span>
      ))}
    </div>
  );
}
