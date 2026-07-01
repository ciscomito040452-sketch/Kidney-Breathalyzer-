import type { Measurement } from "@/types/measurement";
import { scorePercent } from "@/lib/risk-engine/risk-zones";
import { formatAcetonePpb, formatAmmoniaPpb } from "@/lib/sensor-labels";

const PINNED_SPARKLINE_DAYS = 7;

export function buildPinnedSparklines(measurements: Measurement[]) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - PINNED_SPARKLINE_DAYS);

  const recent = measurements
    .filter((m) => new Date(m.measured_at) >= cutoff)
    .slice()
    .reverse();

  return {
    risk: recent.map((m) => ({ value: scorePercent(m.risk_score) })),
    ammonia: recent.map((m) => ({
      value: formatAmmoniaPpb(m.mq135_value),
    })),
    acetone: recent.map((m) => ({
      value: formatAcetonePpb(m.mq3_value),
    })),
  };
}
