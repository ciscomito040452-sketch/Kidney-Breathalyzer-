import { NextResponse } from "next/server";
import { ingestMeasurement } from "@/lib/measurements/ingest";
import type { DeviceIngestRequest } from "@/types/api";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as DeviceIngestRequest;
    const { mq135_value, mq3_value, measured_at, device_id } = body;

    if (
      typeof mq135_value !== "number" ||
      typeof mq3_value !== "number" ||
      Number.isNaN(mq135_value) ||
      Number.isNaN(mq3_value)
    ) {
      return NextResponse.json(
        { error: "mq135_value และ mq3_value ต้องเป็นตัวเลข" },
        { status: 400 }
      );
    }

    const result = ingestMeasurement({
      mq135_value,
      mq3_value,
      measured_at,
      is_mock: false,
      device_id,
    });

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "ไม่สามารถรับข้อมูลจากอุปกรณ์ได้" },
      { status: 400 }
    );
  }
}
