import type {
  MeasurementAnalytics,
  TrendDirection,
} from "@/lib/ai-insight/analyze-measurements";
import { t } from "@/lib/i18n/messages";
import type { AppLocale } from "@/lib/preferences/profile-preferences";

export function buildMetricTrendNarrativeForPeriod(
  locale: AppLocale,
  sensorName: string,
  periodDays: number,
  trend: TrendDirection,
  trendPercent: number
): string {
  const pct = Math.round(Math.abs(trendPercent));
  const days = String(periodDays);

  if (trend === "stable") {
    return t(locale, "trendInsightStable")
      .replace("{sensor}", sensorName)
      .replace("{n}", days);
  }
  if (trend === "rising") {
    return t(locale, "trendInsightRising")
      .replace("{sensor}", sensorName)
      .replace("{pct}", String(pct))
      .replace("{n}", days);
  }
  return t(locale, "trendInsightFalling")
    .replace("{sensor}", sensorName)
    .replace("{pct}", String(pct))
    .replace("{n}", days);
}

export function buildTrendNarrativeForPeriod(
  locale: AppLocale,
  analytics: MeasurementAnalytics,
  sensorName: string,
  periodDays: number
): string {
  return buildMetricTrendNarrativeForPeriod(
    locale,
    sensorName,
    periodDays,
    analytics.ammoniaTrend,
    analytics.ammoniaTrendPercent
  );
}
