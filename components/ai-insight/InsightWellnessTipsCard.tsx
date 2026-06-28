"use client";

import type { LucideIcon } from "lucide-react";
import { Activity, ChevronRight, Droplets, Stethoscope, Utensils } from "lucide-react";
import { usePreferences } from "@/components/providers/PreferencesProvider";
import {
  InsightGroupedCard,
  InsightIconBadge,
} from "@/components/ai-insight/insight-ui";

const TIP_ICONS: LucideIcon[] = [
  Droplets,
  Utensils,
  Activity,
  Stethoscope,
];

const TIP_TONES = ["accent", "good", "attention", "neutral"] as const;

interface InsightWellnessTipsCardProps {
  tips: string[];
}

export function InsightWellnessTipsCard({ tips }: InsightWellnessTipsCardProps) {
  const { translate } = usePreferences();
  const visibleTips = tips.slice(0, 3);

  return (
    <section className="space-y-3">
      <p className="text-base font-semibold text-[var(--text-primary)]">
        {translate("insightShortTips")}
      </p>
      <InsightGroupedCard>
        <div className="divide-y divide-border-subtle">
          {visibleTips.map((tip, index) => {
            const Icon = TIP_ICONS[index] ?? Activity;
            const tone = TIP_TONES[index] ?? "neutral";

            return (
              <div
                key={tip}
                className="flex items-center gap-3 px-4 py-3.5"
              >
                <InsightIconBadge icon={Icon} tone={tone} size="sm" />
                <p className="min-w-0 flex-1 text-sm leading-snug text-[var(--text-primary)]">
                  {tip}
                </p>
                <ChevronRight
                  className="h-4 w-4 shrink-0 text-[var(--text-secondary)] opacity-40"
                  strokeWidth={1.75}
                  aria-hidden
                />
              </div>
            );
          })}
        </div>
      </InsightGroupedCard>
    </section>
  );
}
