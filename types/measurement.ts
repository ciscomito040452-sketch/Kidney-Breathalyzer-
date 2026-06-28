export type RiskLevel = "low" | "moderate" | "high";

export interface Measurement {
  id: string;
  user_id: string;
  measured_at: string;
  mq135_value: number;
  mq3_value: number;
  risk_score: number;
  risk_level: RiskLevel;
  is_mock: boolean;
  ai_explanation: string;
  created_at: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  age: number | null;
  gender: string | null;
  weight_kg: number | null;
  has_diabetes: boolean;
  has_hypertension: boolean;
  has_family_history: boolean;
  updated_at: string;
}

export interface UserStreaks {
  user_id: string;
  current_streak: number;
  longest_streak: number;
  weekly_count: number;
  challenge_days: boolean[];
}

export type DeviceStatus = "connected" | "disconnected" | "demo";
