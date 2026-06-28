import {
  analyzeMeasurements,
  type MeasurementAnalytics,
  type TrendDirection,
} from "@/lib/ai-insight/analyze-measurements";
import type { InsightHighlightTone } from "@/lib/dashboard/build-dashboard-insight";
import {
  getRiskFullLabels,
  getSensorStatusLabel,
  getSensorUILabels,
} from "@/lib/i18n/labels";
import { t } from "@/lib/i18n/messages";
import type { AppLocale } from "@/lib/preferences/profile-preferences";
import type { RiskFactors } from "@/lib/risk-engine/calculate-score";
import { scoreToRiskLevel } from "@/lib/risk-engine/risk-level";
import { scorePercent } from "@/lib/risk-engine/risk-zones";
import {
  formatAcetonePpb,
  formatAmmoniaPpb,
  formatRiskScoreDisplay,
} from "@/lib/sensor-labels";
import {
  getAcetoneStatus,
  getAmmoniaStatus,
} from "@/lib/sensors/status";
import type { Measurement, RiskLevel } from "@/types/measurement";

export interface HolisticInsightHighlight {
  id: string;
  label: string;
  tone: InsightHighlightTone;
}

export interface HolisticInsight {
  summary: string;
  highlights: HolisticInsightHighlight[];
  researchNote: string;
  suggestion: string;
  periodCaption: string;
  overallRiskLevel: RiskLevel;
  avgRiskScore: number;
  analytics: MeasurementAnalytics;
  trendNarrative: string;
}

const RESEARCH_NOTE_TH =
  "งานวิจัยด้านลมหายใจพบว่า แอมโมเนียและสารจากการเผาผลาญโปรตีนอาจสะท้อนการขับถ่ายของไตในบางบริบท (เช่น การสะสมของยูเรีย) ระบบ PoC นี้ใช้เซนเซอร์ MQ-135/MQ-3 เพื่อติดตามแนวโน้มระยะยาวเท่านั้น — ไม่แทนการตรวจเลือดหรือปัสสาวะ";

const RESEARCH_NOTE_EN =
  "Breath research suggests ammonia and protein metabolism markers may reflect kidney excretion in some contexts (e.g. urea buildup). This PoC uses MQ-135/MQ-3 sensors for long-term trend monitoring only — not a substitute for blood or urine tests.";

function trendPhraseTh(direction: TrendDirection): string {
  switch (direction) {
    case "rising":
      return "มีแนวโน้มเพิ่มขึ้น";
    case "falling":
      return "มีแนวโน้มลดลง";
    default:
      return "ค่อนข้างคงที่";
  }
}

function trendPhraseEn(direction: TrendDirection): string {
  switch (direction) {
    case "rising":
      return "trending upward";
    case "falling":
      return "trending downward";
    default:
      return "relatively stable";
  }
}

function suggestionForLevel(
  riskLevel: RiskLevel,
  locale: AppLocale
): string {
  if (locale === "en") {
    switch (riskLevel) {
      case "high":
        return "Based on your history, consider seeing a doctor for further evaluation and keep measuring regularly.";
      case "moderate":
        return "Keep measuring 2–3 times per week, stay hydrated, and consult a doctor if elevated readings persist.";
      default:
        return "Your overall pattern looks reassuring — keep regular measurements to spot long-term changes early.";
    }
  }

  switch (riskLevel) {
    case "high":
      return "จากภาพรวมข้อมูล ควรนัดพบแพทย์เพื่อตรวจเพิ่มเติม และวัดติดตามอย่างสม่ำเสมอ";
    case "moderate":
      return "แนะนำให้วัดสม่ำเสมอ 2–3 ครั้งต่อสัปดาห์ ดื่มน้ำให้เพียงพอ และปรึกษาแพทย์หากค่ายังสูงต่อเนื่อง";
    default:
      return "ภาพรวมอยู่ในเกณฑ์ที่น่าพอใจ — รักษาการวัดสม่ำเสมอเพื่อเห็นการเปลี่ยนแปลงระยะยาว";
  }
}

