import type { DemoRiskFactors } from "@/lib/profile/onboarding-storage";

export const RISK_FACTORS_COOKIE = "kb-risk-factors";

export function buildRiskFactorsCookieValue(factors: DemoRiskFactors): string {
  return encodeURIComponent(JSON.stringify(factors));
}
