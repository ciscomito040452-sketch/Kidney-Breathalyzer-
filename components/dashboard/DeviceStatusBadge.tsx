import { cn } from "@/lib/utils";
import { DEVICE_STATUS_LABELS } from "@/lib/constants";
import type { DeviceStatus } from "@/types/measurement";

interface DeviceStatusBadgeProps {
  status: DeviceStatus;
  className?: string;
}

const statusStyles: Record<DeviceStatus, string> = {
  connected: "bg-risk-low/10 text-risk-low",
  disconnected: "bg-[var(--text-secondary)]/10 text-[var(--text-secondary)]",
  demo: "bg-accent-primary/10 text-accent-primary",
};

export function DeviceStatusBadge({ status, className }: DeviceStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
        statusStyles[status],
        className
      )}
    >
      {DEVICE_STATUS_LABELS[status]}
    </span>
  );
}
