import type { LucideIcon } from "lucide-react";
import { Activity, ClipboardList, Gauge, Wind } from "lucide-react";
import { getSensorUILabels } from "@/lib/i18n/labels";
import { t, type MessageKey } from "@/lib/i18n/messages";
import type { AppLocale } from "@/lib/preferences/profile-preferences";
import type { DemoRiskFactors } from "@/lib/profile/onboarding-storage";
import { summarizeRiskFactorLabels } from "@/lib/profile/risk-factor-labels";
import { formatAcetonePpb, formatAmmoniaPpb } from "@/lib/sensor-labels";
import { analyzeMeasurements } from "@/lib/ai-insight/analyze-measurements";
import { normalizeMq135, normalizeMq3 } from "@/lib/risk-engine";
import type { Measurement } from "@/types/measurement";

export type InsightFactorStatus = "good" | "moderate" | "low";

export interface InsightFactor {
  id: string;
  icon: LucideIcon;
  label: string;
  value: string;
  listItems?: string[];
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

function getRiskFactorLabels(
  locale: AppLocale,
  factors: DemoRiskFactors
): string[] {
  if (factors.risk_factor_ids?.length) {
    return summarizeRiskFactorLabels(
      locale,
      factors.risk_factor_ids,
      factors.risk_factor_other ?? null
    );
  }

  const items: string[] = [];
  if (factors.has_diabetes) items.push(t(locale, "riskFactorDiabetes"));
  if (factors.has_hypertension) items.push(t(locale, "riskFactorHypertension"));
  if (factors.has_family_history) items.push(t(locale, "riskFactorFamily"));
  return items;
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
  measurements: Measurement[];
  riskFactors: DemoRiskFactors;
  locale?: AppLocale;
}): InsightFactor[] {
  const locale = input.locale ?? "th";
  const { measurements, riskFactors } = input;
  const sensorUi = getSensorUILabels(locale);
  const analytics = analyzeMeasurements(measurements);

  const avgMq135 = analytics?.avgMq135 ?? 0;
  const avgMq3 = analytics?.avgMq3 ?? 0;
  const ammoniaNorm = normalizeMq135(avgMq135);
  const acetoneNorm = normalizeMq3(avgMq3);
  const weeklyCount = countMeasurementsInDays(measurements, 7);
  const ammoniaStatus = sensorStatus(ammoniaNorm);
  const acetoneStatus = sensorStatus(acetoneNorm);
  const frequencyStatus = measurementFrequencyStatus(weeklyCount);
  const hasRiskFactors =
    (riskFactors.risk_factor_ids?.length ?? 0) > 0 ||
    riskFactors.has_diabetes ||
    riskFactors.has_hypertension ||
    riskFactors.has_family_history;
  const riskFactorLabels = getRiskFactorLabels(locale, riskFactors);

  return [
    {
      id: "ammonia",
      icon: Wind,
      label: sensorUi.ammonia.label,
      value: analytics
        ? `${formatAmmoniaPpb(avgMq135)} ${sensorUi.ammonia.unit}`
        : `— ${sensorUi.ammonia.unit}`,
      status: ammoniaStatus,
      statusLabel: insightStatusLabel(locale, ammoniaStatus),
    },
    {
      id: "acetone",
      icon: Activity,
      label: sensorUi.acetone.label,
      value: analytics
        ? `${formatAcetonePpb(avgMq3)} ${sensorUi.acetone.unit}`
        : `— ${sensorUi.acetone.unit}`,
      status: acetoneStatus,
      statusLabel: insightStatusLabel(locale, acetoneStatus),
    },
    {
      id: "measurement-frequency",
      icon: Gauge,
      label: t(locale, "insightMeasurementFreq"),
      value: analytics
        ? t(locale, "insightMeasurementFreqAllValue")
            .replace("{n}", String(analytics.count))
            .replace("{days}", String(analytics.daySpan))
        : t(locale, "insightMeasurementFreqValue").replace(
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
      value:
        riskFactorLabels.length > 0
          ? String(riskFactorLabels.length)
          : t(locale, "insightNoRiskSpecified"),
      listItems:
        riskFactorLabels.length > 0 ? riskFactorLabels : undefined,
      status: hasRiskFactors ? "moderate" : "good",
      statusLabel: hasRiskFactors
        ? t(locale, "insightHasRiskFactors")
        : t(locale, "insightNoRiskSpecified"),
    },
  ];
}
