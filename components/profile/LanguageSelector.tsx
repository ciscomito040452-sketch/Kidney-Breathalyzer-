"use client";

import { usePreferences } from "@/components/providers/PreferencesProvider";
import { FlagIcon } from "@/components/shared/FlagIcon";
import type { AppLocale } from "@/lib/preferences/profile-preferences";
import { cn } from "@/lib/utils";

export function LanguageSelector() {
  const { locale, setLocale, translate } = usePreferences();

  const options: { code: AppLocale; label: string }[] = [
    { code: "th", label: "TH" },
    { code: "en", label: "ENG" },
  ];

  return (
    <div className="flex gap-2">
      {options.map(({ code, label }) => {
        const active = locale === code;
        return (
          <button
            key={code}
            type="button"
            onClick={() => setLocale(code)}
            className={cn(
              "flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "border-accent-primary bg-accent-primary/10 text-accent-primary"
                : "border-border-subtle bg-surface-elevated text-[var(--text-secondary)]"
            )}
            aria-pressed={active}
          >
            <FlagIcon locale={code} />
            <span>{label}</span>
          </button>
        );
      })}
      <span className="sr-only">
        {translate("language")}: {locale === "th" ? "TH" : "ENG"}
      </span>
    </div>
  );
}
