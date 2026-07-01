import type { AppLocale } from "@/lib/preferences/profile-preferences";
import { t } from "@/lib/i18n/messages";
import { formatRiskScoreDisplay } from "@/lib/sensor-labels";
import type { SensorStatus } from "@/lib/sensors/status";
import type { RiskLevel } from "@/types/measurement";

export function getRiskQualitativeHeadline(
  locale: AppLocale,
  level: RiskLevel
): string {
  const key =
    level === "low"
      ? "qualitativeRiskLow"
      : level === "moderate"
        ? "qualitativeRiskModerate"
        : "qualitativeRiskHigh";
  return t(locale, key);
}

export function getRiskQualitativeCaption(
  locale: AppLocale,
  score: number,
  delta?: number | null
): string {
  const scoreText = t(locale, "qualitativeScoreCaption").replace(
    "{n}",
    formatRiskScoreDisplay(score)
  );
  if (delta == null || delta === 0) return scoreText;
  const deltaKey = delta > 0 ? "qualitativeDeltaUp" : "qualitativeDeltaDown";
  const deltaText = t(locale, deltaKey).replace("{n}", String(Math.abs(delta)));
  return `${scoreText} · ${deltaText}`;
}

export function getSensorQualitativeHeadline(
  locale: AppLocale,
  status: SensorStatus
): string {
  return status === "elevated"
    ? t(locale, "qualitativeSensorElevated")
    : t(locale, "qualitativeSensorReference");
}

export function getSensorQualitativeCaption(
  value: number | string,
  unit: string
): string {
  return `${value} ${unit}`;
}
