"use client";

import { CalendarCheck, Wind } from "lucide-react";
import { SectionHeader } from "@/components/health/SectionHeader";
import { usePreferences } from "@/components/providers/PreferencesProvider";
import { cn } from "@/lib/utils";

interface ProfileStatsCardProps {
  totalMeasurements: number;
  currentStreak: number;
}

const statCardClass =
  "app-card app-card--pinned flex flex-col rounded-2xl p-4";

export function ProfileStatsCard({
  totalMeasurements,
  currentStreak,
}: ProfileStatsCardProps) {
  const { translate } = usePreferences();

  const stats = [
    {
      icon: Wind,
      value: String(totalMeasurements),
      label: translate("statMeasurements"),
      tint: "bg-[rgb(var(--metric-screening-rgb)/0.12)] text-[var(--metric-screening)]",
    },
    {
      icon: CalendarCheck,
      value: String(currentStreak),
      label: translate("statStreak"),
      tint: "bg-[rgb(var(--metric-ammonia-rgb)/0.12)] text-[var(--metric-ammonia)]",
    },
  ] as const;

  return (
    <section className="space-y-3" aria-label={translate("healthSummary")}>
      <SectionHeader title={translate("healthSummary")} />
      <div className="grid grid-cols-2 gap-3">
        {stats.map(({ icon: Icon, value, label, tint }) => (
          <div key={label} className={statCardClass}>
            <span
              className={cn(
                "mb-3 flex h-9 w-9 items-center justify-center rounded-xl",
                tint
              )}
              aria-hidden
            >
              <Icon className="h-4 w-4" strokeWidth={1.75} />
            </span>
            <p className="text-pinned-value leading-none text-[var(--text-primary)]">
              {value}
            </p>
            <p className="mt-2 text-pinned-caption font-medium text-[var(--text-secondary)]">
              {label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
