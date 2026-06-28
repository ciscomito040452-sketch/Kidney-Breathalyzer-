"use client";

import Link from "next/link";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  YAxis,
} from "recharts";
import {
  ArrowRight,
  BookOpen,
  Lightbulb,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CTA_VIEW_DETAIL } from "@/lib/constants";
import type {
  DashboardInsight,
  InsightHighlightTone,
} from "@/lib/dashboard/build-dashboard-insight";
import { cn } from "@/lib/utils";

interface SparklinePoint {
  date: string;
  risk_score: number;
}

interface DashboardInsightCardProps {
  insight: DashboardInsight;
  resultId?: string;
  sparklineData?: SparklinePoint[];
}

const highlightStyles: Record<InsightHighlightTone, string> = {
  good: "bg-risk-low/10 text-risk-low ring-risk-low/20",
  attention: "bg-accent-primary/10 text-accent-primary ring-accent-primary/20",
  neutral: "bg-surface text-[var(--text-secondary)] ring-border-subtle",
};

export function DashboardInsightCard({
  insight,
  resultId,
  sparklineData = [],
}: DashboardInsightCardProps) {
  const chartData = sparklineData.map((d) => ({
    ...d,
    score: Math.round(d.risk_score * 100),
  }));

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="flex items-center gap-2 text-base">
          <Sparkles className="h-4 w-4 text-accent-primary" strokeWidth={1.75} />
          สรุปจาก AI
        </CardTitle>
        <p className="text-sm text-[var(--text-secondary)]">
          การวิเคราะห์เบื้องต้นจากข้อมูลการวัดล่าสุด
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {insight.highlights.map((item) => (
            <span
              key={item.id}
              className={cn(
                "inline-flex max-w-full rounded-full px-2.5 py-1 text-xs font-medium ring-1",
                highlightStyles[item.tone]
              )}
            >
              <span className="truncate">{item.label}</span>
            </span>
          ))}
        </div>

        {chartData.length >= 2 && (
          <div className="rounded-2xl bg-surface px-3 py-3">
            <p className="mb-2 text-xs font-medium text-[var(--text-secondary)]">
              แนวโน้มคะแนน 7 วัน
              {insight.trendCaption && (
                <span className="text-[var(--text-primary)]">
                  {" "}
                  · {insight.trendCaption}
                </span>
              )}
            </p>
            <ResponsiveContainer width="100%" height={64}>
              <LineChart data={chartData}>
                <YAxis hide domain={["dataMin - 5", "dataMax + 5"]} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid var(--border-subtle, #E5E5EA)",
                    fontSize: 12,
                  }}
                  formatter={(value) => [`${value ?? 0}/100`, "คะแนน"]}
                  labelFormatter={() => ""}
                />
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

        <div className="space-y-3 rounded-2xl bg-surface p-4">
          <div className="flex gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-primary/10 text-accent-primary">
              <BookOpen className="h-4 w-4" strokeWidth={1.75} aria-hidden />
            </span>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-[var(--text-primary)]">
                อ้างอิงจากงานวิจัย
              </p>
              <p className="text-xs leading-relaxed text-[var(--text-secondary)]">
                {insight.researchNote}
              </p>
            </div>
          </div>

          <div className="flex gap-3 border-t border-border-subtle pt-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-primary/10 text-accent-primary">
              <Lightbulb className="h-4 w-4" strokeWidth={1.75} aria-hidden />
            </span>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-[var(--text-primary)]">
                ขั้นตอนถัดไป
              </p>
              <p className="text-xs leading-relaxed text-[var(--text-secondary)]">
                {insight.suggestion}
              </p>
            </div>
          </div>
        </div>

        {resultId && (
          <Link
            href={`/result/${resultId}`}
            className="inline-flex items-center gap-1 text-sm font-medium text-accent-primary"
          >
            {CTA_VIEW_DETAIL}
            <ArrowRight className="h-4 w-4" strokeWidth={1.75} aria-hidden />
          </Link>
        )}
      </CardContent>
    </Card>
  );
}
