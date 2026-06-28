"use client";

import { ShieldCheck } from "lucide-react";
import { usePreferences } from "@/components/providers/PreferencesProvider";

export function ScreeningContextBanner() {
  const { translate } = usePreferences();

  return (
    <div className="flex items-start gap-3 rounded-2xl border border-[var(--surface-card-border)] bg-[var(--accent-tint)] px-4 py-3.5 shadow-card app-card">
      <span
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent-primary/15 text-accent-primary"
        aria-hidden
      >
        <ShieldCheck className="h-4 w-4" strokeWidth={1.75} />
      </span>
      <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
        {translate("screeningContextSubtitle")}
      </p>
    </div>
  );
}
