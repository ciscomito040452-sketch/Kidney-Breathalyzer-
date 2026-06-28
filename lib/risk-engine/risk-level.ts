import type { RiskLevel } from "@/types/measurement";

export function scoreToRiskLevel(score: number): RiskLevel {
  if (score < 0.4) return "low";
  if (score < 0.7) return "moderate";
  return "high";
}

export function riskLevelColor(level: RiskLevel): string {
  const colors: Record<RiskLevel, string> = {
    low: "text-risk-low",
    moderate: "text-risk-moderate",
    high: "text-risk-high",
  };
  return colors[level];
}

export function riskLevelBgColor(level: RiskLevel): string {
  const colors: Record<RiskLevel, string> = {
    low: "bg-risk-low/10 border-risk-low/20",
    moderate: "bg-risk-moderate/10 border-risk-moderate/20",
    high: "bg-risk-high/10 border-risk-high/20",
  };
  return colors[level];
}
