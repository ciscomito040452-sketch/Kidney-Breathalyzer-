"use client";

import { usePreferences } from "@/components/providers/PreferencesProvider";
import type { AppLocale } from "@/lib/preferences/profile-preferences";
import { cn } from "@/lib/utils";

export function LanguageSelector() {
  const { locale, setLocale, translate } = usePreferences();

  const options: { code: AppLocale; label: string }[] = [
    { code: "th", label: translate("languageTh") },
    { code: "en", label: translate("languageEn") },
  ];

  return (
    <div
      className="relative flex rounded-xl bg-surface-elevated p-1 segmented-track"
      role="group"
      aria-label={translate("language")}
    >
      {options.map(({ code, label }) => {
        const active = locale === code;
        return (
          <button
            key={code}
            type="button"
            onClick={() => setLocale(code)}
            className={cn(
              "relative z-[1] flex min-h-[44px] flex-1 items-center justify-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "text-[var(--text-primary)] font-semibold"
                : "text-[var(--text-secondary)]"
            )}
            aria-pressed={active}
          >
            {label}
          </button>
        );
      })}
      <div
        className="pointer-events-none absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-lg bg-[var(--bg-surface-elevated)] shadow-sm transition-transform duration-200 ease-out"
        style={{
          transform: locale === "en" ? "translateX(100%)" : "translateX(0)",
        }}
        aria-hidden
      />
    </div>
  );
}
