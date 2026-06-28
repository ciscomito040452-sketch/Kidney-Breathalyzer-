import type { RiskLevel } from "@/types/measurement";
import type { RiskFactors } from "./calculate-score";
import {
  formatAcetonePpb,
  formatAmmoniaPpb,
  SENSOR_UI,
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

export function generateExplanation(input: ExplanationInput): string {
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
      `แอมโมเนีย (${ammoniaPpb} ${SENSOR_UI.ammonia.unit}) และอะซิโทน (${acetonePpb} ${SENSOR_UI.acetone.unit}) อยู่สูงกว่าเกณฑ์อ้างอิงสำหรับการคัดกรอง`
    );
  } else if (ammoniaElevated) {
    parts.push(
      `แอมโมเนียในลมหายใจ (${ammoniaPpb} ${SENSOR_UI.ammonia.unit}) สูงกว่าเกณฑ์อ้างอิง ขณะที่อะซิโทน (${acetonePpb} ${SENSOR_UI.acetone.unit}) อยู่ในช่วงปกติ`
    );
  } else if (acetoneElevated) {
    parts.push(
      `อะซิโทนในลมหายใจ (${acetonePpb} ${SENSOR_UI.acetone.unit}) สูงกว่าเกณฑ์อ้างอิง ขณะที่แอมโมเนียอยู่ในช่วงปกติ`
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
    low: "ระบบประเมินความเสี่ยงในระดับต่ำ",
    moderate: "ระบบประเมินความเสี่ยงในระดับปานกลาง",
    high: "ระบบประเมินความเสี่ยงในระดับสูง ควรปรึกษาแพทย์",
  };

  parts.push(levelText[input.risk_level]);
  return parts.join(" ");
}

export const HEALTH_TIPS = [
  "ดื่มน้ำให้เพียงพอตามที่ร่างกายต้องการ",
  "ลดการบริโภคโปรตีนในปริมาณที่มากเกินไป",
  "ออกกำลังกายสม่ำเสมอตามความเหมาะสม",
  "ตรวจสุขภาพกับแพทย์เป็นระยะ",
];
