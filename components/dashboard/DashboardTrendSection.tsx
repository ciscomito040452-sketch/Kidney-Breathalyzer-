"use client";

import { useMemo, useState } from "react";
import { TrendChart } from "@/components/dashboard/TrendChart";
import { TrendChartInsight } from "@/components/dashboard/TrendChartInsight";
import { usePreferences } from "@/components/providers/PreferencesProvider";
import { SegmentedControl } from "@/components/shared/SegmentedControl";
import { buildTrendPeriodInsight } from "@/lib/dashboard/build-trend-period-insight";
import { DASHBOARD_TREND_DAY_OPTIONS, type DashboardTrendDays } from "@/lib/constants";
import type { Measurement } from "@/types/measurement";

interface DashboardTrendSectionProps {
  measurements: Measurement[];
}

export function DashboardTrendSection({
  measurements,
}: DashboardTrendSectionProps) {
  const { locale, translate } = usePreferences();
  const [days, setDays] = useState<DashboardTrendDays>(7);

  const filteredMeasurements = useMemo(() => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return measurements.filter((m) => new Date(m.measured_at) >= cutoff);
  }, [measurements, days]);

  const trendData = useMemo(() => {
    return filteredMeasurements
      .slice()
      .reverse()
      .map((m) => ({
        date: m.measured_at,
        mq135_value: m.mq135_value,
        mq3_value: m.mq3_value,
        risk_score: m.risk_score,
      }));
  }, [filteredMeasurements]);

  const trendInsight = useMemo(
    () => buildTrendPeriodInsight(filteredMeasurements, locale, days),
    [filteredMeasurements, locale, days]
  );

  return (
    <div className="space-y-3">
      <SegmentedControl
        options={DASHBOARD_TREND_DAY_OPTIONS}
        value={days}
        onChange={setDays}
        formatLabel={(d) => translate("trendDays").replace("{n}", String(d))}
      />
      <TrendChart
        data={trendData}
        title={translate("trendTitle").replace("{n}", String(days))}
        compact
        showDualLine
      />
      {trendInsight && <TrendChartInsight insight={trendInsight} />}
    </div>
  );
}
