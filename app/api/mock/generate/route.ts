import { NextResponse } from "next/server";
import { generateMockSensorValues } from "@/lib/mock/generator";
import { ingestMeasurement } from "@/lib/measurements/ingest";

/** Dev/firmware testing only — not exposed in app UI */
export async function POST() {
  const { mq135_value, mq3_value } = generateMockSensorValues();
  const result = ingestMeasurement({
    mq135_value,
    mq3_value,
    is_mock: true,
  });

  return NextResponse.json({
    id: result.id,
    risk_score: result.risk_score,
    risk_level: result.risk_level,
    ai_explanation: result.ai_explanation,
    mq135_value,
    mq3_value,
  });
}
