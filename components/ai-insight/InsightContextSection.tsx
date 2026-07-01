"use client";

import { useEffect, useMemo, useState } from "react";
import { InsightWideFactorCard } from "@/components/ai-insight/InsightWideFactorCard";
import {
  HealthGroupedCard,
  HealthGroupedDivider,
  HealthListRow,
  SectionHeader,
} from "@/components/health";
import { usePreferences } from "@/components/providers/PreferencesProvider";
import { buildInsightContextFactors } from "@/lib/ai-insight/context-factors";
import { getDefaultDemoRiskFactors } from "@/lib/mock/demo-user";
import { getRiskFactorsFromStorage } from "@/lib/profile/onboarding-storage";
import type { Measurement } from "@/types/measurement";

interface InsightContextSectionProps {
  measurements: Measurement[];
}

export function InsightContextSection({
  measurements,
}: InsightContextSectionProps) {
  const { locale, translate } = usePreferences();
  const [riskFactors, setRiskFactors] = useState(getDefaultDemoRiskFactors());

  useEffect(() => {
    setRiskFactors(getRiskFactorsFromStorage());
  }, []);

  const factors = useMemo(
    () =>
      buildInsightContextFactors({
        measurements,
        riskFactors,
        locale,
      }),
    [measurements, riskFactors, locale]
  );

  const compactFactors = factors.filter((factor) => factor.layout !== "wide");
  const wideFactors = factors.filter((factor) => factor.layout === "wide");

  return (
    <section className="space-y-3">
      <SectionHeader
        title={translate("insightContextTitle")}
        action={
          <span className="max-w-[45%] text-right text-pinned-caption text-[var(--text-secondary)]">
            {translate("insightContextSubtitle")}
          </span>
        }
      />

      <HealthGroupedCard>
        {compactFactors.map((factor, index) => {
          const Icon = factor.icon;
          const detail = [factor.value, factor.statusLabel]
            .filter(Boolean)
            .join(" · ");
          return (
            <div key={factor.id}>
              {index > 0 && <HealthGroupedDivider />}
              <HealthListRow
                icon={Icon}
                title={factor.label}
                detail={detail || factor.detail}
                showChevron={false}
                trailing={
                  factor.listItems && factor.listItems.length > 0 ? (
                    <span className="text-xs text-[var(--text-secondary)]">
                      {factor.listItems.length}
                    </span>
                  ) : undefined
                }
              />
            </div>
          );
        })}
      </HealthGroupedCard>

      {wideFactors.map((factor) => (
        <InsightWideFactorCard key={factor.id} factor={factor} />
      ))}
    </section>
  );
}
