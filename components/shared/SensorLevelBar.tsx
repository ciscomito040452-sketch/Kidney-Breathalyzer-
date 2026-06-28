import type { SensorStatus } from "@/lib/sensors/status";
import { cn } from "@/lib/utils";

interface SensorLevelBarProps {
  percent: number;
  thresholdPercent?: number;
  status: SensorStatus;
  className?: string;
}

export function SensorLevelBar({
  percent,
  thresholdPercent,
  status,
  className,
}: SensorLevelBarProps) {
  const elevated = status === "elevated";

  return (
    <div
      className={cn("relative h-1.5 w-full overflow-hidden rounded-full bg-border-subtle", className)}
      aria-hidden
    >
      <div
        className={cn(
          "absolute inset-y-0 left-0 rounded-full",
          elevated ? "bg-accent-primary" : "bg-risk-low/60"
        )}
        style={{ width: `${percent}%` }}
      />
      {thresholdPercent != null && (
        <div
          className="absolute inset-y-0 w-px bg-[var(--text-secondary)]/40"
          style={{ left: `${thresholdPercent}%` }}
        />
      )}
    </div>
  );
}
