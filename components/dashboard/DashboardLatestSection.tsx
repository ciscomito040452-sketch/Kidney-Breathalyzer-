"use client";

import { FlaskConical, Wind } from "lucide-react";
import { usePreferences } from "@/components/providers/PreferencesProvider";
import { PageSectionHeader } from "@/components/shared/PageSectionHeader";
import { RiskScoreCard } from "@/components/shared/RiskScoreCard";
import { SensorValueCard } from "@/components/shared/SensorValueCard";
import {
  formatAcetonePpb,
  formatAmmoniaPpb,
  SENSOR_UI,
} from "@/lib/sensor-labels";
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
import { formatDateTimeThai } from "@/lib/utils";
import type { RiskLevel } from "@/types/measurement";

interface DashboardLatestSectionProps {
  riskLevel: RiskLevel;
  riskScore: number;
  mq135: number;
  mq3: number;
  measuredAt: string;
  riskDelta?: number | null;
}

export function DashboardLatestSection({
  riskLevel,
  riskScore,
  mq135,
  mq3,
  measuredAt,
  riskDelta,
}: DashboardLatestSectionProps) {
  const { translate } = usePreferences();
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
    <section className="space-y-3">
      <PageSectionHeader
        title={translate("latestResults")}
        subtitle={formatDateTimeThai(measuredAt)}
      />

      <RiskScoreCard
        riskLevel={riskLevel}
        riskScore={riskScore}
        riskDelta={riskDelta}
        educationContext={educationContext}
      />

      <div className="flex gap-3">
        <SensorValueCard
          icon={
            <FlaskConical
              className="h-4 w-4 shrink-0 text-accent-primary"
              strokeWidth={1.75}
            />
          }
          label={SENSOR_UI.ammonia.label}
          value={ammoniaPpb}
          unit={SENSOR_UI.ammonia.unit}
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
          label={SENSOR_UI.acetone.label}
          value={acetonePpb}
          unit={SENSOR_UI.acetone.unit}
          status={acetoneStatus}
          barPercent={acetoneBarPercent(acetonePpb)}
          thresholdPercent={acetoneThresholdPercent()}
          educationTopic="acetone"
          educationContext={educationContext}
        />
      </div>
    </section>
  );
}
