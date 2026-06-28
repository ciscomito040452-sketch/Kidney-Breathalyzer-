import { ProfilePageClient } from "@/components/profile/ProfilePageClient";
import { getDemoMeasurements } from "@/lib/mock/demo-store";

export default function ProfilePage() {
  const latest = getDemoMeasurements()[0];

  return (
    <ProfilePageClient lastMeasuredAt={latest?.measured_at ?? null} />
  );
}
