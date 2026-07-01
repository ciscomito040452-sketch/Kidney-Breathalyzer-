"use client";

import { usePreferences } from "@/components/providers/PreferencesProvider";
import { getRiskShortLabels } from "@/lib/i18n/messages";
import type { RiskLevel } from "@/types/measurement";
import { cn } from "@/lib/utils";

type RiskFilterValue = RiskLevel | "all";

interface HistoryRiskFilterChipsProps {
  value: RiskFilterValue;
  onChange: (value: RiskFilterValue) => void;
}

const FILTER_OPTIONS: RiskFilterValue[] = ["all", "low", "moderate", "high"];

const riskDotClass: Record<RiskLevel, string> = {
  low: "bg-risk-low",
  moderate: "bg-risk-moderate",
  high: "bg-risk-high",
};

export function HistoryRiskFilterChips({
  value,
  onChange,
}: HistoryRiskFilterChipsProps) {
  const { locale, translate } = usePreferences();
  const riskLabels = getRiskShortLabels(locale);

  const labels: Record<RiskFilterValue, string> = {
    all: translate("filterAll"),
    low: riskLabels.low,
    moderate: riskLabels.moderate,
    high: riskLabels.high,
  };

  return (
    <div
      className="segmented-track flex gap-0.5 rounded-xl p-1"
      role="tablist"
      aria-label={translate("historyRiskFilterAria")}
    >
      {FILTER_OPTIONS.map((optionValue) => {
        const selected = value === optionValue;
        const isRisk = optionValue !== "all";

        return (
          <button
            key={optionValue}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(optionValue)}
            className={cn(
              "flex min-h-[40px] min-w-0 flex-1 items-center justify-center gap-1.5 rounded-lg px-1 py-2 transition-all",
              selected
                ? "bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] shadow-sm"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            )}
          >
            {isRisk && (
              <span
                className={cn(
                  "h-2 w-2 shrink-0 rounded-full",
                  riskDotClass[optionValue],
                  !selected && "opacity-45"
                )}
                aria-hidden
              />
            )}
            <span className="truncate text-[11px] font-semibold leading-none sm:text-xs">
              {labels[optionValue]}
            </span>
          </button>
        );
      })}
    </div>
  );
}
