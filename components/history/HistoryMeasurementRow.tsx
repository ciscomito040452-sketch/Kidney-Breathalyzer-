"use client";

import Link from "next/link";
import { Activity, ChevronRight } from "lucide-react";
import { usePreferences } from "@/components/providers/PreferencesProvider";
import { getRiskFullLabels } from "@/lib/i18n/labels";
import { scorePercent } from "@/lib/risk-engine/risk-zones";
import { formatHistoryListTimeLocale, cn } from "@/lib/utils";
import type { Measurement, RiskLevel } from "@/types/measurement";

interface HistoryMeasurementRowProps {
  measurement: Measurement;
  variant?: "default" | "compact";
  grouped?: boolean;
  isLast?: boolean;
}

const levelIconWrap: Record<RiskLevel, string> = {
  low: "bg-risk-moderate/10 text-[var(--risk-meter-mid)]",
  moderate: "bg-risk-moderate/15 text-risk-moderate",
  high: "bg-risk-moderate/20 text-[var(--risk-meter-end)]",
};

export function HistoryMeasurementRow({
  measurement,
  variant = "default",
  grouped = false,
  isLast = false,
}: HistoryMeasurementRowProps) {
  const { locale } = usePreferences();
  const isCompact = variant === "compact";
  const riskLabels = getRiskFullLabels(locale);
  const timeLabel = formatHistoryListTimeLocale(locale, measurement.measured_at);
  const scoreDisplay = scorePercent(measurement.risk_score);

  return (
    <Link
      href={`/result/${measurement.id}`}
      className={cn(
        "flex items-center gap-3 transition-colors active:bg-surface-elevated",
        grouped
          ? cn(
              "border-b border-border-subtle px-4 py-3.5",
              isLast && "border-b-0"
            )
          : cn(
              "rounded-2xl border border-border-subtle bg-surface px-3.5 hover:bg-surface-elevated",
              isCompact ? "py-3" : "py-3.5"
            )
      )}
    >
      <span
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
          levelIconWrap[measurement.risk_level]
        )}
        aria-hidden
      >
        <Activity className="h-5 w-5" strokeWidth={1.75} />
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-[var(--text-primary)]">
          {riskLabels[measurement.risk_level]}
        </p>
        <p className="mt-0.5 text-xs text-[var(--text-secondary)]">
          {timeLabel}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-1.5">
        <span className="text-sm font-medium tabular-nums text-[var(--text-secondary)]">
          {scoreDisplay}
        </span>
        <ChevronRight
          className="h-4 w-4 text-[var(--text-secondary)] opacity-50"
          strokeWidth={2}
          aria-hidden
        />
      </div>
    </Link>
  );
}
