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
  const isMeasure = variant === "measure";

  return (
    <div
      className={cn(
        "relative mb-4 flex h-14 w-14 items-center justify-center rounded-[18px] shadow-card ring-1 ring-white/25",
        isMeasure
          ? "bg-gradient-to-br from-accent-primary to-[#4a9ae8]"
          : "bg-gradient-to-br from-[#6eb5e8] to-accent-secondary"
      )}
      aria-hidden
    >
      <div className="absolute inset-[3px] rounded-[15px] bg-white/10" />
      <Icon
        className="relative z-[1] h-6 w-6 text-white drop-shadow-sm"
        strokeWidth={1.65}
      />
    </div>
  );
}

function StatTile({ icon, value, label, variant }: StatTileProps) {
  return (
    <div className="rounded-2xl border border-border-subtle bg-[var(--bg-primary)] p-4 shadow-card">
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
      <div className="grid grid-cols-2 gap-3">
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
