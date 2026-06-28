"use client";

import { useMemo, useState } from "react";
import { ClipboardList } from "lucide-react";
import { DisclaimerBanner } from "@/components/layout/DisclaimerBanner";
import { HistoryDayGroupSection } from "@/components/history/HistoryDayGroupSection";
import { HistoryPeriodControl } from "@/components/history/HistoryPeriodControl";
import { TrendChart } from "@/components/dashboard/TrendChart";
import { EmptyState } from "@/components/shared/EmptyState";
import { PageSectionHeader } from "@/components/shared/PageSectionHeader";
import { TabPageHeader } from "@/components/shared/TabPageHeader";
import { RISK_SHORT_LABELS } from "@/lib/constants";
import {
  filterMeasurementsByPeriod,
  HISTORY_PERIOD_LABELS,
  HISTORY_PERIOD_OPTIONS,
  periodChartTitle,
  type HistoryPeriod,
} from "@/lib/history/date-range";
import { groupMeasurementsByDay } from "@/lib/history/group-by-day";
import type { Measurement, RiskLevel } from "@/types/measurement";
import { cn } from "@/lib/utils";

interface HistoryPageClientProps {
  initialMeasurements: Measurement[];
}

const RISK_FILTER_OPTIONS = [
  { value: "all" as const, label: "ทั้งหมด" },
  { value: "low" as const, label: RISK_SHORT_LABELS.low },
  { value: "moderate" as const, label: RISK_SHORT_LABELS.moderate },
  { value: "high" as const, label: RISK_SHORT_LABELS.high },
];

export function HistoryPageClient({
  initialMeasurements,
}: HistoryPageClientProps) {
  const [period, setPeriod] = useState<HistoryPeriod>("last_30");
  const [riskFilter, setRiskFilter] = useState<RiskLevel | "all">("all");

  const filtered = useMemo(() => {
    const inPeriod = filterMeasurementsByPeriod(initialMeasurements, period);
    return inPeriod.filter(
      (m) => riskFilter === "all" || m.risk_level === riskFilter
    );
  }, [initialMeasurements, period, riskFilter]);

  const groups = useMemo(
    () => groupMeasurementsByDay(filtered),
    [filtered]
  );

  const trendData = filtered
    .slice()
    .reverse()
    .map((m) => ({
      date: m.measured_at,
      mq135_value: m.mq135_value,
      mq3_value: m.mq3_value,
      risk_score: m.risk_score,
    }));

  const listSubtitle =
    filtered.length > 0
      ? `${filtered.length} รายการ · ${HISTORY_PERIOD_LABELS[period]}`
      : `ไม่มีรายการ · ${HISTORY_PERIOD_LABELS[period]}`;

  return (
    <main className="space-y-6 px-4 py-6">
      <TabPageHeader
        title="ประวัติการวัด"
        subtitle="ติดตามแนวโน้มและผลย้อนหลัง"
      />

      <HistoryPeriodControl
        options={HISTORY_PERIOD_OPTIONS}
        value={period}
        onChange={setPeriod}
        formatLabel={(p) => HISTORY_PERIOD_LABELS[p]}
      />

      <TrendChart
        data={trendData}
        title={periodChartTitle(period)}
        showDualLine
      />

      <section className="space-y-3">
        <PageSectionHeader title="รายการวัด" subtitle={listSubtitle} />

        <div className="grid grid-cols-4 gap-2">
          {RISK_FILTER_OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setRiskFilter(value)}
              className={cn(
                "min-h-[44px] rounded-full px-2 text-sm font-medium transition-colors",
                riskFilter === value
                  ? "bg-accent-primary text-white"
                  : "bg-surface text-[var(--text-secondary)] hover:bg-[var(--bg-primary)]"
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            message="ไม่พบข้อมูลในช่วงที่เลือก"
          />
        ) : (
          <div className="space-y-5">
            {groups.map((group) => (
              <HistoryDayGroupSection key={group.key} group={group} />
            ))}
          </div>
        )}
      </section>

      <DisclaimerBanner />
    </main>
  );
}
