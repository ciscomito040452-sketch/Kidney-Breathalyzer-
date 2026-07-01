"use client";

import { useEffect, useState } from "react";
import { Loader2, Smartphone } from "lucide-react";
import { DeviceStatusBadge } from "@/components/dashboard/DeviceStatusBadge";
import {
  HealthGroupedCard,
  HealthGroupedDivider,
  HealthListRow,
} from "@/components/health";
import { MotionCrossfade } from "@/components/motion/MotionCrossfade";
import { useDemo } from "@/components/providers/DemoProvider";
import { usePreferences } from "@/components/providers/PreferencesProvider";
import { ROUTE_DEVICE_GUIDE } from "@/lib/constants";
import { resolveDeviceStatus } from "@/lib/device/status";
import { formatDateTimeThai } from "@/lib/utils";

interface DashboardMoreSectionProps {
  lastMeasuredAt: string | null;
}

export function DashboardMoreSection({
  lastMeasuredAt,
}: DashboardMoreSectionProps) {
  const { isDemo } = useDemo();
  const { translate } = usePreferences();
  const [isSyncing, setIsSyncing] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsSyncing(false), 1600);
    return () => clearTimeout(timer);
  }, []);

  const status = resolveDeviceStatus(lastMeasuredAt, isDemo);

  return (
    <HealthGroupedCard className="app-card--pinned">
      <HealthListRow
        icon={Smartphone}
        title={translate("deviceStatus")}
        detail={
          isSyncing ? (
            translate("syncing")
          ) : lastMeasuredAt ? (
            `${translate("lastSync")} · ${formatDateTimeThai(lastMeasuredAt)}`
          ) : undefined
        }
        trailing={
          <MotionCrossfade motionKey={isSyncing ? "syncing" : "done"}>
            {isSyncing ? (
              <Loader2 className="h-4 w-4 animate-spin text-accent-primary" />
            ) : (
              <span className="kb-pop-in inline-flex">
                <DeviceStatusBadge status={status} />
              </span>
            )}
          </MotionCrossfade>
        }
        showChevron={false}
      />
      <HealthGroupedDivider />
      <HealthListRow
        icon={Smartphone}
        title={translate("deviceGuide")}
        href={ROUTE_DEVICE_GUIDE}
      />
    </HealthGroupedCard>
  );
}
