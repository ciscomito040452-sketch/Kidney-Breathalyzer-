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
import { CTA_DEVICE_GUIDE, ROUTE_DEVICE_GUIDE, WEEKLY_GOAL_TARGET } from "@/lib/constants";
import { buildDashboardInsight } from "@/lib/dashboard/build-dashboard-insight";
import { computeGamificationStats } from "@/lib/gamification";
import {
  computeRiskScoreDelta,
} from "@/lib/measurements/risk-delta";
import { getDemoMeasurements } from "@/lib/mock/demo-store";
import { getEffectiveRiskFactors } from "@/lib/profile/effective-risk-factors";
import { formatRiskScoreDisplay } from "@/lib/sensor-labels";

export default function DashboardPage() {
  const riskFactors = getEffectiveRiskFactors();
  const measurements = getDemoMeasurements(riskFactors);
  const latest = measurements[0];
  const gamification = computeGamificationStats(measurements);

  const riskDelta = latest
    ? computeRiskScoreDelta(measurements, latest.risk_score)
    : null;

  const sparklineData = measurements
    .slice(0, 7)
    .reverse()
    .map((m) => ({
      date: m.measured_at,
      risk_score: m.risk_score,
    }));

  const weeklyAvgScore =
    measurements.length > 0
      ? measurements
          .slice(0, gamification.weekly_count || 1)
          .reduce((s, m) => s + m.risk_score, 0) /
        Math.max(gamification.weekly_count, 1)
      : 0;

  const dashboardInsight = latest
    ? buildDashboardInsight({
        latest,
        measurements,
        riskFactors,
      })
    : null;

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
          {CTA_DEVICE_GUIDE}
        </Link>
      </Button>

      {gamification.weekly_count > 0 && (
        <p className="text-center text-xs text-[var(--text-secondary)]">
          วัด {gamification.weekly_count} ครั้งสัปดาห์นี้ · ค่าเฉลี่ย{" "}
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
          resultId={latest.id}
          sparklineData={sparklineData}
        />
      )}

      <DisclaimerBanner />
    </main>
  );
}
