"use client";

import type { LucideIcon } from "lucide-react";
import { CalendarCheck, Wind } from "lucide-react";
import { usePreferences } from "@/components/providers/PreferencesProvider";
import { cn } from "@/lib/utils";

interface ProfileStatsCardProps {
  totalMeasurements: number;
  currentStreak: number;
}

interface StatTileProps {
  icon: LucideIcon;
  value: string;
  label: string;
  variant: "measure" | "streak";
}

function StatIconBadge({
  icon: Icon,
  variant,
}: {
  icon: LucideIcon;
  variant: StatTileProps["variant"];
}) {
  return (
    <div
      className={cn(
        "mb-4 flex h-14 w-14 items-center justify-center rounded-2xl",
        variant === "measure"
          ? "bg-[var(--accent-tint)] text-accent-primary"
          : "bg-[var(--accent-tint-strong)] text-accent-primary"
      )}
      aria-hidden
    >
      <Icon className="h-6 w-6" strokeWidth={1.75} />
    </div>
  );
}

function StatTile({ icon, value, label, variant }: StatTileProps) {
  return (
    <div className="bg-surface p-4">
      <StatIconBadge icon={icon} variant={variant} />
      <p className="text-3xl font-semibold tabular-nums leading-none tracking-tight">
        {value}
      </p>
      <p className="mt-2 text-sm font-medium text-[var(--text-secondary)]">
        {label}
      </p>
    </div>
  );
}

export function ProfileStatsCard({
  totalMeasurements,
  currentStreak,
}: ProfileStatsCardProps) {
  const { translate } = usePreferences();

  return (
    <section aria-label={translate("healthSummary")}>
      <p className="mb-3 text-base font-semibold">{translate("healthSummary")}</p>
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-[var(--surface-card-border)] bg-border-subtle shadow-card app-card">
        <StatTile
          icon={Wind}
          value={String(totalMeasurements)}
          label={translate("statMeasurements")}
          variant="measure"
        />
        <StatTile
          icon={CalendarCheck}
          value={String(currentStreak)}
          label={translate("statStreak")}
          variant="streak"
        />
      </div>
    </section>
  );
}
