"use client";

import { useEffect, useMemo, useState } from "react";
import { usePreferences } from "@/components/providers/PreferencesProvider";
import { PageSectionHeader } from "@/components/shared/PageSectionHeader";
import { SensorValueCard } from "@/components/shared/SensorValueCard";
import { buildInsightContextFactors } from "@/lib/ai-insight/context-factors";
import { getDefaultDemoRiskFactors } from "@/lib/mock/demo-user";
import { getRiskFactorsFromStorage } from "@/lib/profile/onboarding-storage";
import type { Measurement } from "@/types/measurement";

interface InsightContextSectionProps {
  latest: Measurement;
  measurements: Measurement[];
}

export function InsightContextSection({
  latest,
  measurements,
}: InsightContextSectionProps) {
  const { translate } = usePreferences();
  const [riskFactors, setRiskFactors] = useState(getDefaultDemoRiskFactors());

  useEffect(() => {
    setRiskFactors(getRiskFactorsFromStorage());
  }, []);

  const factors = useMemo(
    () =>
      buildInsightContextFactors({
        latest,
        measurements,
        riskFactors,
      }),
    [latest, measurements, riskFactors]
  );

  return (
    <section className="space-y-3">
      <PageSectionHeader
        title={translate("insightContextTitle")}
        subtitle={translate("insightContextSubtitle")}
      />
      <div className="grid grid-cols-2 gap-3">
        {factors.map((factor) => {
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
              statusLabel={factor.statusLabel}
              insightStatus={factor.status}
            />
          );
        })}
      </div>
    </section>
  );
}
