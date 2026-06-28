"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useDemo } from "@/components/providers/DemoProvider";
import { DeviceStatusBadge } from "@/components/dashboard/DeviceStatusBadge";
import { resolveDeviceStatus } from "@/lib/device/status";
import { formatDateTimeThai } from "@/lib/utils";

interface DashboardDeviceInfoProps {
  lastMeasuredAt: string | null;
}

export function DashboardDeviceInfo({
  lastMeasuredAt,
}: DashboardDeviceInfoProps) {
  const { isDemo } = useDemo();
  const [isSyncing, setIsSyncing] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsSyncing(false), 1600);
    return () => clearTimeout(timer);
  }, []);

  const status = resolveDeviceStatus(lastMeasuredAt, isDemo);

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border-subtle bg-surface px-4 py-3">
      <div className="space-y-1">
        <p className="text-xs text-[var(--text-secondary)]">สถานะอุปกรณ์</p>
        {isSyncing ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-primary/10 px-2.5 py-0.5 text-xs font-medium text-accent-primary">
            <Loader2 className="h-3 w-3 animate-spin" />
            กำลังซิงค์...
          </span>
        ) : (
          <DeviceStatusBadge status={status} />
        )}
      </div>
      {lastMeasuredAt && !isSyncing && (
        <div className="text-right">
          <p className="text-xs text-[var(--text-secondary)]">ซิงค์ล่าสุด</p>
          <p className="text-sm font-medium">
            {formatDateTimeThai(lastMeasuredAt)}
          </p>
        </div>
      )}
    </div>
  );
}
