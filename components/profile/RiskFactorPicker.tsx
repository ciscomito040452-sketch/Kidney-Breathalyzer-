"use client";

import { usePreferences } from "@/components/providers/PreferencesProvider";
import { Input } from "@/components/ui/input";
import {
  OTHER_RISK_FACTOR_ID,
  RISK_FACTOR_CATALOG,
} from "@/lib/profile/risk-factor-catalog";

interface RiskFactorPickerProps {
  selectedIds: string[];
  otherNote: string;
  onToggle: (id: string, checked: boolean) => void;
  onOtherNoteChange: (value: string) => void;
}

export function RiskFactorPicker({
  selectedIds,
  otherNote,
  onToggle,
  onOtherNoteChange,
}: RiskFactorPickerProps) {
  const { translate } = usePreferences();
  const showOtherInput = selectedIds.includes(OTHER_RISK_FACTOR_ID);

  return (
    <div className="space-y-3">
      <div>
        <p className="text-sm font-medium">{translate("riskFactorsTitle")}</p>
        <p className="text-sm text-[var(--text-secondary)]">
          {translate("riskFactorsHint")}
        </p>
      </div>
      {RISK_FACTOR_CATALOG.map((option) => (
        <label
          key={option.id}
          className="flex cursor-pointer items-center gap-3 rounded-xl border border-border-subtle bg-[var(--bg-primary)] px-4 py-3"
        >
          <input
            type="checkbox"
            checked={selectedIds.includes(option.id)}
            onChange={(e) => onToggle(option.id, e.target.checked)}
            className="h-4 w-4 accent-[var(--accent-primary)]"
          />
          <span className="text-sm">{translate(option.labelKey)}</span>
        </label>
      ))}
      {showOtherInput && (
        <label className="block space-y-1 px-1">
          <span className="text-sm text-[var(--text-secondary)]">
            {translate("riskFactorOtherHint")}
          </span>
          <Input
            value={otherNote}
            onChange={(e) => onOtherNoteChange(e.target.value)}
            placeholder={translate("riskFactorOtherPlaceholder")}
          />
        </label>
      )}
    </div>
  );
}
