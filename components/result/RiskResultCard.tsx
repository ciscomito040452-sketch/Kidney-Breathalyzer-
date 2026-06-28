import { FlaskConical, Wind } from "lucide-react";
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
  SENSOR_STATUS_LABELS,
} from "@/lib/sensors/status";
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
  const ammoniaPpb = formatAmmoniaPpb(mq135);
  const acetonePpb = formatAcetonePpb(mq3);

  return (
    <div className="space-y-3">
      <RiskScoreCard riskLevel={riskLevel} riskScore={riskScore} />

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
          statusLabel={SENSOR_STATUS_LABELS[getAmmoniaStatus(mq135)]}
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
          statusLabel={SENSOR_STATUS_LABELS[getAcetoneStatus(mq3)]}
        />
      </div>
    </div>
  );
}
