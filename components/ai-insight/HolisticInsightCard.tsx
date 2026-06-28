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
import type { HolisticInsight } from "@/lib/ai-insight/build-holistic-insight";
import type { InsightHighlightTone } from "@/lib/dashboard/build-dashboard-insight";
import { formatRiskScoreDisplay } from "@/lib/sensor-labels";
import {
  InsightGroupedCard,
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

const tonePill: Record<InsightHighlightTone, string> = {
  good: "bg-risk-low/15 text-risk-low",
  attention: "bg-accent-primary/12 text-accent-primary",
  neutral: "bg-surface-elevated text-[var(--text-secondary)]",
};

const highlightIcons: Record<string, LucideIcon> = {
  "avg-score": Gauge,
  ammonia: Wind,
  pattern: BarChart3,
  acetone: Droplets,
};

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
          const { title, detail } = parseHighlightLabel(item.label);
          const Icon = highlightIcons[item.id] ?? Activity;
          const valueMatch = title.match(/(\d+(?:\.\d+)?)\s*(ppb|\/100)?/i);
          const metricLabel = valueMatch
            ? title.replace(valueMatch[0], "").trim()
            : title;
          const metricValue = valueMatch
            ? `${valueMatch[1]}${valueMatch[2] ? ` ${valueMatch[2]}` : ""}`
            : "";

          return (
            <div
              key={item.id}
              className="flex items-center justify-between gap-3 px-4 py-3.5"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                    item.tone === "good"
                      ? "bg-risk-low/15 text-risk-low"
                      : item.tone === "attention"
                        ? "bg-accent-primary/12 text-accent-primary"
                        : "bg-surface-elevated text-[var(--text-secondary)]"
                  )}
                  aria-hidden
                >
                  <Icon className="h-4 w-4" strokeWidth={1.75} />
                </span>
                <p className="min-w-0 text-sm text-[var(--text-secondary)]">
                  {metricLabel || title}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2 text-right">
                {metricValue && (
                  <span className="text-sm font-semibold tabular-nums text-[var(--text-primary)]">
                    {metricValue}
                  </span>
                )}
                {detail && (
                  <span
                    className={cn(
                      "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
                      tonePill[item.tone]
                    )}
                  >
                    {detail}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </InsightGroupedCard>
  );
}
