import { RISK_SHORT_LABELS } from "@/lib/constants";
import {
  RISK_ZONE_BOUNDS,
  scorePercent,
} from "@/lib/risk-engine/risk-zones";
import { riskLevelColor } from "@/lib/risk-engine/risk-level";
import type { RiskLevel } from "@/types/measurement";
import { cn } from "@/lib/utils";

const markerColors: Record<RiskLevel, string> = {
  low: "bg-risk-low",
  moderate: "bg-risk-moderate",
  high: "bg-risk-high",
};

interface RiskMeterProps {
  riskScore: number;
  riskLevel: RiskLevel;
  compact?: boolean;
  showZoneLabels?: boolean;
  className?: string;
}

export function RiskMeter({
  riskScore,
  riskLevel,
  compact = false,
  showZoneLabels = true,
  className,
}: RiskMeterProps) {
  const pct = scorePercent(riskScore);
  const { lowMax, moderateMax } = RISK_ZONE_BOUNDS;

  return (
    <div
      className={cn("w-full", className)}
      role="meter"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`คะแนนความเสี่ยง ${pct} จาก 100 — ${RISK_SHORT_LABELS[riskLevel]}`}
    >
      {showZoneLabels && !compact && (
        <div className="mb-1.5 flex justify-between text-[10px] text-[var(--text-secondary)]">
          <span>{RISK_SHORT_LABELS.low}</span>
          <span>{RISK_SHORT_LABELS.moderate}</span>
          <span>{RISK_SHORT_LABELS.high}</span>
        </div>
      )}

      <div
        className={cn(
          "relative w-full overflow-hidden rounded-full bg-border-subtle",
          compact ? "h-1.5" : "h-2"
        )}
      >
        <div
          className="absolute inset-y-0 left-0 bg-risk-low/50"
          style={{ width: `${lowMax}%` }}
          aria-hidden
        />
        <div
          className="absolute inset-y-0 bg-risk-moderate/40"
          style={{ left: `${lowMax}%`, width: `${moderateMax - lowMax}%` }}
          aria-hidden
        />
        <div
          className="absolute inset-y-0 right-0 bg-risk-high/35"
          style={{ width: `${100 - moderateMax}%` }}
          aria-hidden
        />
        <div
          className="absolute inset-y-0 w-px bg-border-subtle/80"
          style={{ left: `${lowMax}%` }}
          aria-hidden
        />
        <div
          className="absolute inset-y-0 w-px bg-border-subtle/80"
          style={{ left: `${moderateMax}%` }}
          aria-hidden
        />
        <div
          className={cn(
            "absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-sm",
            markerColors[riskLevel],
            compact ? "h-2.5 w-2.5" : "h-3 w-3"
          )}
          style={{ left: `${pct}%` }}
          aria-hidden
        />
      </div>

      <p
        className={cn(
          "mt-1.5 font-medium",
          riskLevelColor(riskLevel),
          compact ? "text-xs" : "text-sm"
        )}
      >
        {RISK_SHORT_LABELS[riskLevel]}
      </p>
    </div>
  );
}
