import { NextResponse } from "next/server";
import { getDemoMeasurements } from "@/lib/mock/demo-store";
import { getEffectiveRiskFactors } from "@/lib/profile/effective-risk-factors";
import { ingestMeasurement } from "@/lib/measurements/ingest";
import type { CreateMeasurementRequest } from "@/types/api";

export async function GET() {
  const measurements = getDemoMeasurements(getEffectiveRiskFactors());
  return NextResponse.json({ data: measurements });
}

/** @deprecated Use POST /api/device/ingest for device submissions */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreateMeasurementRequest;
    const { mq135_value, mq3_value, is_mock = true } = body;

    const result = ingestMeasurement({
      mq135_value,
      mq3_value,
      is_mock,
    });

    return NextResponse.json({
      id: result.id,
      risk_score: result.risk_score,
      risk_level: result.risk_level,
      ai_explanation: result.ai_explanation,
    });
  } catch {
    return NextResponse.json(
      { error: "ไม่สามารถบันทึกผลการวัดได้" },
      { status: 400 }
    );
  }
}
