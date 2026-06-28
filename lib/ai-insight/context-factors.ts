import type { LucideIcon } from "lucide-react";
import { Activity, ClipboardList, Gauge, Wind } from "lucide-react";
import { getSensorUILabels } from "@/lib/i18n/labels";
import { t, type MessageKey } from "@/lib/i18n/messages";
import type { AppLocale } from "@/lib/preferences/profile-preferences";
import type { DemoRiskFactors } from "@/lib/profile/onboarding-storage";
import { summarizeRiskFactorLabels } from "@/lib/profile/risk-factor-labels";
import { formatAcetonePpb, formatAmmoniaPpb } from "@/lib/sensor-labels";
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

const STATUS_KEYS: Record<InsightFactorStatus, MessageKey> = {
  good: "insightStatusGood",
  moderate: "insightStatusModerate",
  low: "insightStatusLow",
};

function insightStatusLabel(
  locale: AppLocale,
  status: InsightFactorStatus
): string {
  return t(locale, STATUS_KEYS[status]);
}

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

function formatRiskFactorSummary(
  locale: AppLocale,
  factors: DemoRiskFactors
): string {
  if (factors.risk_factor_ids?.length) {
    const labels = summarizeRiskFactorLabels(
      locale,
      factors.risk_factor_ids,
      factors.risk_factor_other ?? null
    );
    return labels.length > 0
      ? labels.join(", ")
      : t(locale, "insightNoRiskSpecified");
  }

  const items: string[] = [];
  if (factors.has_diabetes) items.push(t(locale, "riskFactorDiabetes"));
  if (factors.has_hypertension) items.push(t(locale, "riskFactorHypertension"));
  if (factors.has_family_history) items.push(t(locale, "riskFactorFamily"));
  return items.length > 0
    ? items.join(", ")
    : t(locale, "insightNoRiskSpecified");
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
  locale?: AppLocale;
}): InsightFactor[] {
  const locale = input.locale ?? "th";
  const { latest, measurements, riskFactors } = input;
  const sensorUi = getSensorUILabels(locale);
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
      label: sensorUi.ammonia.label,
      value: `${formatAmmoniaPpb(latest.mq135_value)} ${sensorUi.ammonia.unit}`,
      status: ammoniaStatus,
      statusLabel: insightStatusLabel(locale, ammoniaStatus),
    },
    {
      id: "acetone",
      icon: Activity,
      label: sensorUi.acetone.label,
      value: `${formatAcetonePpb(latest.mq3_value)} ${sensorUi.acetone.unit}`,
      status: acetoneStatus,
      statusLabel: insightStatusLabel(locale, acetoneStatus),
    },
    {
      id: "measurement-frequency",
      icon: Gauge,
      label: t(locale, "insightMeasurementFreq"),
      value: t(locale, "insightMeasurementFreqValue").replace(
        "{n}",
        String(weeklyCount)
      ),
      status: frequencyStatus,
      statusLabel: insightStatusLabel(locale, frequencyStatus),
    },
    {
      id: "risk-factors",
      icon: ClipboardList,
      label: t(locale, "insightRiskFactorsLabel"),
      value: formatRiskFactorSummary(locale, riskFactors),
      status: hasRiskFactors ? "moderate" : "good",
      statusLabel: hasRiskFactors
        ? t(locale, "insightHasRiskFactors")
        : t(locale, "insightNoRiskSpecified"),
    },
  ];
}
