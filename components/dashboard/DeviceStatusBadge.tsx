"use client";

import { cn } from "@/lib/utils";
import { usePreferences } from "@/components/providers/PreferencesProvider";
import type { DeviceStatus } from "@/types/measurement";

interface DeviceStatusBadgeProps {
  status: DeviceStatus;
  className?: string;
}

const statusStyles: Record<DeviceStatus, string> = {
  connected: "bg-accent-primary/10 text-accent-primary",
  disconnected: "bg-[var(--text-secondary)]/10 text-[var(--text-secondary)]",
  demo: "bg-accent-primary/10 text-accent-primary",
};

const statusKeys = {
  connected: "connected",
  disconnected: "disconnected",
  demo: "demoMode",
} as const;

export function DeviceStatusBadge({ status, className }: DeviceStatusBadgeProps) {
  const { translate } = usePreferences();

  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
        statusStyles[status],
        className
      )}
    >
      {translate(statusKeys[status])}
    </span>
  );
}
