"use client";

import { useEffect, useState } from "react";
import { RiskBadge } from "@/components/shared/RiskBadge";
import { RiskScoreRing } from "@/components/shared/RiskScoreRing";
import { TrendDeltaBadge } from "@/components/shared/TrendDeltaBadge";
import { usePreferences } from "@/components/providers/PreferencesProvider";
import { useMotionSafe } from "@/lib/motion/use-motion-safe";
import { scorePercent } from "@/lib/risk-engine/risk-zones";
import { formatDateTimeLocale } from "@/lib/utils";
import type { RiskLevel } from "@/types/measurement";
import { cn } from "@/lib/utils";

interface ScreeningHeroSummaryProps {
  riskLevel: RiskLevel;
  riskScore: number;
  measuredAt: string;
  riskDelta?: number | null;
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

  return (
    <section
      className={cn(
        "kb-fade-up rounded-3xl px-4 py-5 text-center",
        heroTint[riskLevel]
      )}
    >
      <p className="text-[11px] font-medium uppercase tracking-wide text-[var(--text-secondary)]">
        {translate("riskScoreLabel")}
      </p>
      <p className="mt-0.5 text-xs text-[var(--text-secondary)]">
        {formatDateTimeLocale(locale, measuredAt)}
      </p>

      <div className="relative mx-auto mt-3 flex h-36 w-36 items-center justify-center">
        <RiskScoreRing
          riskScore={riskScore}
          riskLevel={riskLevel}
          size={140}
          animateOnMount
          className="absolute inset-0 m-auto"
        />
        <div className="relative text-center">
          <p className="text-4xl font-semibold tabular-nums tracking-tight">
            {displayPct}
          </p>
          <p className="text-xs text-[var(--text-secondary)]">/100</p>
        </div>
      </div>

      <div
        className="mt-3 flex flex-wrap items-center justify-center gap-2"
        style={{ animationDelay: "120ms" }}
      >
        <RiskBadge level={riskLevel} compact />
        <TrendDeltaBadge delta={riskDelta} />
      </div>

      <p
        className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]"
        style={{ animationDelay: "160ms" }}
      >
        {translate("screeningContextSubtitle")}
      </p>
    </section>
  );
}
