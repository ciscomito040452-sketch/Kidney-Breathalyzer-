import type { AppLocale } from "@/lib/preferences/profile-preferences";
import { t, type MessageKey } from "@/lib/i18n/messages";
import {
  RISK_FACTOR_CATALOG,
  OTHER_RISK_FACTOR_ID,
} from "@/lib/profile/risk-factor-catalog";

export function summarizeRiskFactorLabels(
  locale: AppLocale,
  ids: string[],
  otherNote: string | null
): string[] {
  const labels = ids
    .filter((id) => id !== OTHER_RISK_FACTOR_ID)
    .map((id) => {
      const option = RISK_FACTOR_CATALOG.find((item) => item.id === id);
      return option ? t(locale, option.labelKey) : id;
    });

  if (ids.includes(OTHER_RISK_FACTOR_ID) && otherNote?.trim()) {
    labels.push(otherNote.trim());
  } else if (ids.includes(OTHER_RISK_FACTOR_ID)) {
    labels.push(t(locale, "riskFactorOther" as MessageKey));
  }

  return labels;
}
