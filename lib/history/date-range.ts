import type { Measurement } from "@/types/measurement";

export type HistoryPeriod =
  | "today"
  | "this_week"
  | "this_month"
  | "last_7"
  | "last_30"
  | "last_90";

export const HISTORY_PERIOD_OPTIONS: HistoryPeriod[] = [
  "today",
  "this_week",
  "this_month",
  "last_7",
  "last_30",
  "last_90",
];

export const HISTORY_PERIOD_LABELS: Record<HistoryPeriod, string> = {
  today: "วันนี้",
  this_week: "สัปดาห์นี้",
  this_month: "เดือนนี้",
  last_7: "7 วัน",
  last_30: "30 วัน",
  last_90: "90 วัน",
};

export function getPeriodBounds(
  period: HistoryPeriod,
  now: Date = new Date()
): { start: Date; end: Date } {
  const end = new Date(now);
  end.setHours(23, 59, 59, 999);

  const start = new Date(now);
  start.setHours(0, 0, 0, 0);

  switch (period) {
    case "today":
      return { start, end };
    case "this_week": {
      const day = start.getDay();
      const mondayOffset = day === 0 ? -6 : 1 - day;
      start.setDate(start.getDate() + mondayOffset);
      return { start, end };
    }
    case "this_month":
      start.setDate(1);
      return { start, end };
    case "last_7":
      start.setDate(start.getDate() - 6);
      return { start, end };
    case "last_30":
      start.setDate(start.getDate() - 29);
      return { start, end };
    case "last_90":
      start.setDate(start.getDate() - 89);
      return { start, end };
  }
}

export function filterMeasurementsByPeriod(
  measurements: Measurement[],
  period: HistoryPeriod,
  now?: Date
): Measurement[] {
  const { start, end } = getPeriodBounds(period, now);
  return measurements.filter((m) => {
    const t = new Date(m.measured_at).getTime();
    return t >= start.getTime() && t <= end.getTime();
  });
}

export function periodChartTitle(period: HistoryPeriod): string {
  switch (period) {
    case "today":
      return "แนวโน้มวันนี้";
    case "this_week":
      return "แนวโน้มสัปดาห์นี้";
    case "this_month":
      return "แนวโน้มเดือนนี้";
    default:
      return `แนวโน้ม ${HISTORY_PERIOD_LABELS[period]}`;
  }
}

export function periodDaysApprox(period: HistoryPeriod): number {
  switch (period) {
    case "today":
      return 1;
    case "this_week":
    case "last_7":
      return 7;
    case "this_month":
    case "last_30":
      return 30;
    case "last_90":
      return 90;
  }
}
