import type { Measurement } from "@/types/measurement";
import { calculateRiskScore, generateExplanation } from "@/lib/risk-engine";
import { computeTrendContext } from "@/lib/risk-engine/trend-context";
import {
  addDemoMeasurement,
  getDemoMeasurements,
} from "@/lib/mock/demo-store";
import { createMockMeasurement } from "@/lib/mock/generator";
import { getEffectiveRiskFactors } from "@/lib/profile/effective-risk-factors";
import {
  formatAcetonePpb,
  formatAmmoniaPpb,
} from "@/lib/sensor-labels";
import {
  getAcetoneStatus,
  getAmmoniaStatus,
} from "@/lib/sensors/status";

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

  const riskFactors = getEffectiveRiskFactors();
  const history = getDemoMeasurements(riskFactors);
  const { risk_score, risk_level } = calculateRiskScore({
    mq135_value,
    mq3_value,
    riskFactors,
    history,
  });

  const trend = computeTrendContext(history, mq135_value);
  const ai_explanation = generateExplanation({
    risk_level,
    mq135_value,
    mq3_value,
    riskFactors,
    avgMq135: trend.avgMq135,
    trendPercent: trend.trendPercent,
    consecutiveHighDays: trend.consecutiveHighDays,
    ammoniaPpb: formatAmmoniaPpb(mq135_value),
    acetonePpb: formatAcetonePpb(mq3_value),
    ammoniaStatus: getAmmoniaStatus(mq135_value),
    acetoneStatus: getAcetoneStatus(mq3_value),
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
