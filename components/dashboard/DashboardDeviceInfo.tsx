"use client";

import { useDemo } from "@/components/providers/DemoProvider";
import { DeviceStatusBadge } from "@/components/dashboard/DeviceStatusBadge";
import { resolveDeviceStatus } from "@/lib/device/status";
import { formatDateTimeThai } from "@/lib/utils";

interface DashboardDeviceInfoProps {
  lastMeasuredAt: string | null;
}

export function DashboardDeviceInfo({ lastMeasuredAt }: DashboardDeviceInfoProps) {
  const { isDemo } = useDemo();
  const status = resolveDeviceStatus(lastMeasuredAt, isDemo);

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border-subtle bg-surface px-4 py-3">
      <div className="space-y-1">
        <p className="text-xs text-[var(--text-secondary)]">สถานะอุปกรณ์</p>
        <DeviceStatusBadge status={status} />
      </div>
      {lastMeasuredAt && (
        <div className="text-right">
          <p className="text-xs text-[var(--text-secondary)]">ซิงค์ล่าสุด</p>
          <p className="text-sm font-medium">{formatDateTimeThai(lastMeasuredAt)}</p>
        </div>
      )}
    </div>
  );
}
