"use client";

import { useEffect, useState } from "react";
import { RiskBadge } from "@/components/shared/RiskBadge";
import { RiskScoreRing } from "@/components/shared/RiskScoreRing";
import { TrendDeltaBadge } from "@/components/shared/TrendDeltaBadge";
import { usePreferences } from "@/components/providers/PreferencesProvider";
import { useMotionSafe } from "@/lib/motion/use-motion-safe";
import { scorePercent } from "@/lib/risk-engine/risk-zones";
import {
  getRiskQualitativeCaption,
  getRiskQualitativeHeadline,
} from "@/lib/ui/qualitative-labels";
import { formatDateTimeLocale } from "@/lib/utils";
import type { RiskLevel } from "@/types/measurement";
import { cn } from "@/lib/utils";

interface ScreeningHeroSummaryProps {
  riskLevel: RiskLevel;
  riskScore: number;
  measuredAt: string;
  riskDelta?: number | null;
  variant?: "detail" | "pinned";
}

const heroTint: Record<RiskLevel, string> = {
  low: "bg-risk-low/8",
  moderate: "bg-risk-moderate/10",
  high: "bg-risk-high/12",
};

export function ScreeningHeroSummary({
  riskLevel,
  riskScore,
  measuredAt,
  riskDelta,
  variant = "detail",
}: ScreeningHeroSummaryProps) {
  const { locale, translate } = usePreferences();
  const { animate, durationMs } = useMotionSafe();
  const targetPct = scorePercent(riskScore);
  const [displayPct, setDisplayPct] = useState(animate ? 0 : targetPct);

  useEffect(() => {
    if (!animate) {
      setDisplayPct(targetPct);
      return;
    }

    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      setDisplayPct(Math.round(targetPct * t));
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [animate, durationMs, targetPct]);

  const headline = getRiskQualitativeHeadline(locale, riskLevel);
  const caption = getRiskQualitativeCaption(locale, riskScore, riskDelta);

  if (variant === "pinned") {
    return (
      <section
        className={cn(
          "kb-fade-up flex items-center gap-4 rounded-2xl p-4 app-card app-card--pinned",
          heroTint[riskLevel]
        )}
      >
        <RiskScoreRing
          riskScore={riskScore}
          riskLevel={riskLevel}
          size={56}
          animateOnMount
        />
        <div className="min-w-0 flex-1">
          <p className="text-pinned-caption text-[var(--text-secondary)]">
            {formatDateTimeLocale(locale, measuredAt)}
          </p>
          <p className="mt-0.5 text-pinned-headline font-semibold text-[var(--text-primary)]">
            {headline}
          </p>
          <p className="mt-1 text-pinned-caption text-[var(--text-secondary)]">
            {caption}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      className={cn(
        "kb-fade-up rounded-3xl px-4 py-6 text-center app-card app-card--elevated",
        heroTint[riskLevel]
      )}
    >
      <p className="text-pinned-caption font-medium text-[var(--text-secondary)]">
        {translate("pinnedScreening")}
      </p>
      <p className="mt-1 text-pinned-headline font-semibold text-[var(--text-primary)]">
        {headline}
      </p>
      <p className="mt-0.5 text-pinned-caption text-[var(--text-secondary)]">
        {formatDateTimeLocale(locale, measuredAt)}
      </p>

      <div className="relative mx-auto mt-4 flex h-40 w-40 items-center justify-center">
        <RiskScoreRing
          riskScore={riskScore}
          riskLevel={riskLevel}
          size={152}
          animateOnMount
          className="absolute inset-0 m-auto"
        />
        <div className="relative text-center">
          <p className="text-5xl font-semibold tabular-nums tracking-tight">
            {displayPct}
          </p>
          <p className="text-sm text-[var(--text-secondary)]">/100</p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
        <RiskBadge level={riskLevel} compact />
        <TrendDeltaBadge delta={riskDelta} />
      </div>

      <p className="mt-3 text-pinned-caption leading-relaxed text-[var(--text-secondary)]">
        {caption}
      </p>
    </section>
  );
}
