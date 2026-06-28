import { ProfilePageClient } from "@/components/profile/ProfilePageClient";
import { getDemoMeasurements } from "@/lib/mock/demo-store";
import { getEffectiveRiskFactors } from "@/lib/profile/effective-risk-factors";

export default function ProfilePage() {
  const latest = getDemoMeasurements(getEffectiveRiskFactors())[0];

  return (
    <ProfilePageClient lastMeasuredAt={latest?.measured_at ?? null} />
  );
}
