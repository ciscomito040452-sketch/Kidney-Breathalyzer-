"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ONBOARDING_DEVICE_STEPS } from "@/lib/device-guide/content";
import { HealthGroupedCard } from "@/components/health/HealthGroupedCard";
import { OnboardingDisclaimerStep } from "@/components/onboarding/OnboardingDisclaimerStep";
import { OnboardingStepIndicator } from "@/components/onboarding/OnboardingStepIndicator";
import { RiskFactorPicker } from "@/components/profile/RiskFactorPicker";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { useDemo } from "@/components/providers/DemoProvider";
import { usePreferences } from "@/components/providers/PreferencesProvider";
import { persistProfileForm } from "@/lib/profile/profile-form";
import type { StoredOnboardingProfile } from "@/lib/profile/onboarding-storage";
import { saveOnboardingProfile } from "@/lib/profile/onboarding-storage";

const DEVICE_STEPS = ONBOARDING_DEVICE_STEPS;
const TOTAL_STEPS = 4;

export type { StoredOnboardingProfile as OnboardingProfile };

export function OnboardingPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { enterDemoMode } = useDemo();
  const { translate } = usePreferences();
  const initialStep = Math.min(
    Math.max(Number(searchParams.get("step")) || 1, 1),
    TOTAL_STEPS
  );

  const [step, setStep] = useState(initialStep);
  const [displayName, setDisplayName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [weight, setWeight] = useState("");
  const [riskFactorIds, setRiskFactorIds] = useState<string[]>([]);
  const [riskFactorOther, setRiskFactorOther] = useState("");
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
    persistProfileForm({
      displayName,
      age,
      gender,
      weight,
      riskFactorIds,
      riskFactorOther,
    });
    saveOnboardingProfile({ disclaimer_accepted: disclaimerAccepted });

    enterDemoMode();
    router.push("/dashboard");
  }, [
    age,
    disclaimerAccepted,
    displayName,
    enterDemoMode,
    gender,
    riskFactorIds,
    riskFactorOther,
    router,
    weight,
  ]);

  const canProceed =
    step === 1
      ? displayName.trim().length > 0
      : step === 3
        ? disclaimerAccepted
        : true;

  function handleRiskToggle(id: string, checked: boolean) {
    setRiskFactorIds((prev) =>
      checked ? [...prev, id] : prev.filter((item) => item !== id)
    );
  }

  return (
    <main className="flex min-h-[calc(100vh-2rem)] flex-col px-4 py-6">
      <header className="mb-6 space-y-4">
        <OnboardingStepIndicator currentStep={step} totalSteps={TOTAL_STEPS} />
        <div>
          <p className="text-xs text-[var(--text-secondary)]">
            {translate("onboardingStep")} {step}/{TOTAL_STEPS}
          </p>
          <h1 className="text-summary-title font-semibold tracking-tight">
            {translate("onboardingTitle")}
          </h1>
        </div>
      </header>

      <div className="min-h-0 flex-1 space-y-5 overflow-y-auto overscroll-contain">
        {step === 1 && (
          <HealthGroupedCard variant="elevated">
            <div className="space-y-4 p-4">
              <p className="text-sm text-[var(--text-secondary)]">
                {translate("onboardingPersonalHint")}
              </p>
              <label className="block space-y-1">
                <span className="text-sm font-medium">
                  {translate("displayNameLabel")}
                </span>
                <Input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder={translate("displayNamePlaceholder")}
                />
              </label>
              <label className="block space-y-1">
                <span className="text-sm">
                  {translate("ageLabel")} ({translate("optionalField")})
                </span>
                <Input
                  type="number"
                  min={1}
                  max={120}
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                />
              </label>
              <label className="block space-y-1">
                <span className="text-sm">
                  {translate("genderLabel")} ({translate("optionalField")})
                </span>
                <Select value={gender} onChange={(e) => setGender(e.target.value)}>
                  <option value="">{translate("selectGender")}</option>
                  <option value="female">{translate("genderFemale")}</option>
                  <option value="male">{translate("genderMale")}</option>
                  <option value="other">{translate("genderOther")}</option>
                </Select>
              </label>
              <label className="block space-y-1">
                <span className="text-sm">
                  {translate("weightLabel")} ({translate("optionalField")})
                </span>
                <Input
                  type="number"
                  min={1}
                  step={0.1}
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                />
              </label>
            </div>
          </HealthGroupedCard>
        )}

        {step === 2 && (
          <HealthGroupedCard variant="elevated">
            <div className="p-4">
              <RiskFactorPicker
                selectedIds={riskFactorIds}
                otherNote={riskFactorOther}
                onToggle={handleRiskToggle}
                onOtherNoteChange={setRiskFactorOther}
              />
            </div>
          </HealthGroupedCard>
        )}

        {step === 3 && (
          <OnboardingDisclaimerStep
            accepted={disclaimerAccepted}
            onAcceptedChange={setDisclaimerAccepted}
          />
        )}

        {step === 4 && (
          <section className="space-y-3">
            <p className="text-sm text-[var(--text-secondary)]">
              การวัดเกิดที่อุปกรณ์ IoT — แอปจะแสดงผลหลังข้อมูลซิงค์เข้ามา ·{" "}
              <Link href="/guide/device" className="font-medium text-accent-primary">
                อ่านคู่มือฉบับเต็ม
              </Link>
            </p>
            {DEVICE_STEPS.map((item, index) => {
              const Icon = item.icon;
              return (
                <HealthGroupedCard key={item.title} variant="elevated">
                  <div className="flex gap-3 p-4">
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
                </HealthGroupedCard>
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
            {translate("back")}
          </Button>
        )}
        {step < TOTAL_STEPS ? (
          <Button
            type="button"
            className="flex-1"
            disabled={!canProceed}
            onClick={() => setStep((s) => s + 1)}
          >
            {translate("next")}
          </Button>
        ) : (
          <Button type="button" className="flex-1" onClick={saveAndFinish}>
            {translate("startUsing")}
          </Button>
        )}
      </div>
    </main>
  );
}
