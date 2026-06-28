"use client";

import { HistoryMeasurementRow } from "@/components/history/HistoryMeasurementRow";
import { InsightGroupedCard } from "@/components/ai-insight/insight-ui";
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
    <section className="space-y-2.5">
      <div className="flex items-baseline justify-between gap-2 px-0.5">
        <h3 className="text-[17px] font-semibold tracking-tight text-[var(--text-primary)]">
          {group.label}
        </h3>
        <span className="text-sm text-[var(--text-secondary)]">{countLabel}</span>
      </div>

      <InsightGroupedCard>
        {group.items.map((m, index) => (
          <HistoryMeasurementRow
            key={m.id}
            measurement={m}
            variant="compact"
            grouped
            isLast={index === group.items.length - 1}
          />
        ))}
      </InsightGroupedCard>
    </section>
  );
}
