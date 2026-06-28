"use client";

import { Activity, Flame } from "lucide-react";
import { usePreferences } from "@/components/providers/PreferencesProvider";

interface ProfileStatsCardProps {
  totalMeasurements: number;
  currentStreak: number;
}

export function ProfileStatsCard({
  totalMeasurements,
  currentStreak,
}: ProfileStatsCardProps) {
  const { translate } = usePreferences();

  const stats = [
    {
      icon: Activity,
      value: String(totalMeasurements),
      label: translate("statMeasurements"),
      accent: "bg-accent-primary/10 text-accent-primary",
    },
    {
      icon: Flame,
      value: String(currentStreak),
      label: translate("statStreak"),
      accent: "bg-orange-500/10 text-orange-600",
    },
  ];

  return (
    <section aria-label={translate("healthSummary")}>
      <p className="mb-3 text-base font-semibold">{translate("healthSummary")}</p>
      <div className="grid grid-cols-2 gap-3">
        {stats.map(({ icon: Icon, value, label, accent }) => (
          <div
            key={label}
            className="rounded-2xl border border-border-subtle bg-[var(--bg-primary)] p-4 shadow-card"
          >
            <div
              className={`mb-3 flex h-11 w-11 items-center justify-center rounded-2xl ${accent}`}
            >
              <Icon className="h-5 w-5" strokeWidth={1.75} />
            </div>
            <p className="text-3xl font-semibold tabular-nums leading-none">
              {value}
            </p>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">{label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
