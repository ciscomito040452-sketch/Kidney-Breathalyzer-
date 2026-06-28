import type { RiskLevel } from "@/types/measurement";
import type { RiskFactors } from "./calculate-score";

export interface ExplanationInput {
  risk_level: RiskLevel;
  mq135_value: number;
  mq3_value: number;
  avgMq135?: number;
  trendPercent?: number;
  riskFactors?: RiskFactors;
}

export function generateExplanation(input: ExplanationInput): string {
  const parts: string[] = [];

  if (input.avgMq135 && input.trendPercent && input.trendPercent > 15) {
    parts.push(
      `ค่า ammonia ในลมหายใจสูงกว่าค่าเฉลี่ยของคุณ ${Math.round(input.trendPercent)}% ในช่วง 7 วันที่ผ่านมา`
    );
  } else if (input.mq135_value > 300) {
    parts.push("ค่าเซนเซอร์ MQ-135 อยู่ในระดับที่สูงกว่าค่าปกติของคุณ");
  } else {
    parts.push("ค่าการวัดอยู่ในแนวโน้มที่ควรติดตามอย่างต่อเนื่อง");
  }

  if (input.riskFactors?.has_diabetes) {
    parts.push("ประกอบกับประวัติโรคเบาหวาน");
  }
  if (input.riskFactors?.has_hypertension) {
    parts.push("ประกอบกับประวัติความดันโลหิตสูง");
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
