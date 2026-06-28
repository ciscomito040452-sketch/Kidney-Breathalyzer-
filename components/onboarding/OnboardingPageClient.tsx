"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Bluetooth, Cloud, Wind } from "lucide-react";
import { OnboardingStepIndicator } from "@/components/onboarding/OnboardingStepIndicator";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { MEDICAL_DISCLAIMER } from "@/lib/constants";
import {
  ONBOARDING_STORAGE_KEY,
  type StoredOnboardingProfile,
} from "@/lib/profile/onboarding-storage";

const DEVICE_STEPS = [
  {
    icon: Bluetooth,
    title: "เปิดอุปกรณ์และเชื่อมต่อ Wi-Fi",
    description:
      "เปิด Kidney Breathalyzer แล้วเชื่อมต่อเครือข่าย Wi-Fi ตามที่แสดงบนหน้าจออุปกรณ์",
  },
  {
    icon: Wind,
    title: "เป่าลมหายใจที่อุปกรณ์",
    description:
      "วางปากให้สนิทกับท่อเป่า หายใจเข้าลึก แล้วเป่าออกช้า ๆ ตามที่อุปกรณ์แจ้ง",
  },
  {
    icon: Cloud,
    title: "รอข้อมูลซิงค์เข้าแอป",
    description:
      "อุปกรณ์จะส่งค่าเซนเซอร์ไปยังระบบอัตโนมัติ ผลการคัดกรองความเสี่ยงจะปรากฏบนหน้าหลักของแอป",
  },
] as const;

const TOTAL_STEPS = 4;

export type { StoredOnboardingProfile as OnboardingProfile };

