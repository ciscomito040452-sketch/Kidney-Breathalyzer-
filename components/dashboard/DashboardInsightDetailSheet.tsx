"use client";

import { useEffect, useMemo, useState } from "react";
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
  ChevronDown,
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
import {
  parseInsightSummary,
} from "@/lib/dashboard/format-insight-display";
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

const tonePill: Record<InsightHighlightTone, string> = {
  good: "bg-risk-low/15 text-risk-low",
  attention: "bg-accent-primary/12 text-accent-primary",
  neutral: "bg-surface-elevated text-[var(--text-secondary)]",
};

function parseHighlightLabel(label: string): {
  title: string;
  detail: string;
} {
  const split = label.split(" · ");
  if (split.length < 2) {
    return { title: label, detail: "" };
  }
  const detail = split.pop() ?? "";
  return { title: split.join(" · "), detail };
}

function InsightRow({
  title,
  detail,
  tone,
}: {
  title: string;
  detail: string;
  tone: InsightHighlightTone;
}) {
  const valueMatch = title.match(/(\d+(?:\.\d+)?)\s*(ppb)$/i);
  const metricLabel = valueMatch
    ? title.replace(/\s*\d+(?:\.\d+)?\s*ppb/i, "").trim()
    : title;
  const metricValue = valueMatch
    ? `${valueMatch[1]} ${valueMatch[2]}`
    : "";

  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3.5">
      <p className="min-w-0 text-sm text-[var(--text-secondary)]">
        {metricLabel}
      </p>
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
              tonePill[tone]
            )}
          >
            {detail}
          </span>
        )}
      </div>
    </div>
  );
}

