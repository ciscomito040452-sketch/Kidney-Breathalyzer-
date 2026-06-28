"use client";

import { FlaskConical, Stethoscope, TrendingUp } from "lucide-react";
import { usePreferences } from "@/components/providers/PreferencesProvider";
import type { MessageKey } from "@/lib/i18n/messages";

const POINTS: { icon: typeof Stethoscope; key: MessageKey }[] = [
  { icon: Stethoscope, key: "whenToSeeDoctorPoint1" },
  { icon: TrendingUp, key: "whenToSeeDoctorPoint2" },
  { icon: FlaskConical, key: "whenToSeeDoctorPoint3" },
];

export function WhenToSeeDoctorCard() {
  const { translate } = usePreferences();

  return (
    <section className="overflow-hidden rounded-2xl border border-[var(--surface-card-border)] bg-surface shadow-card app-card">
      <div className="border-b border-border-subtle px-4 py-3">
        <p className="text-sm font-semibold text-[var(--text-primary)]">
          {translate("whenToSeeDoctorTitle")}
        </p>
      </div>
      <ul className="divide-y divide-border-subtle">
        {POINTS.map(({ icon: Icon, key }) => (
          <li key={key} className="flex items-start gap-3 px-4 py-3.5">
            <span
              className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-tint)] text-accent-primary"
              aria-hidden
            >
              <Icon className="h-4 w-4" strokeWidth={1.75} />
            </span>
            <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
              {translate(key)}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
