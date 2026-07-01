"use client";

import { useMemo, useState } from "react";
import { Activity, Droplets, Wind } from "lucide-react";
import {
  PinnedAnalyticsFooter,
  PinnedHealthCard,
} from "@/components/health";
import { SparklineMini } from "@/components/health/SparklineMini";
import { RiskScoreRing } from "@/components/shared/RiskScoreRing";
import { SensorEducationSheet } from "@/components/shared/SensorEducationSheet";
import { usePreferences } from "@/components/providers/PreferencesProvider";
import { buildPinnedSparklines } from "@/lib/dashboard/build-pinned-sparklines";
import { getSensorUILabels } from "@/lib/i18n/labels";
import {
  getRiskQualitativeCaption,
  getRiskQualitativeHeadline,
  getSensorQualitativeHeadline,
} from "@/lib/ui/qualitative-labels";
import {
  formatAcetonePpb,
  formatAmmoniaPpb,
} from "@/lib/sensor-labels";
import {
  acetoneBarPercent,
  acetoneThresholdPercent,
  ammoniaBarPercent,
  ammoniaThresholdPercent,
} from "@/lib/sensors/sensor-zones";
import {
  getAcetoneStatus,
  getAmmoniaStatus,
} from "@/lib/sensors/status";
import { scorePercent } from "@/lib/risk-engine/risk-zones";
import { formatDateTimeLocale } from "@/lib/utils";
import type { Measurement } from "@/types/measurement";

interface DashboardPinnedSectionProps {
  latest: Measurement;
  measurements: Measurement[];
  riskDelta: number | null;
}

export function DashboardPinnedSection({
  latest,
  measurements,
  riskDelta,
}: DashboardPinnedSectionProps) {
  const { locale, translate } = usePreferences();
  const sensorUi = getSensorUILabels(locale);
  const [ammoniaOpen, setAmmoniaOpen] = useState(false);
  const [acetoneOpen, setAcetoneOpen] = useState(false);

  const sparklines = useMemo(
    () => buildPinnedSparklines(measurements),
    [measurements]
  );

  const ammoniaPpb = formatAmmoniaPpb(latest.mq135_value);
  const acetonePpb = formatAcetonePpb(latest.mq3_value);
  const ammoniaStatus = getAmmoniaStatus(latest.mq135_value);
  const acetoneStatus = getAcetoneStatus(latest.mq3_value);

  const educationContext = {
    ammoniaPpb,
    acetonePpb,
    riskScore: latest.risk_score,
    riskLevel: latest.risk_level,
    ammoniaStatus,
    acetoneStatus,
  };

  const timeLabel = formatDateTimeLocale(locale, latest.measured_at);

  return (
    <section className="space-y-3">
      <PinnedHealthCard
        icon={Activity}
        iconClassName="bg-[rgb(var(--metric-screening-rgb)/0.12)] text-[var(--metric-screening)]"
        category={translate("pinnedScreening")}
        timeLabel={timeLabel}
        headline={getRiskQualitativeHeadline(locale, latest.risk_level)}
        value={String(scorePercent(latest.risk_score))}
        valueUnit="/100"
        caption={
          riskDelta != null
            ? getRiskQualitativeCaption(locale, latest.risk_score, riskDelta)
            : undefined
        }
        href={`/result/${latest.id}`}
        visual={
          <RiskScoreRing
            riskScore={latest.risk_score}
            riskLevel={latest.risk_level}
            size={68}
            animateOnMount
          />
        }
        footer={
          <PinnedAnalyticsFooter
            sparklineData={sparklines.risk}
            stroke="var(--metric-screening)"
          />
        }
        animationDelay={0}
      />

      <PinnedHealthCard
        icon={Wind}
        iconClassName="bg-[rgb(var(--metric-ammonia-rgb)/0.12)] text-[var(--metric-ammonia)]"
        category={translate("pinnedAmmonia")}
        timeLabel={timeLabel}
        headline={getSensorQualitativeHeadline(locale, ammoniaStatus)}
        value={String(ammoniaPpb)}
        valueUnit={sensorUi.ammonia.unit}
        variant="metric"
        onClick={() => setAmmoniaOpen(true)}
        visual={
          sparklines.ammonia.length >= 2 ? (
            <SparklineMini
              data={sparklines.ammonia}
              stroke="var(--metric-ammonia)"
              width={88}
              height={52}
            />
          ) : (
            <span className="text-2xl font-semibold tabular-nums text-[var(--text-primary)]">
              {ammoniaPpb}
            </span>
          )
        }
        footer={
          <PinnedAnalyticsFooter
            sparklineData={[]}
            barPercent={ammoniaBarPercent(ammoniaPpb)}
            thresholdPercent={ammoniaThresholdPercent()}
            sensorStatus={ammoniaStatus}
          />
        }
        animationDelay={50}
      />

      <PinnedHealthCard
        icon={Droplets}
        iconClassName="bg-[rgb(var(--metric-acetone-rgb)/0.12)] text-[var(--metric-acetone)]"
        category={translate("pinnedAcetone")}
        timeLabel={timeLabel}
        headline={getSensorQualitativeHeadline(locale, acetoneStatus)}
        value={String(acetonePpb)}
        valueUnit={sensorUi.acetone.unit}
        variant="metric"
        onClick={() => setAcetoneOpen(true)}
        visual={
          sparklines.acetone.length >= 2 ? (
            <SparklineMini
              data={sparklines.acetone}
              stroke="var(--metric-acetone)"
              width={88}
              height={52}
            />
          ) : (
            <span className="text-2xl font-semibold tabular-nums text-[var(--text-primary)]">
              {acetonePpb}
            </span>
          )
        }
        footer={
          <PinnedAnalyticsFooter
            sparklineData={[]}
            barPercent={acetoneBarPercent(acetonePpb)}
            thresholdPercent={acetoneThresholdPercent()}
            sensorStatus={acetoneStatus}
          />
        }
        animationDelay={100}
      />

      <SensorEducationSheet
        open={ammoniaOpen}
        onOpenChange={setAmmoniaOpen}
        topic="ammonia"
        context={educationContext}
      />
      <SensorEducationSheet
        open={acetoneOpen}
        onOpenChange={setAcetoneOpen}
        topic="acetone"
        context={educationContext}
      />
    </section>
  );
}
