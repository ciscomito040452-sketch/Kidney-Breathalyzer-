import { getAmmoniaStatus, getAcetoneStatus } from "@/lib/sensors/status";
import type { Measurement, RiskLevel } from "@/types/measurement";

export type TrendDirection = "rising" | "stable" | "falling";

export interface MeasurementAnalytics {
  count: number;
  daySpan: number;
  avgRiskScore: number;
  avgMq135: number;
  avgMq3: number;
  dominantRiskLevel: RiskLevel;
  riskLevelCounts: Record<RiskLevel, number>;
  ammoniaTrend: TrendDirection;
  ammoniaTrendPercent: number;
  riskScoreTrend: TrendDirection;
  riskScoreTrendPercent: number;
  elevatedAmmoniaPercent: number;
  elevatedAcetonePercent: number;
  weeklyMeasurementCount: number;
  moderateOrHighPercent: number;
}

function trendFromPercent(pct: number): TrendDirection {
  if (pct > 8) return "rising";
  if (pct < -8) return "falling";
  return "stable";
}

export function analyzeMeasurements(
  measurements: Measurement[]
): MeasurementAnalytics | null {
  if (measurements.length === 0) return null;

  const chronological = [...measurements].sort(
    (a, b) =>
      new Date(a.measured_at).getTime() - new Date(b.measured_at).getTime()
  );

  const count = measurements.length;
  const oldest = new Date(chronological[0].measured_at);
  const newest = new Date(chronological[chronological.length - 1].measured_at);
  const daySpan = Math.max(
    1,
    Math.ceil((newest.getTime() - oldest.getTime()) / 86_400_000) + 1
  );

  const avgRiskScore =
    measurements.reduce((sum, m) => sum + m.risk_score, 0) / count;
  const avgMq135 =
    measurements.reduce((sum, m) => sum + m.mq135_value, 0) / count;
  const avgMq3 =
    measurements.reduce((sum, m) => sum + m.mq3_value, 0) / count;

  const riskLevelCounts: Record<RiskLevel, number> = {
    low: 0,
    moderate: 0,
    high: 0,
  };
  let elevatedAmmonia = 0;
  let elevatedAcetone = 0;

  for (const m of measurements) {
    riskLevelCounts[m.risk_level] += 1;
    if (getAmmoniaStatus(m.mq135_value) === "elevated") elevatedAmmonia += 1;
    if (getAcetoneStatus(m.mq3_value) === "elevated") elevatedAcetone += 1;
  }

  const dominantRiskLevel = (
    Object.entries(riskLevelCounts).sort((a, b) => b[1] - a[1])[0][0]
  ) as RiskLevel;

  const mid = Math.max(1, Math.floor(count / 2));
  const olderHalf = chronological.slice(0, mid);
  const recentHalf = chronological.slice(mid);

  const olderMq135Avg =
    olderHalf.reduce((sum, m) => sum + m.mq135_value, 0) / olderHalf.length;
  const recentMq135Avg =
    recentHalf.length > 0
      ? recentHalf.reduce((sum, m) => sum + m.mq135_value, 0) /
        recentHalf.length
      : olderMq135Avg;
  const ammoniaTrendPercent =
    olderMq135Avg > 0
      ? ((recentMq135Avg - olderMq135Avg) / olderMq135Avg) * 100
      : 0;

  const olderRiskAvg =
    olderHalf.reduce((sum, m) => sum + m.risk_score, 0) / olderHalf.length;
  const recentRiskAvg =
    recentHalf.length > 0
      ? recentHalf.reduce((sum, m) => sum + m.risk_score, 0) /
        recentHalf.length
      : olderRiskAvg;
  const riskScoreTrendPercent =
    olderRiskAvg > 0
      ? ((recentRiskAvg - olderRiskAvg) / olderRiskAvg) * 100
      : 0;

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weeklyMeasurementCount = measurements.filter(
    (m) => new Date(m.measured_at) >= weekAgo
  ).length;

  const moderateOrHigh = riskLevelCounts.moderate + riskLevelCounts.high;

  return {
    count,
    daySpan,
    avgRiskScore,
    avgMq135,
    avgMq3,
    dominantRiskLevel,
    riskLevelCounts,
    ammoniaTrend: trendFromPercent(ammoniaTrendPercent),
    ammoniaTrendPercent,
    riskScoreTrend: trendFromPercent(riskScoreTrendPercent),
    riskScoreTrendPercent,
    elevatedAmmoniaPercent: Math.round((elevatedAmmonia / count) * 100),
    elevatedAcetonePercent: Math.round((elevatedAcetone / count) * 100),
    weeklyMeasurementCount,
    moderateOrHighPercent: Math.round((moderateOrHigh / count) * 100),
  };
}
