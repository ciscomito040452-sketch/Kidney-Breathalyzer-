"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { HolisticInsightCard } from "@/components/ai-insight/HolisticInsightCard";
import { InsightContextSection } from "@/components/ai-insight/InsightContextSection";
import { TrendChart } from "@/components/dashboard/TrendChart";
import { DisclaimerBanner } from "@/components/layout/DisclaimerBanner";
import { PageSectionHeader } from "@/components/shared/PageSectionHeader";
import { AIInsightPageHeader } from "@/components/ai-insight/AIInsightPageHeader";
import { usePreferences } from "@/components/providers/PreferencesProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

  const trendData = measurements
    .slice()
    .reverse()
    .slice(-30)
    .map((m) => ({
      date: m.measured_at,
      mq135_value: m.mq135_value,
      mq3_value: m.mq3_value,
      risk_score: m.risk_score,
    }));

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
    <main className="space-y-6 px-4 py-6">
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

          <section className="space-y-3">
            <PageSectionHeader title={translate("insightTrendSection")} />
            <TrendChart
              data={trendData}
              title={translate("insightTrend30Title")}
              showDualLine
            />
            <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
              {insight.trendNarrative}
            </p>
          </section>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">
                {translate("researchNoteTitle")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
                {insight.researchNote}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">
                {translate("nextStepsTitle")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">
                {insight.suggestion}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">
                {translate("insightShortTips")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {healthTips.slice(0, 3).map((tip) => (
                  <li key={tip} className="flex items-start gap-2 text-sm">
                    <CheckCircle2
                      className="mt-0.5 h-4 w-4 shrink-0 text-accent-primary"
                      strokeWidth={2}
                    />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {latest && (
            <Button variant="secondary" className="w-full" asChild>
              <Link href={`/result/${latest.id}`}>
                {translate("viewLatestReport")}
              </Link>
            </Button>
          )}
        </>
      )}

      <DisclaimerBanner />
    </main>
  );
}
