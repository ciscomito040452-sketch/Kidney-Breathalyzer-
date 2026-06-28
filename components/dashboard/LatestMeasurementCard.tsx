import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  formatAcetonePpb,
  formatAmmoniaPpb,
  SENSOR_UI,
} from "@/lib/sensor-labels";
import { formatDateTimeThai } from "@/lib/utils";

interface LatestMeasurementCardProps {
  measuredAt: string;
  mq135: number;
  mq3: number;
}

export function LatestMeasurementCard({
  measuredAt,
  mq135,
  mq3,
}: LatestMeasurementCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">การวัดล่าสุด</CardTitle>
        <p className="text-xs text-[var(--text-secondary)]">
          {formatDateTimeThai(measuredAt)}
        </p>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-[var(--bg-primary)] p-3">
          <p className="text-xs text-[var(--text-secondary)]">
            {SENSOR_UI.ammonia.label}
          </p>
          <p className="text-xl font-semibold tabular-nums">
            {formatAmmoniaPpb(mq135)}
            <span className="ml-1 text-sm font-normal">
              {SENSOR_UI.ammonia.unit}
            </span>
          </p>
        </div>
        <div className="rounded-xl bg-[var(--bg-primary)] p-3">
          <p className="text-xs text-[var(--text-secondary)]">
            {SENSOR_UI.acetone.label}
          </p>
          <p className="text-xl font-semibold tabular-nums">
            {formatAcetonePpb(mq3)}
            <span className="ml-1 text-sm font-normal">
              {SENSOR_UI.acetone.unit}
            </span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