function buildSummaryTh(
  analytics: MeasurementAnalytics,
  overallRiskLevel: RiskLevel,
  riskFactors?: RiskFactors
): string {
  const avgDisplay = scorePercent(analytics.avgRiskScore);
  const parts: string[] = [];

  parts.push(
    `จากการวัด ${analytics.count} ครั้งใน ${analytics.daySpan} วัน ค่าแอมโมเนียในลมหายใจ${trendPhraseTh(analytics.ammoniaTrend)}เมื่อเทียบช่วงต้นและปลายของข้อมูล`
  );

  if (analytics.moderateOrHighPercent >= 40) {
    parts.push(
      `การวัดส่วนใหญ่ (${analytics.moderateOrHighPercent}%) อยู่ในระดับความเสี่ยงปานกลางขึ้นไป`
    );
  } else {
    parts.push(
      `ส่วนใหญ่อยู่ในระดับความเสี่ยงต่ำถึงปานกลาง`
    );
  }

  if (analytics.elevatedAmmoniaPercent >= 30) {
    parts.push(
      `แอมโมเนียสูงกว่าเกณฑ์อ้างอิงใน ${analytics.elevatedAmmoniaPercent}% ของการวัด`
    );
  }

  if (riskFactors?.has_diabetes) {
    parts.push("ประกอบกับประวัติโรคเบาหวานที่คุณระบุ");
  }
  if (riskFactors?.has_hypertension) {
    parts.push("ประกอบกับประวัติความดันโลหิตสูง");
  }
  if (riskFactors?.has_family_history) {
    parts.push("ประกอบกับประวัติโรคไตในครอบครัว");
  }

  const levelText: Record<RiskLevel, string> = {
    low: `คะแนนความเสี่ยงเฉลี่ย ${avgDisplay}/100 — ภาพรวมอยู่ในระดับต่ำ`,
    moderate: `คะแนนความเสี่ยงเฉลี่ย ${avgDisplay}/100 — ภาพรวมอยู่ในระดับปานกลาง ควรติดตามต่อเนื่อง`,
    high: `คะแนนความเสี่ยงเฉลี่ย ${avgDisplay}/100 — ภาพรวมอยู่ในระดับสูง ควรปรึกษาแพทย์`,
  };

  parts.push(levelText[overallRiskLevel]);
  return parts.join(" ");
}

function buildSummaryEn(
  analytics: MeasurementAnalytics,
  overallRiskLevel: RiskLevel
): string {
  const avgDisplay = scorePercent(analytics.avgRiskScore);
  const parts: string[] = [];

  parts.push(
    `Across ${analytics.count} readings over ${analytics.daySpan} days, breath ammonia is ${trendPhraseEn(analytics.ammoniaTrend)} compared with earlier vs. later in your history.`
  );

  if (analytics.moderateOrHighPercent >= 40) {
    parts.push(
      `${analytics.moderateOrHighPercent}% of readings were moderate risk or higher.`
    );
  }

  if (analytics.elevatedAmmoniaPercent >= 30) {
    parts.push(
      `Ammonia was above the reference threshold in ${analytics.elevatedAmmoniaPercent}% of readings.`
    );
  }

  const levelText: Record<RiskLevel, string> = {
    low: `Average risk score ${avgDisplay}/100 — overall pattern is low.`,
    moderate: `Average risk score ${avgDisplay}/100 — overall pattern is moderate; keep monitoring.`,
    high: `Average risk score ${avgDisplay}/100 — overall pattern is elevated; consider seeing a doctor.`,
  };

  parts.push(levelText[overallRiskLevel]);
  return parts.join(" ");
}

function buildTrendNarrative(
  locale: AppLocale,
  analytics: MeasurementAnalytics,
  sensorName: string
): string {
  const pct = Math.round(Math.abs(analytics.ammoniaTrendPercent));
  if (analytics.ammoniaTrend === "stable") {
    return locale === "en"
      ? `${sensorName} stayed relatively stable across your full history.`
      : `ค่า${sensorName}ค่อนข้างคงที่ตลอดช่วงข้อมูลทั้งหมด`;
  }
  if (analytics.ammoniaTrend === "rising") {
    return locale === "en"
      ? `${sensorName} rose about ${pct}% from the first half to the second half of your readings.`
      : `ค่า${sensorName}สูงขึ้นประมาณ ${pct}% เมื่อเทียบครึ่งแรกกับครึ่งหลังของข้อมูล`;
  }
  return locale === "en"
    ? `${sensorName} fell about ${pct}% from the first half to the second half of your readings.`
    : `ค่า${sensorName}ลดลงประมาณ ${pct}% เมื่อเทียบครึ่งแรกกับครึ่งหลังของข้อมูล`;
}

