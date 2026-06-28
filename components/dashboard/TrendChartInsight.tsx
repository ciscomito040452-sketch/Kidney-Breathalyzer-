"use client";

import { Sparkles } from "lucide-react";
import { usePreferences } from "@/components/providers/PreferencesProvider";
import {
  formatTrendInsightLatestLine,
  type TrendPeriodInsight,
} from "@/lib/dashboard/build-trend-period-insight";
import { cn } from "@/lib/utils";

interface TrendChartInsightProps {
  insight: TrendPeriodInsight;
  className?: string;
}

export function TrendChartInsight({
  insight,
  className,
}: TrendChartInsightProps) {
  const { locale, translate } = usePreferences();

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-[var(--surface-card-border)] bg-surface shadow-card app-card",
        className
      )}
    >
      <div className="flex items-start gap-3 border-b border-border-subtle px-4 py-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--accent-tint)] text-accent-primary">
          <Sparkles className="h-4 w-4" strokeWidth={1.75} aria-hidden />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[var(--text-primary)]">
            {translate("trendInsightTitle")}
          </p>
          <p className="text-xs text-[var(--text-secondary)]">
            {translate("trendInsightSubtitle")}
          </p>
        </div>
      </div>
      <div className="space-y-3 px-4 py-4">
        <p className="text-sm leading-relaxed text-[var(--text-primary)]">
          {insight.narrative}
        </p>
        <p className="text-sm text-[var(--text-secondary)]">
          {formatTrendInsightLatestLine(locale, insight.latestRiskLabel)}
        </p>
        <p className="rounded-xl bg-[var(--accent-tint)] px-3 py-2.5 text-sm font-medium leading-snug text-accent-primary">
          {insight.nextStep}
        </p>
      </div>
    </div>
  );
}
