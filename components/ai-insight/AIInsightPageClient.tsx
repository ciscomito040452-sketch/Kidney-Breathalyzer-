"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import { HolisticInsightCard } from "@/components/ai-insight/HolisticInsightCard";
import { HolisticTrendSection } from "@/components/ai-insight/HolisticTrendSection";
import { InsightContextSection } from "@/components/ai-insight/InsightContextSection";
import { InsightWellnessTipsCard } from "@/components/ai-insight/InsightWellnessTipsCard";
import { DisclaimerBanner } from "@/components/layout/DisclaimerBanner";
import { AIInsightPageHeader } from "@/components/ai-insight/AIInsightPageHeader";
import { usePreferences } from "@/components/providers/PreferencesProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { buildHolisticInsight } from "@/lib/ai-insight/build-holistic-insight";
import { getDefaultDemoRiskFactors } from "@/lib/mock/demo-user";
import { getRiskFactorsFromStorage } from "@/lib/profile/onboarding-storage";
import { getHealthTips } from "@/lib/risk-engine";
import type { Measurement } from "@/types/measurement";

interface AIInsightPageClientProps {
  measurements: Measurement[];
}

export function AIInsightPageClient({
  measurements,
}: AIInsightPageClientProps) {
  const { locale, translate } = usePreferences();
  const [riskFactors, setRiskFactors] = useState(getDefaultDemoRiskFactors());
  const latest = measurements[0];

  useEffect(() => {
    setRiskFactors(getRiskFactorsFromStorage());
  }, []);

  const insight = useMemo(
    () =>
      buildHolisticInsight({
        measurements,
        riskFactors,
        locale,
      }),
    [measurements, riskFactors, locale]
  );

  const sparklineData = measurements
    .slice()
    .reverse()
    .slice(-14)
    .map((m) => ({
      date: m.measured_at,
      risk_score: m.risk_score,
    }));

  const healthTips = getHealthTips(locale);

  return (
    <main className="space-y-6 px-4 py-6 pb-8">
      <AIInsightPageHeader />

      {!insight ? (
        <Card>
          <CardContent className="py-8 text-center text-sm text-[var(--text-secondary)]">
            {translate("noMeasurementData")}
          </CardContent>
        </Card>
      ) : (
        <>
          <HolisticInsightCard
            insight={insight}
            sparklineData={sparklineData}
          />

          <InsightContextSection measurements={measurements} />

          <HolisticTrendSection measurements={measurements} insight={insight} />

          <InsightWellnessTipsCard tips={healthTips} />

          {latest && (
            <Button variant="secondary" className="h-12 w-full gap-2" asChild>
              <Link href={`/result/${latest.id}`}>
                {translate("viewLatestReport")}
                <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
              </Link>
            </Button>
          )}
        </>
      )}

      <DisclaimerBanner />
    </main>
  );
}
