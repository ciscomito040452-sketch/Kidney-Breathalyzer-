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

const VISUAL_ZONE_WIDTH = 100 / 3;

/** Map raw score (0–100) to equal thirds on the risk meter bar */
export function visualMarkerPercent(score: number): number {
  const pct = scorePercent(score);
  const { lowMax, moderateMax } = RISK_ZONE_BOUNDS;

  if (pct <= lowMax) {
    const ratio = lowMax > 0 ? pct / lowMax : 0;
    return ratio * VISUAL_ZONE_WIDTH;
  }
  if (pct <= moderateMax) {
    const span = moderateMax - lowMax;
    const ratio = span > 0 ? (pct - lowMax) / span : 0;
    return VISUAL_ZONE_WIDTH + ratio * VISUAL_ZONE_WIDTH;
  }

  const span = 100 - moderateMax;
  const ratio = span > 0 ? (pct - moderateMax) / span : 0;
  return 2 * VISUAL_ZONE_WIDTH + ratio * VISUAL_ZONE_WIDTH;
}
