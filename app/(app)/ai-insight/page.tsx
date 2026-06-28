import Link from "next/link";
import { Sparkles } from "lucide-react";
import { InsightContextSection } from "@/components/ai-insight/InsightContextSection";
import { TrendChart } from "@/components/dashboard/TrendChart";
import { DisclaimerBanner } from "@/components/layout/DisclaimerBanner";
import { RiskBadge } from "@/components/shared/RiskBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HEALTH_TIPS } from "@/lib/risk-engine";
import { getDemoMeasurements } from "@/lib/mock/demo-store";
import { formatRiskScoreDisplay, SENSOR_UI } from "@/lib/sensor-labels";
import { formatDateTimeThai } from "@/lib/utils";

export default function AIInsightPage() {
  const measurements = getDemoMeasurements();
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
      <header>
        <h1 className="flex items-center gap-2 text-xl font-semibold">
          <Sparkles className="h-5 w-5 text-accent-primary" />
          ข้อมูลเชิงลึกจาก AI
        </h1>
        <p className="text-sm text-[var(--text-secondary)]">
          การวิเคราะห์เบื้องต้นจากข้อมูลการวัด
        </p>
      </header>

      {!latest ? (
        <Card>
          <CardContent className="py-8 text-center text-sm text-[var(--text-secondary)]">
            ยังไม่มีข้อมูลการวัด
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">ผลล่าสุด</CardTitle>
                <RiskBadge level={latest.risk_level} />
              </div>
              <p className="text-xs text-[var(--text-secondary)]">
                {formatDateTimeThai(latest.measured_at)}
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-3xl font-semibold tabular-nums">
                {formatRiskScoreDisplay(latest.risk_score)}
              </p>
              <p className="text-sm leading-relaxed">
                {latest.ai_explanation}
              </p>
            </CardContent>
          </Card>

          <InsightContextSection latest={latest} measurements={measurements} />

          <Card>
            <CardHeader>
              <CardTitle className="text-base">เปรียบเทียบ 7 วัน</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">{trendMessage}</p>
            </CardContent>
          </Card>

          <TrendChart
            data={trendData}
            title="แนวโน้ม 30 วัน"
            showDualLine
          />

          <Card>
            <CardHeader>
              <CardTitle className="text-base">คำแนะนำสั้น ๆ</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-inside list-disc space-y-1 text-sm">
                {HEALTH_TIPS.slice(0, 3).map((tip) => (
                  <li key={tip}>{tip}</li>
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
