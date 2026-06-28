"use client";

import { AppLogo } from "@/components/shared/AppLogo";
import { useDemo } from "@/components/providers/DemoProvider";
import { usePreferences } from "@/components/providers/PreferencesProvider";
import { getDisplayName } from "@/lib/profile/onboarding-storage";
import { getGreeting } from "@/lib/i18n/messages";
import { formatDateThai } from "@/lib/utils";

export function PageHeader() {
  const { isDemo } = useDemo();
  const { locale, translate } = usePreferences();
  const name = getDisplayName() || translate("greetingHello");

  return (
    <header className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <p className="text-sm text-[var(--text-secondary)]">
          {getGreeting(locale)}
        </p>
        <h1 className="truncate text-xl font-semibold">{name}</h1>
        <p className="text-sm text-[var(--text-secondary)]">
          {formatDateThai(new Date())}
        </p>
        {isDemo && (
          <span className="mt-2 inline-flex rounded-full bg-accent-primary/10 px-2.5 py-0.5 text-xs font-medium text-accent-primary">
            {translate("demoMode")}
          </span>
        )}
      </div>

      <AppLogo size={44} className="h-11 w-11 shrink-0" />
    </header>
  );
}
