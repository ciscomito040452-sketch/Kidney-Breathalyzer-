import type { DeviceStatus } from "@/types/measurement";

const SYNC_THRESHOLD_MS = 24 * 60 * 60 * 1000;

export function resolveDeviceStatus(
  lastMeasuredAt: string | null | undefined,
  isDemo: boolean
): DeviceStatus {
  if (isDemo) return "demo";
  if (!lastMeasuredAt) return "disconnected";

  const elapsed = Date.now() - new Date(lastMeasuredAt).getTime();
  return elapsed < SYNC_THRESHOLD_MS ? "connected" : "disconnected";
}
