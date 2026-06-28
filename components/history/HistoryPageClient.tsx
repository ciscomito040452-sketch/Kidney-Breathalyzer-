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
import { usePreferences } from "@/components/providers/PreferencesProvider";
import {
  filterMeasurementsByPeriod,
  HISTORY_PERIOD_OPTIONS,
  type HistoryPeriod,
} from "@/lib/history/date-range";
import { groupMeasurementsByDay } from "@/lib/history/group-by-day";
import type { Measurement, RiskLevel } from "@/types/measurement";
import { cn } from "@/lib/utils";
import { getHistoryPeriodLabel, getPeriodChartTitle, getRiskShortLabels } from "@/lib/i18n/messages";

interface HistoryPageClientProps {
  initialMeasurements: Measurement[];
}

export function HistoryPageClient({
  initialMeasurements,
}: HistoryPageClientProps) {
  const { locale, translate } = usePreferences();
  const [period, setPeriod] = useState<HistoryPeriod>("last_30");
  const [riskFilter, setRiskFilter] = useState<RiskLevel | "all">("all");

  const riskLabels = getRiskShortLabels(locale);
  const riskFilterOptions = useMemo(
    () => [
      { value: "all" as const, label: translate("filterAll") },
      { value: "low" as const, label: riskLabels.low },
      { value: "moderate" as const, label: riskLabels.moderate },
      { value: "high" as const, label: riskLabels.high },
    ],
    [riskLabels, translate]
  );

  const filtered = useMemo(() => {
    const inPeriod = filterMeasurementsByPeriod(initialMeasurements, period);
    return inPeriod.filter(
      (m) => riskFilter === "all" || m.risk_level === riskFilter
    );
  }, [initialMeasurements, period, riskFilter]);

  const groups = useMemo(
    () => groupMeasurementsByDay(filtered, locale),
    [filtered, locale]
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

  const periodLabel = getHistoryPeriodLabel(locale, period);
  const listSubtitle =
    filtered.length > 0
      ? `${filtered.length} ${translate("itemsCount")} · ${periodLabel}`
      : `${translate("noItems")} · ${periodLabel}`;

  return (
    <main className="space-y-6 px-4 py-6">
      <TabPageHeader
        title={translate("historyTitle")}
        subtitle={translate("historySubtitle")}
      />

      <HistoryPeriodControl
        options={HISTORY_PERIOD_OPTIONS}
        value={period}
        onChange={setPeriod}
        formatLabel={(p) => getHistoryPeriodLabel(locale, p)}
      />

      <TrendChart
        data={trendData}
        title={getPeriodChartTitle(locale, period)}
        showDualLine
      />

      <section className="space-y-3">
        <PageSectionHeader
          title={translate("historyListTitle")}
          subtitle={listSubtitle}
        />

        <div className="grid grid-cols-4 gap-2">
          {riskFilterOptions.map(({ value, label }) => (
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
            message={translate("historyEmpty")}
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
