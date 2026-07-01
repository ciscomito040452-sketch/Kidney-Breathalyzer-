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
import { getRiskQualitativeHeadline } from "@/lib/ui/qualitative-labels";
import type { DashboardInsight } from "@/lib/dashboard/build-dashboard-insight";
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
  qualitativeFirst?: boolean;
}

export function DashboardInsightCard({
  insight,
  riskLevel,
  resultId,
  sparklineData = [],
  qualitativeFirst = false,
}: DashboardInsightCardProps) {
  const { locale, translate } = usePreferences();
  const [detailOpen, setDetailOpen] = useState(false);

  const chartData = sparklineData.map((d) => ({
    ...d,
    score: Math.round(d.risk_score * 100),
  }));

  const hasChart = chartData.length >= 2;
  const headline = qualitativeFirst
    ? getRiskQualitativeHeadline(locale, riskLevel)
    : null;

  return (
    <>
      <Card className="app-card app-card--pinned overflow-hidden border-0 shadow-none">
        <button
          type="button"
          onClick={() => setDetailOpen(true)}
          className="w-full text-left transition-opacity active:opacity-90"
          aria-label={`${translate("aiSummaryTitle")} — ${translate("viewDetail")}`}
        >
          <CardContent className="space-y-3 p-4 pt-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2.5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-primary/10">
                  <Sparkles
                    className="h-4 w-4 text-accent-primary"
                    strokeWidth={1.75}
                    aria-hidden
                  />
                </span>
                <span className="text-sm font-semibold text-[var(--text-primary)]">
                  {translate("aiSummaryTitle")}
                </span>
              </div>
              <ChevronRight
                className="h-4 w-4 shrink-0 text-[var(--text-secondary)]"
                strokeWidth={2}
                aria-hidden
              />
            </div>

            {qualitativeFirst && headline && (
              <p className="text-pinned-headline font-semibold text-[var(--text-primary)]">
                {headline}
              </p>
            )}

            {hasChart && (
              <div
                className="h-12 w-full rounded-xl bg-surface px-1 py-1"
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
                      isAnimationActive
                      animationDuration={400}
                      animationEasing="ease-out"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            <p className="line-clamp-2 text-sm leading-relaxed text-[var(--text-secondary)]">
              {insight.summary}
            </p>

            <p className="text-xs font-medium text-accent-primary">
              {translate("viewDetail")}
            </p>
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