export function DashboardInsightDetailSheet({
  open,
  onOpenChange,
  insight,
  sparklineData = [],
  resultId,
}: DashboardInsightDetailSheetProps) {
  const { locale, translate } = usePreferences();
  const [mounted, setMounted] = useState(false);
  const [researchOpen, setResearchOpen] = useState(false);

  const chartData = sparklineData.map((d) => ({
    ...d,
    score: Math.round(d.risk_score * 100),
  }));

  const parsedSummary = useMemo(
    () => parseInsightSummary(insight.summary, locale),
    [insight.summary, locale]
  );

  const suggestionSteps = insight.suggestionSteps;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    setResearchOpen(false);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open || !mounted) return null;

  const scoreHighlight = insight.highlights.find((h) => h.id === "score");
  const metricHighlights = insight.highlights.filter((h) => h.id !== "score");

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
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
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--accent-tint)] text-accent-primary">
                <Sparkles className="h-4 w-4" strokeWidth={1.75} aria-hidden />
              </span>
              <div className="min-w-0">
                <h2
                  id="insight-sheet-title"
                  className="text-base font-semibold text-[var(--text-primary)]"
                >
                  {translate("aiSummaryTitle")}
                </h2>
                <p className="truncate text-xs text-[var(--text-secondary)]">
                  {translate("aiSummarySubtitle")}
                </p>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[var(--text-secondary)] hover:bg-surface"
            aria-label={translate("cancel")}
          >
            <X className="h-5 w-5" strokeWidth={1.75} />
          </button>
        </div>

        <div
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          <div className="space-y-4 pb-[calc(1rem+env(safe-area-inset-bottom,0px))]">
            {scoreHighlight && (
              <section className="overflow-hidden rounded-2xl border border-[var(--surface-card-border)] bg-surface shadow-card app-card">
                {(() => {
                  const { title, detail } = parseHighlightLabel(
                    scoreHighlight.label
                  );
                  const scoreMatch = title.match(/(\d+\/100)\s*$/);
                  const scoreValue = scoreMatch?.[1] ?? title;
                  const labelPart = scoreMatch
                    ? title.replace(scoreMatch[0], "").trim()
                    : translate("riskScoreLabel");

                  return (
                    <div className="px-4 py-5">
                      <p className="text-xs font-medium uppercase tracking-wide text-[var(--text-secondary)]">
                        {labelPart}
                      </p>
                      <div className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <p className="text-4xl font-semibold tabular-nums tracking-tight">
                          {scoreValue}
                        </p>
                        {detail && (
                          <span
                            className={cn(
                              "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
                              tonePill[scoreHighlight.tone]
                            )}
                          >
                            {detail}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })()}
                {metricHighlights.length > 0 && (
                  <div className="divide-y divide-border-subtle border-t border-border-subtle">
                    {metricHighlights.map((item) => {
                      const { title, detail } = parseHighlightLabel(item.label);
                      return (
                        <InsightRow
                          key={item.id}
                          title={title}
                          detail={detail}
                          tone={item.tone}
                        />
                      );
                    })}
                  </div>
                )}
              </section>
            )}

            {chartData.length >= 2 && (
              <section className="overflow-hidden rounded-2xl border border-[var(--surface-card-border)] bg-surface px-4 py-4 shadow-card app-card">
                <div className="mb-3 flex items-baseline justify-between gap-2">
                  <p className="text-sm font-medium text-[var(--text-primary)]">
                    {translate("trendScore7days")}
                  </p>
                  {insight.trendCaption && (
                    <p className="text-xs text-[var(--text-secondary)]">
                      {insight.trendCaption}
                    </p>
                  )}
                </div>
                <ResponsiveContainer width="100%" height={96}>
                  <LineChart data={chartData}>
                    <YAxis hide domain={["dataMin - 5", "dataMax + 5"]} />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 12,
                        border: "1px solid var(--border-subtle)",
                        background: "var(--bg-primary)",
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
                      stroke="var(--accent-primary)"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </section>
            )}

            <section className="overflow-hidden rounded-2xl border border-[var(--surface-card-border)] bg-surface shadow-card app-card">
              <div className="border-b border-border-subtle px-4 py-3">
                <p className="text-xs font-medium uppercase tracking-wide text-[var(--text-secondary)]">
                  {translate("aiSummaryTitle")}
                </p>
              </div>
              <div className="space-y-3 px-4 py-4">
                <p className="text-sm leading-relaxed text-[var(--text-primary)]">
                  {parsedSummary.lead}
                </p>
                {parsedSummary.factors.length > 0 && (
                  <ul className="space-y-1.5">
                    {parsedSummary.factors.map((factor) => (
                      <li
                        key={factor}
                        className="flex items-start gap-2 text-sm text-[var(--text-secondary)]"
                      >
                        <span
                          className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[var(--text-secondary)]"
                          aria-hidden
                        />
                        <span>{factor}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {parsedSummary.conclusion && (
                  <p className="rounded-xl bg-[var(--accent-tint)] px-3 py-2.5 text-sm font-medium leading-snug text-accent-primary">
                    {parsedSummary.conclusion}
                  </p>
                )}
              </div>
            </section>

            <section className="overflow-hidden rounded-2xl border border-[var(--surface-card-border)] bg-surface shadow-card app-card">
              <div className="flex items-center gap-2 border-b border-border-subtle px-4 py-3">
                <Lightbulb
                  className="h-4 w-4 text-accent-primary"
                  strokeWidth={1.75}
                  aria-hidden
                />
                <p className="text-sm font-semibold text-[var(--text-primary)]">
                  {translate("nextStepsTitle")}
                </p>
              </div>
              <ol className="space-y-0 divide-y divide-border-subtle">
                {suggestionSteps.map((step, index) => (
                  <li
                    key={`${index}-${step}`}
                    className="flex gap-3 px-4 py-3.5 text-sm leading-snug text-[var(--text-primary)]"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--accent-tint)] text-xs font-semibold text-accent-primary">
                      {index + 1}
                    </span>
                    <span className="pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            </section>

            <section className="overflow-hidden rounded-2xl border border-[var(--surface-card-border)] bg-surface shadow-card app-card">
              <button
                type="button"
                onClick={() => setResearchOpen((v) => !v)}
                className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left"
                aria-expanded={researchOpen}
              >
                <div className="flex items-center gap-2">
                  <BookOpen
                    className="h-4 w-4 text-accent-primary"
                    strokeWidth={1.75}
                    aria-hidden
                  />
                  <span className="text-sm font-semibold text-[var(--text-primary)]">
                    {translate("researchNoteTitle")}
                  </span>
                </div>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 shrink-0 text-[var(--text-secondary)] transition-transform duration-200",
                    researchOpen && "rotate-180"
                  )}
                  aria-hidden
                />
              </button>
              {researchOpen && (
                <p className="border-t border-border-subtle px-4 py-3 text-xs leading-relaxed text-[var(--text-secondary)]">
                  {insight.researchNote}
                </p>
              )}
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
