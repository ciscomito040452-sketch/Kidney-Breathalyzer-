"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Bell,
  Globe,
  LogOut,
  Moon,
  Smartphone,
  User,
} from "lucide-react";
import { useDemo } from "@/components/providers/DemoProvider";
import { DeviceStatusBadge } from "@/components/dashboard/DeviceStatusBadge";
import { resolveDeviceStatus } from "@/lib/device/status";
import {
  formatGenderThai,
  getProfileDisplayFromStorage,
  getProfileInitials,
  getRiskFactorsFromStorage,
} from "@/lib/profile/onboarding-storage";
import { formatDateTimeThai } from "@/lib/utils";

interface ProfilePageClientProps {
  lastMeasuredAt: string | null;
}

export function ProfilePageClient({ lastMeasuredAt }: ProfilePageClientProps) {
  const { isDemo, exitDemoMode } = useDemo();
  const deviceStatus = resolveDeviceStatus(lastMeasuredAt, isDemo);
  const [profile, setProfile] = useState({
    age: 45,
    gender: "other",
    weight_kg: 70,
    initials: "KB",
  });
  const [riskSummary, setRiskSummary] = useState<string[]>([]);

  useEffect(() => {
    const display = getProfileDisplayFromStorage();
    const factors = getRiskFactorsFromStorage();
    setProfile({
      age: display.age,
      gender: display.gender,
      weight_kg: display.weight_kg,
      initials: getProfileInitials(),
    });

    const summary: string[] = [];
    if (factors.has_diabetes) summary.push("เบาหวาน");
    if (factors.has_hypertension) summary.push("ความดันสูง");
    if (factors.has_family_history) summary.push("ประวัติครอบครัว");
    setRiskSummary(summary);
  }, []);

  const settingsItems = [
    {
      icon: User,
      label: "ข้อมูลส่วนตัว",
      value: `${profile.age} ปี · ${formatGenderThai(profile.gender)}`,
      href: "/onboarding?step=1",
    },
    {
      icon: Bell,
      label: "การแจ้งเตือน",
      value: "เปิด",
    },
    {
      icon: Globe,
      label: "ภาษา",
      value: "ไทย",
    },
    {
      icon: Moon,
      label: "โหมดการแสดงผล",
      value: "เร็ว ๆ นี้",
    },
  ] as const;

  return (
    <main className="space-y-6 px-4 py-6">
      <header className="flex items-center gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-accent-primary/10 text-lg font-semibold text-accent-primary">
          {profile.initials}
        </div>
        <div>
          <h1 className="text-xl font-semibold">โปรไฟล์</h1>
          <p className="text-sm text-[var(--text-secondary)]">
            {profile.weight_kg} kg
            {riskSummary.length > 0 && ` · ${riskSummary.join(", ")}`}
          </p>
        </div>
      </header>

      <div className="rounded-2xl border border-border-subtle bg-surface p-4">
        <div className="flex items-start gap-3">
          <Smartphone className="mt-0.5 h-5 w-5 text-accent-primary" />
          <div className="flex-1 space-y-2">
            <p className="text-sm font-medium">อุปกรณ์ Kidney Breathalyzer</p>
            <DeviceStatusBadge status={deviceStatus} />
            {lastMeasuredAt && (
              <p className="text-xs text-[var(--text-secondary)]">
                ซิงค์ล่าสุด: {formatDateTimeThai(lastMeasuredAt)}
              </p>
            )}
            <Link
              href="/onboarding?step=4"
              className="inline-block text-sm text-accent-primary"
            >
              วิธีใช้อุปกรณ์
            </Link>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border-subtle bg-surface">
        {settingsItems.map((item, index) => {
          const Icon = item.icon;
          const content = (
            <>
              <div className="flex items-center gap-3">
                <Icon className="h-5 w-5 text-accent-primary" />
                <span className="text-sm">{item.label}</span>
              </div>
              <span className="text-sm text-[var(--text-secondary)]">
                {item.value}
              </span>
            </>
          );

          const rowClass = `flex items-center justify-between px-4 py-3.5 ${
            index < settingsItems.length - 1
              ? "border-b border-border-subtle"
              : ""
          }`;

          if ("href" in item && item.href) {
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`${rowClass} transition-colors hover:bg-surface/80`}
              >
                {content}
              </Link>
            );
          }

          return (
            <div key={item.label} className={rowClass}>
              {content}
            </div>
          );
        })}
      </div>

      {isDemo && (
        <button
          type="button"
          onClick={exitDemoMode}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-risk-high/20 bg-risk-high/5 py-3 text-sm font-medium text-risk-high"
        >
          <LogOut className="h-4 w-4" />
          ออกจากโหมดสาธิต
        </button>
      )}

      <p className="text-center text-xs text-[var(--text-secondary)]">
        <Link href="/login" className="text-accent-primary">
          เข้าสู่ระบบ
        </Link>{" "}
        สำหรับบัญชีจริง (เร็ว ๆ นี้)
      </p>
    </main>
  );
}
