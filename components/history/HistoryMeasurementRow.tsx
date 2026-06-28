"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { usePreferences } from "@/components/providers/PreferencesProvider";
import { RiskScoreRing } from "@/components/shared/RiskScoreRing";
import { getRiskShortLabels } from "@/lib/i18n/messages";
import { formatHistoryListTimeLocale, cn } from "@/lib/utils";
import type { Measurement } from "@/types/measurement";

interface HistoryMeasurementRowProps {
  measurement: Measurement;
  variant?: "default" | "compact";
}

export function HistoryMeasurementRow({
  measurement,
  variant = "default",
}: HistoryMeasurementRowProps) {
  const { locale, translate } = usePreferences();
  const isCompact = variant === "compact";
  const riskLabels = getRiskShortLabels(locale);
  const timeLabel = formatHistoryListTimeLocale(locale, measurement.measured_at);

  return (
    <Link
      href={`/result/${measurement.id}`}
      className="block transition-opacity active:opacity-80"
    >
      <div
        className={cn(
          "flex items-center gap-3 rounded-2xl border border-border-subtle bg-surface px-3.5 transition-colors hover:bg-surface-elevated",
          isCompact ? "py-3" : "py-3.5"
        )}
      >
        <RiskScoreRing
          riskScore={measurement.risk_score}
          riskLevel={measurement.risk_level}
          size={isCompact ? 44 : 48}
        />

        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-[var(--text-primary)]">
            {riskLabels[measurement.risk_level]}
          </p>
          <p className="mt-0.5 text-xs text-[var(--text-secondary)]">
            {timeLabel} · {translate("riskScoreLabel")}
          </p>
        </div>

        <ChevronRight
          className="h-4 w-4 shrink-0 text-[var(--text-secondary)] opacity-60"
          strokeWidth={2}
          aria-hidden
        />
      </div>
    </Link>
  );
}
