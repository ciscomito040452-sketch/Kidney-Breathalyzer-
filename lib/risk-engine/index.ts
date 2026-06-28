export { normalizeMq135, normalizeMq3 } from "./normalize";
export {
  calculateRiskScore,
  type CalculateScoreInput,
  type CalculateScoreResult,
  type RiskFactors,
} from "./calculate-score";
export {
  scoreToRiskLevel,
  riskLevelColor,
  riskLevelBgColor,
} from "./risk-level";
export {
  generateExplanation,
  HEALTH_TIPS,
  type ExplanationInput,
} from "./explanations";
