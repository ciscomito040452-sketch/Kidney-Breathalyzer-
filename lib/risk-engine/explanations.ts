import type { RiskLevel } from "@/types/measurement";
import type { RiskFactors } from "./calculate-score";
import type { AppLocale } from "@/lib/preferences/profile-preferences";
import {
  formatAcetonePpb,
  formatAmmoniaPpb,
} from "@/lib/sensor-labels";
import type { SensorStatus } from "@/lib/sensors/status";

export interface ExplanationInput {
  risk_level: RiskLevel;
  mq135_value: number;
  mq3_value: number;
  avgMq135?: number;
  trendPercent?: number;
  consecutiveHighDays?: number;
  riskFactors?: RiskFactors;
  ammoniaStatus?: SensorStatus;
  acetoneStatus?: SensorStatus;
  ammoniaPpb?: number;
  acetonePpb?: number;
}

export function generateExplanation(
  input: ExplanationInput,
  locale: AppLocale = "th"
): string {
  if (locale === "en") {
    return generateExplanationEn(input);
  }

  const parts: string[] = [];
  const ammoniaPpb = input.ammoniaPpb ?? formatAmmoniaPpb(input.mq135_value);
  const acetonePpb = input.acetonePpb ?? formatAcetonePpb(input.mq3_value);
  const ammoniaElevated = input.ammoniaStatus === "elevated";
  const acetoneElevated = input.acetoneStatus === "elevated";

  if (input.consecutiveHighDays && input.consecutiveHighDays >= 3) {
    const pct =
      input.trendPercent && input.trendPercent > 0
        ? ` ${Math.round(input.trendPercent)}%`
        : "";
    parts.push(
      `แอมโมเนียในลมหายใจสูงกว่าค่าเฉลี่ยของคุณ${pct} ติดต่อกัน ${input.consecutiveHighDays} วัน`
    );
  } else if (input.avgMq135 && input.trendPercent && input.trendPercent > 15) {
    parts.push(
      `แอมโมเนียในลมหายใจสูงกว่าค่าเฉลี่ยของคุณ ${Math.round(input.trendPercent)}% ในช่วง 7 วันที่ผ่านมา`
    );
  } else if (ammoniaElevated && acetoneElevated) {
    parts.push(
      `แอมโมเนีย (${ammoniaPpb} ppb) และอะซิโทน (${acetonePpb} ppb) อยู่สูงกว่าเกณฑ์อ้างอิงสำหรับการคัดกรอง`
    );
  } else if (ammoniaElevated) {
    parts.push(
      `แอมโมเนียในลมหายใจ (${ammoniaPpb} ppb) สูงกว่าเกณฑ์อ้างอิง ขณะที่อะซิโทน (${acetonePpb} ppb) อยู่ในช่วงปกติ`
    );
  } else if (acetoneElevated) {
    parts.push(
      `อะซิโทนในลมหายใจ (${acetonePpb} ppb) สูงกว่าเกณฑ์อ้างอิง ขณะที่แอมโมเนียอยู่ในช่วงปกติ`
    );
  } else {
    parts.push(
      "ค่าแอมโมเนียและอะซิโทนในลมหายใจอยู่ในแนวโน้มที่ควรติดตามอย่างต่อเนื่อง"
    );
  }

  if (input.riskFactors?.has_diabetes) {
    parts.push("ประกอบกับประวัติโรคเบาหวาน");
  }
  if (input.riskFactors?.has_hypertension) {
    parts.push("ประกอบกับประวัติความดันโลหิตสูง");
  }
  if (input.riskFactors?.has_family_history) {
    parts.push("ประกอบกับประวัติโรคไตในครอบครัว");
  }

  const levelText: Record<RiskLevel, string> = {
    low: "ระบบประเมินการคัดกรองความเสี่ยงโรคไตในระดับต่ำ — ควรวัดต่อเนื่อง",
    moderate:
      "ระบบประเมินการคัดกรองความเสี่ยงโรคไตในระดับปานกลาง — ควรติดตามและพิจารณาปรึกษาแพทย์หากค่ายังสูง",
    high: "ระบบประเมินการคัดกรองความเสี่ยงโรคไตในระดับสูง — แนะนำปรึกษาแพทย์เพื่อตรวจเลือดและปัสสาวะ",
  };

  parts.push(levelText[input.risk_level]);
  return parts.join(" ");
}

function generateExplanationEn(input: ExplanationInput): string {
  const ammoniaPpb = input.ammoniaPpb ?? formatAmmoniaPpb(input.mq135_value);
  const acetonePpb = input.acetonePpb ?? formatAcetonePpb(input.mq3_value);
  const ammoniaElevated = input.ammoniaStatus === "elevated";
  const acetoneElevated = input.acetoneStatus === "elevated";

  let lead = "Ammonia and acetone in breath are within a range worth monitoring.";
  if (ammoniaElevated && acetoneElevated) {
    lead = `Ammonia (${ammoniaPpb} ppb) and acetone (${acetonePpb} ppb) are above reference screening thresholds.`;
  } else if (ammoniaElevated) {
    lead = `Ammonia (${ammoniaPpb} ppb) is elevated while acetone (${acetonePpb} ppb) is normal.`;
  } else if (acetoneElevated) {
    lead = `Acetone (${acetonePpb} ppb) is elevated while ammonia is normal.`;
  }

  const levelText: Record<RiskLevel, string> = {
    low: "Kidney disease screening risk is assessed as low — keep measuring regularly.",
    moderate:
      "Kidney disease screening risk is assessed as moderate — monitor and consider a doctor if values stay elevated.",
    high: "Kidney disease screening risk is assessed as high — consult a doctor for blood and urine tests.",
  };

  return `${lead} ${levelText[input.risk_level]}`;
}

export const HEALTH_TIPS = [
  "ดื่มน้ำให้เพียงพอตามที่ร่างกายต้องการ",
  "ลดการบริโภคโปรตีนในปริมาณที่มากเกินไป",
  "ออกกำลังกายสม่ำเสมอตามความเหมาะสม",
  "ตรวจสุขภาพกับแพทย์เป็นระยะ",
];

export const HEALTH_TIPS_EN = [
  "Stay well hydrated",
  "Avoid excessive protein intake",
  "Exercise regularly as appropriate",
  "See your doctor for routine checkups",
];

export function getHealthTips(locale: AppLocale): string[] {
  return locale === "en" ? HEALTH_TIPS_EN : HEALTH_TIPS;
}
