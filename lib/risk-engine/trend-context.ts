import type { Measurement } from "@/types/measurement";

export interface TrendContext {
  avgMq135?: number;
  trendPercent?: number;
  consecutiveHighDays?: number;
}

type MqHistory = Pick<Measurement, "mq135_value" | "measured_at">[];

export function computeTrendContext(
  history: MqHistory,
  currentMq135: number
): TrendContext {
  if (history.length === 0) return {};

  const allValues = [...history.map((m) => m.mq135_value), currentMq135];
  const personalAvg =
    allValues.reduce((sum, value) => sum + value, 0) / allValues.length;

  const recentWindow = history.slice(0, 6);
  const avg7 =
    [...recentWindow.map((m) => m.mq135_value), currentMq135].reduce(
      (sum, value) => sum + value,
      0
    ) / (recentWindow.length + 1);

  const trendPercent =
    avg7 > 0 ? ((currentMq135 - avg7) / avg7) * 100 : undefined;

  const threshold = personalAvg * 1.15;
  let consecutiveHighDays = 0;
  const recentChronological = [...history].reverse();
  for (let i = recentChronological.length - 1; i >= 0; i -= 1) {
    if (recentChronological[i].mq135_value > threshold) {
      consecutiveHighDays += 1;
    } else {
      break;
    }
  }
  if (currentMq135 > threshold) {
    consecutiveHighDays += 1;
  }

  return {
    avgMq135: personalAvg,
    trendPercent,
    consecutiveHighDays:
      consecutiveHighDays >= 3 ? consecutiveHighDays : undefined,
  };
}
