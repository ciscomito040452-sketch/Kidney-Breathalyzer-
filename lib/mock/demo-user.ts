import { DEMO_USER_ID } from "@/lib/constants";
import type { DemoRiskFactors } from "@/lib/profile/onboarding-storage";
import type { UserProfile } from "@/types/measurement";

export const DEMO_PROFILE: UserProfile = {
  id: "demo-profile-001",
  user_id: DEMO_USER_ID,
  age: 45,
  gender: "other",
  weight_kg: 70,
  has_diabetes: true,
  has_hypertension: false,
  has_family_history: true,
  updated_at: new Date().toISOString(),
};

/** Server-side default risk factors for demo seed data. */
export function getDefaultDemoRiskFactors(): DemoRiskFactors {
  return {
    has_diabetes: DEMO_PROFILE.has_diabetes,
    has_hypertension: DEMO_PROFILE.has_hypertension,
    has_family_history: DEMO_PROFILE.has_family_history,
  };
}
