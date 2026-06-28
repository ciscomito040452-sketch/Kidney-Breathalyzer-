import { WEEKLY_GOAL_TARGET } from "@/lib/constants";
import type { Measurement } from "@/types/measurement";
import { addDays, getWeekStart } from "./dates";

export function countMeasurementsThisWeek(
  measurements: Measurement[],
  reference: Date = new Date()
): number {
  const weekStart = getWeekStart(reference);
  const weekEnd = addDays(weekStart, 7);

  return measurements.filter((m) => {
    const measuredAt = new Date(m.measured_at);
    return measuredAt >= weekStart && measuredAt < weekEnd;
  }).length;
}

export function getWeeklyGoalProgress(
  measurements: Measurement[],
  reference: Date = new Date()
) {
  const count = countMeasurementsThisWeek(measurements, reference);
  const target = WEEKLY_GOAL_TARGET;
  const progressPercent = Math.min(100, Math.round((count / target) * 100));

  return { count, target, progressPercent };
}
