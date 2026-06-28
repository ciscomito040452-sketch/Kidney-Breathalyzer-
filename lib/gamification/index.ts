import { CHALLENGE_DAYS } from "@/lib/constants";
import type { Measurement, UserStreaks } from "@/types/measurement";
import { getChallengeDays, getStreakFromMeasurements } from "./streak";
import { getWeeklyGoalProgress } from "./weekly-goal";

export { calculateCurrentStreak, calculateLongestStreak, getChallengeDays } from "./streak";
export { countMeasurementsThisWeek, getWeeklyGoalProgress } from "./weekly-goal";

export function computeGamificationStats(
  measurements: Measurement[],
  reference: Date = new Date()
): UserStreaks {
  const { currentStreak, longestStreak, dateKeys } =
    getStreakFromMeasurements(measurements, reference);
  const { count: weekly_count } = getWeeklyGoalProgress(measurements, reference);
  const challenge_days = getChallengeDays(dateKeys, CHALLENGE_DAYS, reference);

  return {
    user_id: measurements[0]?.user_id ?? "",
    current_streak: currentStreak,
    longest_streak: longestStreak,
    weekly_count,
    challenge_days,
  };
}
