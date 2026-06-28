import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { RiskIndicator } from "@/components/shared/RiskIndicator";
import { riskLevelColor } from "@/lib/risk-engine/risk-level";
import {
  formatHistoryListDate,
  formatHistoryListTime,
} from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { Measurement } from "@/types/measurement";

const accentBarColors: Record<Measurement["risk_level"], string> = {
  low: "bg-risk-low",
  moderate: "bg-risk-moderate",
  high: "bg-risk-high",
};

interface HistoryMeasurementRowProps {
  measurement: Measurement;
}

export function HistoryMeasurementRow({
  measurement,
}: HistoryMeasurementRowProps) {
  const score = Math.round(measurement.risk_score * 100);

  return (
    <Link
      href={`/result/${measurement.id}`}
      className="flex items-stretch overflow-hidden rounded-2xl border border-border-subtle bg-surface transition-colors hover:bg-[var(--bg-primary)]"
    >
      <div
        className={cn(
          "w-1 shrink-0",
          accentBarColors[measurement.risk_level]
        )}
        aria-hidden
      />

      <div className="flex min-w-0 flex-1 items-center gap-3 px-3 py-3.5">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium leading-tight">
            {formatHistoryListDate(measurement.measured_at)}
          </p>
          <p className="mt-0.5 text-xs text-[var(--text-secondary)]">
            {formatHistoryListTime(measurement.measured_at)}
          </p>
          <RiskIndicator level={measurement.risk_level} className="mt-2" />
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <div className="text-right">
            <p
              className={cn(
                "text-2xl font-semibold tabular-nums leading-none",
                riskLevelColor(measurement.risk_level)
              )}
            >
              {score}
            </p>
            <p className="mt-0.5 text-[10px] text-[var(--text-secondary)]">
              คะแนน
            </p>
          </div>
          <ChevronRight
            className="h-4 w-4 text-[var(--text-secondary)]"
            strokeWidth={1.75}
            aria-hidden
          />
        </div>
      </div>
    </Link>
  );
}
