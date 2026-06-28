import type { TrendDirection } from "@/lib/ai-insight/analyze-measurements";
import { t, type MessageKey } from "@/lib/i18n/messages";
import type { AppLocale } from "@/lib/preferences/profile-preferences";
import type { RiskLevel } from "@/types/measurement";

export type TrendRecommendationTone = "attention" | "neutral" | "good";

export interface TrendRecommendation {
  nextStep: string;
  tone: TrendRecommendationTone;
}

const RECOMMENDATIONS: Record<
  RiskLevel,
  Record<TrendDirection, { key: MessageKey; tone: TrendRecommendationTone }>
> = {
  high: {
    rising: { key: "trendRecHighRising", tone: "attention" },
    stable: { key: "trendRecHighStable", tone: "attention" },
    falling: { key: "trendRecHighFalling", tone: "attention" },
  },
  moderate: {
    rising: { key: "trendRecModerateRising", tone: "attention" },
    stable: { key: "trendRecModerateStable", tone: "neutral" },
    falling: { key: "trendRecModerateFalling", tone: "neutral" },
  },
  low: {
    rising: { key: "trendRecLowRising", tone: "neutral" },
    stable: { key: "trendRecLowStable", tone: "good" },
    falling: { key: "trendRecLowFalling", tone: "good" },
  },
};

export function buildTrendRecommendation(
  locale: AppLocale,
  riskLevel: RiskLevel,
  ammoniaTrend: TrendDirection
): TrendRecommendation {
  const { key, tone } = RECOMMENDATIONS[riskLevel][ammoniaTrend];
  return {
    nextStep: t(locale, key),
    tone,
  };
}