export function OnboardingPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialStep = Math.min(
    Math.max(Number(searchParams.get("step")) || 1, 1),
    TOTAL_STEPS
  );

  const [step, setStep] = useState(initialStep);
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [weight, setWeight] = useState("");
  const [hasDiabetes, setHasDiabetes] = useState(false);
  const [hasHypertension, setHasHypertension] = useState(false);
  const [hasFamilyHistory, setHasFamilyHistory] = useState(false);
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);

  useEffect(() => {
    const stepParam = searchParams.get("step");
    if (stepParam) {
      const parsed = Number(stepParam);
      if (parsed >= 1 && parsed <= TOTAL_STEPS) {
        setStep(parsed);
      }
    }
  }, [searchParams]);

  const saveAndFinish = useCallback(() => {
    const profile: StoredOnboardingProfile = {
      age: age ? Number(age) : null,
      gender: gender || null,
      weight_kg: weight ? Number(weight) : null,
      has_diabetes: hasDiabetes,
      has_hypertension: hasHypertension,
      has_family_history: hasFamilyHistory,
      disclaimer_accepted: disclaimerAccepted,
      completed_at: new Date().toISOString(),
    };
    localStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(profile));
    router.push("/dashboard");
  }, [
    age,
    gender,
    weight,
    hasDiabetes,
    hasHypertension,
    hasFamilyHistory,
    disclaimerAccepted,
    router,
  ]);

  const canProceed =
    step === 1
      ? age && gender && weight
      : step === 3
        ? disclaimerAccepted
        : true;

  return (
    <main className="flex min-h-[calc(100vh-2rem)] flex-col px-4 py-6">
      <header className="mb-6 space-y-4">
        <OnboardingStepIndicator currentStep={step} totalSteps={TOTAL_STEPS} />
        <div>
          <p className="text-xs text-[var(--text-secondary)]">
            ขั้นตอน {step}/{TOTAL_STEPS}
          </p>
          <h1 className="text-xl font-semibold">ตั้งค่าเบื้องต้น</h1>
        </div>
      </header>

      <div className="flex-1 space-y-5">
        {step === 1 && (
          <section className="space-y-4">
            <p className="text-sm text-[var(--text-secondary)]">
              ข้อมูลส่วนตัว (ไม่เก็บชื่อ-นามสกุล)
            </p>
            <label className="block space-y-1">
              <span className="text-sm">อายุ</span>
              <Input
                type="number"
                min={1}
                max={120}
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </label>
            <label className="block space-y-1">
              <span className="text-sm">เพศ</span>
              <Select value={gender} onChange={(e) => setGender(e.target.value)}>
                <option value="">เลือก</option>
                <option value="female">หญิง</option>
                <option value="male">ชาย</option>
                <option value="other">อื่น ๆ</option>
              </Select>
            </label>
            <label className="block space-y-1">
              <span className="text-sm">น้ำหนัก (kg)</span>
              <Input
                type="number"
                min={1}
                step={0.1}
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </label>
          </section>
        )}

        {step === 2 && (
          <section className="space-y-4">
            <p className="text-sm text-[var(--text-secondary)]">
              ปัจจัยเสี่ยง (เลือกได้มากกว่าหนึ่งข้อ)
            </p>
            {[
              { id: "diabetes", label: "โรคเบาหวาน", checked: hasDiabetes, set: setHasDiabetes },
              {
                id: "hypertension",
                label: "ความดันโลหิตสูง",
                checked: hasHypertension,
                set: setHasHypertension,
              },
              {
                id: "family",
                label: "ประวัติครอบครัวเป็นโรคไต",
                checked: hasFamilyHistory,
                set: setHasFamilyHistory,
              },
            ].map((item) => (
              <label
                key={item.id}
                className="flex cursor-pointer items-center gap-3 rounded-xl border border-border-subtle bg-surface px-4 py-3"
              >
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={(e) => item.set(e.target.checked)}
                  className="h-4 w-4 accent-[var(--accent-primary)]"
                />
                <span className="text-sm">{item.label}</span>
              </label>
            ))}
          </section>
        )}

        {step === 3 && (
          <section className="space-y-4">
            <p className="text-sm font-medium">ข้อจำกัดความรับผิดชอบ</p>
            <p className="rounded-xl border border-border-subtle bg-surface p-4 text-sm leading-relaxed text-[var(--text-secondary)]">
              {MEDICAL_DISCLAIMER}
            </p>
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={disclaimerAccepted}
                onChange={(e) => setDisclaimerAccepted(e.target.checked)}
                className="mt-1 h-4 w-4 accent-[var(--accent-primary)]"
              />
              <span className="text-sm">
                ฉันเข้าใจและยอมรับว่าระบบนี้เป็นการคัดกรองความเสี่ยงเท่านั้น
              </span>
            </label>
          </section>
        )}

        {step === 4 && (
          <section className="space-y-4">
            <p className="text-sm text-[var(--text-secondary)]">
              การวัดเกิดที่อุปกรณ์ IoT — แอปจะแสดงผลหลังข้อมูลซิงค์เข้ามา
            </p>
            {DEVICE_STEPS.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="flex gap-3 rounded-xl border border-border-subtle bg-surface p-4"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-primary/10">
                    <Icon className="h-5 w-5 text-accent-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {index + 1}. {item.title}
                    </p>
                    <p className="mt-1 text-sm text-[var(--text-secondary)]">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </section>
        )}
      </div>

      <div className="mt-6 flex gap-3">
        {step > 1 && step !== 4 && (
          <Button
            type="button"
            variant="secondary"
            className="flex-1"
            onClick={() => setStep((s) => s - 1)}
          >
            ย้อนกลับ
          </Button>
        )}
        {step < TOTAL_STEPS ? (
          <Button
            type="button"
            className="flex-1"
            disabled={!canProceed}
            onClick={() => setStep((s) => s + 1)}
          >
            ถัดไป
          </Button>
        ) : (
          <Button type="button" className="flex-1" onClick={saveAndFinish}>
            เริ่มใช้งาน
          </Button>
        )}
      </div>
    </main>
  );
}
