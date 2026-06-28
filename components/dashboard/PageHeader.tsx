"use client";

import { AppLogo } from "@/components/shared/AppLogo";
import { useDemo } from "@/components/providers/DemoProvider";
import { usePreferences } from "@/components/providers/PreferencesProvider";
import { getDisplayName } from "@/lib/profile/onboarding-storage";
import { getGreeting } from "@/lib/i18n/messages";
import { formatDateLocale } from "@/lib/utils";

export function PageHeader() {
  const { isDemo } = useDemo();
  const { locale, translate } = usePreferences();
  const name = getDisplayName() || translate("greetingHello");

  return (
    <header className="space-y-1">
      <p className="text-sm text-[var(--text-secondary)]">
        {getGreeting(locale)}
      </p>

      <div className="flex items-center justify-between gap-3">
        <h1 className="min-w-0 truncate text-2xl font-semibold tracking-tight">
          {name}
        </h1>
        <AppLogo
          size={32}
          variant="mark"
          className="h-8 w-8 shrink-0"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2 pt-0.5">
        <p className="text-sm text-[var(--text-secondary)]">
          {formatDateLocale(locale, new Date())}
        </p>
        {isDemo && (
          <span className="inline-flex rounded-full bg-accent-primary/10 px-2.5 py-0.5 text-xs font-medium text-accent-primary">
            {translate("demoMode")}
          </span>
        )}
      </div>
    </header>
  );
}
