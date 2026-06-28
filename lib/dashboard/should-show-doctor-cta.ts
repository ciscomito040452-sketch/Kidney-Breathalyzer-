import type { TrendDirection } from "@/lib/ai-insight/analyze-measurements";
import type { RiskLevel } from "@/types/measurement";
import { getAmmoniaStatus } from "@/lib/sensors/status";

export type DoctorCtaVariant = "primary" | "soft";

export interface DoctorCtaDecision {
  show: boolean;
  variant: DoctorCtaVariant;
}

export function shouldShowDoctorCta(input: {
  riskLevel: RiskLevel;
  ammoniaTrend?: TrendDirection;
  mq135Value?: number;
}): DoctorCtaDecision {
  const { riskLevel, ammoniaTrend, mq135Value } = input;

  if (riskLevel === "high") {
    return { show: true, variant: "primary" };
  }

  const ammoniaElevated =
    mq135Value != null && getAmmoniaStatus(mq135Value) === "elevated";

  if (
    riskLevel === "moderate" &&
    (ammoniaTrend === "rising" || ammoniaElevated)
  ) {
    return { show: true, variant: "soft" };
  }

  return { show: false, variant: "soft" };
}
