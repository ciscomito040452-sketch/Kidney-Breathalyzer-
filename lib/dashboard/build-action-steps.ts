import type { TrendRecommendation } from "@/lib/dashboard/build-trend-recommendation";
import { suggestionStepsForLevel } from "@/lib/dashboard/suggestion-steps";
import { t } from "@/lib/i18n/messages";
import type { AppLocale } from "@/lib/preferences/profile-preferences";
import type { RiskLevel } from "@/types/measurement";

export function buildActionStepsFromRecommendation(
  recommendation: TrendRecommendation,
  riskLevel: RiskLevel,
  locale: AppLocale
): string[] {
  const fallback = suggestionStepsForLevel(riskLevel, locale);
  const steps: string[] = [recommendation.nextStep];

  if (recommendation.tone === "attention") {
    const doctorStep = t(locale, "seeDoctor");
    if (!steps.some((s) => s.includes(doctorStep) || s.includes("แพทย์") || s.includes("doctor"))) {
      steps.push(
        locale === "en"
          ? "Consult a doctor for blood and urine tests to confirm screening results"
          : "ปรึกษาแพทย์เพื่อตรวจเลือดและปัสสาวะยืนยันผลการคัดกรอง"
      );
    }
  }

  for (const step of fallback) {
    if (steps.length >= 3) break;
    if (steps.includes(step)) continue;
    steps.push(step);
  }

  return steps.slice(0, 3);
}
