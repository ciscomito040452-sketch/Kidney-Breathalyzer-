import { analyzeMeasurements } from "@/lib/ai-insight/analyze-measurements";
import { buildTrendNarrativeForPeriod } from "@/lib/ai-insight/trend-narrative";
import { getRiskFullLabels, getSensorUILabels } from "@/lib/i18n/labels";
import { t } from "@/lib/i18n/messages";
import type { AppLocale } from "@/lib/preferences/profile-preferences";
import { suggestionStepsForLevel } from "@/lib/dashboard/suggestion-steps";
import type { Measurement } from "@/types/measurement";

export interface TrendPeriodInsight {
  narrative: string;
  latestRiskLabel: string;
  nextStep: string;
}

export function buildTrendPeriodInsight(
  measurements: Measurement[],
  locale: AppLocale,
  periodDays: number
): TrendPeriodInsight | null {
  if (measurements.length < 2) return null;

  const analytics = analyzeMeasurements(measurements);
  if (!analytics) return null;

  const sensorUi = getSensorUILabels(locale);
  const riskLabels = getRiskFullLabels(locale);
  const ammoniaName = sensorUi.ammonia.label.split(" ")[0];
  const latest = measurements[0];

  return {
    narrative: buildTrendNarrativeForPeriod(
      locale,
      analytics,
      ammoniaName,
      periodDays
    ),
    latestRiskLabel: riskLabels[latest.risk_level],
    nextStep: suggestionStepsForLevel(latest.risk_level, locale)[0],
  };
}

export function formatTrendInsightLatestLine(
  locale: AppLocale,
  riskLabel: string
): string {
  return t(locale, "trendInsightLatestRisk").replace("{level}", riskLabel);
}
