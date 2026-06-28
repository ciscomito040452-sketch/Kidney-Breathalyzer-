import type { ReactNode } from "react";
import { Activity, FlaskConical, Wind } from "lucide-react";
import { RiskIndicator } from "@/components/shared/RiskIndicator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatRiskDeltaThai } from "@/lib/measurements/risk-delta";
import {
  formatAcetonePpb,
  formatAmmoniaPpb,
  formatRiskScoreDisplay,
  SENSOR_UI,
} from "@/lib/sensor-labels";
import {
  getAcetoneStatus,
  getAmmoniaStatus,
  SENSOR_STATUS_LABELS,
} from "@/lib/sensors/status";
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

interface SensorValueCardProps {
  icon: ReactNode;
  label: string;
  value: number;
  unit: string;
  statusLabel: string;
}

function SensorValueCard({
  icon,
  label,
  value,
  unit,
  statusLabel,
}: SensorValueCardProps) {
  return (
    <Card className="flex-1">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)]">
          {icon}
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        <p className="text-3xl font-semibold tabular-nums tracking-tight">
          {value}
          <span className="ml-1 text-base font-normal text-[var(--text-secondary)]">
            {unit}
          </span>
        </p>
        <p className="text-xs text-[var(--text-secondary)]">{statusLabel}</p>
      </CardContent>
    </Card>
  );
}

export function DashboardLatestSection({
  riskLevel,
  riskScore,
  mq135,
  mq3,
  measuredAt,
  riskDelta,
}: DashboardLatestSectionProps) {
  const ammoniaPpb = formatAmmoniaPpb(mq135);
  const acetonePpb = formatAcetonePpb(mq3);

  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-base font-semibold text-[var(--text-primary)]">
          ผลการวัดล่าสุด
        </h2>
        <p className="text-xs text-[var(--text-secondary)]">
          {formatDateTimeThai(measuredAt)}
        </p>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)]">
            <Activity
              className="h-4 w-4 text-accent-primary"
              strokeWidth={1.75}
            />
            คะแนนความเสี่ยง
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-3xl font-semibold tabular-nums tracking-tight">
            {formatRiskScoreDisplay(riskScore)}
          </p>
          <RiskIndicator level={riskLevel} />
          {riskDelta != null && (
            <p className="text-xs text-[var(--text-secondary)]">
              {formatRiskDeltaThai(riskDelta)}
            </p>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <SensorValueCard
          icon={
            <FlaskConical
              className="h-4 w-4 text-accent-primary"
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
              className="h-4 w-4 text-accent-primary"
              strokeWidth={1.75}
            />
          }
          label={SENSOR_UI.acetone.label}
          value={acetonePpb}
          unit={SENSOR_UI.acetone.unit}
          statusLabel={SENSOR_STATUS_LABELS[getAcetoneStatus(mq3)]}
        />
      </div>
    </section>
  );
}
