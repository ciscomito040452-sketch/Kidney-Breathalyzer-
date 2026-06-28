export const ONBOARDING_STORAGE_KEY = "kidney-breathalyzer-onboarding";

export interface StoredOnboardingProfile {
  display_name: string | null;
  age: number | null;
  gender: string | null;
  weight_kg: number | null;
  has_diabetes: boolean;
  has_hypertension: boolean;
  has_family_history: boolean;
  risk_factor_ids: string[];
  risk_factor_other: string | null;
  disclaimer_accepted: boolean;
  completed_at: string;
}

export interface DemoRiskFactors {
  has_diabetes: boolean;
  has_hypertension: boolean;
  has_family_history: boolean;
  risk_factor_ids?: string[];
  risk_factor_other?: string | null;
  display_name?: string | null;
}

function migrateRiskFactorIds(
  stored: Partial<StoredOnboardingProfile>
): string[] {
  if (stored.risk_factor_ids?.length) return stored.risk_factor_ids;

  const ids: string[] = [];
  if (stored.has_diabetes) ids.push("diabetes");
  if (stored.has_hypertension) ids.push("hypertension");
  if (stored.has_family_history) ids.push("family_kidney");
  return ids;
}

function normalizeProfile(
  raw: Partial<StoredOnboardingProfile>
): StoredOnboardingProfile {
  const risk_factor_ids = migrateRiskFactorIds(raw);
  return {
    display_name: raw.display_name ?? null,
    age: raw.age ?? null,
    gender: raw.gender ?? null,
    weight_kg: raw.weight_kg ?? null,
    has_diabetes: raw.has_diabetes ?? risk_factor_ids.includes("diabetes"),
    has_hypertension:
      raw.has_hypertension ?? risk_factor_ids.includes("hypertension"),
    has_family_history:
      raw.has_family_history ?? risk_factor_ids.includes("family_kidney"),
    risk_factor_ids,
    risk_factor_other: raw.risk_factor_other ?? null,
    disclaimer_accepted: raw.disclaimer_accepted ?? false,
    completed_at: raw.completed_at ?? new Date().toISOString(),
  };
}

export function getStoredOnboardingProfile(): StoredOnboardingProfile | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(ONBOARDING_STORAGE_KEY);
    if (!raw) return null;
    return normalizeProfile(JSON.parse(raw) as Partial<StoredOnboardingProfile>);
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
      risk_factor_ids: ["diabetes", "family_kidney"],
    };
  }

  return {
    has_diabetes: stored.has_diabetes,
    has_hypertension: stored.has_hypertension,
    has_family_history: stored.has_family_history,
    risk_factor_ids: stored.risk_factor_ids,
    risk_factor_other: stored.risk_factor_other,
    display_name: stored.display_name,
  };
}

export function getProfileDisplayFromStorage(): {
  display_name: string | null;
  age: number;
  gender: string;
  weight_kg: number;
} {
  const stored = getStoredOnboardingProfile();
  if (!stored) {
    return { display_name: null, age: 45, gender: "other", weight_kg: 70 };
  }

  return {
    display_name: stored.display_name,
    age: stored.age ?? 45,
    gender: stored.gender ?? "other",
    weight_kg: stored.weight_kg ?? 70,
  };
}

export function getDisplayName(): string | null {
  return getStoredOnboardingProfile()?.display_name ?? null;
}

export function getProfileInitials(): string {
  const stored = getStoredOnboardingProfile();
  if (stored?.display_name?.trim()) {
    const parts = stored.display_name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
    }
    return stored.display_name.trim().slice(0, 2).toUpperCase();
  }
  return "KB";
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
  const profile = normalizeProfile({
    ...existing,
    ...patch,
    completed_at: patch.completed_at ?? existing?.completed_at,
  });

  if (typeof window !== "undefined") {
    localStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(profile));
  }

  return profile;
}
