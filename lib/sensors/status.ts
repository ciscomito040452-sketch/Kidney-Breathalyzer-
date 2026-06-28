import { formatAcetonePpb, formatAmmoniaPpb } from "@/lib/sensor-labels";

import { SENSOR_ELEVATED_THRESHOLDS } from "@/lib/sensors/sensor-zones";

export type SensorStatus = "normal" | "elevated";

export { SENSOR_ELEVATED_THRESHOLDS };

const AMMONIA_ELEVATED_PPB = SENSOR_ELEVATED_THRESHOLDS.ammonia;
const ACETONE_ELEVATED_PPB = SENSOR_ELEVATED_THRESHOLDS.acetone;

export const SENSOR_STATUS_LABELS: Record<SensorStatus, string> = {
  normal: "ปกติ",
  elevated: "สูงกว่าปกติ",
};

export function getAmmoniaStatus(mq135: number): SensorStatus {
  return formatAmmoniaPpb(mq135) >= AMMONIA_ELEVATED_PPB ? "elevated" : "normal";
}

export function getAcetoneStatus(mq3: number): SensorStatus {
  return formatAcetonePpb(mq3) >= ACETONE_ELEVATED_PPB ? "elevated" : "normal";
}
