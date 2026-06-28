import type { Measurement } from "@/types/measurement";
import { addDays, getUniqueMeasurementDates, toDateKey } from "./dates";

export function calculateCurrentStreak(
  dateKeys: Set<string>,
  reference: Date = new Date()
): number {
  if (dateKeys.size === 0) return 0;

  const cursor = new Date(reference);
  cursor.setHours(0, 0, 0, 0);

  const todayKey = toDateKey(cursor);
  if (!dateKeys.has(todayKey)) {
    cursor.setDate(cursor.getDate() - 1);
  }

  let streak = 0;
  while (dateKeys.has(toDateKey(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

export function calculateLongestStreak(dateKeys: Set<string>): number {
  const sorted = Array.from(dateKeys).sort();
  if (sorted.length === 0) return 0;

  let longest = 1;
  let current = 1;

  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1]);
    const curr = new Date(sorted[i]);
    const diffDays = Math.round(
      (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 1) {
      current++;
      longest = Math.max(longest, current);
    } else if (diffDays > 1) {
      current = 1;
    }
  }

  return longest;
}

export function getChallengeDays(
  dateKeys: Set<string>,
  days: number,
  reference: Date = new Date()
): boolean[] {
  const result: boolean[] = [];
  const end = new Date(reference);
  end.setHours(0, 0, 0, 0);

  for (let i = days - 1; i >= 0; i--) {
    const day = addDays(end, -i);
    result.push(dateKeys.has(toDateKey(day)));
  }

  return result;
}

export function getStreakFromMeasurements(
  measurements: Measurement[],
  reference: Date = new Date()
) {
  const dateKeys = getUniqueMeasurementDates(
    measurements.map((m) => m.measured_at)
  );

  return {
    currentStreak: calculateCurrentStreak(dateKeys, reference),
    longestStreak: calculateLongestStreak(dateKeys),
    dateKeys,
  };
}
