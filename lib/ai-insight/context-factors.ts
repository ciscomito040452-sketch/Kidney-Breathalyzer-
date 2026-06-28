import type { LucideIcon } from "lucide-react";
import { Activity, ClipboardList, Gauge, Wind } from "lucide-react";
import type { DemoRiskFactors } from "@/lib/profile/onboarding-storage";
import { summarizeRiskFactorLabels } from "@/lib/profile/risk-factor-labels";
import {
  formatAcetonePpb,
  formatAmmoniaPpb,
  SENSOR_UI,
} from "@/lib/sensor-labels";
import { normalizeMq135, normalizeMq3 } from "@/lib/risk-engine";
import type { Measurement } from "@/types/measurement";

export type InsightFactorStatus = "good" | "moderate" | "low";

export interface InsightFactor {
  id: string;
  icon: LucideIcon;
  label: string;
  value: string;
  status: InsightFactorStatus;
  statusLabel: string;
}

export const INSIGHT_STATUS_LABELS: Record<InsightFactorStatus, string> = {
  good: "ปกติ",
  moderate: "ควรติดตาม",
  low: "ควรปรับปรุง",
};

function sensorStatus(normalized: number): InsightFactorStatus {
  if (normalized < 0.4) return "good";
  if (normalized < 0.7) return "moderate";
  return "low";
}

function measurementFrequencyStatus(count: number): InsightFactorStatus {
  if (count >= 3) return "good";
  if (count >= 1) return "moderate";
  return "low";
}

function formatRiskFactorSummary(factors: DemoRiskFactors): string {
  if (factors.risk_factor_ids?.length) {
    const labels = summarizeRiskFactorLabels(
      "th",
      factors.risk_factor_ids,
      factors.risk_factor_other ?? null
    );
    return labels.length > 0 ? labels.join(", ") : "ไม่มีที่ระบุ";
  }

  const items: string[] = [];
  if (factors.has_diabetes) items.push("เบาหวาน");
  if (factors.has_hypertension) items.push("ความดันโลหิตสูง");
  if (factors.has_family_history) items.push("ประวัติโรคไตในครอบครัว");
  return items.length > 0 ? items.join(", ") : "ไม่มีที่ระบุ";
}

function countMeasurementsInDays(
  measurements: Measurement[],
  days: number
): number {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  return measurements.filter((m) => new Date(m.measured_at) >= cutoff).length;
}

export function buildInsightContextFactors(input: {
  latest: Measurement;
  measurements: Measurement[];
  riskFactors: DemoRiskFactors;
}): InsightFactor[] {
  const { latest, measurements, riskFactors } = input;
  const ammoniaNorm = normalizeMq135(latest.mq135_value);
  const acetoneNorm = normalizeMq3(latest.mq3_value);
  const weeklyCount = countMeasurementsInDays(measurements, 7);
  const ammoniaStatus = sensorStatus(ammoniaNorm);
  const acetoneStatus = sensorStatus(acetoneNorm);
  const frequencyStatus = measurementFrequencyStatus(weeklyCount);
  const hasRiskFactors =
    (riskFactors.risk_factor_ids?.length ?? 0) > 0 ||
    riskFactors.has_diabetes ||
    riskFactors.has_hypertension ||
    riskFactors.has_family_history;

  return [
    {
      id: "ammonia",
      icon: Wind,
      label: SENSOR_UI.ammonia.label,
      value: `${formatAmmoniaPpb(latest.mq135_value)} ${SENSOR_UI.ammonia.unit}`,
      status: ammoniaStatus,
      statusLabel: INSIGHT_STATUS_LABELS[ammoniaStatus],
    },
    {
      id: "acetone",
      icon: Activity,
      label: SENSOR_UI.acetone.label,
      value: `${formatAcetonePpb(latest.mq3_value)} ${SENSOR_UI.acetone.unit}`,
      status: acetoneStatus,
      statusLabel: INSIGHT_STATUS_LABELS[acetoneStatus],
    },
    {
      id: "measurement-frequency",
      icon: Gauge,
      label: "ความถี่การวัด",
      value: `${weeklyCount} ครั้ง/7 วัน`,
      status: frequencyStatus,
      statusLabel: INSIGHT_STATUS_LABELS[frequencyStatus],
    },
    {
      id: "risk-factors",
      icon: ClipboardList,
      label: "ปัจจัยเสี่ยง (จากที่คุณระบุ)",
      value: formatRiskFactorSummary(riskFactors),
      status: hasRiskFactors ? "moderate" : "good",
      statusLabel: hasRiskFactors ? "มีปัจจัยเสี่ยง" : "ไม่มีที่ระบุ",
    },
  ];
}
