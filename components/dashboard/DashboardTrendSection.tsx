"use client";

import { useMemo, useState } from "react";
import { TrendChart, type TrendMetric } from "@/components/dashboard/TrendChart";
import { usePreferences } from "@/components/providers/PreferencesProvider";
import { SegmentedControl } from "@/components/shared/SegmentedControl";
import { DASHBOARD_TREND_DAY_OPTIONS, type DashboardTrendDays } from "@/lib/constants";
import type { Measurement } from "@/types/measurement";

interface DashboardTrendSectionProps {
  measurements: Measurement[];
}

export function DashboardTrendSection({
  measurements,
}: DashboardTrendSectionProps) {
  const { translate } = usePreferences();
  const [days, setDays] = useState<DashboardTrendDays>(7);
  const [metric, setMetric] = useState<TrendMetric>("risk_score");

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

  const metricOptions: TrendMetric[] = ["risk_score", "ammonia", "acetone"];
  const metricLabels: Record<TrendMetric, string> = {
    risk_score: translate("trendMetricRisk"),
    ammonia: translate("trendMetricAmmonia"),
    acetone: translate("trendMetricAcetone"),
  };

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
        metric={metric}
        onMetricChange={setMetric}
        metricOptions={metricOptions}
        formatMetricLabel={(m) => metricLabels[m]}
      />
    </div>
  );
}
