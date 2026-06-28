import type { DemoRiskFactors } from "@/lib/profile/onboarding-storage";
import {
  legacyBooleansFromIds,
  OTHER_RISK_FACTOR_ID,
} from "@/lib/profile/risk-factor-catalog";
import {
  buildRiskFactorsCookieValue,
  RISK_FACTORS_COOKIE,
} from "@/lib/profile/risk-factors-cookie";
import {
  getStoredOnboardingProfile,
  saveOnboardingProfile,
} from "@/lib/profile/onboarding-storage";

export interface ProfileFormValues {
  displayName: string;
  age: string;
  gender: string;
  weight: string;
  riskFactorIds: string[];
  riskFactorOther: string;
}

export function profileFormFromStorage(): ProfileFormValues {
  if (typeof window === "undefined") {
    return emptyForm();
  }

  const stored = getStoredOnboardingProfile();
  if (!stored) {
    return {
      displayName: "",
      age: "45",
      gender: "other",
      weight: "70",
      riskFactorIds: ["diabetes", "family_kidney"],
      riskFactorOther: "",
    };
  }

  return {
    displayName: stored.display_name ?? "",
    age: stored.age != null ? String(stored.age) : "",
    gender: stored.gender ?? "",
    weight: stored.weight_kg != null ? String(stored.weight_kg) : "",
    riskFactorIds: stored.risk_factor_ids ?? [],
    riskFactorOther: stored.risk_factor_other ?? "",
  };
}

function emptyForm(): ProfileFormValues {
  return {
    displayName: "",
    age: "",
    gender: "",
    weight: "",
    riskFactorIds: [],
    riskFactorOther: "",
  };
}

export function persistProfileForm(values: ProfileFormValues): void {
  const legacy = legacyBooleansFromIds(values.riskFactorIds);
  const otherNote =
    values.riskFactorIds.includes(OTHER_RISK_FACTOR_ID) &&
    values.riskFactorOther.trim()
      ? values.riskFactorOther.trim()
      : null;

  saveOnboardingProfile({
    display_name: values.displayName.trim() || null,
    age: values.age ? Number(values.age) : null,
    gender: values.gender || null,
    weight_kg: values.weight ? Number(values.weight) : null,
    risk_factor_ids: values.riskFactorIds,
    risk_factor_other: otherNote,
    ...legacy,
  });

  const factors: DemoRiskFactors = {
    ...legacy,
    risk_factor_ids: values.riskFactorIds,
    risk_factor_other: otherNote,
    display_name: values.displayName.trim() || null,
  };
  document.cookie = `${RISK_FACTORS_COOKIE}=${buildRiskFactorsCookieValue(factors)};path=/;max-age=31536000;SameSite=Lax`;
}

export function isProfileFormValid(values: ProfileFormValues): boolean {
  return values.displayName.trim().length >= 1;
}
