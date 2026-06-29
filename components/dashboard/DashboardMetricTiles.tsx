"use client";

import { Droplets, Wind } from "lucide-react";
import { MetricTile } from "@/components/shared/MetricTile";
import { usePreferences } from "@/components/providers/PreferencesProvider";
import { getSensorUILabels } from "@/lib/i18n/labels";
import {
  formatAcetonePpb,
  formatAmmoniaPpb,
} from "@/lib/sensor-labels";
import {
  getAcetoneStatus,
  getAmmoniaStatus,
} from "@/lib/sensors/status";
import type { TrendDirection } from "@/lib/ai-insight/analyze-measurements";
import type { RiskLevel } from "@/types/measurement";

interface DashboardMetricTilesProps {
  mq135: number;
  mq3: number;
  riskScore: number;
  riskLevel: RiskLevel;
  ammoniaTrend?: TrendDirection;
}

export function DashboardMetricTiles({
  mq135,
  mq3,
  riskScore,
  riskLevel,
  ammoniaTrend,
}: DashboardMetricTilesProps) {
  const { locale } = usePreferences();
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
    <div className="flex gap-3">
      <MetricTile
        icon={Wind}
        label={sensorUi.ammonia.label}
        value={ammoniaPpb}
        unit={sensorUi.ammonia.unit}
        status={ammoniaStatus}
        trend={ammoniaTrend}
        educationTopic="ammonia"
        educationContext={educationContext}
        animationDelay={50}
      />
      <MetricTile
        icon={Droplets}
        label={sensorUi.acetone.label}
        value={acetonePpb}
        unit={sensorUi.acetone.unit}
        status={acetoneStatus}
        educationTopic="acetone"
        educationContext={educationContext}
        animationDelay={100}
      />
    </div>
  );
}
