import type { Measurement } from "@/types/measurement";

/** Percent change vs average of prior measurements in the last 7 days (excluding latest). */
export function computeRiskScoreDelta(
  measurements: Measurement[],
  currentScore: number
): number | null {
  if (measurements.length < 2) return null;

  const latestTime = new Date(measurements[0].measured_at).getTime();
  const weekAgo = latestTime - 7 * 24 * 60 * 60 * 1000;

  const prior = measurements
    .slice(1)
    .filter((m) => new Date(m.measured_at).getTime() >= weekAgo);

  if (prior.length === 0) return null;

  const avg =
    prior.reduce((sum, m) => sum + m.risk_score, 0) / prior.length;

  if (avg === 0) return null;

  return Math.round(((currentScore - avg) / avg) * 100);
}

export function formatRiskDeltaThai(delta: number): string {
  if (Math.abs(delta) < 3) {
    return "ใกล้เคียงค่าเฉลี่ย 7 วันที่ผ่านมา";
  }
  if (delta > 0) {
    return `สูงขึ้น ${delta}% จาก 7 วันก่อน`;
  }
  return `ลดลง ${Math.abs(delta)}% จาก 7 วันก่อน`;
}
