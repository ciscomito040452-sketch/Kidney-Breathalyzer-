"use client";

import {
  Line,
  LineChart,
  ResponsiveContainer,
  YAxis,
} from "recharts";
import {
  Activity,
  BarChart3,
  Droplets,
  Gauge,
  Sparkles,
  Wind,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { usePreferences } from "@/components/providers/PreferencesProvider";
import { getRiskFullLabels } from "@/lib/i18n/labels";
import type { MessageKey } from "@/lib/i18n/messages";
import type { HolisticInsight } from "@/lib/ai-insight/build-holistic-insight";
import type { HolisticInsightHighlight } from "@/lib/ai-insight/build-holistic-insight";
import type { InsightHighlightTone } from "@/lib/dashboard/build-dashboard-insight";
import { formatRiskScoreDisplay } from "@/lib/sensor-labels";
import {
  InsightGroupedCard,
  InsightMetricRow,
  parseHighlightLabel,
} from "@/components/ai-insight/insight-ui";
import { cn } from "@/lib/utils";
import type { RiskLevel } from "@/types/measurement";

interface SparklinePoint {
  date: string;
  risk_score: number;
}

interface HolisticInsightCardProps {
  insight: HolisticInsight;
  sparklineData?: SparklinePoint[];
}

const statusPill: Record<RiskLevel, string> = {
  low: "bg-risk-low/15 text-risk-low",
  moderate: "bg-risk-moderate/15 text-risk-moderate",
  high: "bg-risk-moderate/15 text-[var(--risk-meter-end)]",
};

const highlightIcons: Record<string, LucideIcon> = {
  "avg-score": Gauge,
  ammonia: Wind,
  acetone: Droplets,
  pattern: BarChart3,
};

const highlightIconTones: Record<
  string,
  "accent" | "good" | "attention" | "neutral"
> = {
  "avg-score": "accent",
  ammonia: "accent",
  acetone: "good",
  pattern: "accent",
};

function parseHolisticMetric(
  item: HolisticInsightHighlight,
  translate: (key: MessageKey) => string
): {
  label: string;
  value?: string;
  statusLabel?: string;
} {
  const { title, detail } = parseHighlightLabel(item.label);

  switch (item.id) {
    case "avg-score": {
      const score =
        title.match(/(\d+\/100)/)?.[1] ??
        formatRiskScoreDisplay(
          Number(title.match(/(\d+(?:\.\d+)?)/)?.[1] ?? 0) / 100
        );
      return {
        label: translate("insightAvgScoreLabel"),
        value: score,
        statusLabel: detail || undefined,
      };
    }
    case "ammonia":
    case "acetone": {
      const valueMatch = title.match(/(\d+(?:\.\d+)?)\s*ppb/i);
      const metricLabel = valueMatch
        ? title.replace(/\s*\d+(?:\.\d+)?\s*ppb/i, "").trim()
        : title;
      return {
        label: metricLabel,
        value: valueMatch ? `${valueMatch[1]} ppb` : undefined,
        statusLabel: detail || undefined,
      };
    }
    case "pattern": {
      const countMatch = title.match(/(\d+)/);
      return {
        label: translate("insightMeasurementFreq"),
        value: countMatch
          ? `${countMatch[1]} ${translate("timesUnit")}`
          : undefined,
        statusLabel: detail || undefined,
      };
    }
    default:
      return { label: title, statusLabel: detail || undefined };
  }
}

export function HolisticInsightCard({
  insight,
  sparklineData = [],
}: HolisticInsightCardProps) {
  const { locale, translate } = usePreferences();
  const riskLabels = getRiskFullLabels(locale);

  const chartData = sparklineData.map((d) => ({
    ...d,
    score: Math.round(d.risk_score * 100),
  }));

  const hasChart = chartData.length >= 2;

  return (
    <InsightGroupedCard>
      <div className="border-b border-border-subtle px-4 py-4">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[var(--accent-tint)] text-accent-primary">
            <Sparkles className="h-5 w-5" strokeWidth={1.75} aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--text-secondary)]">
              {translate("insightHolisticTitle")}
            </p>
            <p className="mt-0.5 text-xs text-[var(--text-secondary)]">
              {insight.periodCaption}
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-2">
          <p className="text-4xl font-semibold tabular-nums tracking-tight">
            {formatRiskScoreDisplay(insight.avgRiskScore)}
          </p>
          <span className="text-sm font-medium text-[var(--text-secondary)]">
            {translate("insightAvgScoreLabel")}
          </span>
          <span
            className={cn(
              "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
              statusPill[insight.overallRiskLevel]
            )}
          >
            {riskLabels[insight.overallRiskLevel]}
          </span>
        </div>

        {hasChart && (
          <div
            className="mt-4 h-16 w-full rounded-xl bg-surface-elevated px-1 py-1"
            aria-hidden
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <YAxis hide domain={["dataMin - 5", "dataMax + 5"]} />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="var(--accent-primary)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="divide-y divide-border-subtle">
        {insight.highlights.map((item) => {
          const Icon = highlightIcons[item.id] ?? Activity;
          const metric = parseHolisticMetric(item, translate);

          return (
            <InsightMetricRow
              key={item.id}
              icon={Icon}
              iconTone={highlightIconTones[item.id] ?? "accent"}
              label={metric.label}
              value={metric.value}
              statusLabel={metric.statusLabel}
              statusTone={item.tone as InsightHighlightTone}
            />
          );
        })}
      </div>
    </InsightGroupedCard>
  );
}
