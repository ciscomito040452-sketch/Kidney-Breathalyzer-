"use client";

import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  ChevronDown,
  ClipboardList,
  Gauge,
  Lightbulb,
  Minus,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Wind,
  Droplets,
} from "lucide-react";
import { usePreferences } from "@/components/providers/PreferencesProvider";
import { formatTrendInsightLatestLine } from "@/lib/dashboard/build-trend-period-insight";
import type { HolisticInsight } from "@/lib/ai-insight/build-holistic-insight";
import type { TrendDirection } from "@/lib/ai-insight/analyze-measurements";
import {
  InsightGroupedCard,
  InsightStepHeader,
} from "@/components/ai-insight/insight-ui";
import { cn } from "@/lib/utils";

interface HolisticTrendInsightCardProps {
  insight: HolisticInsight;
  className?: string;
}

const trendLineIcons: Record<string, LucideIcon> = {
  ammonia: Wind,
  acetone: Droplets,
  "risk-score": Gauge,
};

function TrendDirectionIcon({ trend }: { trend: TrendDirection }) {
  if (trend === "rising") {
    return (
      <TrendingUp
        className="h-4 w-4 text-risk-moderate"
        strokeWidth={1.75}
        aria-hidden
      />
    );
  }
  if (trend === "falling") {
    return (
      <TrendingDown
        className="h-4 w-4 text-risk-low"
        strokeWidth={1.75}
        aria-hidden
      />
    );
  }
  return (
    <Minus
      className="h-4 w-4 text-[var(--text-secondary)]"
      strokeWidth={1.75}
      aria-hidden
    />
  );
}

function trendForLine(
  insight: HolisticInsight,
  lineId: string
): TrendDirection {
  const { analytics } = insight;
  if (lineId === "ammonia") return analytics.ammoniaTrend;
  if (lineId === "acetone") return analytics.acetoneTrend;
  return analytics.riskScoreTrend;
}

export function HolisticTrendInsightCard({
  insight,
  className,
}: HolisticTrendInsightCardProps) {
  const { locale, translate } = usePreferences();
  const [researchOpen, setResearchOpen] = useState(false);

  return (
    <InsightGroupedCard className={className}>
      <div className="border-b border-border-subtle px-4 py-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-[var(--accent-tint)] text-accent-primary">
            <Sparkles className="h-4 w-4" strokeWidth={1.75} aria-hidden />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[var(--text-primary)]">
              {translate("trendInsightTitle")}
            </p>
            <p className="text-xs text-[var(--text-secondary)]">
              {translate("holisticTrendInsightSubtitle")}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-0 divide-y divide-border-subtle">
        <section className="space-y-3 px-4 py-4">
          <InsightStepHeader
            step={1}
            title={translate("insightStepSummary")}
            icon={ClipboardList}
          />
          <ul className="space-y-2.5 pl-1">
            {insight.summaryBullets.map((bullet) => (
              <li
                key={bullet}
                className="flex items-start gap-2.5 text-sm leading-relaxed text-[var(--text-primary)]"
              >
                <span
                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-primary"
                  aria-hidden
                />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-2 px-4 py-4">
          <InsightStepHeader
            step={2}
            title={translate("insightStepTrends")}
            icon={TrendingUp}
          />
          <div className="mt-3 space-y-2">
            {insight.trendLines.map((line) => {
              const Icon = trendLineIcons[line.id] ?? Gauge;
              const trend = trendForLine(insight, line.id);

              return (
                <div
                  key={line.id}
                  className="rounded-xl bg-surface-elevated px-3 py-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-tint)] text-accent-primary">
                        <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
                      </span>
                      <p className="truncate text-xs font-medium text-[var(--text-secondary)]">
                        {line.label}
                      </p>
                    </div>
                    <TrendDirectionIcon trend={trend} />
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--text-primary)]">
                    {line.narrative}
                  </p>
                </div>
              );
            })}
          </div>

          <p className="rounded-xl bg-[var(--accent-tint)] px-3 py-2.5 text-sm font-medium text-accent-primary">
            {formatTrendInsightLatestLine(locale, insight.latestRiskLabel)}
          </p>
        </section>

        <section className="px-4 py-4">
          <InsightStepHeader
            step={3}
            title={translate("insightStepActions")}
            icon={Lightbulb}
          />
          <ol className="mt-3 divide-y divide-border-subtle overflow-hidden rounded-xl border border-border-subtle">
            {insight.suggestionSteps.map((step, index) => (
              <li
                key={step}
                className="flex items-start gap-3 bg-surface-elevated/50 px-3 py-3"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-primary text-xs font-bold text-white">
                  {index + 1}
                </span>
                <span className="pt-0.5 text-sm leading-relaxed text-[var(--text-primary)]">
                  {step}
                </span>
              </li>
            ))}
          </ol>
        </section>

        <section className="px-4 py-3">
          <button
            type="button"
            onClick={() => setResearchOpen((open) => !open)}
            className="flex w-full items-center justify-between gap-2 rounded-xl px-1 py-2 text-left"
            aria-expanded={researchOpen}
          >
            <span className="flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)]">
              <BookOpen className="h-4 w-4" strokeWidth={1.75} aria-hidden />
              {translate("researchNoteTitle")}
            </span>
            <ChevronDown
              className={cn(
                "h-4 w-4 shrink-0 text-[var(--text-secondary)] transition-transform",
                researchOpen && "rotate-180"
              )}
              strokeWidth={1.75}
              aria-hidden
            />
          </button>
          {researchOpen && (
            <p className="px-1 pb-2 text-sm leading-relaxed text-[var(--text-secondary)]">
              {insight.researchNote}
            </p>
          )}
        </section>
      </div>
    </InsightGroupedCard>
  );
}
