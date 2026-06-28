import { cookies } from "next/headers";
import { getDefaultDemoRiskFactors } from "@/lib/mock/demo-user";
import type { DemoRiskFactors } from "@/lib/profile/onboarding-storage";
import { RISK_FACTORS_COOKIE } from "@/lib/profile/risk-factors-cookie";

export function getEffectiveRiskFactors(): DemoRiskFactors {
  const raw = cookies().get(RISK_FACTORS_COOKIE)?.value;
  if (!raw) return getDefaultDemoRiskFactors();

  try {
    const parsed = JSON.parse(decodeURIComponent(raw)) as DemoRiskFactors;
    return {
      has_diabetes: Boolean(parsed.has_diabetes),
      has_hypertension: Boolean(parsed.has_hypertension),
      has_family_history: Boolean(parsed.has_family_history),
      risk_factor_ids: parsed.risk_factor_ids ?? [],
      risk_factor_other: parsed.risk_factor_other ?? null,
      display_name: parsed.display_name ?? null,
    };
  } catch {
    return getDefaultDemoRiskFactors();
  }
}
