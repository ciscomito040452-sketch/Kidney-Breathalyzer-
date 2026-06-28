import { NextResponse } from "next/server";
import { DEMO_PROFILE } from "@/lib/mock/demo-user";

export async function GET() {
  return NextResponse.json({ data: DEMO_PROFILE });
}

export async function PUT() {
  return NextResponse.json(
    { error: "อัปเดตโปรไฟล์จะพร้อมใช้งานใน P2" },
    { status: 501 }
  );
}
