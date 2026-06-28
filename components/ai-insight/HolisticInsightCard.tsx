"use client";

import {
  Line,
  LineChart,
  ResponsiveContainer,
  YAxis,
} from "recharts";
import { Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { usePreferences } from "@/components/providers/PreferencesProvider";
import { getRiskFullLabels } from "@/lib/i18n/labels";
import type { HolisticInsight } from "@/lib/ai-insight/build-holistic-insight";
import { formatRiskScoreDisplay } from "@/lib/sensor-labels";
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
  low: "bg-risk-moderate/12 text-[var(--risk-meter-end)]",
  moderate: "bg-risk-moderate/15 text-risk-moderate",
  high: "bg-risk-moderate/15 text-[var(--risk-meter-end)]",
};

const toneDot = {
  good: "bg-[var(--risk-meter-end)]",
  attention: "bg-risk-moderate",
  neutral: "bg-[var(--text-secondary)]",
} as const;

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
    <Card className="overflow-hidden">
      <CardContent className="space-y-4 p-4 pt-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-primary/10">
              <Sparkles
                className="h-4 w-4 text-accent-primary"
                strokeWidth={1.75}
                aria-hidden
              />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[var(--text-primary)]">
                {translate("insightHolisticTitle")}
              </p>
              <p className="text-xs text-[var(--text-secondary)]">
                {insight.periodCaption}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <p className="text-3xl font-semibold tabular-nums tracking-tight">
            {formatRiskScoreDisplay(insight.avgRiskScore)}
          </p>
          <span className="text-xs font-medium text-[var(--text-secondary)]">
            {translate("insightAvgScoreLabel")}
          </span>
          <span
            className={cn(
              "inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold",
              statusPill[insight.overallRiskLevel]
            )}
          >
            {riskLabels[insight.overallRiskLevel]}
          </span>
        </div>

        {hasChart && (
          <div
            className="h-14 w-full rounded-xl bg-surface-elevated px-1 py-1"
            aria-hidden
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <YAxis hide domain={["dataMin - 5", "dataMax + 5"]} />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="var(--accent-primary, #2563EB)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        <p className="text-sm leading-relaxed text-[var(--text-primary)]">
          {insight.summary}
        </p>

        <ul className="space-y-2 border-t border-border-subtle pt-3">
          {insight.highlights.map((item) => (
            <li
              key={item.id}
              className="flex items-start gap-2 text-sm text-[var(--text-secondary)]"
            >
              <span
                className={cn(
                  "mt-1.5 h-2 w-2 shrink-0 rounded-full",
                  toneDot[item.tone]
                )}
                aria-hidden
              />
              <span>{item.label}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
