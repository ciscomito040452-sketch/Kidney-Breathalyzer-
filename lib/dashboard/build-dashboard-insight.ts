import { RISK_SHORT_LABELS } from "@/lib/constants";
import { formatRiskDeltaThai, computeRiskScoreDelta } from "@/lib/measurements/risk-delta";
import { generateExplanation } from "@/lib/risk-engine/explanations";
import { computeTrendContext } from "@/lib/risk-engine/trend-context";
import {
  formatAcetonePpb,
  formatAmmoniaPpb,
  formatRiskScoreDisplay,
  SENSOR_UI,
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

/** Screening context — PoC, not clinical diagnosis (aligned with PROJECT_CONTEXT.md) */
export const BREATH_SCREENING_RESEARCH_NOTE =
  "งานวิจัยด้านการวิเคราะห์ลมหายใจพบว่า แอมโมเนียและผลิตภัณฑ์จากการเผาผลาญโปรตีนอาจสะท้อนการขับถ่ายของไตในบางบริบท ระบบ PoC นี้ใช้เซนเซอร์ MQ-135/MQ-3 เพื่อติดตามแนวโน้มเท่านั้น ไม่แทนการตรวจเลือดหรือปัสสาวะ";

function suggestionForLevel(
  riskLevel: Measurement["risk_level"]
): string {
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
}): DashboardInsight {
  const { latest, measurements, riskFactors } = input;
  const ammoniaPpb = formatAmmoniaPpb(latest.mq135_value);
  const acetonePpb = formatAcetonePpb(latest.mq3_value);
  const ammoniaStatus = getAmmoniaStatus(latest.mq135_value);
  const acetoneStatus = getAcetoneStatus(latest.mq3_value);

  const history = measurements.slice(1);
  const trend = computeTrendContext(history, latest.mq135_value);

  const summary = generateExplanation({
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
  });

  const highlights: DashboardInsightHighlight[] = [
    {
      id: "score",
      label: `คะแนน ${formatRiskScoreDisplay(latest.risk_score)} · ${RISK_SHORT_LABELS[latest.risk_level]}`,
      tone:
        latest.risk_level === "low"
          ? "good"
          : latest.risk_level === "moderate"
            ? "attention"
            : "attention",
    },
    {
      id: "ammonia",
      label: `${SENSOR_UI.ammonia.label.split(" ")[0]} ${ammoniaPpb} ${SENSOR_UI.ammonia.unit} · ${
        ammoniaStatus === "elevated" ? "สูงกว่าปกติ" : "ปกติ"
      }`,
      tone: ammoniaStatus === "elevated" ? "attention" : "good",
    },
    {
      id: "acetone",
      label: `${SENSOR_UI.acetone.label} ${acetonePpb} ${SENSOR_UI.acetone.unit} · ${
        acetoneStatus === "elevated" ? "สูงกว่าปกติ" : "ปกติ"
      }`,
      tone: acetoneStatus === "elevated" ? "attention" : "good",
    },
  ];

  const riskDelta = computeRiskScoreDelta(measurements, latest.risk_score);
  const trendCaption =
    riskDelta != null ? formatRiskDeltaThai(riskDelta) : null;

  return {
    summary,
    highlights,
    researchNote: BREATH_SCREENING_RESEARCH_NOTE,
    suggestion: suggestionForLevel(latest.risk_level),
    trendCaption,
  };
}
