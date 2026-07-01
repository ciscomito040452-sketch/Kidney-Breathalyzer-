"use client";

import { Activity } from "lucide-react";
import { PinnedHealthCard } from "@/components/health/PinnedHealthCard";
import { RiskScoreRing } from "@/components/shared/RiskScoreRing";
import { usePreferences } from "@/components/providers/PreferencesProvider";
import {
  getRiskQualitativeCaption,
  getRiskQualitativeHeadline,
} from "@/lib/ui/qualitative-labels";
import { formatDateTimeLocale } from "@/lib/utils";
import type { Measurement } from "@/types/measurement";

interface HistoryLatestHeroProps {
  measurement: Measurement;
}

export function HistoryLatestHero({ measurement }: HistoryLatestHeroProps) {
  const { locale, translate } = usePreferences();

  return (
    <PinnedHealthCard
      icon={Activity}
      iconClassName="bg-[rgb(var(--metric-screening-rgb)/0.12)] text-[var(--metric-screening)]"
      category={translate("latestResults")}
      timeLabel={formatDateTimeLocale(locale, measurement.measured_at)}
      headline={getRiskQualitativeHeadline(locale, measurement.risk_level)}
      caption={getRiskQualitativeCaption(locale, measurement.risk_score)}
      href={`/result/${measurement.id}`}
      visual={
        <RiskScoreRing
          riskScore={measurement.risk_score}
          riskLevel={measurement.risk_level}
          size={56}
        />
      }
    />
  );
}
