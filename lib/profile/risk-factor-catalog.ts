import type { MessageKey } from "@/lib/i18n/messages";

export interface RiskFactorOption {
  id: string;
  labelKey: MessageKey;
  /** Maps to legacy scoring booleans when applicable */
  legacyKey?: "has_diabetes" | "has_hypertension" | "has_family_history";
}

export const RISK_FACTOR_CATALOG: RiskFactorOption[] = [
  { id: "diabetes", labelKey: "riskFactorDiabetes", legacyKey: "has_diabetes" },
  {
    id: "hypertension",
    labelKey: "riskFactorHypertension",
    legacyKey: "has_hypertension",
  },
  {
    id: "family_kidney",
    labelKey: "riskFactorFamily",
    legacyKey: "has_family_history",
  },
  { id: "smoking", labelKey: "riskFactorSmoking" },
  { id: "obesity", labelKey: "riskFactorObesity" },
  { id: "heart_disease", labelKey: "riskFactorHeart" },
  { id: "high_cholesterol", labelKey: "riskFactorCholesterol" },
  { id: "ckd", labelKey: "riskFactorCkd" },
  { id: "alcohol", labelKey: "riskFactorAlcohol" },
  { id: "sedentary", labelKey: "riskFactorSedentary" },
  { id: "other", labelKey: "riskFactorOther" },
];

export const OTHER_RISK_FACTOR_ID = "other";

export function legacyBooleansFromIds(ids: string[]) {
  return {
    has_diabetes: ids.includes("diabetes"),
    has_hypertension: ids.includes("hypertension"),
    has_family_history: ids.includes("family_kidney"),
  };
}
