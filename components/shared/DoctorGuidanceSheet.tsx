"use client";

import { FlaskConical, Stethoscope, TrendingUp, X } from "lucide-react";
import { SheetScaffold } from "@/components/motion/SheetScaffold";
import { usePreferences } from "@/components/providers/PreferencesProvider";
import type { MessageKey } from "@/lib/i18n/messages";

const POINTS: { icon: typeof Stethoscope; key: MessageKey }[] = [
  { icon: Stethoscope, key: "whenToSeeDoctorPoint1" },
  { icon: TrendingUp, key: "whenToSeeDoctorPoint2" },
  { icon: FlaskConical, key: "whenToSeeDoctorPoint3" },
];

interface DoctorGuidanceSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DoctorGuidanceSheet({
  open,
  onOpenChange,
}: DoctorGuidanceSheetProps) {
  const { translate } = usePreferences();

  return (
    <SheetScaffold
      open={open}
      onOpenChange={onOpenChange}
      closeLabel={translate("closeSheet")}
      ariaLabelledBy="doctor-guidance-title"
      sheetClassName="max-h-[min(70vh,520px)]"
      header={
        <div className="flex shrink-0 items-center justify-between rounded-t-2xl border-b border-border-subtle bg-[var(--bg-primary)] px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-primary/10 text-accent-primary">
              <Stethoscope className="h-4 w-4" strokeWidth={1.75} aria-hidden />
            </span>
            <h2
              id="doctor-guidance-title"
              className="text-base font-semibold text-[var(--text-primary)]"
            >
              {translate("whenToSeeDoctorTitle")}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--text-secondary)] hover:bg-surface"
            aria-label={translate("closeSheet")}
          >
            <X className="h-5 w-5" strokeWidth={1.75} />
          </button>
        </div>
      }
    >
      <ul className="divide-y divide-border-subtle overflow-y-auto overscroll-contain pb-[calc(1rem+env(safe-area-inset-bottom,0px))]">
        {POINTS.map(({ icon: Icon, key }) => (
          <li key={key} className="flex items-start gap-3 px-4 py-4">
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
    </SheetScaffold>
  );
}
