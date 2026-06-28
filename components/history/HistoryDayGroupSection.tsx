import { HistoryMeasurementRow } from "@/components/history/HistoryMeasurementRow";
import type { HistoryDayGroup } from "@/lib/history/group-by-day";

interface HistoryDayGroupSectionProps {
  group: HistoryDayGroup;
}

export function HistoryDayGroupSection({ group }: HistoryDayGroupSectionProps) {
  const countLabel =
    group.items.length === 1 ? "1 ครั้ง" : `${group.items.length} ครั้ง`;

  return (
    <section className="space-y-2">
      <div className="flex items-baseline justify-between gap-2 px-0.5">
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">
          {group.label}
        </h3>
        <span className="text-xs text-[var(--text-secondary)]">
          {countLabel}
        </span>
      </div>
      <div className="space-y-2">
        {group.items.map((m) => (
          <HistoryMeasurementRow
            key={m.id}
            measurement={m}
            variant="compact"
          />
        ))}
      </div>
    </section>
  );
}
