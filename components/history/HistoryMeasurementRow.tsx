import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { RiskMeter } from "@/components/shared/RiskMeter";
import { Card, CardContent } from "@/components/ui/card";
import { formatRiskScoreDisplay } from "@/lib/sensor-labels";
import { formatHistoryListTime } from "@/lib/utils";
import type { Measurement } from "@/types/measurement";
import { cn } from "@/lib/utils";

interface HistoryMeasurementRowProps {
  measurement: Measurement;
  variant?: "default" | "compact";
}

export function HistoryMeasurementRow({
  measurement,
  variant = "default",
}: HistoryMeasurementRowProps) {
  const isCompact = variant === "compact";

  return (
    <Link
      href={`/result/${measurement.id}`}
      className="block transition-opacity active:opacity-80"
    >
      <Card
        className={cn(
          "transition-colors hover:bg-[var(--bg-primary)]",
          isCompact && "shadow-none"
        )}
      >
        <CardContent
          className={cn(
            "flex items-center justify-between gap-3",
            isCompact ? "py-3" : "py-4"
          )}
        >
          <div className="min-w-0 flex-1 space-y-2">
            {isCompact && (
              <p className="text-xs font-medium tabular-nums text-[var(--text-secondary)]">
                {formatHistoryListTime(measurement.measured_at)}
              </p>
            )}
            <p
              className={cn(
                "font-semibold tabular-nums tracking-tight",
                isCompact ? "text-2xl" : "text-3xl"
              )}
            >
              {formatRiskScoreDisplay(measurement.risk_score)}
            </p>
            <RiskMeter
              riskScore={measurement.risk_score}
              riskLevel={measurement.risk_level}
              compact
              showZoneLabels={false}
            />
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
