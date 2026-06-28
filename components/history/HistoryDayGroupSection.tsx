"use client";

import { HistoryMeasurementRow } from "@/components/history/HistoryMeasurementRow";
import { usePreferences } from "@/components/providers/PreferencesProvider";
import type { HistoryDayGroup } from "@/lib/history/group-by-day";

interface HistoryDayGroupSectionProps {
  group: HistoryDayGroup;
}

export function HistoryDayGroupSection({ group }: HistoryDayGroupSectionProps) {
  const { translate } = usePreferences();
  const countLabel =
    group.items.length === 1
      ? translate("historyTimesOne")
      : translate("historyTimesMany").replace("{n}", String(group.items.length));

  return (
    <section className="space-y-2">
      <div className="flex items-baseline justify-between gap-2 px-1">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
          {group.label}
        </h3>
        <span className="text-xs text-[var(--text-secondary)]">
          {countLabel}
        </span>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[var(--surface-card-border)] bg-surface shadow-card app-card">
        {group.items.map((m, index) => (
          <HistoryMeasurementRow
            key={m.id}
            measurement={m}
            variant="compact"
            grouped
            isLast={index === group.items.length - 1}
          />
        ))}
      </div>
    </section>
  );
}
