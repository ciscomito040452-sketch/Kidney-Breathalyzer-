"use client";

import Link from "next/link";
import { User } from "lucide-react";
import { useDemo } from "@/components/providers/DemoProvider";
import { usePreferences } from "@/components/providers/PreferencesProvider";
import { getDisplayName } from "@/lib/profile/onboarding-storage";
import { getGreeting } from "@/lib/i18n/messages";
import type { MessageKey } from "@/lib/i18n/messages";
import { cn } from "@/lib/utils";

interface SummaryPageHeaderProps {
  titleKey: MessageKey;
  subtitleKey?: MessageKey;
  showGreeting?: boolean;
  className?: string;
}

export function SummaryPageHeader({
  titleKey,
  subtitleKey,
  showGreeting = true,
  className,
}: SummaryPageHeaderProps) {
  const { isDemo } = useDemo();
  const { locale, translate } = usePreferences();
  const name = getDisplayName() || translate("greetingHello");

  return (
    <header className={cn("space-y-1", className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h1 className="text-summary-title font-semibold tracking-tight text-[var(--text-primary)]">
            {translate(titleKey)}
          </h1>
          {showGreeting && (
            <p className="mt-1 text-pinned-caption text-[var(--text-secondary)]">
              {getGreeting(locale)}, {name}
            </p>
          )}
          {subtitleKey && (
            <p className="mt-0.5 text-pinned-caption text-[var(--text-secondary)]">
              {translate(subtitleKey)}
            </p>
          )}
        </div>
        <Link
          href="/profile"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface text-accent-primary transition-colors active:bg-[var(--accent-tint)]"
          aria-label={translate("navProfile")}
        >
          <User className="h-5 w-5" strokeWidth={1.75} />
        </Link>
      </div>
      {isDemo && (
        <span className="inline-flex rounded-full bg-accent-primary/10 px-2.5 py-0.5 text-xs font-medium text-accent-primary">
          {translate("demoMode")}
        </span>
      )}
    </header>
  );
}
