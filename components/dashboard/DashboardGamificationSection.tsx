"use client";

import { Challenge14Card } from "@/components/gamification/Challenge14Card";
import { StreakCard } from "@/components/gamification/StreakCard";
import { WeeklyGoalCard } from "@/components/gamification/WeeklyGoalCard";
import { WEEKLY_GOAL_TARGET } from "@/lib/constants";
import type { UserStreaks } from "@/types/measurement";

interface DashboardGamificationSectionProps {
  gamification: UserStreaks;
}

export function DashboardGamificationSection({
  gamification,
}: DashboardGamificationSectionProps) {
  return (
    <div className="space-y-3">
      <div className="flex gap-3">
        <Challenge14Card challengeDays={gamification.challenge_days} />
        <StreakCard currentStreak={gamification.current_streak} />
      </div>
      <WeeklyGoalCard
        count={gamification.weekly_count}
        target={WEEKLY_GOAL_TARGET}
      />
    </div>
  );
}
