"use client";

import { AppLogo } from "@/components/shared/AppLogo";
import { usePreferences } from "@/components/providers/PreferencesProvider";
import { APP_NAME } from "@/lib/constants";

export function LandingHero() {
  const { translate } = usePreferences();

  return (
    <div className="flex w-full max-w-full flex-col items-center text-center">
      <AppLogo
        size={80}
        variant="hero"
        className="h-20 w-20 max-w-[28vw]"
      />

      <h1 className="landing-hero-title mt-6 max-w-full text-balance text-[var(--text-primary)]">
        {translate("landingHeroTitle")}
      </h1>

      <p className="mt-2 text-[13px] font-medium text-[var(--text-secondary)]">
        {APP_NAME}
      </p>

      <p className="mt-3 max-w-[18rem] text-pretty text-[13px] leading-snug text-[var(--text-secondary)]">
        {translate("landingScreeningBadge")}
      </p>
    </div>
  );
}
