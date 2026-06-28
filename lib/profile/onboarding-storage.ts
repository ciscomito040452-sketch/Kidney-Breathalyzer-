export const ONBOARDING_STORAGE_KEY = "kidney-breathalyzer-onboarding";

export interface StoredOnboardingProfile {
  age: number | null;
  gender: string | null;
  weight_kg: number | null;
  has_diabetes: boolean;
  has_hypertension: boolean;
  has_family_history: boolean;
  disclaimer_accepted: boolean;
  completed_at: string;
}

export interface DemoRiskFactors {
  has_diabetes: boolean;
  has_hypertension: boolean;
  has_family_history: boolean;
}

export function getStoredOnboardingProfile(): StoredOnboardingProfile | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(ONBOARDING_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredOnboardingProfile;
  } catch {
    return null;
  }
}

export function getRiskFactorsFromStorage(): DemoRiskFactors {
  const stored = getStoredOnboardingProfile();
  if (!stored) {
    return {
      has_diabetes: true,
      has_hypertension: false,
      has_family_history: true,
    };
  }

  return {
    has_diabetes: stored.has_diabetes,
    has_hypertension: stored.has_hypertension,
    has_family_history: stored.has_family_history,
  };
}

export function getProfileDisplayFromStorage(): {
  age: number;
  gender: string;
  weight_kg: number;
} {
  const stored = getStoredOnboardingProfile();
  if (!stored) {
    return { age: 45, gender: "other", weight_kg: 70 };
  }

  return {
    age: stored.age ?? 45,
    gender: stored.gender ?? "other",
    weight_kg: stored.weight_kg ?? 70,
  };
}

export function getProfileInitials(): string {
  const stored = getStoredOnboardingProfile();
  if (!stored?.age) return "KB";
  return String(stored.age).slice(0, 2);
}

const GENDER_LABELS: Record<string, string> = {
  female: "หญิง",
  male: "ชาย",
  other: "อื่น ๆ",
};

export function formatGenderThai(gender: string): string {
  return GENDER_LABELS[gender] ?? gender;
}

export function saveOnboardingProfile(
  patch: Partial<Omit<StoredOnboardingProfile, "completed_at">> & {
    completed_at?: string;
  }
): StoredOnboardingProfile {
  const existing = getStoredOnboardingProfile();
  const profile: StoredOnboardingProfile = {
    age: existing?.age ?? null,
    gender: existing?.gender ?? null,
    weight_kg: existing?.weight_kg ?? null,
    has_diabetes: existing?.has_diabetes ?? false,
    has_hypertension: existing?.has_hypertension ?? false,
    has_family_history: existing?.has_family_history ?? false,
    disclaimer_accepted: existing?.disclaimer_accepted ?? false,
    completed_at: existing?.completed_at ?? new Date().toISOString(),
    ...patch,
  };

  if (typeof window !== "undefined") {
    localStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(profile));
  }

  return profile;
}
