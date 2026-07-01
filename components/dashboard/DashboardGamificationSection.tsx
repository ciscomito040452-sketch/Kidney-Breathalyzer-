"use client";

import { CalendarCheck, Flame, Target } from "lucide-react";
import {
  HealthGroupedCard,
  HealthGroupedDivider,
} from "@/components/health";
import { usePreferences } from "@/components/providers/PreferencesProvider";
import { useMotionSafe } from "@/lib/motion/use-motion-safe";
import { Progress } from "@/components/ui/progress";
import { WEEKLY_GOAL_TARGET } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { UserStreaks } from "@/types/measurement";

interface DashboardGamificationSectionProps {
  gamification: UserStreaks;
}

export function DashboardGamificationSection({
  gamification,
}: DashboardGamificationSectionProps) {
  const { translate } = usePreferences();
  const { animate } = useMotionSafe();
  const completedCount = gamification.challenge_days.filter(Boolean).length;
  const weeklyMet = gamification.weekly_count >= WEEKLY_GOAL_TARGET;
  const weeklyDisplay = weeklyMet
    ? WEEKLY_GOAL_TARGET
    : gamification.weekly_count;
  const weeklyPercent = Math.min(
    100,
    (gamification.weekly_count / WEEKLY_GOAL_TARGET) * 100
  );

  return (
    <HealthGroupedCard className="app-card--pinned">
      <div className="px-4 py-4">
        <div className="flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)]">
          <CalendarCheck
            className="h-4 w-4 text-accent-primary"
            strokeWidth={1.75}
            aria-hidden
          />
          {translate("challenge14Title")}
        </div>
        <p className="mt-2 text-2xl font-bold tabular-nums tracking-tight text-[var(--text-primary)]">
          {completedCount}
          <span className="ml-1 text-base font-normal text-[var(--text-secondary)]">
            /{gamification.challenge_days.length} {translate("daysUnit")}
          </span>
        </p>
        <div
          className="mt-3 flex gap-1.5"
          role="list"
          aria-label={translate("challenge14Title")}
        >
          {gamification.challenge_days.map((filled, index) => (
            <div
              key={index}
              role="listitem"
              className={cn(
                "h-2.5 flex-1 rounded-full transition-colors duration-[450ms]",
                filled ? "bg-accent-primary" : "bg-border-subtle",
                filled && animate && "kb-pop-in"
              )}
              style={
                filled && animate
                  ? { animationDelay: `${index * 30}ms` }
                  : undefined
              }
            />
          ))}
        </div>
      </div>

      <HealthGroupedDivider />

      <div className="flex items-center gap-3 px-4 py-3.5">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-tint)] text-accent-primary">
          <Flame className="h-4 w-4" strokeWidth={1.75} aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-[var(--text-primary)]">
            {translate("streakStatTitle")}
          </p>
          <p className="mt-0.5 text-pinned-caption text-[var(--text-secondary)]">
            {gamification.current_streak} {translate("daysUnit")}
          </p>
        </div>
        <p className="text-2xl font-bold tabular-nums text-[var(--text-primary)]">
          {gamification.current_streak}
        </p>
      </div>

      <HealthGroupedDivider />

      <div className="px-4 py-4">
        <div className="flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)]">
          <Target
            className="h-4 w-4 text-accent-primary"
            strokeWidth={1.75}
            aria-hidden
          />
          {translate("weeklyGoalTitle")}
        </div>
        <p className="mt-2 text-2xl font-bold tabular-nums text-[var(--text-primary)]">
          {weeklyDisplay}/{WEEKLY_GOAL_TARGET}
          <span className="ml-1 text-base font-normal text-[var(--text-secondary)]">
            {translate("timesUnit")}
          </span>
        </p>
        {weeklyMet && (
          <p className="mt-1 text-xs text-accent-primary">{translate("goalMet")}</p>
        )}
        <Progress
          value={weeklyPercent}
          className="mt-3"
          aria-label={translate("weeklyGoalTitle")}
        />
      </div>
    </HealthGroupedCard>
  );
}
