"use client";

import { useEffect, useMemo, useState } from "react";
import { InsightWideFactorCard } from "@/components/ai-insight/InsightWideFactorCard";
import { usePreferences } from "@/components/providers/PreferencesProvider";
import { PageSectionHeader } from "@/components/shared/PageSectionHeader";
import { SensorValueCard } from "@/components/shared/SensorValueCard";
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
      <PageSectionHeader
        title={translate("insightContextTitle")}
        subtitle={translate("insightContextSubtitle")}
      />
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          {compactFactors.map((factor) => {
            const Icon = factor.icon;
            return (
              <SensorValueCard
                key={factor.id}
                className="min-w-0"
                icon={
                  <Icon
                    className="h-4 w-4 shrink-0 text-accent-primary"
                    strokeWidth={1.75}
                  />
                }
                label={factor.label}
                value={factor.value}
                listItems={factor.listItems}
                statusLabel={factor.statusLabel}
                insightStatus={factor.status}
              />
            );
          })}
        </div>
        {wideFactors.map((factor) => (
          <InsightWideFactorCard key={factor.id} factor={factor} />
        ))}
      </div>
    </section>
  );
}
