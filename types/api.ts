export type { Measurement, RiskLevel, UserProfile, UserStreaks, DeviceStatus } from "./measurement";

export interface CreateMeasurementRequest {
  mq135_value: number;
  mq3_value: number;
  is_mock: boolean;
}

export interface DeviceIngestRequest {
  mq135_value: number;
  mq3_value: number;
  device_id?: string;
  measured_at?: string;
}

export interface CreateMeasurementResponse {
  id: string;
  risk_score: number;
  risk_level: string;
  ai_explanation: string;
}

export interface ApiError {
  error: string;
}
