"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ClipboardList } from "lucide-react";
import { DisclaimerBanner } from "@/components/layout/DisclaimerBanner";
import { TrendChart } from "@/components/dashboard/TrendChart";
import { EmptyState } from "@/components/shared/EmptyState";
import { RiskBadge } from "@/components/shared/RiskBadge";
import { SegmentedControl } from "@/components/shared/SegmentedControl";
import {
  HISTORY_DAY_OPTIONS,
  RISK_LABELS,
  type HistoryDays,
} from "@/lib/constants";
import {
  formatAcetonePpb,
  formatAmmoniaPpb,
  SENSOR_UI,
} from "@/lib/sensor-labels";
import { formatDateTimeThai } from "@/lib/utils";
import type { Measurement, RiskLevel } from "@/types/measurement";
import { cn } from "@/lib/utils";

interface HistoryPageClientProps {
  initialMeasurements: Measurement[];
}

const RISK_FILTER_OPTIONS = [
  { value: "all" as const, label: "ทั้งหมด" },
  { value: "low" as const, label: RISK_LABELS.low },
  { value: "moderate" as const, label: RISK_LABELS.moderate },
  { value: "high" as const, label: RISK_LABELS.high },
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

      <div className="flex flex-wrap gap-2">
        {RISK_FILTER_OPTIONS.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            onClick={() => setRiskFilter(value)}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-medium",
              riskFilter === value
                ? "bg-accent-primary text-white"
                : "bg-surface text-[var(--text-secondary)]"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            message="ไม่พบข้อมูลในช่วงที่เลือก"
          />
        ) : (
          filtered.map((m) => (
            <Link
              key={m.id}
              href={`/result/${m.id}`}
              className="flex items-center justify-between rounded-xl border border-border-subtle bg-surface px-4 py-3 transition-colors hover:bg-surface/80"
            >
              <div>
                <p className="text-sm font-medium">
                  {formatDateTimeThai(m.measured_at)}
                </p>
                <p className="text-xs text-[var(--text-secondary)]">
                  คะแนน {Math.round(m.risk_score * 100)}/100 ·{" "}
                  {SENSOR_UI.ammonia.label.split(" ")[0]}{" "}
                  {formatAmmoniaPpb(m.mq135_value)} ·{" "}
                  {SENSOR_UI.acetone.label}{" "}
                  {formatAcetonePpb(m.mq3_value)} ppb
                </p>
              </div>
              <RiskBadge level={m.risk_level} />
            </Link>
          ))
        )}
      </div>

      <DisclaimerBanner compact />
    </main>
  );
}
