"use client";

import { useMemo } from "react";
import { Activity } from "lucide-react";
import {
  PinnedAnalyticsFooter,
  PinnedHealthCard,
} from "@/components/health";
import { RiskScoreRing } from "@/components/shared/RiskScoreRing";
import { usePreferences } from "@/components/providers/PreferencesProvider";
import { buildPinnedSparklines } from "@/lib/dashboard/build-pinned-sparklines";
import {
  getRiskQualitativeCaption,
  getRiskQualitativeHeadline,
} from "@/lib/ui/qualitative-labels";
import { scorePercent } from "@/lib/risk-engine/risk-zones";
import { formatDateTimeLocale } from "@/lib/utils";
import type { Measurement } from "@/types/measurement";

interface HistoryLatestHeroProps {
  measurement: Measurement;
  measurements: Measurement[];
}

export function HistoryLatestHero({
  measurement,
  measurements,
}: HistoryLatestHeroProps) {
  const { locale, translate } = usePreferences();

  const sparklines = useMemo(
    () => buildPinnedSparklines(measurements),
    [measurements]
  );

  return (
    <PinnedHealthCard
      icon={Activity}
      iconClassName="bg-[rgb(var(--metric-screening-rgb)/0.12)] text-[var(--metric-screening)]"
      category={translate("latestResults")}
      timeLabel={formatDateTimeLocale(locale, measurement.measured_at)}
      headline={getRiskQualitativeHeadline(locale, measurement.risk_level)}
      value={String(scorePercent(measurement.risk_score))}
      valueUnit="/100"
      caption={getRiskQualitativeCaption(locale, measurement.risk_score)}
      href={`/result/${measurement.id}`}
      visual={
        <RiskScoreRing
          riskScore={measurement.risk_score}
          riskLevel={measurement.risk_level}
          size={68}
        />
      }
      footer={
        <PinnedAnalyticsFooter
          sparklineData={sparklines.risk}
          stroke="var(--metric-screening)"
        />
      }
    />
  );
}
