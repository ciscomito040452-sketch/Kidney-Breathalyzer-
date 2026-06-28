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

const chipStyles: Record<
  RiskFilterValue,
  { active: string; idle: string }
> = {
  all: {
    active: "bg-accent-primary text-white",
    idle: "bg-surface text-[var(--text-secondary)] ring-1 ring-border-subtle",
  },
  low: {
    active: "bg-risk-low text-white",
    idle: "bg-risk-low/10 text-risk-low ring-1 ring-risk-low/20",
  },
  moderate: {
    active: "bg-risk-moderate text-white",
    idle: "bg-risk-moderate/10 text-risk-moderate ring-1 ring-risk-moderate/20",
  },
  high: {
    active: "bg-risk-high text-white",
    idle: "bg-risk-high/10 text-risk-high ring-1 ring-risk-high/20",
  },
};

export function HistoryRiskFilterChips({
  value,
  onChange,
}: HistoryRiskFilterChipsProps) {
  const { locale, translate } = usePreferences();
  const riskLabels = getRiskShortLabels(locale);

  const options: { value: RiskFilterValue; label: string }[] = [
    { value: "all", label: translate("filterAll") },
    { value: "low", label: riskLabels.low },
    { value: "moderate", label: riskLabels.moderate },
    { value: "high", label: riskLabels.high },
  ];

  return (
    <div className="grid grid-cols-4 gap-2">
      {options.map(({ value: optionValue, label }) => {
        const selected = value === optionValue;
        const styles = chipStyles[optionValue];

        return (
          <button
            key={optionValue}
            type="button"
            onClick={() => onChange(optionValue)}
            className={cn(
              "min-h-[44px] rounded-full px-2 text-sm font-medium transition-colors",
              selected ? styles.active : styles.idle
            )}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
