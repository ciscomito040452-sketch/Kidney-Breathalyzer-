import type { AppLocale } from "@/lib/preferences/profile-preferences";

export interface OnboardingDisclaimerSection {
  id: string;
  title: string;
  points: string[];
}

const SECTIONS_TH: OnboardingDisclaimerSection[] = [
  {
    id: "purpose",
    title: "วัตถุประสงค์ของระบบ",
    points: [
      "Kidney Breathalyzer เป็นแอปคู่คู่กับอุปกรณ์ IoT สำหรับคัดกรองความเสี่ยงโรคไตเบื้องต้นจากข้อมูลลมหายใจ",
      "ระบบช่วยติดตามแนวโน้มค่าที่วัดได้ เช่น แอมโมเนียและอะซิโทน รวมถึงคะแนนความเสี่ยงโดยประมาณจากข้อมูลย้อนหลัง",
      "ผลลัพธ์มีไว้สนับสนุนการดูแลสุขภาพเชิงป้องกันและการตัดสินใจเข้ารับการตรวจเพิ่มเติม ไม่ใช่การวินิจฉัยโรค",
    ],
  },
  {
    id: "limitations",
    title: "ข้อจำกัดและสิ่งที่ระบบไม่ทำ",
    points: [
      "ระบบนี้เป็น Proof of Concept (PoC) สำหรับการสาธิตและการศึกษา ไม่ใช่อุปกรณ์ทางการแพทย์ที่ผ่านการรับรอง",
      "ไม่สามารถวินิจฉัยว่าคุณเป็นโรคไต ระบุระยะของโรค หรือบอกว่าคุณมีอาการใด ๆ ได้",
      "ไม่ทดแทนการตรวจเลือด ปัสสาวะ หรือการประเมินทางคลินิกจากแพทย์",
      "ค่าเซนเซอร์และเกณฑ์อ้างอิงในแอปเป็นมาตรฐานสำหรับการสาธิต อาจไม่ตรงกับมาตรฐานทางคลินิก",
    ],
  },
  {
    id: "interpretation",
    title: "การตีความผลลัพธ์",
    points: [
      "คะแนนความเสี่ยงและข้อความสรุปเป็นการคัดกรองเบื้องต้นเท่านั้น อาจเปลี่ยนแปลงได้ตามการวัดครั้งถัดไป",
      "ค่าสูงหรือแนวโน้มที่เพิ่มขึ้น หมายถึงควรติดตามและพิจารณาปรึกษาแพทย์ ไม่ได้หมายความว่าคุณเป็นโรคไต",
      "ค่าต่ำหรือแนวโน้มที่ดีขึ้น ไม่ได้หมายความว่าไม่จำเป็นต้องตรวจสุขภาพตามปกติ",
      "คำอธิบายจาก AI ในแอปเป็นข้อมูลสุขภาพทั่วไปจากกฎที่กำหนดไว้ ไม่ใช่คำแนะนำการรักษาเฉพาะบุคคล",
    ],
  },
  {
    id: "when-to-see-doctor",
    title: "เมื่อใดควรปรึกษาแพทย์",
    points: [
      "ได้รับการแจ้งเตือนความเสี่ยงในระดับสูงหรือปานกลางต่อเนื่อง",
      "มีอาการที่น่าสงสัย เช่น บวม ปัสสาวะผิดปกติ อ่อนเพลียผิดปกติ หรือมีโรคประจำตัวที่เกี่ยวข้องกับไต",
      "มีข้อสงสัยเกี่ยวกับผลการวัดหรือสุขภาพโดยรวม แม้คะแนนจะอยู่ในระดับต่ำ",
      "ต้องการยืนยันผลก่อนตัดสินใจเรื่องสุขภาพ — ให้ปรึกษาแพทย์หรือบุคลากรทางการแพทย์เสมอ",
    ],
  },
  {
    id: "privacy",
    title: "ข้อมูลและความเป็นส่วนตัว",
    points: [
      "แอปใช้ชื่อเล่นและไม่เก็บชื่อ-นามสกุลตามหลัก PDPA สำหรับการสาธิต",
      "ข้อมูลการวัดใช้เพื่อแสดงประวัติ แนวโน้ม และสรุปในแอปเท่านั้น",
      "การวัดเกิดที่อุปกรณ์ IoT — แอปเป็นตัวแสดงผลหลังข้อมูลซิงค์เข้ามา",
    ],
  },
];

const SECTIONS_EN: OnboardingDisclaimerSection[] = [
  {
    id: "purpose",
    title: "Purpose of the system",
    points: [
      "Kidney Breathalyzer is a companion app for an IoT device for preliminary kidney disease risk screening from breath data.",
      "It helps track trends in measured values such as ammonia and acetone, plus an estimated risk score from your history.",
      "Results support preventive health care and decisions about further checkups — they are not a medical diagnosis.",
    ],
  },
  {
    id: "limitations",
    title: "Limitations and what the system does not do",
    points: [
      "This is a Proof of Concept (PoC) for demonstration and study — not a certified medical device.",
      "It cannot diagnose kidney disease, determine disease stage, or confirm any symptoms you may have.",
      "It does not replace blood tests, urine tests, or clinical assessment by a doctor.",
      "Sensor values and reference thresholds in the app are for demonstration and may not match clinical standards.",
    ],
  },
  {
    id: "interpretation",
    title: "How to interpret results",
    points: [
      "Risk scores and summaries are preliminary screening only and may change with the next reading.",
      "Elevated values or rising trends mean you should monitor closely and consider seeing a doctor — not that you have kidney disease.",
      "Low values or improving trends do not mean you can skip routine health checkups.",
      "AI explanations in the app are general health information from predefined rules — not personalized treatment advice.",
    ],
  },
  {
    id: "when-to-see-doctor",
    title: "When to see a doctor",
    points: [
      "You receive repeated moderate or high risk alerts.",
      "You have concerning symptoms such as swelling, unusual urine changes, unusual fatigue, or relevant chronic conditions.",
      "You have questions about your readings or overall health, even when scores are low.",
      "You need confirmation before health decisions — always consult a doctor or qualified health professional.",
    ],
  },
  {
    id: "privacy",
    title: "Data and privacy",
    points: [
      "The app uses a nickname and does not store full legal names (PDPA-friendly demo practice).",
      "Measurement data is used only to show history, trends, and summaries in the app.",
      "Readings are taken on the IoT device — the app displays results after data syncs.",
    ],
  },
];

export function getOnboardingDisclaimerSections(
  locale: AppLocale
): OnboardingDisclaimerSection[] {
  return locale === "en" ? SECTIONS_EN : SECTIONS_TH;
}
