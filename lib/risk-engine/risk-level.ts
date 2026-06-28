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

export function riskHeroCardClasses(level: RiskLevel): string {
  const classes: Record<RiskLevel, string> = {
    low: "border-risk-low/15 bg-gradient-to-br from-risk-low/10 via-white to-risk-low/5",
    moderate:
      "border-risk-moderate/15 bg-gradient-to-br from-risk-moderate/10 via-white to-risk-moderate/5",
    high: "border-risk-high/15 bg-gradient-to-br from-risk-high/10 via-white to-risk-high/5",
  };
  return classes[level];
}

export function riskHeroGlowClasses(level: RiskLevel): string {
  const classes: Record<RiskLevel, string> = {
    low: "from-risk-low/30 to-risk-low/20",
    moderate: "from-risk-moderate/30 to-risk-moderate/20",
    high: "from-risk-high/30 to-risk-high/20",
  };
  return classes[level];
}
