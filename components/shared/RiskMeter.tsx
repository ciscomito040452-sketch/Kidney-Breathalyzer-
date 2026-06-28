"use client";

import { usePreferences } from "@/components/providers/PreferencesProvider";
import { getRiskShortLabels } from "@/lib/i18n/messages";
import { scorePercent } from "@/lib/risk-engine/risk-zones";
import type { RiskLevel } from "@/types/measurement";
import { cn } from "@/lib/utils";

const markerFill: Record<RiskLevel, string> = {
  low: "bg-risk-low",
  moderate: "bg-risk-moderate",
  high: "bg-risk-high",
};

const markerRing: Record<RiskLevel, string> = {
  low: "ring-risk-low/30",
  moderate: "ring-risk-moderate/35",
  high: "ring-risk-high/40",
};

const statusPill: Record<RiskLevel, string> = {
  low: "bg-risk-low/15 text-risk-low",
  moderate: "bg-risk-moderate/15 text-risk-moderate",
  high: "bg-risk-high/15 text-risk-high",
};

interface RiskMeterProps {
  riskScore: number;
  riskLevel: RiskLevel;
  compact?: boolean;
  showZoneLabels?: boolean;
  showStatusLabel?: boolean;
  className?: string;
}

export function RiskMeter({
  riskScore,
  riskLevel,
  compact = false,
  showZoneLabels = true,
  showStatusLabel = true,
  className,
}: RiskMeterProps) {
  const { locale, translate } = usePreferences();
  const riskLabels = getRiskShortLabels(locale);
  const pct = scorePercent(riskScore);

  return (
    <div
      className={cn("w-full", className)}
      role="meter"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`${translate("riskScoreLabel")} ${pct}/100 — ${riskLabels[riskLevel]}`}
    >
      {showZoneLabels && !compact && (
        <div className="mb-2 grid grid-cols-3 text-center text-[11px] font-medium text-[var(--text-secondary)]">
          <span>{riskLabels.low}</span>
          <span>{riskLabels.moderate}</span>
          <span>{riskLabels.high}</span>
        </div>
      )}

      <div className={cn("relative", compact ? "h-2" : "h-2.5")}>
        <div
          className="flex h-full gap-px overflow-hidden rounded-full bg-[var(--bg-primary)] p-px shadow-inner"
          aria-hidden
        >
          <div className="min-w-0 flex-1 rounded-l-full bg-risk-low" />
          <div className="min-w-0 flex-1 bg-risk-moderate" />
          <div className="min-w-0 flex-1 rounded-r-full bg-risk-high" />
        </div>

        <div
          className={cn(
            "pointer-events-none absolute top-1/2 rounded-full border-2 border-[var(--bg-primary)] shadow-card ring-2",
            compact ? "h-3 w-3" : "h-4 w-4",
            markerFill[riskLevel],
            markerRing[riskLevel]
          )}
          style={{
            left: `clamp(${compact ? 6 : 8}px, ${pct}%, calc(100% - ${compact ? 6 : 8}px))`,
            transform: "translate(-50%, -50%)",
          }}
        />
      </div>

      {showStatusLabel && !compact && (
        <div className="mt-2.5 flex justify-center">
          <span
            className={cn(
              "rounded-full px-3 py-1 text-xs font-semibold",
              statusPill[riskLevel]
            )}
          >
            {riskLabels[riskLevel]}
          </span>
        </div>
      )}
    </div>
  );
}
