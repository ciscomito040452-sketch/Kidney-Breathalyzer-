import { ProfilePageClient } from "@/components/profile/ProfilePageClient";
import { computeGamificationStats } from "@/lib/gamification";
import { getDemoMeasurements } from "@/lib/mock/demo-store";
import { getEffectiveRiskFactors } from "@/lib/profile/effective-risk-factors";

export default function ProfilePage() {
  const measurements = getDemoMeasurements(getEffectiveRiskFactors());
  const latest = measurements[0];
  const gamification = computeGamificationStats(measurements);

  return (
    <ProfilePageClient
      lastMeasuredAt={latest?.measured_at ?? null}
      totalMeasurements={measurements.length}
      currentStreak={gamification.current_streak}
    />
  );
}
