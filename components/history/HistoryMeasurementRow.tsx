import Link from "next/link";
import { Calendar, ChevronRight } from "lucide-react";
import { RiskIndicator } from "@/components/shared/RiskIndicator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatRiskScoreDisplay } from "@/lib/sensor-labels";
import {
  formatHistoryListDate,
  formatHistoryListTime,
} from "@/lib/utils";
import type { Measurement } from "@/types/measurement";

interface HistoryMeasurementRowProps {
  measurement: Measurement;
}

export function HistoryMeasurementRow({
  measurement,
}: HistoryMeasurementRowProps) {
  return (
    <Link
      href={`/result/${measurement.id}`}
      className="block transition-opacity active:opacity-80"
    >
      <Card className="transition-colors hover:bg-[var(--bg-primary)]">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between gap-2 text-sm font-medium text-[var(--text-secondary)]">
            <span className="flex min-w-0 items-center gap-2">
              <Calendar
                className="h-4 w-4 shrink-0 text-accent-primary"
                strokeWidth={1.75}
              />
              <span className="truncate">
                {formatHistoryListDate(measurement.measured_at)}
              </span>
            </span>
            <span className="shrink-0 text-xs font-normal tabular-nums">
              {formatHistoryListTime(measurement.measured_at)}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between gap-4">
          <div className="space-y-2">
            <p className="text-3xl font-semibold tabular-nums tracking-tight">
              {formatRiskScoreDisplay(measurement.risk_score)}
            </p>
            <RiskIndicator level={measurement.risk_level} />
          </div>
          <ChevronRight
            className="h-5 w-5 shrink-0 text-[var(--text-secondary)]"
            strokeWidth={1.75}
            aria-hidden
          />
        </CardContent>
      </Card>
    </Link>
  );
}
