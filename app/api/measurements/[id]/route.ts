import { NextResponse } from "next/server";
import { getDemoMeasurementById } from "@/lib/mock/demo-store";
import { getEffectiveRiskFactors } from "@/lib/profile/effective-risk-factors";

interface RouteParams {
  params: { id: string };
}

export async function GET(_request: Request, { params }: RouteParams) {
  const measurement = getDemoMeasurementById(
    params.id,
    getEffectiveRiskFactors()
  );

  if (!measurement) {
    return NextResponse.json(
      { error: "ไม่พบข้อมูลการวัด" },
      { status: 404 }
    );
  }

  return NextResponse.json({ data: measurement });
}
