"use client";

import { usePreferences } from "@/components/providers/PreferencesProvider";
import { getRiskShortLabels } from "@/lib/i18n/messages";
import {
  scorePercent,
  visualMarkerPercent,
} from "@/lib/risk-engine/risk-zones";
import type { RiskLevel } from "@/types/measurement";
import { cn } from "@/lib/utils";

const ZONES: RiskLevel[] = ["low", "moderate", "high"];

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
  const markerLeft = visualMarkerPercent(riskScore);

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
        <div className="mb-2 grid grid-cols-3 text-center text-[11px] font-medium tracking-wide text-[var(--text-secondary)]">
          {ZONES.map((zone) => (
            <span
              key={zone}
              className={cn(
                zone === riskLevel && "font-semibold text-[var(--text-primary)]"
              )}
            >
              {riskLabels[zone]}
            </span>
          ))}
        </div>
      )}

      <div className={cn("relative", compact ? "h-2" : "h-2.5")}>
        <div
          className="h-full overflow-hidden rounded-full bg-gradient-to-r from-risk-low via-risk-moderate to-risk-high shadow-inner"
          aria-hidden
        />

        {!compact && (
          <>
            <div
              className="pointer-events-none absolute inset-y-0 w-px bg-[var(--bg-primary)]/35"
              style={{ left: "33.333%" }}
              aria-hidden
            />
            <div
              className="pointer-events-none absolute inset-y-0 w-px bg-[var(--bg-primary)]/35"
              style={{ left: "66.666%" }}
              aria-hidden
            />
          </>
        )}

        <div
          className={cn(
            "pointer-events-none absolute top-1/2 z-10 rounded-full border-2 border-[var(--bg-primary)] shadow-card ring-2",
            compact ? "h-3 w-3" : "h-4 w-4",
            markerFill[riskLevel],
            markerRing[riskLevel]
          )}
          style={{
            left: `clamp(${compact ? 6 : 8}px, ${markerLeft}%, calc(100% - ${compact ? 6 : 8}px))`,
            transform: "translate(-50%, -50%)",
          }}
        />
      </div>

      {showStatusLabel && !compact && (
        <div className="mt-2.5 grid grid-cols-3">
          {ZONES.map((zone) => (
            <div key={zone} className="flex justify-center">
              {zone === riskLevel && (
                <span
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-semibold",
                    statusPill[zone]
                  )}
                >
                  {riskLabels[zone]}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
