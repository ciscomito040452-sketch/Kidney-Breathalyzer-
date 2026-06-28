import { MQ135_RANGE, MQ3_RANGE } from "@/lib/constants";

export function normalizeMq135(value: number): number {
  const { min, max } = MQ135_RANGE;
  return Math.min(1, Math.max(0, (value - min) / (max - min)));
}

export function normalizeMq3(value: number): number {
  const { min, max } = MQ3_RANGE;
  return Math.min(1, Math.max(0, (value - min) / (max - min)));
}
