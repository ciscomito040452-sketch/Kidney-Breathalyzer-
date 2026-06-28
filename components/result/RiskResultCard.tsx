"use client";

import { useState } from "react";
import { FlaskConical, Wind } from "lucide-react";
import { RiskScoreCard } from "@/components/shared/RiskScoreCard";
import { SensorEducationSheet } from "@/components/shared/SensorEducationSheet";
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
import { RISK_LABELS } from "@/lib/constants";
import type { RiskLevel } from "@/types/measurement";

interface RiskResultCardProps {
  riskLevel: RiskLevel;
  riskScore: number;
  mq135: number;
  mq3: number;
}

export function RiskResultCard({
  riskLevel,
  riskScore,
  mq135,
  mq3,
}: RiskResultCardProps) {
  const [fullEducationOpen, setFullEducationOpen] = useState(false);

  const ammoniaPpb = formatAmmoniaPpb(mq135);
  const acetonePpb = formatAcetonePpb(mq3);
  const ammoniaStatus = getAmmoniaStatus(mq135);
  const acetoneStatus = getAcetoneStatus(mq3);

  const educationContext = {
    ammoniaPpb,
    acetonePpb,
    riskScore,
    ammoniaStatus,
    acetoneStatus,
    riskLevelLabel: RISK_LABELS[riskLevel],
  };

  return (
    <div className="space-y-3">
      <RiskScoreCard
        riskLevel={riskLevel}
        riskScore={riskScore}
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

      <button
        type="button"
        onClick={() => setFullEducationOpen(true)}
        className="text-sm font-medium text-accent-primary"
      >
        ทำความเข้าใจค่าเซนเซอร์และเกณฑ์
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
