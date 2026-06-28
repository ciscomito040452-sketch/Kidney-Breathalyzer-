import { DashboardPageClient } from "@/components/dashboard/DashboardPageClient";
import { buildDashboardInsight } from "@/lib/dashboard/build-dashboard-insight";
import { computeGamificationStats } from "@/lib/gamification";
import { computeRiskScoreDelta } from "@/lib/measurements/risk-delta";
import { getDemoMeasurements } from "@/lib/mock/demo-store";
import { getEffectiveRiskFactors } from "@/lib/profile/effective-risk-factors";
import { getServerLocale } from "@/lib/i18n/server-locale";

export default function DashboardPage() {
  const locale = getServerLocale();
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
        locale,
      })
    : null;

  return (
    <DashboardPageClient
      latest={latest}
      measurements={measurements}
      gamification={gamification}
      dashboardInsight={dashboardInsight}
      riskDelta={riskDelta}
      sparklineData={sparklineData}
      weeklyAvgScore={weeklyAvgScore}
    />
  );
}
