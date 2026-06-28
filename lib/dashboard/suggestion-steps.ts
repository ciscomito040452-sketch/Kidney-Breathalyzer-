import type { AppLocale } from "@/lib/preferences/profile-preferences";
import type { Measurement } from "@/types/measurement";

export function suggestionStepsForLevel(
  riskLevel: Measurement["risk_level"],
  locale: AppLocale
): string[] {
  if (locale === "en") {
    switch (riskLevel) {
      case "high":
        return [
          "Consider seeing a doctor for further evaluation",
          "Keep measuring regularly",
        ];
      case "moderate":
        return [
          "Re-test in 2–3 days",
          "Stay hydrated",
          "Consult a doctor if values stay elevated",
        ];
      default:
        return [
          "Keep measuring regularly for long-term trends",
          "Aim for at least 3 readings per week",
        ];
    }
  }

  switch (riskLevel) {
    case "high":
      return [
        "ควรนัดพบแพทย์เพื่อตรวจเพิ่มเติม",
        "วัดติดตามอย่างสม่ำเสมอ",
      ];
    case "moderate":
      return [
        "แนะนำให้วัดซ้ำใน 2–3 วัน",
        "ดื่มน้ำให้เพียงพอ",
        "ปรึกษาแพทย์หากค่ายังสูงต่อเนื่อง",
      ];
    default:
      return [
        "รักษาการวัดสม่ำเสมอเพื่อเห็นแนวโน้มระยะยาว",
        "อย่างน้อย 3 ครั้งต่อสัปดาห์",
      ];
  }
}

export function suggestionForLevel(
  riskLevel: Measurement["risk_level"],
  locale: AppLocale
): string {
  return suggestionStepsForLevel(riskLevel, locale).join(
    locale === "en" ? ". " : " · "
  );
}
