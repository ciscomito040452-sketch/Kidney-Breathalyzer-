"use client";

import Link from "next/link";
import { Smartphone, Wind } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ROUTE_DEVICE_GUIDE } from "@/lib/constants";

export function MeasureInfoPage() {
  return (
    <main className="space-y-6 px-4 py-6">
      <div className="space-y-2">
        <h1 className="text-section-title text-[var(--text-primary)]">
          วัดที่อุปกรณ์
        </h1>
        <p className="text-sm text-[var(--text-secondary)]">
          การคัดกรองความเสี่ยงทำบน Kidney Breathalyzer (ESP32)
          แอปนี้ใช้ดูผลหลังซิงค์เท่านั้น
        </p>
      </div>

      <Card className="app-card app-card--pinned border-[var(--border-pinned)] bg-surface-elevated shadow-none">
        <CardContent className="space-y-4 pt-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent-tint)] text-accent-primary">
            <Wind className="h-6 w-6" strokeWidth={1.75} aria-hidden />
          </div>
          <p className="text-sm leading-relaxed text-[var(--text-primary)]">
            เปิดเครื่อง → เป่าลมหายใจตามคู่มือ → รอผลบนจออุปกรณ์
            จากนั้นข้อมูลจะปรากฏในแอปเมื่อซิงค์สำเร็จ
          </p>
          <p className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
            <Smartphone className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
            ไม่มีปุ่มวัดในแอป — เป็น companion สำหรับดูประวัติและแนวโน้ม
          </p>
        </CardContent>
      </Card>

      <Button className="h-[52px] w-full" asChild>
        <Link href={ROUTE_DEVICE_GUIDE}>ดูคู่มืออุปกรณ์</Link>
      </Button>
      <Button variant="secondary" className="h-[52px] w-full" asChild>
        <Link href="/dashboard">กลับหน้าหลัก</Link>
      </Button>
    </main>
  );
}
