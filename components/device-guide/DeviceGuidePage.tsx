import Link from "next/link";
import { ArrowLeft, Clock, Smartphone } from "lucide-react";
import { DeviceGuideStepCard } from "@/components/device-guide/DeviceGuideStepCard";
import { DisclaimerBanner } from "@/components/layout/DisclaimerBanner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DEVICE_GUIDE_INTRO,
  DEVICE_GUIDE_STEPS,
} from "@/lib/device-guide/content";

export function DeviceGuidePage() {
  return (
    <main className="space-y-6 px-4 py-6">
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-surface text-[var(--text-secondary)] transition-colors hover:text-accent-primary"
          aria-label="กลับหน้าหลัก"
        >
          <ArrowLeft className="h-5 w-5" strokeWidth={1.75} />
        </Link>
        <div className="min-w-0">
          <h1 className="text-xl font-semibold">{DEVICE_GUIDE_INTRO.title}</h1>
          <p className="text-sm text-[var(--text-secondary)]">
            คู่มือทีละขั้นตอน
          </p>
        </div>
      </div>

      <Card className="border-accent-primary/15 bg-gradient-to-br from-accent-primary/5 to-[var(--bg-primary)]">
        <CardContent className="space-y-3 pt-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-primary/10 text-accent-primary">
            <Smartphone className="h-6 w-6" strokeWidth={1.75} aria-hidden />
          </div>
          <p className="text-sm leading-relaxed text-[var(--text-primary)]">
            {DEVICE_GUIDE_INTRO.subtitle}
          </p>
          <p className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
            <Clock className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
            {DEVICE_GUIDE_INTRO.duration}
          </p>
        </CardContent>
      </Card>

      <section aria-label="ขั้นตอนการใช้งาน">
        {DEVICE_GUIDE_STEPS.map((step, index) => (
          <DeviceGuideStepCard
            key={step.id}
            step={step}
            isLast={index === DEVICE_GUIDE_STEPS.length - 1}
          />
        ))}
      </section>

      <Card className="bg-surface">
        <CardContent className="space-y-2 pt-4">
          <p className="text-sm font-semibold text-[var(--text-primary)]">
            คำถามที่พบบ่อย
          </p>
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="font-medium text-[var(--text-primary)]">
                ทำไมแอปไม่มีปุ่มวัด?
              </dt>
              <dd className="mt-0.5 text-[var(--text-secondary)]">
                การวัดทำที่อุปกรณ์เท่านั้น แอปใช้ดูผลหลังซิงค์
              </dd>
            </div>
            <div>
              <dt className="font-medium text-[var(--text-primary)]">
                โหมดสาธิตคืออะไร?
              </dt>
              <dd className="mt-0.5 text-[var(--text-secondary)]">
                ข้อมูลตัวอย่าง 30 วันสำหรับทดลองใช้งานโดยไม่ต้องมีฮาร์ดแวร์
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <DisclaimerBanner />

      <Button className="h-[52px] w-full" asChild>
        <Link href="/dashboard">กลับหน้าหลัก</Link>
      </Button>
    </main>
  );
}
