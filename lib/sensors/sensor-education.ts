import { MEDICAL_DISCLAIMER } from "@/lib/constants";
import { RISK_ZONE_BOUNDS } from "@/lib/risk-engine/risk-zones";
import { SENSOR_UI } from "@/lib/sensor-labels";
import type { SensorStatus } from "@/lib/sensors/status";
import { SENSOR_ELEVATED_THRESHOLDS } from "@/lib/sensors/sensor-zones";
import type { RiskLevel } from "@/types/measurement";

export type EducationTopic = "ammonia" | "acetone" | "risk_score" | "all";

export type EducationSectionKind =
  | "intro"
  | "current"
  | "threshold"
  | "source"
  | "disclaimer";

export interface EducationSection {
  title: string;
  body: string;
  kind: EducationSectionKind;
}

export interface EducationContext {
  ammoniaPpb?: number;
  acetonePpb?: number;
  riskScore?: number;
  riskLevel?: RiskLevel;
  ammoniaStatus?: SensorStatus;
  acetoneStatus?: SensorStatus;
  riskLevelLabel?: string;
}

function ammoniaSections(ctx: EducationContext): EducationSection[] {
  const ppb = ctx.ammoniaPpb;
  const status = ctx.ammoniaStatus;
  const threshold = SENSOR_ELEVATED_THRESHOLDS.ammonia;

  const sections: EducationSection[] = [
    {
      kind: "intro",
      title: `${SENSOR_UI.ammonia.label} คืออะไร`,
      body:
        "แอมโมเนียในลมหายใจเป็นข้อมูลสุขภาพทั่วไปที่อุปกรณ์วัดได้ ระบบนี้ใช้สำหรับคัดกรองความเสี่ยงเบื้องต้น ไม่ใช่การวินิจฉัยโรค",
    },
  ];

  if (ppb != null && status) {
    sections.push({
      kind: "current",
      title: "ค่าของคุณตอนนี้",
      body:
        status === "elevated"
          ? `${ppb} ${SENSOR_UI.ammonia.unit} — สูงกว่าเกณฑ์อ้างอิงสำหรับการคัดกรอง (${threshold} ${SENSOR_UI.ammonia.unit})`
          : `${ppb} ${SENSOR_UI.ammonia.unit} — อยู่ในช่วงเกณฑ์อ้างอิงสำหรับการคัดกรอง (ต่ำกว่า ${threshold} ${SENSOR_UI.ammonia.unit})`,
    });
  }

  sections.push({
    kind: "threshold",
    title: "เกณฑ์อ้างอิง (PoC)",
    body: `เกณฑ์อ้างอิง: ต่ำกว่า ${threshold} ${SENSOR_UI.ammonia.unit}\nสูงกว่าเกณฑ์: ${threshold} ${SENSOR_UI.ammonia.unit} ขึ้นไป`,
  });

  return sections;
}

function acetoneSections(ctx: EducationContext): EducationSection[] {
  const ppb = ctx.acetonePpb;
  const status = ctx.acetoneStatus;
  const threshold = SENSOR_ELEVATED_THRESHOLDS.acetone;

  const sections: EducationSection[] = [
    {
      kind: "intro",
      title: `${SENSOR_UI.acetone.label} คืออะไร`,
      body:
        "อะซิโทนในลมหายใจเป็นสารที่อุปกรณ์ตรวจจับได้ ค่านี้ใช้ประกอบการคัดกรองความเสี่ยงเท่านั้น ไม่ใช่ผลวินิจฉัยทางการแพทย์",
    },
  ];

  if (ppb != null && status) {
    sections.push({
      kind: "current",
      title: "ค่าของคุณตอนนี้",
      body:
        status === "elevated"
          ? `${ppb} ${SENSOR_UI.acetone.unit} — สูงกว่าเกณฑ์อ้างอิงสำหรับการคัดกรอง (${threshold} ${SENSOR_UI.acetone.unit})`
          : `${ppb} ${SENSOR_UI.acetone.unit} — อยู่ในช่วงเกณฑ์อ้างอิงสำหรับการคัดกรอง (ต่ำกว่า ${threshold} ${SENSOR_UI.acetone.unit})`,
    });
  }

  sections.push({
    kind: "threshold",
    title: "เกณฑ์อ้างอิง (PoC)",
    body: `เกณฑ์อ้างอิง: ต่ำกว่า ${threshold} ${SENSOR_UI.acetone.unit}\nสูงกว่าเกณฑ์: ${threshold} ${SENSOR_UI.acetone.unit} ขึ้นไป`,
  });

  return sections;
}

function riskScoreSections(ctx: EducationContext): EducationSection[] {
  const pct =
    ctx.riskScore != null ? Math.round(ctx.riskScore * 100) : undefined;

  const sections: EducationSection[] = [
    {
      kind: "intro",
      title: "คะแนนความเสี่ยง 0–100 คืออะไร",
      body:
        "คะแนนรวมจากค่าเซนเซอร์ แนวโน้มย้อนหลัง และปัจจัยเสี่ยงที่คุณระบุ ใช้สำหรับคัดกรองความเสี่ยงเบื้องต้นเท่านั้น",
    },
  ];

  if (pct != null) {
    sections.push({
      kind: "current",
      title: "คะแนนของคุณตอนนี้",
      body: `${pct}/100${ctx.riskLevelLabel ? ` — ${ctx.riskLevelLabel}` : ""}`,
    });
  }

  sections.push({
    kind: "threshold",
    title: "ช่วงคะแนนอ้างอิง",
    body: `ต่ำ: 0–${RISK_ZONE_BOUNDS.lowMax - 1}\nปานกลาง: ${RISK_ZONE_BOUNDS.lowMax}–${RISK_ZONE_BOUNDS.moderateMax - 1}\nสูง: ${RISK_ZONE_BOUNDS.moderateMax}–100`,
  });

  return sections;
}

const SOURCE_SECTION: EducationSection = {
  kind: "source",
  title: "ข้อมูลอิงจากอะไร",
  body:
    "ค่าจากเซนเซอร์ MQ-135 (แอมโมเนีย) และ MQ-3 (อะซิโทน) บนอุปกรณ์ Kidney Breathalyzer ส่งผ่าน Wi-Fi เข้าระบบ แล้วคำนวณคะแนนด้วยกฎในระบบสาธิต (PoC)",
};

const DISCLAIMER_SECTION: EducationSection = {
  kind: "disclaimer",
  title: "ข้อจำกัด",
  body: MEDICAL_DISCLAIMER,
};

export function getSensorEducation(
  topic: EducationTopic,
  ctx: EducationContext = {}
): EducationSection[] {
  const sections: EducationSection[] = [];

  if (topic === "ammonia" || topic === "all") {
    sections.push(...ammoniaSections(ctx));
  }
  if (topic === "acetone" || topic === "all") {
    sections.push(...acetoneSections(ctx));
  }
  if (topic === "risk_score" || topic === "all") {
    sections.push(...riskScoreSections(ctx));
  }

  if (topic === "all" || topic === "ammonia" || topic === "acetone") {
    sections.push(SOURCE_SECTION);
  }

  sections.push(DISCLAIMER_SECTION);
  return sections;
}

export function educationTopicTitle(topic: EducationTopic): string {
  switch (topic) {
    case "ammonia":
      return SENSOR_UI.ammonia.label;
    case "acetone":
      return SENSOR_UI.acetone.label;
    case "risk_score":
      return "คะแนนความเสี่ยง";
    case "all":
      return "ทำความเข้าใจข้อมูลการวัด";
  }
}
