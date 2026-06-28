import type { RiskLevel } from "@/types/measurement";
import { RISK_SHORT_LABELS } from "@/lib/constants";
import { riskLevelColor } from "@/lib/risk-engine/risk-level";
import { cn } from "@/lib/utils";

const pillBg: Record<RiskLevel, string> = {
  low: "bg-risk-low/10",
  moderate: "bg-risk-moderate/10",
  high: "bg-risk-high/10",
};

interface RiskIndicatorProps {
  level: RiskLevel;
  className?: string;
}

/** Pill fallback for very tight layouts */
export function RiskIndicator({ level, className }: RiskIndicatorProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        pillBg[level],
        riskLevelColor(level),
        className
      )}
    >
      {RISK_SHORT_LABELS[level]}
    </span>
  );
}
