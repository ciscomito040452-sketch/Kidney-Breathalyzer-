"use client";

import { useMemo, useState } from "react";
import { ClipboardList } from "lucide-react";
import { DisclaimerBanner } from "@/components/layout/DisclaimerBanner";
import { HistoryMeasurementRow } from "@/components/history/HistoryMeasurementRow";
import { TrendChart } from "@/components/dashboard/TrendChart";
import { EmptyState } from "@/components/shared/EmptyState";
import { SegmentedControl } from "@/components/shared/SegmentedControl";
import {
  HISTORY_DAY_OPTIONS,
  RISK_SHORT_LABELS,
  type HistoryDays,
} from "@/lib/constants";
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
  const [days, setDays] = useState<HistoryDays>(7);
  const [riskFilter, setRiskFilter] = useState<RiskLevel | "all">("all");

  const measurements = useMemo(
    () => initialMeasurements,
    [initialMeasurements]
  );

  const filtered = useMemo(() => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return measurements.filter((m) => {
      const inRange = new Date(m.measured_at) >= cutoff;
      const matchesRisk =
        riskFilter === "all" || m.risk_level === riskFilter;
      return inRange && matchesRisk;
    });
  }, [measurements, days, riskFilter]);

  const trendData = filtered
    .slice()
    .reverse()
    .map((m) => ({
      date: m.measured_at,
      mq135_value: m.mq135_value,
      mq3_value: m.mq3_value,
      risk_score: m.risk_score,
    }));

  return (
    <main className="space-y-6 px-4 py-6">
      <header>
        <h1 className="text-xl font-semibold">ประวัติการวัด</h1>
        <p className="text-sm text-[var(--text-secondary)]">
          ติดตามแนวโน้มและผลย้อนหลัง
        </p>
      </header>

      <SegmentedControl
        options={HISTORY_DAY_OPTIONS}
        value={days}
        onChange={setDays}
        formatLabel={(d) => `${d} วัน`}
      />

      <TrendChart data={trendData} title={`แนวโน้ม ${days} วัน`} showDualLine />

      <section className="space-y-3">
        <div>
          <h2 className="text-base font-semibold text-[var(--text-primary)]">
            รายการวัด
          </h2>
          <p className="text-xs text-[var(--text-secondary)]">
            {filtered.length > 0
              ? `${filtered.length} รายการในช่วง ${days} วัน`
              : `ไม่มีรายการในช่วง ${days} วัน`}
          </p>
        </div>

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

        <div className="space-y-3">
          {filtered.length === 0 ? (
            <EmptyState
              icon={ClipboardList}
              message="ไม่พบข้อมูลในช่วงที่เลือก"
            />
          ) : (
            filtered.map((m) => (
              <HistoryMeasurementRow key={m.id} measurement={m} />
            ))
          )}
        </div>
      </section>

      <DisclaimerBanner compact />
    </main>
  );
}
