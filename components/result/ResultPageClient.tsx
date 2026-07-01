"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ScreeningHeroSummary } from "@/components/dashboard/ScreeningHeroSummary";
import { AIExplanation } from "@/components/result/AIExplanation";
import { DoctorCTA } from "@/components/result/DoctorCTA";
import { HealthTips } from "@/components/result/HealthTips";
import { ResultSensorRows } from "@/components/result/ResultSensorRows";
import { SectionHeader } from "@/components/health/SectionHeader";
import { WhenToSeeDoctorCard } from "@/components/shared/WhenToSeeDoctorCard";
import { DisclaimerBanner } from "@/components/layout/DisclaimerBanner";
import { StaggerSection } from "@/components/shared/StaggerSection";
import { Pressable } from "@/components/motion/Pressable";
import { Button } from "@/components/ui/button";
import { usePreferences } from "@/components/providers/PreferencesProvider";
import { shouldShowDoctorCta } from "@/lib/dashboard/should-show-doctor-cta";
import { getHealthTips } from "@/lib/risk-engine/explanations";
import { getAmmoniaTrendForMeasurements } from "@/lib/result/build-result-explanation";
import type { Measurement } from "@/types/measurement";

interface ResultPageClientProps {
  measurement: Measurement;
  explanation: string;
  measurements: Measurement[];
}

export function ResultPageClient({
  measurement,
  explanation,
  measurements,
}: ResultPageClientProps) {
  const { locale, translate } = usePreferences();
  const analytics = getAmmoniaTrendForMeasurements(measurements);
  const doctorCta = shouldShowDoctorCta({
    riskLevel: measurement.risk_level,
    ammoniaTrend: analytics?.ammoniaTrend,
    mq135Value: measurement.mq135_value,
  });

  return (
    <main className="space-y-6 px-4 py-6 pb-10">
      <header>
        <Pressable
          as={Link}
          href="/history"
          className="mb-3 inline-flex items-center gap-1.5 text-sm text-accent-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          {translate("resultBackToHistory")}
        </Pressable>
        <h1 className="text-summary-title font-semibold tracking-tight">
          {translate("resultDetailTitle")}
        </h1>
      </header>

      <StaggerSection className="space-y-6">
        <ScreeningHeroSummary
          variant="detail"
          riskLevel={measurement.risk_level}
          riskScore={measurement.risk_score}
          measuredAt={measurement.measured_at}
        />

        <ResultSensorRows
          riskLevel={measurement.risk_level}
          riskScore={measurement.risk_score}
          mq135={measurement.mq135_value}
          mq3={measurement.mq3_value}
        />

        <div className="space-y-3">
          <SectionHeader title={translate("explanationSection")} />
          <AIExplanation explanation={explanation} />
        </div>

        {doctorCta.show && <DoctorCTA variant={doctorCta.variant} />}

        {!doctorCta.show && measurement.risk_level !== "low" && (
          <WhenToSeeDoctorCard />
        )}

        <div className="space-y-3">
          <SectionHeader title={translate("tipsSection")} />
          <HealthTips tips={getHealthTips(locale)} />
        </div>
      </StaggerSection>

      <Button variant="secondary" className="w-full" asChild>
        <Link href="/dashboard">{translate("resultBackDashboard")}</Link>
      </Button>

      <DisclaimerBanner />
    </main>
  );
}
