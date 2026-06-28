import { Suspense } from "react";
import { OnboardingPageClient } from "@/components/onboarding/OnboardingPageClient";

export default function OnboardingPage() {
  return (
    <Suspense fallback={<main className="px-4 py-12">กำลังโหลด...</main>}>
      <OnboardingPageClient />
    </Suspense>
  );
}