export function buildHolisticInsight(input: {
  measurements: Measurement[];
  riskFactors?: RiskFactors;
  locale?: AppLocale;
}): HolisticInsight | null {
  const locale = input.locale ?? "th";
  const analytics = analyzeMeasurements(input.measurements);
  if (!analytics) return null;

  const overallRiskLevel = scoreToRiskLevel(analytics.avgRiskScore);
  const sensorUi = getSensorUILabels(locale);
  const riskLabels = getRiskFullLabels(locale);
  const ammoniaPpb = formatAmmoniaPpb(analytics.avgMq135);
  const acetonePpb = formatAcetonePpb(analytics.avgMq3);
  const ammoniaStatus = getAmmoniaStatus(analytics.avgMq135);
  const acetoneStatus = getAcetoneStatus(analytics.avgMq3);

  const summary =
    locale === "en"
      ? buildSummaryEn(analytics, overallRiskLevel)
      : buildSummaryTh(analytics, overallRiskLevel, input.riskFactors);

  const statusLabel = (status: typeof ammoniaStatus) =>
    getSensorStatusLabel(locale, status);

  const highlights: HolisticInsightHighlight[] = [
    {
      id: "avg-score",
      label:
        locale === "en"
          ? `Avg. score ${formatRiskScoreDisplay(analytics.avgRiskScore)} · ${riskLabels[overallRiskLevel]}`
          : `คะแนนเฉลี่ย ${formatRiskScoreDisplay(analytics.avgRiskScore)} · ${riskLabels[overallRiskLevel]}`,
      tone:
        overallRiskLevel === "low"
          ? "good"
          : overallRiskLevel === "high"
            ? "attention"
            : "attention",
    },
    {
      id: "ammonia",
      label:
        locale === "en"
          ? `${sensorUi.ammonia.label} avg. ${ammoniaPpb} ${sensorUi.ammonia.unit} · ${statusLabel(ammoniaStatus)}`
          : `${sensorUi.ammonia.label} เฉลี่ย ${ammoniaPpb} ${sensorUi.ammonia.unit} · ${statusLabel(ammoniaStatus)}`,
      tone: ammoniaStatus === "elevated" ? "attention" : "good",
    },
    {
      id: "pattern",
      label:
        locale === "en"
          ? `${analytics.count} readings · ${analytics.moderateOrHighPercent}% moderate or higher`
          : `วัด ${analytics.count} ครั้ง · ${analytics.moderateOrHighPercent}% ปานกลางขึ้นไป`,
      tone: analytics.moderateOrHighPercent >= 50 ? "attention" : "neutral",
    },
    {
      id: "acetone",
      label:
        locale === "en"
          ? `${sensorUi.acetone.label} avg. ${acetonePpb} ${sensorUi.acetone.unit} · ${statusLabel(acetoneStatus)}`
          : `${sensorUi.acetone.label} เฉลี่ย ${acetonePpb} ${sensorUi.acetone.unit} · ${statusLabel(acetoneStatus)}`,
      tone: acetoneStatus === "elevated" ? "attention" : "good",
    },
  ];

  const periodCaption = t(locale, "insightPeriodCaption")
    .replace("{count}", String(analytics.count))
    .replace("{days}", String(analytics.daySpan));

  const ammoniaName = sensorUi.ammonia.label.split(" ")[0];

  return {
    summary,
    highlights,
    researchNote: locale === "en" ? RESEARCH_NOTE_EN : RESEARCH_NOTE_TH,
    suggestion: suggestionForLevel(overallRiskLevel, locale),
    periodCaption,
    overallRiskLevel,
    avgRiskScore: analytics.avgRiskScore,
    analytics,
    trendNarrative: buildTrendNarrative(locale, analytics, ammoniaName),
  };
}
