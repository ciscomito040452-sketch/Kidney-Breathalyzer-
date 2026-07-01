"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { TrendingUp } from "lucide-react";
import { DashboardInsightCard } from "@/components/dashboard/DashboardInsightCard";
import { IOSSegmentedControl } from "@/components/health/IOSSegmentedControl";
import { PinnedHealthCard } from "@/components/health/PinnedHealthCard";
import { SparklineMini } from "@/components/health/SparklineMini";
import { DoctorCTA } from "@/components/result/DoctorCTA";
import { usePreferences } from "@/components/providers/PreferencesProvider";
import { DASHBOARD_TREND_DAY_OPTIONS, type DashboardTrendDays } from "@/lib/constants";
import type { DashboardInsight } from "@/lib/dashboard/build-dashboard-insight";
import type { DoctorCtaDecision } from "@/lib/dashboard/should-show-doctor-cta";
import { scorePercent } from "@/lib/risk-engine/risk-zones";
import type { Measurement } from "@/types/measurement";

interface DashboardHighlightsSectionProps {
  measurements: Measurement[];
  dashboardInsight: DashboardInsight | null;
  latest: Measurement;
  riskDelta: number | null;
  sparklineData: { date: string; risk_score: number }[];
  doctorCta: DoctorCtaDecision;
}

export function DashboardHighlightsSection({
  measurements,
  dashboardInsight,
  latest,
  sparklineData,
  doctorCta,
}: DashboardHighlightsSectionProps) {
  const { translate } = usePreferences();
  const [days, setDays] = useState<DashboardTrendDays>(7);

  const trendSparkline = useMemo(() => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return measurements
      .filter((m) => new Date(m.measured_at) >= cutoff)
      .slice()
      .reverse()
      .map((m) => ({ value: scorePercent(m.risk_score) }));
  }, [measurements, days]);

  const trendSummary =
    trendSparkline.length >= 2
      ? translate("trendTitle").replace("{n}", String(days))
      : translate("chartNoData");

  return (
    <section className="space-y-3">
      <Link href="/history" className="block">
        <PinnedHealthCard
          icon={TrendingUp}
          category={translate("trendInsightTitle")}
          timeLabel={translate("viewHistoryTrend")}
          headline={trendSummary}
          caption={translate("trendInsightSubtitle")}
          visual={
            <SparklineMini
              data={trendSparkline}
              stroke="var(--metric-screening)"
            />
          }
        />
      </Link>

      <div className="px-1">
        <IOSSegmentedControl
          options={DASHBOARD_TREND_DAY_OPTIONS}
          value={days}
          onChange={setDays}
          formatLabel={(d) => translate("trendDays").replace("{n}", String(d))}
        />
      </div>

      {dashboardInsight && (
        <DashboardInsightCard
          insight={dashboardInsight}
          riskScore={latest.risk_score}
          riskLevel={latest.risk_level}
          resultId={latest.id}
          sparklineData={sparklineData}
          qualitativeFirst
        />
      )}

      {doctorCta.show && (
        <DoctorCTA variant={doctorCta.variant} className="rounded-2xl" />
      )}
    </section>
  );
}
