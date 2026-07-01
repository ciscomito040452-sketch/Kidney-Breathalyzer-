import { analyzeMeasurements } from "@/lib/ai-insight/analyze-measurements";
import { buildTrendRecommendation } from "@/lib/dashboard/build-trend-recommendation";
import { computeTrendContext } from "@/lib/risk-engine/trend-context";
import { generateExplanation } from "@/lib/risk-engine/explanations";
import {
  formatAcetonePpb,
  formatAmmoniaPpb,
} from "@/lib/sensor-labels";
import {
  getAcetoneStatus,
  getAmmoniaStatus,
} from "@/lib/sensors/status";
import type { AppLocale } from "@/lib/preferences/profile-preferences";
import type { RiskFactors } from "@/lib/risk-engine/calculate-score";
import type { Measurement } from "@/types/measurement";

export function buildResultExplanation(input: {
  measurement: Measurement;
  measurements: Measurement[];
  riskFactors?: RiskFactors;
  locale?: AppLocale;
}): string {
  const locale = input.locale ?? "th";
  const { measurement, measurements, riskFactors } = input;
  const measuredAt = new Date(measurement.measured_at).getTime();
  const history = measurements.filter(
    (m) =>
      m.id !== measurement.id &&
      new Date(m.measured_at).getTime() < measuredAt
  );
  const trend = computeTrendContext(history, measurement.mq135_value);
  const ammoniaPpb = formatAmmoniaPpb(measurement.mq135_value);
  const acetonePpb = formatAcetonePpb(measurement.mq3_value);

  return generateExplanation(
    {
      risk_level: measurement.risk_level,
      mq135_value: measurement.mq135_value,
      mq3_value: measurement.mq3_value,
      avgMq135: trend.avgMq135,
      trendPercent: trend.trendPercent,
      consecutiveHighDays: trend.consecutiveHighDays,
      riskFactors,
      ammoniaStatus: getAmmoniaStatus(measurement.mq135_value),
      acetoneStatus: getAcetoneStatus(measurement.mq3_value),
      ammoniaPpb,
      acetonePpb,
    },
    locale
  );
}

export function getAmmoniaTrendForMeasurements(
  measurements: Measurement[]
): ReturnType<typeof analyzeMeasurements> {
  return analyzeMeasurements(measurements);
}
