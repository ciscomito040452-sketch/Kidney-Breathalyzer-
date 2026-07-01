"use client";

import { useState } from "react";
import { Activity, Droplets, Wind } from "lucide-react";
import { PinnedHealthCard } from "@/components/health/PinnedHealthCard";
import { RiskScoreRing } from "@/components/shared/RiskScoreRing";
import { SensorEducationSheet } from "@/components/shared/SensorEducationSheet";
import { usePreferences } from "@/components/providers/PreferencesProvider";
import { getSensorUILabels } from "@/lib/i18n/labels";
import {
  getRiskQualitativeCaption,
  getRiskQualitativeHeadline,
  getSensorQualitativeCaption,
  getSensorQualitativeHeadline,
} from "@/lib/ui/qualitative-labels";
import {
  formatAcetonePpb,
  formatAmmoniaPpb,
} from "@/lib/sensor-labels";
import {
  getAcetoneStatus,
  getAmmoniaStatus,
} from "@/lib/sensors/status";
import { formatDateTimeLocale } from "@/lib/utils";
import type { Measurement } from "@/types/measurement";

interface DashboardPinnedSectionProps {
  latest: Measurement;
  riskDelta: number | null;
}

export function DashboardPinnedSection({
  latest,
  riskDelta,
}: DashboardPinnedSectionProps) {
  const { locale, translate } = usePreferences();
  const sensorUi = getSensorUILabels(locale);
  const [ammoniaOpen, setAmmoniaOpen] = useState(false);
  const [acetoneOpen, setAcetoneOpen] = useState(false);

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
        caption={getRiskQualitativeCaption(
          locale,
          latest.risk_score,
          riskDelta
        )}
        href={`/result/${latest.id}`}
        visual={
          <RiskScoreRing
            riskScore={latest.risk_score}
            riskLevel={latest.risk_level}
            size={56}
            animateOnMount
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
        caption={getSensorQualitativeCaption(ammoniaPpb, sensorUi.ammonia.unit)}
        onClick={() => setAmmoniaOpen(true)}
        animationDelay={50}
      />

      <PinnedHealthCard
        icon={Droplets}
        iconClassName="bg-[rgb(var(--metric-acetone-rgb)/0.12)] text-[var(--metric-acetone)]"
        category={translate("pinnedAcetone")}
        timeLabel={timeLabel}
        headline={getSensorQualitativeHeadline(locale, acetoneStatus)}
        caption={getSensorQualitativeCaption(acetonePpb, sensorUi.acetone.unit)}
        onClick={() => setAcetoneOpen(true)}
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
