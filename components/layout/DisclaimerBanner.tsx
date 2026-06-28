"use client";

import { usePreferences } from "@/components/providers/PreferencesProvider";
import { cn } from "@/lib/utils";

interface DisclaimerBannerProps {
  className?: string;
  compact?: boolean;
}

export function DisclaimerBanner({
  className,
  compact = false,
}: DisclaimerBannerProps) {
  const { translate } = usePreferences();

  return (
    <div
      className={cn(
        "rounded-xl bg-surface text-[13px] leading-relaxed text-[var(--text-secondary)]",
        compact ? "p-3" : "p-4",
        className
      )}
      role="note"
      aria-label={translate("medicalDisclaimerAria")}
    >
      {translate("medicalDisclaimer")}
    </div>
  );
}
