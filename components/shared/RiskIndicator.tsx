import type { RiskLevel } from "@/types/measurement";
import { RISK_SHORT_LABELS } from "@/lib/constants";
import { riskLevelColor } from "@/lib/risk-engine/risk-level";
import { cn } from "@/lib/utils";

const dotColors: Record<RiskLevel, string> = {
  low: "bg-risk-low",
  moderate: "bg-risk-moderate",
  high: "bg-risk-high",
};

interface RiskIndicatorProps {
  level: RiskLevel;
  className?: string;
}

/** Compact dot + short label for lists and tight layouts */
export function RiskIndicator({ level, className }: RiskIndicatorProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-xs font-medium",
        riskLevelColor(level),
        className
      )}
    >
      <span
        className={cn("h-2 w-2 shrink-0 rounded-full", dotColors[level])}
        aria-hidden
      />
      {RISK_SHORT_LABELS[level]}
    </span>
  );
}
