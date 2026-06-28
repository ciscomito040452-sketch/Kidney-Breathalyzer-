import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { InsightContextSection } from "@/components/ai-insight/InsightContextSection";
import { TrendChart } from "@/components/dashboard/TrendChart";
import { DisclaimerBanner } from "@/components/layout/DisclaimerBanner";
import { PageSectionHeader } from "@/components/shared/PageSectionHeader";
import { RiskScoreCard } from "@/components/shared/RiskScoreCard";
import { AIInsightPageHeader } from "@/components/ai-insight/AIInsightPageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HEALTH_TIPS } from "@/lib/risk-engine";
import { getDemoMeasurements } from "@/lib/mock/demo-store";
import { getEffectiveRiskFactors } from "@/lib/profile/effective-risk-factors";
import { SENSOR_UI } from "@/lib/sensor-labels";
import { formatDateTimeThai } from "@/lib/utils";

export default function AIInsightPage() {
  const measurements = getDemoMeasurements(getEffectiveRiskFactors());
  const latest = measurements[0];
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

  const ammoniaName = SENSOR_UI.ammonia.label.split(" ")[0];
  const trendMessage =
    Math.abs(trendPercent) < 5
      ? `ค่า${ammoniaName}อยู่ในแนวโน้มใกล้เคียงค่าเฉลี่ย 7 วันของคุณ`
      : trendPercent > 0
        ? `ค่า${ammoniaName}สูงกว่าค่าเฉลี่ยของคุณ ${Math.round(trendPercent)}% ในช่วง 7 วันที่ผ่านมา`
        : `ค่า${ammoniaName}ต่ำกว่าค่าเฉลี่ยของคุณ ${Math.round(Math.abs(trendPercent))}% ในช่วง 7 วันที่ผ่านมา`;

  return (
    <main className="space-y-6 px-4 py-6">
      <AIInsightPageHeader />

      {!latest ? (
        <Card>
          <CardContent className="py-8 text-center text-sm text-[var(--text-secondary)]">
            ยังไม่มีข้อมูลการวัด
          </CardContent>
        </Card>
      ) : (
        <>
          <section className="space-y-3">
            <PageSectionHeader
              title="ผลล่าสุด"
              subtitle={formatDateTimeThai(latest.measured_at)}
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
            <PageSectionHeader title="แนวโน้ม" />
            <TrendChart
              data={trendData}
              title="แนวโน้ม 30 วัน"
              showDualLine
            />
            <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
              {trendMessage}
            </p>
          </section>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">คำแนะนำสั้น ๆ</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {HEALTH_TIPS.slice(0, 3).map((tip) => (
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
            <Link href={`/result/${latest.id}`}>ดูรายงานฉบับเต็ม</Link>
          </Button>
        </>
      )}

      <DisclaimerBanner />
    </main>
  );
}
