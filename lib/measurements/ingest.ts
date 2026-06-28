import type { Measurement } from "@/types/measurement";
import { calculateRiskScore, generateExplanation } from "@/lib/risk-engine";
import {
  addDemoMeasurement,
  getDemoMeasurements,
} from "@/lib/mock/demo-store";
import { createMockMeasurement } from "@/lib/mock/generator";
import { DEMO_PROFILE } from "@/lib/mock/demo-user";

export interface IngestMeasurementInput {
  mq135_value: number;
  mq3_value: number;
  is_mock?: boolean;
  measured_at?: string;
  device_id?: string;
}

export interface IngestMeasurementResult {
  id: string;
  risk_score: number;
  risk_level: Measurement["risk_level"];
  ai_explanation: string;
  measured_at: string;
}

export function ingestMeasurement(
  input: IngestMeasurementInput
): IngestMeasurementResult {
  const { mq135_value, mq3_value, is_mock = false, measured_at } = input;

  const history = getDemoMeasurements();
  const { risk_score, risk_level } = calculateRiskScore({
    mq135_value,
    mq3_value,
    riskFactors: {
      has_diabetes: DEMO_PROFILE.has_diabetes,
      has_hypertension: DEMO_PROFILE.has_hypertension,
      has_family_history: DEMO_PROFILE.has_family_history,
    },
    history,
  });

  const ai_explanation = generateExplanation({
    risk_level,
    mq135_value,
    mq3_value,
    riskFactors: {
      has_diabetes: DEMO_PROFILE.has_diabetes,
      has_family_history: DEMO_PROFILE.has_family_history,
    },
  });

  const measurement = addDemoMeasurement(
    createMockMeasurement({
      mq135_value,
      mq3_value,
      risk_score,
      risk_level,
      is_mock,
      ai_explanation,
      measured_at: measured_at ?? new Date().toISOString(),
    })
  );

  return {
    id: measurement.id,
    risk_score: measurement.risk_score,
    risk_level: measurement.risk_level,
    ai_explanation: measurement.ai_explanation,
    measured_at: measurement.measured_at,
  };
}
