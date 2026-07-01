"use client";

import { useState } from "react";
import { Droplets, Wind } from "lucide-react";
import {
  HealthGroupedCard,
  HealthGroupedDivider,
  HealthListRow,
} from "@/components/health";
import { SensorEducationSheet } from "@/components/shared/SensorEducationSheet";
import { usePreferences } from "@/components/providers/PreferencesProvider";
import { getSensorUILabels } from "@/lib/i18n/labels";
import {
  getSensorQualitativeCaption,
  getSensorQualitativeHeadline,
} from "@/lib/ui/qualitative-labels";
import {
  getAcetoneStatus,
  getAmmoniaStatus,
} from "@/lib/sensors/status";
import {
  formatAcetonePpb,
  formatAmmoniaPpb,
} from "@/lib/sensor-labels";
import type { RiskLevel } from "@/types/measurement";

interface ResultSensorRowsProps {
  riskLevel: RiskLevel;
  riskScore: number;
  mq135: number;
  mq3: number;
}

export function ResultSensorRows({
  riskLevel,
  riskScore,
  mq135,
  mq3,
}: ResultSensorRowsProps) {
  const [ammoniaOpen, setAmmoniaOpen] = useState(false);
  const [acetoneOpen, setAcetoneOpen] = useState(false);
  const { locale, translate } = usePreferences();
  const sensorUi = getSensorUILabels(locale);

  const ammoniaPpb = formatAmmoniaPpb(mq135);
  const acetonePpb = formatAcetonePpb(mq3);
  const ammoniaStatus = getAmmoniaStatus(mq135);
  const acetoneStatus = getAcetoneStatus(mq3);

  const educationContext = {
    ammoniaPpb,
    acetonePpb,
    riskScore,
    riskLevel,
    ammoniaStatus,
    acetoneStatus,
  };

  return (
    <>
      <HealthGroupedCard>
        <HealthListRow
          icon={Wind}
          iconClassName="bg-[rgb(var(--metric-ammonia-rgb)/0.12)] text-[var(--metric-ammonia)]"
          title={sensorUi.ammonia.label}
          detail={`${getSensorQualitativeHeadline(locale, ammoniaStatus)} · ${getSensorQualitativeCaption(ammoniaPpb, sensorUi.ammonia.unit)}`}
          onClick={() => setAmmoniaOpen(true)}
        />
        <HealthGroupedDivider />
        <HealthListRow
          icon={Droplets}
          iconClassName="bg-[rgb(var(--metric-acetone-rgb)/0.12)] text-[var(--metric-acetone)]"
          title={sensorUi.acetone.label}
          detail={`${getSensorQualitativeHeadline(locale, acetoneStatus)} · ${getSensorQualitativeCaption(acetonePpb, sensorUi.acetone.unit)}`}
          onClick={() => setAcetoneOpen(true)}
        />
        <HealthGroupedDivider />
        <div className="px-4 py-3">
          <button
            type="button"
            onClick={() => setAmmoniaOpen(true)}
            className="text-sm font-medium text-accent-primary"
          >
            {translate("understandSensors")}
          </button>
        </div>
      </HealthGroupedCard>

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
    </>
  );
}
