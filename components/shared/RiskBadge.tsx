"use client";

import { Badge } from "@/components/ui/badge";
import { usePreferences } from "@/components/providers/PreferencesProvider";
import { getRiskFullLabels } from "@/lib/i18n/labels";
import { getRiskShortLabels } from "@/lib/i18n/messages";
import type { RiskLevel } from "@/types/measurement";
import { cn } from "@/lib/utils";

interface RiskBadgeProps {
  level: RiskLevel;
  className?: string;
  compact?: boolean;
}

export function RiskBadge({ level, className, compact }: RiskBadgeProps) {
  const { locale } = usePreferences();
  const fullLabels = getRiskFullLabels(locale);
  const shortLabels = getRiskShortLabels(locale);

  return (
    <Badge
      variant={level}
      className={cn(
        compact && "px-2 py-0.5 text-[11px] font-semibold tracking-wide",
        className
      )}
    >
      {compact ? shortLabels[level] : fullLabels[level]}
    </Badge>
  );
}
