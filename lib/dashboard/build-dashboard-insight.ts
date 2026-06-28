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
  trendCaption: string | null;
}

const RESEARCH_NOTE_TH =
  "งานวิจัยด้านการวิเคราะห์ลมหายใจพบว่า แอมโมเนียและผลิตภัณฑ์จากการเผาผลาญโปรตีนอาจสะท้อนการขับถ่ายของไตในบางบริบท ระบบ PoC นี้ใช้เซนเซอร์ MQ-135/MQ-3 เพื่อติดตามแนวโน้มเท่านั้น ไม่แทนการตรวจเลือดหรือปัสสาวะ";

const RESEARCH_NOTE_EN =
  "Breath research suggests ammonia and protein metabolism markers may reflect kidney excretion in some contexts. This PoC uses MQ-135/MQ-3 sensors for trend monitoring only — not a substitute for blood or urine tests.";

function suggestionForLevel(
  riskLevel: Measurement["risk_level"],
  locale: AppLocale
): string {
  if (locale === "en") {
    switch (riskLevel) {
      case "high":
        return "Consider seeing a doctor for further evaluation and keep measuring regularly.";
      case "moderate":
        return "Re-test in 2–3 days, stay hydrated, and consult a doctor if values stay elevated.";
      default:
        return "Keep measuring regularly for long-term trends — at least 3 times per week.";
    }
  }

  switch (riskLevel) {
    case "high":
      return "ควรนัดพบแพทย์เพื่อตรวจเพิ่มเติม และวัดติดตามอย่างสม่ำเสมอ";
    case "moderate":
      return "แนะนำให้วัดซ้ำใน 2–3 วัน ดื่มน้ำให้เพียงพอ และปรึกษาแพทย์หากค่ายังสูงต่อเนื่อง";
    default:
      return "รักษาการวัดสม่ำเสมอเพื่อเห็นแนวโน้มระยะยาว — อย่างน้อย 3 ครั้งต่อสัปดาห์";
  }
}

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

  return {
    summary,
    highlights,
    researchNote: locale === "en" ? RESEARCH_NOTE_EN : RESEARCH_NOTE_TH,
    suggestion: suggestionForLevel(latest.risk_level, locale),
    trendCaption,
  };
}

/** @deprecated Use buildDashboardInsight return value */
export const BREATH_SCREENING_RESEARCH_NOTE = RESEARCH_NOTE_TH;
