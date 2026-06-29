"use client";

import Link from "next/link";
import { Smartphone } from "lucide-react";
import { Challenge14Card } from "@/components/gamification/Challenge14Card";
import { StreakCard } from "@/components/gamification/StreakCard";
import { WeeklyGoalCard } from "@/components/gamification/WeeklyGoalCard";
import { DashboardDeviceInfo } from "@/components/dashboard/DashboardDeviceInfo";
import { DashboardInsightCard } from "@/components/dashboard/DashboardInsightCard";
import { DashboardMetricTiles } from "@/components/dashboard/DashboardMetricTiles";
import { DashboardTrendSection } from "@/components/dashboard/DashboardTrendSection";
import { ScreeningHeroSummary } from "@/components/dashboard/ScreeningHeroSummary";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { DoctorCTA } from "@/components/result/DoctorCTA";
import { WhenToSeeDoctorCard } from "@/components/shared/WhenToSeeDoctorCard";
import { DisclaimerBanner } from "@/components/layout/DisclaimerBanner";
import { StaggerSection } from "@/components/shared/StaggerSection";
import { Button } from "@/components/ui/button";
import { usePreferences } from "@/components/providers/PreferencesProvider";
import { ROUTE_DEVICE_GUIDE, WEEKLY_GOAL_TARGET } from "@/lib/constants";
import type { TrendDirection } from "@/lib/ai-insight/analyze-measurements";
import type { DashboardInsight } from "@/lib/dashboard/build-dashboard-insight";
import type { DoctorCtaDecision } from "@/lib/dashboard/should-show-doctor-cta";
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
  doctorCta: DoctorCtaDecision;
  ammoniaTrend?: TrendDirection;
}

export function DashboardPageClient({
  latest,
  measurements,
  gamification,
  dashboardInsight,
  riskDelta,
  sparklineData,
  weeklyAvgScore,
  doctorCta,
  ammoniaTrend,
}: DashboardPageClientProps) {
  const { translate } = usePreferences();

  return (
    <main className="space-y-4 px-4 py-6">
      <PageHeader />
      <DashboardDeviceInfo lastMeasuredAt={latest?.measured_at ?? null} />

      {latest && (
        <StaggerSection className="space-y-4">
          <ScreeningHeroSummary
            riskLevel={latest.risk_level}
            riskScore={latest.risk_score}
            measuredAt={latest.measured_at}
            riskDelta={riskDelta}
          />

          {doctorCta.show && <DoctorCTA variant={doctorCta.variant} />}

          <DashboardMetricTiles
            mq135={latest.mq135_value}
            mq3={latest.mq3_value}
            riskScore={latest.risk_score}
            riskLevel={latest.risk_level}
            ammoniaTrend={ammoniaTrend}
          />

          <DashboardTrendSection measurements={measurements} />

          {dashboardInsight && (
            <DashboardInsightCard
              insight={dashboardInsight}
              riskScore={latest.risk_score}
              riskLevel={latest.risk_level}
              resultId={latest.id}
              sparklineData={sparklineData}
            />
          )}
        </StaggerSection>
      )}

      <Button variant="secondary" size="sm" className="h-10 w-full gap-2" asChild>
        <Link href={ROUTE_DEVICE_GUIDE}>
          <Smartphone className="h-4 w-4" />
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

      {latest && latest.risk_level !== "low" && <WhenToSeeDoctorCard />}

      <DisclaimerBanner />
    </main>
  );
}
