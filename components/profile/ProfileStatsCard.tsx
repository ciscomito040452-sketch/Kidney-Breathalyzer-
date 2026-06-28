"use client";

import { Activity, Calendar, Flame } from "lucide-react";
import { usePreferences } from "@/components/providers/PreferencesProvider";
import { Card, CardContent } from "@/components/ui/card";
import { formatDateThai } from "@/lib/utils";

interface ProfileStatsCardProps {
  totalMeasurements: number;
  currentStreak: number;
  memberSince: string | null;
}

export function ProfileStatsCard({
  totalMeasurements,
  currentStreak,
  memberSince,
}: ProfileStatsCardProps) {
  const { translate } = usePreferences();

  const stats = [
    {
      icon: Activity,
      label: translate("totalMeasurements"),
      value: String(totalMeasurements),
    },
    {
      icon: Flame,
      label: translate("currentStreak"),
      value: `${currentStreak} ${translate("days")}`,
    },
    {
      icon: Calendar,
      label: translate("memberSince"),
      value: memberSince ? formatDateThai(new Date(memberSince)) : "—",
    },
  ];

  return (
    <Card>
      <CardContent className="pt-4">
        <p className="mb-3 text-sm font-semibold">{translate("healthSummary")}</p>
        <div className="grid grid-cols-3 gap-2">
          {stats.map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="rounded-xl bg-surface px-2 py-3 text-center"
            >
              <Icon
                className="mx-auto mb-1.5 h-4 w-4 text-accent-primary"
                strokeWidth={1.75}
              />
              <p className="text-sm font-semibold tabular-nums">{value}</p>
              <p className="mt-0.5 text-[10px] leading-tight text-[var(--text-secondary)]">
                {label}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
