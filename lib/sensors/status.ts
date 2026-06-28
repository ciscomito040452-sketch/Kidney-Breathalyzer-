import { formatAcetonePpb, formatAmmoniaPpb } from "@/lib/sensor-labels";

export type SensorStatus = "normal" | "elevated";

const AMMONIA_ELEVATED_PPB = 280;
const ACETONE_ELEVATED_PPB = 225;

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
