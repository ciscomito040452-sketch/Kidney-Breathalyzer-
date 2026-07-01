"use client";

import { SectionHeader, SummaryPageHeader } from "@/components/health";
import { DashboardHighlightsSection } from "@/components/dashboard/DashboardHighlightsSection";
import { DashboardMoreSection } from "@/components/dashboard/DashboardMoreSection";
import { DashboardPinnedSection } from "@/components/dashboard/DashboardPinnedSection";
import { WhenToSeeDoctorCard } from "@/components/shared/WhenToSeeDoctorCard";
import { DisclaimerBanner } from "@/components/layout/DisclaimerBanner";
import { StaggerSection } from "@/components/shared/StaggerSection";
import { usePreferences } from "@/components/providers/PreferencesProvider";
import type { TrendDirection } from "@/lib/ai-insight/analyze-measurements";
import type { DashboardInsight } from "@/lib/dashboard/build-dashboard-insight";
import type { DoctorCtaDecision } from "@/lib/dashboard/should-show-doctor-cta";
import type { UserStreaks } from "@/types/measurement";
import type { Measurement } from "@/types/measurement";

interface DashboardPageClientProps {
  latest: Measurement | undefined;
  measurements: Measurement[];
  gamification: UserStreaks;
  dashboardInsight: DashboardInsight | null;
  riskDelta: number | null;
  sparklineData: { date: string; risk_score: number }[];
  weeklyAvgScore: number;
  doctorCta: DoctorCtaDecision;
  ammoniaTrend?: TrendDirection;
}

export function DashboardPageClient({
  latest,
  measurements,
  gamification,
  dashboardInsight,
  riskDelta,
  sparklineData,
  doctorCta,
}: DashboardPageClientProps) {
  const { translate } = usePreferences();

  return (
    <main className="space-y-6 px-4 py-6">
      <SummaryPageHeader titleKey="summaryTitle" />

      {latest && (
        <StaggerSection className="space-y-6">
          <div className="space-y-3">
            <SectionHeader title={translate("pinnedSection")} />
            <DashboardPinnedSection
              latest={latest}
              riskDelta={riskDelta}
            />
          </div>

          <div className="space-y-3">
            <SectionHeader title={translate("highlightsSection")} />
            <DashboardHighlightsSection
              measurements={measurements}
              dashboardInsight={dashboardInsight}
              latest={latest}
              riskDelta={riskDelta}
              sparklineData={sparklineData}
              doctorCta={doctorCta}
            />
          </div>
        </StaggerSection>
      )}

      <div className="space-y-3">
        <SectionHeader title={translate("moreSection")} />
        <DashboardMoreSection
          lastMeasuredAt={latest?.measured_at ?? null}
          gamification={gamification}
        />
      </div>

      {latest && latest.risk_level !== "low" && !doctorCta.show && (
        <WhenToSeeDoctorCard />
      )}

      <DisclaimerBanner />
    </main>
  );
}
