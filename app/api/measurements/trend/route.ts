import { NextResponse } from "next/server";
import { getDemoMeasurements } from "@/lib/mock/demo-store";
import { getEffectiveRiskFactors } from "@/lib/profile/effective-risk-factors";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const parsedDays = Number(searchParams.get("days") ?? "7");
  const days = Number.isFinite(parsedDays)
    ? Math.min(90, Math.max(1, Math.floor(parsedDays)))
    : 7;
  const measurements = getDemoMeasurements(getEffectiveRiskFactors());

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);

  const filtered = measurements
    .filter((m) => new Date(m.measured_at) >= cutoff)
    .sort(
      (a, b) =>
        new Date(a.measured_at).getTime() - new Date(b.measured_at).getTime()
    )
    .map((m) => ({
      date: m.measured_at,
      mq135_value: m.mq135_value,
      mq3_value: m.mq3_value,
      risk_score: m.risk_score,
      risk_level: m.risk_level,
    }));

  return NextResponse.json({ data: filtered, days });
}
