"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { HistoryScoreBadge } from "@/components/history/HistoryScoreBadge";
import { SensorStatusPill } from "@/components/shared/SensorStatusPill";
import { usePreferences } from "@/components/providers/PreferencesProvider";
import { getRiskFullLabels } from "@/lib/i18n/labels";
import {
  getAcetoneStatus,
  getAmmoniaStatus,
} from "@/lib/sensors/status";
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
  const ammoniaStatus = getAmmoniaStatus(measurement.mq135_value);
  const acetoneStatus = getAcetoneStatus(measurement.mq3_value);

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

        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-medium tabular-nums text-[var(--text-secondary)]">
            {timeLabel}
          </span>
          <SensorStatusPill status={ammoniaStatus} />
          <SensorStatusPill status={acetoneStatus} />
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
