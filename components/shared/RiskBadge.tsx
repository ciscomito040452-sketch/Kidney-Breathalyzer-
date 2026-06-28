import { Badge } from "@/components/ui/badge";
import { RISK_LABELS, RISK_SHORT_LABELS } from "@/lib/constants";
import type { RiskLevel } from "@/types/measurement";
import { cn } from "@/lib/utils";

interface RiskBadgeProps {
  level: RiskLevel;
  className?: string;
  compact?: boolean;
}

export function RiskBadge({ level, className, compact }: RiskBadgeProps) {
  return (
    <Badge
      variant={level}
      className={cn(
        compact && "px-2 py-0.5 text-[11px] font-semibold tracking-wide",
        className
      )}
    >
      {compact ? RISK_SHORT_LABELS[level] : RISK_LABELS[level]}
    </Badge>
  );
}
