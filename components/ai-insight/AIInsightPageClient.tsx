"use client";

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { InsightContextSection } from "@/components/ai-insight/InsightContextSection";
import { TrendChart } from "@/components/dashboard/TrendChart";
import { DisclaimerBanner } from "@/components/layout/DisclaimerBanner";
import { PageSectionHeader } from "@/components/shared/PageSectionHeader";
import { RiskScoreCard } from "@/components/shared/RiskScoreCard";
import { AIInsightPageHeader } from "@/components/ai-insight/AIInsightPageHeader";
import { usePreferences } from "@/components/providers/PreferencesProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatInsightTrendMessage, getSensorUILabels } from "@/lib/i18n/labels";
import { getHealthTips } from "@/lib/risk-engine";
import { formatDateTimeLocale } from "@/lib/utils";
import type { Measurement } from "@/types/measurement";

interface AIInsightPageClientProps {
  measurements: Measurement[];
}

export function AIInsightPageClient({
  measurements,
}: AIInsightPageClientProps) {
  const { locale, translate } = usePreferences();
  const latest = measurements[0];
  const sensorUi = getSensorUILabels(locale);

  const last7 = measurements.filter((m) => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 7);
    return new Date(m.measured_at) >= cutoff;
  });

  const avgMq135 =
    last7.length > 0
      ? last7.reduce((s, m) => s + m.mq135_value, 0) / last7.length
      : 0;

  const trendPercent =
    latest && avgMq135 > 0
      ? ((latest.mq135_value - avgMq135) / avgMq135) * 100
      : 0;

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

  const ammoniaName = sensorUi.ammonia.label.split(" ")[0];
  const trendMessage = formatInsightTrendMessage(
    locale,
    ammoniaName,
    trendPercent
  );

  const healthTips = getHealthTips(locale);

  return (
    <main className="space-y-6 px-4 py-6">
      <AIInsightPageHeader />

      {!latest ? (
        <Card>
          <CardContent className="py-8 text-center text-sm text-[var(--text-secondary)]">
            {translate("noMeasurementData")}
          </CardContent>
        </Card>
      ) : (
        <>
          <section className="space-y-3">
            <PageSectionHeader
              title={translate("insightLatestTitle")}
              subtitle={formatDateTimeLocale(locale, latest.measured_at)}
            />
            <RiskScoreCard
              riskLevel={latest.risk_level}
              riskScore={latest.risk_score}
            />
            <Card>
              <CardContent className="pt-4">
                <p className="text-sm leading-relaxed">
                  {latest.ai_explanation}
                </p>
              </CardContent>
            </Card>
          </section>

          <InsightContextSection latest={latest} measurements={measurements} />

          <section className="space-y-3">
            <PageSectionHeader title={translate("insightTrendSection")} />
            <TrendChart
              data={trendData}
              title={translate("insightTrend30Title")}
              showDualLine
            />
            <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
              {trendMessage}
            </p>
          </section>

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

          <Button className="w-full" asChild>
            <Link href={`/result/${latest.id}`}>
              {translate("viewFullReport")}
            </Link>
          </Button>
        </>
      )}

      <DisclaimerBanner />
    </main>
  );
}
