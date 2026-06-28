import { NextResponse } from "next/server";
import { getDemoMeasurementById } from "@/lib/mock/demo-store";

interface RouteParams {
  params: { id: string };
}

export async function GET(_request: Request, { params }: RouteParams) {
  const measurement = getDemoMeasurementById(params.id);

  if (!measurement) {
    return NextResponse.json(
      { error: "ไม่พบข้อมูลการวัด" },
      { status: 404 }
    );
  }

  return NextResponse.json({ data: measurement });
}
