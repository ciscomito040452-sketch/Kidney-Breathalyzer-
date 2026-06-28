import { Badge } from "@/components/ui/badge";
import { RISK_LABELS } from "@/lib/constants";
import type { RiskLevel } from "@/types/measurement";

interface RiskBadgeProps {
  level: RiskLevel;
  className?: string;
}

export function RiskBadge({ level, className }: RiskBadgeProps) {
  return (
    <Badge variant={level} className={className}>
      {RISK_LABELS[level]}
    </Badge>
  );
}
