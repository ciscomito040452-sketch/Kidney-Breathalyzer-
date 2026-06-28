import type { Measurement } from "@/types/measurement";
import { normalizeMq135, normalizeMq3 } from "./normalize";
import { scoreToRiskLevel } from "./risk-level";

export interface RiskFactors {
  has_diabetes?: boolean;
  has_hypertension?: boolean;
  has_family_history?: boolean;
}

export interface CalculateScoreInput {
  mq135_value: number;
  mq3_value: number;
  riskFactors?: RiskFactors;
  history?: Pick<Measurement, "mq135_value" | "mq3_value" | "measured_at">[];
}

export interface CalculateScoreResult {
  risk_score: number;
  risk_level: ReturnType<typeof scoreToRiskLevel>;
  trend_bonus: number;
}

function calculateTrendBonus(
  mq135: number,
  history: CalculateScoreInput["history"]
): number {
  if (!history || history.length < 3) return 0;

  const recent = history.slice(0, 3);
  const avg =
    recent.reduce((sum, m) => sum + m.mq135_value, 0) / recent.length;
  const threshold = avg * 1.15;

  const allAbove = recent.every((m) => m.mq135_value > threshold);
  return allAbove ? 0.15 : 0;
}

export function calculateRiskScore(
  input: CalculateScoreInput
): CalculateScoreResult {
  const baseScore =
    normalizeMq135(input.mq135_value) * 0.6 +
    normalizeMq3(input.mq3_value) * 0.4;

  let multiplier = 0;
  if (input.riskFactors?.has_diabetes) multiplier += 0.1;
  if (input.riskFactors?.has_hypertension) multiplier += 0.1;
  if (input.riskFactors?.has_family_history) multiplier += 0.05;

  const trendBonus = calculateTrendBonus(input.mq135_value, input.history);

  const risk_score = Math.min(1, baseScore + multiplier + trendBonus);
  const risk_level = scoreToRiskLevel(risk_score);

  return { risk_score, risk_level, trend_bonus: trendBonus };
}
