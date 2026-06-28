import {
  formatAcetonePpb,
  formatAmmoniaPpb,
  SENSOR_UI,
} from "@/lib/sensor-labels";
import {
  getAcetoneStatus,
  getAmmoniaStatus,
  SENSOR_STATUS_LABELS,
  type SensorStatus,
} from "@/lib/sensors/status";
import { cn } from "@/lib/utils";

interface SensorChipRowProps {
  mq135: number;
  mq3: number;
  compact?: boolean;
}

function statusClasses(status: SensorStatus): string {
  return status === "normal"
    ? "bg-risk-low/10 text-risk-low"
    : "bg-risk-moderate/10 text-risk-moderate";
}

export function SensorChipRow({ mq135, mq3, compact = false }: SensorChipRowProps) {
  const ammoniaStatus = getAmmoniaStatus(mq135);
  const acetoneStatus = getAcetoneStatus(mq3);

  const chips = [
    {
      label: SENSOR_UI.ammonia.label,
      value: formatAmmoniaPpb(mq135),
      unit: SENSOR_UI.ammonia.unit,
      status: ammoniaStatus,
    },
    {
      label: SENSOR_UI.acetone.label,
      value: formatAcetonePpb(mq3),
      unit: SENSOR_UI.acetone.unit,
      status: acetoneStatus,
    },
  ];

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-[var(--text-secondary)]">
        ค่าเซนเซอร์ล่าสุด
      </p>
      <div className="grid grid-cols-2 gap-2">
        {chips.map((chip) => (
          <div
            key={chip.label}
            className={cn(
              "rounded-xl border border-border-subtle bg-white/60 p-2.5",
              compact && "p-2"
            )}
          >
            <p className="text-[11px] text-[var(--text-secondary)]">
              {chip.label}
            </p>
            <p className={cn("font-semibold tabular-nums", compact ? "text-base" : "text-lg")}>
              {chip.value}
              <span className="ml-0.5 text-xs font-normal text-[var(--text-secondary)]">
                {chip.unit}
              </span>
            </p>
            <span
              className={cn(
                "mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium",
                statusClasses(chip.status)
              )}
            >
              {SENSOR_STATUS_LABELS[chip.status]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
