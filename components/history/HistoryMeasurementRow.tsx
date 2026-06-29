"use client";

import Link from "next/link";
import { ChevronRight, Droplets, Wind } from "lucide-react";
import { HistoryScoreBadge } from "@/components/history/HistoryScoreBadge";
import { usePreferences } from "@/components/providers/PreferencesProvider";
import { getRiskFullLabels } from "@/lib/i18n/labels";
import { formatAcetonePpb, formatAmmoniaPpb } from "@/lib/sensor-labels";
import { formatHistoryListTimeLocale, cn } from "@/lib/utils";
import type { Measurement } from "@/types/measurement";

interface HistoryMeasurementRowProps {
  measurement: Measurement;
  variant?: "default" | "compact";
  grouped?: boolean;
  isLast?: boolean;
}

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
  const ammoniaPpb = formatAmmoniaPpb(measurement.mq135_value);
  const acetonePpb = formatAcetonePpb(measurement.mq3_value);

  return (
    <Link
      href={`/result/${measurement.id}`}
      className={cn(
        "flex items-center gap-3.5 transition-colors active:scale-[0.99] active:bg-surface-elevated",
        grouped
          ? cn(
              "border-b border-border-subtle px-4 py-4",
              isLast && "border-b-0"
            )
          : cn(
              "rounded-2xl border border-[var(--surface-card-border)] bg-surface px-4 shadow-card app-card hover:bg-surface-elevated",
              isCompact ? "py-3.5" : "py-4"
            )
      )}
    >
      <HistoryScoreBadge
        riskScore={measurement.risk_score}
        riskLevel={measurement.risk_level}
        size={isCompact ? 46 : 50}
      />

      <div className="min-w-0 flex-1">
        <p className="truncate text-[15px] font-semibold leading-snug text-[var(--text-primary)]">
          {riskLabels[measurement.risk_level]}
        </p>

        <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[var(--text-secondary)]">
          <span className="font-medium tabular-nums">{timeLabel}</span>
          <span aria-hidden className="text-border-subtle">
            ·
          </span>
          <span className="inline-flex items-center gap-1 tabular-nums">
            <Wind
              className="h-3.5 w-3.5 shrink-0 text-risk-low"
              strokeWidth={1.75}
              aria-hidden
            />
            NH₃ {ammoniaPpb}
          </span>
          <span className="inline-flex items-center gap-1 tabular-nums">
            <Droplets
              className="h-3.5 w-3.5 shrink-0 text-risk-moderate"
              strokeWidth={1.75}
              aria-hidden
            />
            {acetonePpb} ppb
          </span>
        </div>
      </div>

      <ChevronRight
        className="h-4 w-4 shrink-0 text-[var(--text-secondary)] opacity-40"
        strokeWidth={2}
        aria-hidden
      />
    </Link>
  );
}
