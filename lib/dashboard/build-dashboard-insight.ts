import type { AppLocale } from "@/lib/preferences/profile-preferences";
import { t } from "@/lib/i18n/messages";
import {
  formatRiskDelta,
  getRiskFullLabels,
  getSensorStatusLabel,
  getSensorUILabels,
} from "@/lib/i18n/labels";
import { formatRiskDeltaThai, computeRiskScoreDelta } from "@/lib/measurements/risk-delta";
import { generateExplanation } from "@/lib/risk-engine/explanations";
import { computeTrendContext } from "@/lib/risk-engine/trend-context";
import {
  formatAcetonePpb,
  formatAmmoniaPpb,
  formatRiskScoreDisplay,
} from "@/lib/sensor-labels";
import {
  getAcetoneStatus,
  getAmmoniaStatus,
} from "@/lib/sensors/status";
import type { Measurement } from "@/types/measurement";
import type { RiskFactors } from "@/lib/risk-engine/calculate-score";
import { analyzeMeasurements } from "@/lib/ai-insight/analyze-measurements";
import { buildActionStepsFromRecommendation } from "@/lib/dashboard/build-action-steps";
import { buildTrendRecommendation } from "@/lib/dashboard/build-trend-recommendation";

export type InsightHighlightTone = "good" | "attention" | "neutral";

export interface DashboardInsightHighlight {
  id: string;
  label: string;
  tone: InsightHighlightTone;
}

export interface DashboardInsight {
  summary: string;
  highlights: DashboardInsightHighlight[];
  researchNote: string;
  suggestion: string;
  suggestionSteps: string[];
  trendCaption: string | null;
}

const RESEARCH_NOTE_TH =
  "งานวิจัยด้านการวิเคราะห์ลมหายใจพบว่า แอมโมเนียและผลิตภัณฑ์จากการเผาผลาญโปรตีนอาจสะท้อนการขับถ่ายของไตในบางบริบท ระบบ PoC นี้ใช้เซนเซอร์ MQ-135/MQ-3 เพื่อติดตามแนวโน้มเท่านั้น ไม่แทนการตรวจเลือดหรือปัสสาวะ";

const RESEARCH_NOTE_EN =
  "Breath research suggests ammonia and protein metabolism markers may reflect kidney excretion in some contexts. This PoC uses MQ-135/MQ-3 sensors for trend monitoring only — not a substitute for blood or urine tests.";

export function buildDashboardInsight(input: {
  latest: Measurement;
  measurements: Measurement[];
  riskFactors?: RiskFactors;
  locale?: AppLocale;
}): DashboardInsight {
  const locale = input.locale ?? "th";
  const { latest, measurements, riskFactors } = input;
  const sensorUi = getSensorUILabels(locale);
  const riskLabels = getRiskFullLabels(locale);
  const ammoniaPpb = formatAmmoniaPpb(latest.mq135_value);
  const acetonePpb = formatAcetonePpb(latest.mq3_value);
  const ammoniaStatus = getAmmoniaStatus(latest.mq135_value);
  const acetoneStatus = getAcetoneStatus(latest.mq3_value);

  const history = measurements.slice(1);
  const trend = computeTrendContext(history, latest.mq135_value);

  const summary = generateExplanation(
    {
      risk_level: latest.risk_level,
      mq135_value: latest.mq135_value,
      mq3_value: latest.mq3_value,
      avgMq135: trend.avgMq135,
      trendPercent: trend.trendPercent,
      consecutiveHighDays: trend.consecutiveHighDays,
      riskFactors,
      ammoniaStatus,
      acetoneStatus,
      ammoniaPpb,
      acetonePpb,
    },
    locale
  );

  const statusLabel = (status: typeof ammoniaStatus) =>
    getSensorStatusLabel(locale, status);

  const highlights: DashboardInsightHighlight[] = [
    {
      id: "score",
      label: `${t(locale, "riskScoreLabel")} ${formatRiskScoreDisplay(latest.risk_score)} · ${riskLabels[latest.risk_level]}`,
      tone:
        latest.risk_level === "low"
          ? "good"
          : latest.risk_level === "moderate"
            ? "attention"
            : "attention",
    },
    {
      id: "ammonia",
      label: `${sensorUi.ammonia.label} ${ammoniaPpb} ${sensorUi.ammonia.unit} · ${statusLabel(ammoniaStatus)}`,
      tone: ammoniaStatus === "elevated" ? "attention" : "good",
    },
    {
      id: "acetone",
      label: `${sensorUi.acetone.label} ${acetonePpb} ${sensorUi.acetone.unit} · ${statusLabel(acetoneStatus)}`,
      tone: acetoneStatus === "elevated" ? "attention" : "good",
    },
  ];

  const riskDelta = computeRiskScoreDelta(measurements, latest.risk_score);
  const trendCaption =
    riskDelta != null
      ? locale === "en"
        ? formatRiskDelta(locale, riskDelta)
        : formatRiskDeltaThai(riskDelta)
      : null;

  const analytics = analyzeMeasurements(measurements);
  const ammoniaTrend = analytics?.ammoniaTrend ?? "stable";
  const recommendation = buildTrendRecommendation(
    locale,
    latest.risk_level,
    ammoniaTrend
  );
  const suggestionSteps = buildActionStepsFromRecommendation(
    recommendation,
    latest.risk_level,
    locale
  );

  return {
    summary,
    highlights,
    researchNote: locale === "en" ? RESEARCH_NOTE_EN : RESEARCH_NOTE_TH,
    suggestion: recommendation.nextStep,
    suggestionSteps,
    trendCaption,
  };
}

/** @deprecated Use buildDashboardInsight return value */
export const BREATH_SCREENING_RESEARCH_NOTE = RESEARCH_NOTE_TH;
