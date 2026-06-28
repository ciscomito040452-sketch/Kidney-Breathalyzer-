"use client";

import { useMemo } from "react";
import { TrendChart } from "@/components/dashboard/TrendChart";
import { HolisticTrendInsightCard } from "@/components/ai-insight/HolisticTrendInsightCard";
import { PageSectionHeader } from "@/components/shared/PageSectionHeader";
import { usePreferences } from "@/components/providers/PreferencesProvider";
import type { HolisticInsight } from "@/lib/ai-insight/build-holistic-insight";
import type { Measurement } from "@/types/measurement";

interface HolisticTrendSectionProps {
  measurements: Measurement[];
  insight: HolisticInsight;
}

export function HolisticTrendSection({
  measurements,
  insight,
}: HolisticTrendSectionProps) {
  const { translate } = usePreferences();

  const trendData = useMemo(
    () =>
      measurements
        .slice()
        .reverse()
        .map((m) => ({
          date: m.measured_at,
          mq135_value: m.mq135_value,
          mq3_value: m.mq3_value,
          risk_score: m.risk_score,
        })),
    [measurements]
  );

  const chartTitle = translate("trendTitle").replace(
    "{n}",
    String(insight.analytics.daySpan)
  );

  return (
    <section className="space-y-3">
      <PageSectionHeader title={translate("insightTrendSection")} />
      <TrendChart data={trendData} title={chartTitle} showDualLine />
      <HolisticTrendInsightCard insight={insight} />
    </section>
  );
}
