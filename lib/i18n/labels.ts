import type { AppLocale } from "@/lib/preferences/profile-preferences";
import type { RiskLevel } from "@/types/measurement";
import type { SensorStatus } from "@/lib/sensors/status";
import { getRiskShortLabels, t } from "@/lib/i18n/messages";

export function getSensorUILabels(locale: AppLocale) {
  return {
    ammonia: {
      label: t(locale, "sensorAmmonia"),
      unit: "ppb",
    },
    acetone: {
      label: t(locale, "sensorAcetone"),
      unit: "ppb",
    },
  } as const;
}

export function getSensorStatusLabel(
  locale: AppLocale,
  status: SensorStatus
): string {
  return status === "elevated"
    ? t(locale, "sensorElevated")
    : t(locale, "sensorNormal");
}

export function getRiskFullLabels(locale: AppLocale): Record<RiskLevel, string> {
  return {
    low: t(locale, "riskLabelLow"),
    moderate: t(locale, "riskLabelModerate"),
    high: t(locale, "riskLabelHigh"),
  };
}

export function formatRiskDelta(locale: AppLocale, delta: number): string {
  if (Math.abs(delta) < 3) {
    return t(locale, "riskDeltaStable");
  }
  if (delta > 0) {
    return t(locale, "riskDeltaUp").replace("{n}", String(delta));
  }
  return t(locale, "riskDeltaDown").replace("{n}", String(Math.abs(delta)));
}

export function formatInsightTrendMessage(
  locale: AppLocale,
  sensorName: string,
  trendPercent: number
): string {
  if (Math.abs(trendPercent) < 5) {
    return t(locale, "insightTrendStable").replace("{sensor}", sensorName);
  }
  if (trendPercent > 0) {
    return t(locale, "insightTrendUp")
      .replace("{sensor}", sensorName)
      .replace("{n}", String(Math.round(trendPercent)));
  }
  return t(locale, "insightTrendDown")
    .replace("{sensor}", sensorName)
    .replace("{n}", String(Math.round(Math.abs(trendPercent))));
}
