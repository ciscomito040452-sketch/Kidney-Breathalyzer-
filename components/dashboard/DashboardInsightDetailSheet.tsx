"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createPortal } from "react-dom";
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
  X,
} from "lucide-react";
import { usePreferences } from "@/components/providers/PreferencesProvider";
import { Button } from "@/components/ui/button";
import type {
  DashboardInsight,
  InsightHighlightTone,
} from "@/lib/dashboard/build-dashboard-insight";
import { cn } from "@/lib/utils";

interface SparklinePoint {
  date: string;
  risk_score: number;
}

interface DashboardInsightDetailSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  insight: DashboardInsight;
  sparklineData?: SparklinePoint[];
  resultId?: string;
}

const toneDot: Record<InsightHighlightTone, string> = {
  good: "bg-risk-low",
  attention: "bg-accent-primary",
  neutral: "bg-[var(--text-secondary)]",
};

export function DashboardInsightDetailSheet({
  open,
  onOpenChange,
  insight,
  sparklineData = [],
  resultId,
}: DashboardInsightDetailSheetProps) {
  const { translate } = usePreferences();
  const [mounted, setMounted] = useState(false);

  const chartData = sparklineData.map((d) => ({
    ...d,
    score: Math.round(d.risk_score * 100),
  }));

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        aria-label={translate("cancel")}
        onClick={() => onOpenChange(false)}
      />
      <div
        className="relative z-10 flex max-h-[min(88vh,720px)] w-full max-w-app flex-col rounded-t-2xl bg-[var(--bg-canvas)] shadow-mobile"
        role="dialog"
        aria-modal="true"
        aria-labelledby="insight-sheet-title"
      >
        <div className="flex shrink-0 items-center justify-between rounded-t-2xl border-b border-border-subtle bg-[var(--bg-primary)] px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-primary/10 text-accent-primary">
              <Sparkles className="h-4 w-4" strokeWidth={1.75} aria-hidden />
            </span>
            <h2
              id="insight-sheet-title"
              className="text-base font-semibold text-[var(--text-primary)]"
            >
              {translate("aiSummaryTitle")}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--text-secondary)] hover:bg-surface"
            aria-label={translate("cancel")}
          >
            <X className="h-5 w-5" strokeWidth={1.75} />
          </button>
        </div>

        <div
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          <div className="space-y-3 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))]">
            <section className="rounded-2xl bg-[var(--bg-primary)] p-4 shadow-card">
              <ul className="space-y-2.5">
                {insight.highlights.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-start gap-2.5 text-sm text-[var(--text-primary)]"
                  >
                    <span
                      className={cn(
                        "mt-1.5 h-2 w-2 shrink-0 rounded-full",
                        toneDot[item.tone]
                      )}
                      aria-hidden
                    />
                    <span className="leading-relaxed">{item.label}</span>
                  </li>
                ))}
              </ul>
            </section>

            {chartData.length >= 2 && (
              <section className="rounded-2xl bg-[var(--bg-primary)] p-4 shadow-card">
                <p className="mb-3 text-xs font-medium text-[var(--text-secondary)]">
                  {translate("trendScore7days")}
                  {insight.trendCaption && (
                    <span className="text-[var(--text-primary)]">
                      {" "}
                      · {insight.trendCaption}
                    </span>
                  )}
                </p>
                <ResponsiveContainer width="100%" height={88}>
                  <LineChart data={chartData}>
                    <YAxis hide domain={["dataMin - 5", "dataMax + 5"]} />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 12,
                        border: "1px solid var(--border-subtle, #E5E5EA)",
                        fontSize: 12,
                      }}
                      formatter={(value) => [
                        `${value ?? 0}/100`,
                        translate("scoreChartLabel"),
                      ]}
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
              </section>
            )}

            <section className="rounded-2xl bg-[var(--bg-primary)] p-4 shadow-card">
              <p className="text-sm leading-relaxed text-[var(--text-primary)]">
                {insight.summary}
              </p>
            </section>

            <section className="rounded-2xl bg-[var(--bg-primary)] p-4 shadow-card">
              <div className="flex gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-primary/10 text-accent-primary">
                  <BookOpen className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                </span>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-[var(--text-primary)]">
                    {translate("researchNoteTitle")}
                  </p>
                  <p className="text-xs leading-relaxed text-[var(--text-secondary)]">
                    {insight.researchNote}
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-2xl bg-[var(--bg-primary)] p-4 shadow-card">
              <div className="flex gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-primary/10 text-accent-primary">
                  <Lightbulb
                    className="h-4 w-4"
                    strokeWidth={1.75}
                    aria-hidden
                  />
                </span>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-[var(--text-primary)]">
                    {translate("nextStepsTitle")}
                  </p>
                  <p className="text-xs leading-relaxed text-[var(--text-secondary)]">
                    {insight.suggestion}
                  </p>
                </div>
              </div>
            </section>

            {resultId && (
              <Button className="h-[52px] w-full" asChild>
                <Link href={`/result/${resultId}`}>
                  {translate("viewFullReport")}
                  <ArrowRight className="ml-1 h-4 w-4" strokeWidth={1.75} />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
