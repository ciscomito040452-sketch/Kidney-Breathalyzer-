"use client";

import type { LucideIcon } from "lucide-react";
import {
  AlertCircle,
  Brain,
  Eye,
  FileWarning,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";
import { usePreferences } from "@/components/providers/PreferencesProvider";
import { getOnboardingDisclaimerSections } from "@/lib/legal/onboarding-disclaimer";
import { cn } from "@/lib/utils";

const sectionIcons: Record<string, LucideIcon> = {
  purpose: Eye,
  limitations: FileWarning,
  interpretation: Brain,
  "when-to-see-doctor": Stethoscope,
  privacy: ShieldCheck,
};

interface OnboardingDisclaimerStepProps {
  accepted: boolean;
  onAcceptedChange: (accepted: boolean) => void;
}

export function OnboardingDisclaimerStep({
  accepted,
  onAcceptedChange,
}: OnboardingDisclaimerStepProps) {
  const { locale, translate } = usePreferences();
  const sections = getOnboardingDisclaimerSections(locale);

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-2xl border border-[var(--surface-card-border)] bg-surface shadow-card app-card">
        <div className="border-b border-border-subtle px-4 py-4">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[var(--accent-tint)] text-accent-primary">
              <ShieldCheck className="h-5 w-5" strokeWidth={1.75} aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="text-base font-semibold text-[var(--text-primary)]">
                {translate("onboardingDisclaimerTitle")}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-[var(--text-secondary)]">
                {translate("onboardingDisclaimerIntro")}
              </p>
            </div>
          </div>
        </div>

        <div className="divide-y divide-border-subtle">
          {sections.map((section) => {
            const Icon = sectionIcons[section.id] ?? AlertCircle;

            return (
              <section key={section.id} className="px-4 py-4">
                <div className="mb-2.5 flex items-center gap-2">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-surface-elevated text-accent-primary">
                    <Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                  </span>
                  <h2 className="text-sm font-semibold text-[var(--text-primary)]">
                    {section.title}
                  </h2>
                </div>
                <ul className="space-y-2 pl-10">
                  {section.points.map((point) => (
                    <li
                      key={point}
                      className="flex items-start gap-2 text-sm leading-relaxed text-[var(--text-secondary)]"
                    >
                      <span
                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-primary"
                        aria-hidden
                      />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      </div>

      <label
        className={cn(
          "flex cursor-pointer items-start gap-3 rounded-2xl border px-4 py-4 transition-colors",
          accepted
            ? "border-accent-primary/30 bg-[var(--accent-tint)]"
            : "border-border-subtle bg-surface"
        )}
      >
        <input
          type="checkbox"
          checked={accepted}
          onChange={(e) => onAcceptedChange(e.target.checked)}
          className="mt-0.5 h-5 w-5 shrink-0 accent-[var(--accent-primary)]"
        />
        <span className="text-sm leading-relaxed text-[var(--text-primary)]">
          {translate("onboardingDisclaimerAccept")}
        </span>
      </label>
    </div>
  );
}
