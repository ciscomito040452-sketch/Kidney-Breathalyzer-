"use client";

import { useEffect, useState } from "react";
import {
  CalendarCheck,
  Flame,
  Loader2,
  Smartphone,
  Target,
} from "lucide-react";
import { DeviceStatusBadge } from "@/components/dashboard/DeviceStatusBadge";
import {
  HealthGroupedCard,
  HealthGroupedDivider,
  HealthListRow,
} from "@/components/health";
import { useDemo } from "@/components/providers/DemoProvider";
import { usePreferences } from "@/components/providers/PreferencesProvider";
import { ROUTE_DEVICE_GUIDE, WEEKLY_GOAL_TARGET } from "@/lib/constants";
import { resolveDeviceStatus } from "@/lib/device/status";
import { formatDateTimeThai } from "@/lib/utils";
import type { UserStreaks } from "@/types/measurement";
import { cn } from "@/lib/utils";

interface DashboardMoreSectionProps {
  lastMeasuredAt: string | null;
  gamification: UserStreaks;
}

export function DashboardMoreSection({
  lastMeasuredAt,
  gamification,
}: DashboardMoreSectionProps) {
  const { isDemo } = useDemo();
  const { translate } = usePreferences();
  const [isSyncing, setIsSyncing] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsSyncing(false), 1600);
    return () => clearTimeout(timer);
  }, []);

  const status = resolveDeviceStatus(lastMeasuredAt, isDemo);
  const weeklyMet = gamification.weekly_count >= WEEKLY_GOAL_TARGET;
  const challengeCompleted = gamification.challenge_days.filter(Boolean).length;

  return (
    <HealthGroupedCard>
      <HealthListRow
        icon={Smartphone}
        title={translate("deviceStatus")}
        detail={
          isSyncing
            ? translate("syncing")
            : lastMeasuredAt
              ? `${translate("lastSync")} · ${formatDateTimeThai(lastMeasuredAt)}`
              : undefined
        }
        trailing={
          isSyncing ? (
            <Loader2 className="h-4 w-4 animate-spin text-accent-primary" />
          ) : (
            <DeviceStatusBadge status={status} />
          )
        }
        showChevron={false}
      />
      <HealthGroupedDivider />

      <HealthListRow
        icon={Flame}
        title={translate("streakStatTitle")}
        detail={`${gamification.current_streak} ${translate("daysUnit")}`}
        showChevron={false}
      />
      <HealthGroupedDivider />

      <HealthListRow
        icon={Target}
        title={translate("weeklyGoalTitle")}
        detail={`${gamification.weekly_count}/${WEEKLY_GOAL_TARGET} ${translate("timesUnit")}${
          weeklyMet ? ` · ${translate("goalMet")}` : ""
        }`}
        showChevron={false}
      />
      <HealthGroupedDivider />

      <div className="px-4 py-3.5">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-tint)] text-accent-primary">
            <CalendarCheck className="h-4 w-4" strokeWidth={1.75} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-[var(--text-primary)]">
              {translate("challenge14Title")}
            </p>
            <p className="mt-0.5 text-pinned-caption text-[var(--text-secondary)]">
              {challengeCompleted}/{gamification.challenge_days.length}{" "}
              {translate("daysUnit")}
            </p>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5 pl-12">
          {gamification.challenge_days.map((filled, i) => (
            <span
              key={i}
              className={cn(
                "h-2.5 w-2.5 rounded-full",
                filled ? "bg-accent-primary" : "bg-[var(--border-subtle)]"
              )}
              aria-hidden
            />
          ))}
        </div>
      </div>
      <HealthGroupedDivider />

      <HealthListRow
        icon={Smartphone}
        title={translate("deviceGuide")}
        href={ROUTE_DEVICE_GUIDE}
      />
    </HealthGroupedCard>
  );
}
