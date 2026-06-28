"use client";

import Link from "next/link";
import { Smartphone } from "lucide-react";
import { Challenge14Card } from "@/components/gamification/Challenge14Card";
import { StreakCard } from "@/components/gamification/StreakCard";
import { WeeklyGoalCard } from "@/components/gamification/WeeklyGoalCard";
import { DashboardDeviceInfo } from "@/components/dashboard/DashboardDeviceInfo";
import { DashboardLatestSection } from "@/components/dashboard/DashboardLatestSection";
import { DashboardInsightCard } from "@/components/dashboard/DashboardInsightCard";
import { DashboardTrendSection } from "@/components/dashboard/DashboardTrendSection";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { DisclaimerBanner } from "@/components/layout/DisclaimerBanner";
import { Button } from "@/components/ui/button";
import { usePreferences } from "@/components/providers/PreferencesProvider";
import { ROUTE_DEVICE_GUIDE, WEEKLY_GOAL_TARGET } from "@/lib/constants";
import type { DashboardInsight } from "@/lib/dashboard/build-dashboard-insight";
import type { UserStreaks } from "@/types/measurement";
import type { Measurement } from "@/types/measurement";
import { formatRiskScoreDisplay } from "@/lib/sensor-labels";

interface DashboardPageClientProps {
  latest: Measurement | undefined;
  measurements: Measurement[];
  gamification: UserStreaks;
  dashboardInsight: DashboardInsight | null;
  riskDelta: number | null;
  sparklineData: { date: string; risk_score: number }[];
  weeklyAvgScore: number;
}

export function DashboardPageClient({
  latest,
  measurements,
  gamification,
  dashboardInsight,
  riskDelta,
  sparklineData,
  weeklyAvgScore,
}: DashboardPageClientProps) {
  const { translate } = usePreferences();

  return (
    <main className="space-y-6 px-4 py-6">
      <PageHeader />

      <DashboardDeviceInfo lastMeasuredAt={latest?.measured_at ?? null} />

      {latest && (
        <DashboardLatestSection
          riskLevel={latest.risk_level}
          riskScore={latest.risk_score}
          mq135={latest.mq135_value}
          mq3={latest.mq3_value}
          measuredAt={latest.measured_at}
          riskDelta={riskDelta}
        />
      )}

      <Button className="h-[52px] w-full gap-2" asChild>
        <Link href={ROUTE_DEVICE_GUIDE}>
          <Smartphone className="h-5 w-5" />
          {translate("deviceGuide")}
        </Link>
      </Button>

      {gamification.weekly_count > 0 && (
        <p className="text-center text-xs text-[var(--text-secondary)]">
          {translate("weeklyMeasuredPrefix")} {gamification.weekly_count}{" "}
          {translate("weeklyMeasuredSuffix")} · {translate("weeklyAvgLabel")}{" "}
          {formatRiskScoreDisplay(weeklyAvgScore)}
        </p>
      )}

      <div className="flex gap-3">
        <Challenge14Card challengeDays={gamification.challenge_days} />
        <StreakCard currentStreak={gamification.current_streak} />
      </div>

      <WeeklyGoalCard
        count={gamification.weekly_count}
        target={WEEKLY_GOAL_TARGET}
      />

      <DashboardTrendSection measurements={measurements} />

      {dashboardInsight && latest && (
        <DashboardInsightCard
          insight={dashboardInsight}
          riskScore={latest.risk_score}
          riskLevel={latest.risk_level}
          resultId={latest.id}
          sparklineData={sparklineData}
        />
      )}

      <DisclaimerBanner />
    </main>
  );
}
