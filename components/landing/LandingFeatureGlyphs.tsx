"use client";

import type { LucideIcon } from "lucide-react";
import { LineChart, Smartphone, Wind } from "lucide-react";
import { usePreferences } from "@/components/providers/PreferencesProvider";
import type { MessageKey } from "@/lib/i18n/messages";

interface FeatureGlyph {
  icon: LucideIcon;
  labelKey: MessageKey;
}

const FEATURES: FeatureGlyph[] = [
  { icon: Wind, labelKey: "landingFeature1Short" },
  { icon: Smartphone, labelKey: "landingFeature2Short" },
  { icon: LineChart, labelKey: "landingFeature3Short" },
];

export function LandingFeatureGlyphs() {
  const { translate } = usePreferences();

  return (
    <div className="mt-8 grid w-full max-w-[18rem] grid-cols-3 gap-3">
      {FEATURES.map(({ icon: Icon, labelKey }) => (
        <div
          key={labelKey}
          className="flex flex-col items-center gap-2 text-center"
        >
          <span
            className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--accent-tint)] text-accent-primary"
            aria-hidden
          >
            <Icon className="h-5 w-5" strokeWidth={1.75} />
          </span>
          <span className="text-[11px] font-medium leading-tight text-[var(--text-secondary)]">
            {translate(labelKey)}
          </span>
        </div>
      ))}
    </div>
  );
}
