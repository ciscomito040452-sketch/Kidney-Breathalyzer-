"use client";

import { useMemo, useState } from "react";
import { TrendChart } from "@/components/dashboard/TrendChart";
import { SegmentedControl } from "@/components/shared/SegmentedControl";
import { DASHBOARD_TREND_DAY_OPTIONS, type DashboardTrendDays } from "@/lib/constants";
import type { Measurement } from "@/types/measurement";

interface DashboardTrendSectionProps {
  measurements: Measurement[];
}

export function DashboardTrendSection({
  measurements,
}: DashboardTrendSectionProps) {
  const [days, setDays] = useState<DashboardTrendDays>(7);

  const trendData = useMemo(() => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);

    return measurements
      .slice()
      .reverse()
      .filter((m) => new Date(m.measured_at) >= cutoff)
      .map((m) => ({
        date: m.measured_at,
        mq135_value: m.mq135_value,
        mq3_value: m.mq3_value,
        risk_score: m.risk_score,
      }));
  }, [measurements, days]);

  return (
    <div className="space-y-3">
      <SegmentedControl
        options={DASHBOARD_TREND_DAY_OPTIONS}
        value={days}
        onChange={setDays}
        formatLabel={(d) => `${d} วัน`}
      />
      <TrendChart data={trendData} title={`แนวโน้ม ${days} วัน`} compact />
    </div>
  );
}
