/** UI display labels — backend still uses mq135_value / mq3_value */

export const SENSOR_UI = {
  ammonia: { label: "แอมโมเนีย (NH₃)", unit: "ppb" },
  acetone: { label: "อะซิโทน", unit: "ppb" },
} as const;

/** MQ-135 raw value maps 1:1 to displayed ppb (PoC scale, not lab-calibrated). */
export function formatAmmoniaPpb(mq135: number): number {
  return Math.round(mq135);
}

/** MQ-3 raw ratio × 500 → displayed acetone ppb (PoC scale, not lab-calibrated). */
export function formatAcetonePpb(mq3: number): number {
  return Math.round(mq3 * 500);
}

export function formatRiskScoreDisplay(score: number): string {
  return `${Math.round(score * 100)}/100`;
}
