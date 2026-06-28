import { RISK_SHORT_LABELS } from "@/lib/constants";
import {
  RISK_ZONE_BOUNDS,
  scorePercent,
} from "@/lib/risk-engine/risk-zones";
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
        <div className="relative mb-2.5 h-4 text-[11px] font-medium text-[var(--text-secondary)]">
          <span className="absolute left-0 top-0">{RISK_SHORT_LABELS.low}</span>
          <span
            className="absolute top-0 -translate-x-1/2"
            style={{ left: `${lowMax}%` }}
          >
            {RISK_SHORT_LABELS.moderate}
          </span>
          <span className="absolute right-0 top-0">{RISK_SHORT_LABELS.high}</span>
        </div>
      )}

      <div
        className={cn(
          "relative w-full",
          compact ? "h-2" : "h-3"
        )}
      >
        {/* Track */}
        <div
          className={cn(
            "absolute inset-x-0 top-1/2 -translate-y-1/2 overflow-hidden rounded-full bg-[#E8ECF1]",
            compact ? "h-1.5" : "h-2.5"
          )}
        >
          <div
            className="h-full w-full rounded-full bg-gradient-to-r from-risk-low/30 via-risk-moderate/45 to-risk-high/55"
            aria-hidden
          />
        </div>

        {/* Zone tick marks */}
        {!compact && (
          <>
            <div
              className="absolute top-1/2 h-3 w-px -translate-y-1/2 bg-white/70"
              style={{ left: `${lowMax}%` }}
              aria-hidden
            />
            <div
              className="absolute top-1/2 h-3 w-px -translate-y-1/2 bg-white/70"
              style={{ left: `${moderateMax}%` }}
              aria-hidden
            />
          </>
        )}

        {/* Position marker */}
        <div
          className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${pct}%` }}
          aria-hidden
        >
          <div
            className={cn(
              "rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.12),0_2px_8px_rgba(37,99,235,0.18)] ring-[3px]",
              markerRing[riskLevel],
              compact ? "h-3 w-3 p-0.5" : "h-[18px] w-[18px] p-[3px]"
            )}
          >
            <div
              className={cn("h-full w-full rounded-full", markerFill[riskLevel])}
            />
          </div>
        </div>
      </div>

      {showStatusLabel && (
        <div className={cn(compact ? "mt-1.5" : "mt-3")}>
          <span
            className={cn(
              "inline-flex rounded-full px-2.5 py-0.5 font-medium",
              riskLevel === "low" && "bg-risk-low/10 text-risk-low",
              riskLevel === "moderate" && "bg-risk-moderate/10 text-risk-moderate",
              riskLevel === "high" && "bg-risk-high/10 text-risk-high",
              compact ? "text-[11px]" : "text-xs"
            )}
          >
            {RISK_SHORT_LABELS[riskLevel]}
          </span>
        </div>
      )}
    </div>
  );
}
