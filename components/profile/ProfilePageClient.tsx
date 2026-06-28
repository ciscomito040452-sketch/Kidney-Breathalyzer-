"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Bell,
  Globe,
  LogOut,
  Moon,
  User,
} from "lucide-react";
import { useDemo } from "@/components/providers/DemoProvider";
import { DashboardDeviceInfo } from "@/components/dashboard/DashboardDeviceInfo";
import { TabPageHeader } from "@/components/shared/TabPageHeader";
import { Card, CardContent } from "@/components/ui/card";
import {
  formatGenderThai,
  getProfileDisplayFromStorage,
  getProfileInitials,
  getRiskFactorsFromStorage,
} from "@/lib/profile/onboarding-storage";

interface ProfilePageClientProps {
  lastMeasuredAt: string | null;
}

export function ProfilePageClient({ lastMeasuredAt }: ProfilePageClientProps) {
  const { isDemo, exitDemoMode } = useDemo();
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
        <TabPageHeader
          title="โปรไฟล์"
          subtitle={`${profile.weight_kg} kg${
            riskSummary.length > 0 ? ` · ${riskSummary.join(", ")}` : ""
          }`}
        />
      </header>

      <DashboardDeviceInfo lastMeasuredAt={lastMeasuredAt} />

      <Card className="overflow-hidden p-0">
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
      </Card>

      <p className="text-center">
        <Link
          href="/onboarding?step=4"
          className="text-sm text-accent-primary"
        >
          วิธีใช้อุปกรณ์
        </Link>
      </p>

      {isDemo && (
        <button
          type="button"
          onClick={exitDemoMode}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-border-subtle bg-surface py-3 text-sm font-medium text-[var(--text-secondary)]"
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
