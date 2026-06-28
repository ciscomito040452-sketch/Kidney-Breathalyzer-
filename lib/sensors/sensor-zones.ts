export const SENSOR_ELEVATED_THRESHOLDS = {
  ammonia: 280,
  acetone: 225,
} as const;

const AMMONIA_BAR_MAX = 400;
const ACETONE_BAR_MAX = 350;

export function ammoniaBarPercent(ppb: number): number {
  return Math.min(100, Math.max(0, (ppb / AMMONIA_BAR_MAX) * 100));
}

export function acetoneBarPercent(ppb: number): number {
  return Math.min(100, Math.max(0, (ppb / ACETONE_BAR_MAX) * 100));
}

export function ammoniaThresholdPercent(): number {
  return (SENSOR_ELEVATED_THRESHOLDS.ammonia / AMMONIA_BAR_MAX) * 100;
}

export function acetoneThresholdPercent(): number {
  return (SENSOR_ELEVATED_THRESHOLDS.acetone / ACETONE_BAR_MAX) * 100;
}
