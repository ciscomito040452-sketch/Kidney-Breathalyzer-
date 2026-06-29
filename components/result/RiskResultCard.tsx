"use client";

import { useState } from "react";
import { FlaskConical, Wind } from "lucide-react";
import { RiskScoreCard } from "@/components/shared/RiskScoreCard";
import { SensorEducationSheet } from "@/components/shared/SensorEducationSheet";
import { SensorValueCard } from "@/components/shared/SensorValueCard";
import { usePreferences } from "@/components/providers/PreferencesProvider";
import { getRiskFullLabels, getSensorUILabels } from "@/lib/i18n/labels";
import {
  getAcetoneStatus,
  getAmmoniaStatus,
} from "@/lib/sensors/status";
import {
  acetoneBarPercent,
  acetoneThresholdPercent,
  ammoniaBarPercent,
  ammoniaThresholdPercent,
} from "@/lib/sensors/sensor-zones";
import {
  formatAcetonePpb,
  formatAmmoniaPpb,
} from "@/lib/sensor-labels";
import type { RiskLevel } from "@/types/measurement";

interface RiskResultCardProps {
  riskLevel: RiskLevel;
  riskScore: number;
  mq135: number;
  mq3: number;
  compact?: boolean;
}

export function RiskResultCard({
  riskLevel,
  riskScore,
  mq135,
  mq3,
  compact = false,
}: RiskResultCardProps) {
  const [fullEducationOpen, setFullEducationOpen] = useState(false);
  const { locale, translate } = usePreferences();
  const sensorUi = getSensorUILabels(locale);
  const riskLabels = getRiskFullLabels(locale);

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
    riskLevelLabel: riskLabels[riskLevel],
  };

  return (
    <div className="space-y-3">
      {!compact && (
        <RiskScoreCard
          riskLevel={riskLevel}
          riskScore={riskScore}
          educationContext={educationContext}
        />
      )}

      <div className="flex gap-3">
        <SensorValueCard
          icon={
            <FlaskConical
              className="h-4 w-4 shrink-0 text-accent-primary"
              strokeWidth={1.75}
            />
          }
          label={sensorUi.ammonia.label}
          value={ammoniaPpb}
          unit={sensorUi.ammonia.unit}
          status={ammoniaStatus}
          barPercent={ammoniaBarPercent(ammoniaPpb)}
          thresholdPercent={ammoniaThresholdPercent()}
          educationTopic="ammonia"
          educationContext={educationContext}
        />
        <SensorValueCard
          icon={
            <Wind
              className="h-4 w-4 shrink-0 text-accent-primary"
              strokeWidth={1.75}
            />
          }
          label={sensorUi.acetone.label}
          value={acetonePpb}
          unit={sensorUi.acetone.unit}
          status={acetoneStatus}
          barPercent={acetoneBarPercent(acetonePpb)}
          thresholdPercent={acetoneThresholdPercent()}
          educationTopic="acetone"
          educationContext={educationContext}
        />
      </div>

      <button
        type="button"
        onClick={() => setFullEducationOpen(true)}
        className="text-sm font-medium text-accent-primary"
      >
        {translate("understandSensors")}
      </button>

      <SensorEducationSheet
        open={fullEducationOpen}
        onOpenChange={setFullEducationOpen}
        topic="all"
        context={educationContext}
      />
    </div>
  );
}
