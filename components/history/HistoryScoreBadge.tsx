"use client";

import { RiskScoreRing } from "@/components/shared/RiskScoreRing";
import { scorePercent } from "@/lib/risk-engine/risk-zones";
import { riskLevelColor } from "@/lib/risk-engine/risk-level";
import type { RiskLevel } from "@/types/measurement";
import { cn } from "@/lib/utils";

interface HistoryScoreBadgeProps {
  riskScore: number;
  riskLevel: RiskLevel;
  size?: number;
  className?: string;
}

export function HistoryScoreBadge({
  riskScore,
  riskLevel,
  size = 48,
  className,
}: HistoryScoreBadgeProps) {
  const display = scorePercent(riskScore);

  return (
    <div
      className={cn("relative shrink-0", className)}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <RiskScoreRing
        riskScore={riskScore}
        riskLevel={riskLevel}
        size={size}
        className="absolute inset-0"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className={cn(
            "text-sm font-semibold tabular-nums leading-none",
            riskLevelColor(riskLevel)
          )}
        >
          {display}
        </span>
      </div>
    </div>
  );
}
