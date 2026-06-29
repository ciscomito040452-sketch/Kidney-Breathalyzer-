"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HistoryScoreBadge } from "@/components/history/HistoryScoreBadge";
import { usePreferences } from "@/components/providers/PreferencesProvider";
import { getRiskFullLabels } from "@/lib/i18n/labels";
import { formatDateTimeLocale } from "@/lib/utils";
import type { Measurement } from "@/types/measurement";
import { cn } from "@/lib/utils";

interface HistoryLatestHeroProps {
  measurement: Measurement;
}

const heroTint = {
  low: "bg-risk-low/8",
  moderate: "bg-risk-moderate/10",
  high: "bg-risk-high/12",
} as const;

export function HistoryLatestHero({ measurement }: HistoryLatestHeroProps) {
  const { locale, translate } = usePreferences();
  const riskLabels = getRiskFullLabels(locale);

  return (
    <Link
      href={`/result/${measurement.id}`}
      className={cn(
        "kb-fade-up flex items-center gap-4 rounded-3xl border border-[var(--surface-card-border)] px-4 py-4 shadow-card app-card transition-transform active:scale-[0.99]",
        heroTint[measurement.risk_level]
      )}
    >
      <HistoryScoreBadge
        riskScore={measurement.risk_score}
        riskLevel={measurement.risk_level}
        size={56}
      />
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-medium uppercase tracking-wide text-[var(--text-secondary)]">
          {translate("latestResults")}
        </p>
        <p className="mt-0.5 truncate text-base font-semibold text-[var(--text-primary)]">
          {riskLabels[measurement.risk_level]}
        </p>
        <p className="mt-1 text-xs text-[var(--text-secondary)]">
          {formatDateTimeLocale(locale, measurement.measured_at)}
        </p>
      </div>
      <ArrowRight
        className="h-4 w-4 shrink-0 text-accent-primary"
        strokeWidth={2}
        aria-hidden
      />
    </Link>
  );
}
