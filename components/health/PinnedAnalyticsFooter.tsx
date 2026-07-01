"use client";

import { SparklineMini } from "@/components/health/SparklineMini";
import { SensorLevelBar } from "@/components/shared/SensorLevelBar";
import { usePreferences } from "@/components/providers/PreferencesProvider";
import type { SensorStatus } from "@/lib/sensors/status";
import { cn } from "@/lib/utils";

interface PinnedAnalyticsFooterProps {
  sparklineData: { value: number }[];
  stroke?: string;
  barPercent?: number;
  thresholdPercent?: number;
  sensorStatus?: SensorStatus;
  className?: string;
}

export function PinnedAnalyticsFooter({
  sparklineData,
  stroke = "var(--accent-primary)",
  barPercent,
  thresholdPercent,
  sensorStatus,
  className,
}: PinnedAnalyticsFooterProps) {
  const { translate } = usePreferences();
  const hasSparkline = sparklineData.length >= 2;
  const hasBar = barPercent != null && sensorStatus != null;

  if (!hasSparkline && !hasBar) return null;

  return (
    <div
      className={cn(
        "mt-4 space-y-2.5 rounded-xl bg-[var(--accent-tint)]/40 px-3 py-2.5",
        className
      )}
    >
      {hasSparkline && (
        <div>
          <p className="mb-1.5 text-[10px] font-medium uppercase tracking-wide text-[var(--text-secondary)]">
            {translate("pinnedTrend7Days")}
          </p>
          <SparklineMini
            data={sparklineData}
            stroke={stroke}
            fullWidth
            height={40}
          />
        </div>
      )}
      {hasBar && sensorStatus && (
        <div className={hasSparkline ? undefined : "pt-0.5"}>
          {!hasSparkline && (
            <p className="mb-1.5 text-[10px] font-medium uppercase tracking-wide text-[var(--text-secondary)]">
              {translate("pinnedRangePosition")}
            </p>
          )}
          <SensorLevelBar
            percent={barPercent}
            thresholdPercent={thresholdPercent}
            status={sensorStatus}
            className="h-2"
          />
        </div>
      )}
    </div>
  );
}
