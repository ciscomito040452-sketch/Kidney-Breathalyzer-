import type { DemoRiskFactors } from "@/lib/profile/onboarding-storage";
import {
  buildRiskFactorsCookieValue,
  RISK_FACTORS_COOKIE,
} from "@/lib/profile/risk-factors-cookie";
import {
  getStoredOnboardingProfile,
  saveOnboardingProfile,
} from "@/lib/profile/onboarding-storage";

export interface ProfileFormValues {
  age: string;
  gender: string;
  weight: string;
  hasDiabetes: boolean;
  hasHypertension: boolean;
  hasFamilyHistory: boolean;
}

export function profileFormFromStorage(): ProfileFormValues {
  if (typeof window === "undefined") {
    return emptyForm();
  }

  const stored = getStoredOnboardingProfile();
  if (!stored) {
    return {
      age: "45",
      gender: "other",
      weight: "70",
      hasDiabetes: true,
      hasHypertension: false,
      hasFamilyHistory: true,
    };
  }

  return {
    age: stored.age != null ? String(stored.age) : "",
    gender: stored.gender ?? "",
    weight: stored.weight_kg != null ? String(stored.weight_kg) : "",
    hasDiabetes: stored.has_diabetes,
    hasHypertension: stored.has_hypertension,
    hasFamilyHistory: stored.has_family_history,
  };
}

function emptyForm(): ProfileFormValues {
  return {
    age: "",
    gender: "",
    weight: "",
    hasDiabetes: false,
    hasHypertension: false,
    hasFamilyHistory: false,
  };
}

export function persistProfileForm(values: ProfileFormValues): void {
  saveOnboardingProfile({
    age: values.age ? Number(values.age) : null,
    gender: values.gender || null,
    weight_kg: values.weight ? Number(values.weight) : null,
    has_diabetes: values.hasDiabetes,
    has_hypertension: values.hasHypertension,
    has_family_history: values.hasFamilyHistory,
  });

  const factors: DemoRiskFactors = {
    has_diabetes: values.hasDiabetes,
    has_hypertension: values.hasHypertension,
    has_family_history: values.hasFamilyHistory,
  };
  document.cookie = `${RISK_FACTORS_COOKIE}=${buildRiskFactorsCookieValue(factors)};path=/;max-age=31536000;SameSite=Lax`;
}

export function isProfileFormValid(values: ProfileFormValues): boolean {
  return Boolean(values.age && values.gender && values.weight);
}
