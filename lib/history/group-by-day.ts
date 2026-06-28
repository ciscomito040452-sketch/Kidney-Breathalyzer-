import type { Measurement } from "@/types/measurement";
import { formatHistoryListDate } from "@/lib/utils";

export interface HistoryDayGroup {
  key: string;
  label: string;
  items: Measurement[];
}

function dayKey(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function dayLabel(key: string, now: Date = new Date()): string {
  const todayKey = dayKey(now.toISOString());
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = dayKey(yesterday.toISOString());

  if (key === todayKey) return "วันนี้";
  if (key === yesterdayKey) return "เมื่อวาน";

  const [y, m, d] = key.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return formatHistoryListDate(date);
}

export function groupMeasurementsByDay(
  measurements: Measurement[],
  now: Date = new Date()
): HistoryDayGroup[] {
  const sorted = [...measurements].sort(
    (a, b) =>
      new Date(b.measured_at).getTime() - new Date(a.measured_at).getTime()
  );

  const map = new Map<string, Measurement[]>();

  for (const m of sorted) {
    const key = dayKey(m.measured_at);
    const list = map.get(key) ?? [];
    list.push(m);
    map.set(key, list);
  }

  return Array.from(map.entries()).map(([key, items]) => ({
    key,
    label: dayLabel(key, now),
    items: items.sort(
      (a, b) =>
        new Date(b.measured_at).getTime() - new Date(a.measured_at).getTime()
    ),
  }));
}
