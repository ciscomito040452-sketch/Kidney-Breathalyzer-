/** Risk score zone bounds (0–100 display scale), synced with scoreToRiskLevel */

export const RISK_ZONE_BOUNDS = {
  lowMax: 40,
  moderateMax: 70,
} as const;

export function scorePercent(score: number): number {
  const pct = Math.round(score * 100);
  return Math.min(100, Math.max(0, pct));
}

export function zoneDividerPercents(): [number, number] {
  return [RISK_ZONE_BOUNDS.lowMax, RISK_ZONE_BOUNDS.moderateMax];
}
