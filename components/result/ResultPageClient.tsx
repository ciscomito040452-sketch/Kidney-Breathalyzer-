"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ScreeningHeroSummary } from "@/components/dashboard/ScreeningHeroSummary";
import { AIExplanation } from "@/components/result/AIExplanation";
import { DoctorCTA } from "@/components/result/DoctorCTA";
import { HealthTips } from "@/components/result/HealthTips";
import { RiskResultCard } from "@/components/result/RiskResultCard";
import { WhenToSeeDoctorCard } from "@/components/shared/WhenToSeeDoctorCard";
import { DisclaimerBanner } from "@/components/layout/DisclaimerBanner";
import { StaggerSection } from "@/components/shared/StaggerSection";
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
    <main className="space-y-4 px-4 py-6 pb-10">
      <header>
        <Link
          href="/history"
          className="mb-3 inline-flex items-center gap-1.5 text-sm text-accent-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          {translate("resultBackToHistory")}
        </Link>
      </header>

      <StaggerSection className="space-y-4">
        <ScreeningHeroSummary
          riskLevel={measurement.risk_level}
          riskScore={measurement.risk_score}
          measuredAt={measurement.measured_at}
        />

        <RiskResultCard
          compact
          riskLevel={measurement.risk_level}
          riskScore={measurement.risk_score}
          mq135={measurement.mq135_value}
          mq3={measurement.mq3_value}
        />

        <AIExplanation explanation={explanation} />

        {doctorCta.show && <DoctorCTA variant={doctorCta.variant} />}

        {!doctorCta.show && measurement.risk_level !== "low" && (
          <WhenToSeeDoctorCard />
        )}

        <HealthTips tips={getHealthTips(locale)} />
      </StaggerSection>

      <Button variant="secondary" className="w-full" asChild>
        <Link href="/dashboard">{translate("resultBackDashboard")}</Link>
      </Button>

      <DisclaimerBanner />
    </main>
  );
}
