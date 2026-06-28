"use client";

import { useState } from "react";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  YAxis,
} from "recharts";
import { ChevronRight, Sparkles } from "lucide-react";
import { DashboardInsightDetailSheet } from "@/components/dashboard/DashboardInsightDetailSheet";
import { Card, CardContent } from "@/components/ui/card";
import { usePreferences } from "@/components/providers/PreferencesProvider";
import { getRiskFullLabels } from "@/lib/i18n/labels";
import type { DashboardInsight } from "@/lib/dashboard/build-dashboard-insight";
import { formatRiskScoreDisplay } from "@/lib/sensor-labels";
import type { RiskLevel } from "@/types/measurement";
import { cn } from "@/lib/utils";

interface SparklinePoint {
  date: string;
  risk_score: number;
}

interface DashboardInsightCardProps {
  insight: DashboardInsight;
  riskScore: number;
  riskLevel: RiskLevel;
  resultId?: string;
  sparklineData?: SparklinePoint[];
}

const statusPill: Record<RiskLevel, string> = {
  low: "bg-risk-low/15 text-risk-low",
  moderate: "bg-risk-moderate/15 text-risk-moderate",
  high: "bg-risk-high/15 text-risk-high",
};

export function DashboardInsightCard({
  insight,
  riskScore,
  riskLevel,
  resultId,
  sparklineData = [],
}: DashboardInsightCardProps) {
  const { locale, translate } = usePreferences();
  const [detailOpen, setDetailOpen] = useState(false);
  const riskLabels = getRiskFullLabels(locale);

  const chartData = sparklineData.map((d) => ({
    ...d,
    score: Math.round(d.risk_score * 100),
  }));

  return (
    <>
      <Card className="overflow-hidden">
        <button
          type="button"
          onClick={() => setDetailOpen(true)}
          className="w-full text-left transition-opacity active:opacity-90"
          aria-label={`${translate("aiSummaryTitle")} — ${translate("viewDetail")}`}
        >
          <CardContent className="space-y-4 p-4 pt-5">
            <div className="flex items-center gap-2">
              <Sparkles
                className="h-4 w-4 text-accent-primary"
                strokeWidth={1.75}
                aria-hidden
              />
              <span className="text-base font-semibold text-[var(--text-primary)]">
                {translate("aiSummaryTitle")}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0 space-y-2">
                <p className="text-4xl font-semibold tabular-nums tracking-tight">
                  {formatRiskScoreDisplay(riskScore)}
                </p>
                <span
                  className={cn(
                    "inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold",
                    statusPill[riskLevel]
                  )}
                >
                  {riskLabels[riskLevel]}
                </span>
              </div>

              {chartData.length >= 2 && (
                <div className="h-12 w-28 shrink-0 opacity-90" aria-hidden>
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
            </div>

            <p className="line-clamp-2 text-sm leading-relaxed text-[var(--text-secondary)]">
              {insight.summary}
            </p>

            <div className="flex items-center justify-between border-t border-border-subtle pt-3">
              <span className="text-sm font-medium text-accent-primary">
                {translate("viewDetail")}
              </span>
              <ChevronRight
                className="h-4 w-4 text-accent-primary"
                strokeWidth={2}
                aria-hidden
              />
            </div>
          </CardContent>
        </button>
      </Card>

      <DashboardInsightDetailSheet
        open={detailOpen}
        onOpenChange={setDetailOpen}
        insight={insight}
        sparklineData={sparklineData}
        resultId={resultId}
      />
    </>
  );
}
