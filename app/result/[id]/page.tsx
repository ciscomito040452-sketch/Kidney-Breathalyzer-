import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { AIExplanation } from "@/components/result/AIExplanation";
import { DoctorCTA } from "@/components/result/DoctorCTA";
import { HealthTips } from "@/components/result/HealthTips";
import { RiskResultCard } from "@/components/result/RiskResultCard";
import { DisclaimerBanner } from "@/components/layout/DisclaimerBanner";
import { Button } from "@/components/ui/button";
import { HEALTH_TIPS } from "@/lib/risk-engine";
import { getDemoMeasurementById } from "@/lib/mock/demo-store";
import { getEffectiveRiskFactors } from "@/lib/profile/effective-risk-factors";
import { formatDateTimeThai } from "@/lib/utils";

interface ResultPageProps {
  params: { id: string };
}

export default function ResultPage({ params }: ResultPageProps) {
  const measurement = getDemoMeasurementById(
    params.id,
    getEffectiveRiskFactors()
  );

  if (!measurement) {
    notFound();
  }

  return (
    <main className="min-h-screen space-y-6 px-4 py-6 pb-10">
      <header>
        <Link
          href="/history"
          className="mb-3 inline-flex items-center gap-1.5 text-sm text-accent-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          ผลการวัด
        </Link>
        <p className="text-sm text-[var(--text-secondary)]">
          {formatDateTimeThai(measurement.measured_at)}
        </p>
      </header>

      <RiskResultCard
        riskLevel={measurement.risk_level}
        riskScore={measurement.risk_score}
        mq135={measurement.mq135_value}
        mq3={measurement.mq3_value}
      />

      <AIExplanation explanation={measurement.ai_explanation} />

      <HealthTips tips={HEALTH_TIPS} />

      {measurement.risk_level === "high" && <DoctorCTA />}

      <Button variant="secondary" className="w-full" asChild>
        <Link href="/dashboard">กลับหน้าหลัก</Link>
      </Button>

      <DisclaimerBanner />
    </main>
  );
}
