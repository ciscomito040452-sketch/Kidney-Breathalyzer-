"use client";

import { useRouter } from "next/navigation";
import { LandingActions } from "@/components/landing/LandingActions";
import { LandingFeatureGlyphs } from "@/components/landing/LandingFeatureGlyphs";
import { LandingHero } from "@/components/landing/LandingHero";
import { StaggerSection } from "@/components/shared/StaggerSection";
import { useDemo } from "@/components/providers/DemoProvider";

export function LandingPageClient() {
  const router = useRouter();
  const { enterDemoMode } = useDemo();

  function handleDemo() {
    enterDemoMode();
    router.push("/dashboard");
  }

  return (
    <main className="flex min-h-dvh w-full max-w-full flex-col overflow-x-hidden bg-[var(--bg-primary)] px-5">
      <div className="flex flex-1 flex-col items-center justify-center pt-[max(1.5rem,env(safe-area-inset-top))]">
        <StaggerSection className="flex w-full flex-col items-center">
          <LandingHero />
          <LandingFeatureGlyphs />
        </StaggerSection>
      </div>

      <div className="mt-auto shrink-0 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-6">
        <LandingActions onDemo={handleDemo} />
      </div>
    </main>
  );
}
