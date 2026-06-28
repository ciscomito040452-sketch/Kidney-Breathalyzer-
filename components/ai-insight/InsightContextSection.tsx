"use client";

import { useEffect, useMemo, useState } from "react";
import { InsightFactorCard } from "@/components/ai-insight/InsightFactorCard";
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
      <h2 className="text-base font-semibold">ข้อมูลที่ใช้วิเคราะห์</h2>
      <p className="text-xs text-[var(--text-secondary)]">
        จากเซนเซอร์ลมหายใจ ความถี่การใช้งานอุปกรณ์ และปัจจัยเสี่ยงที่คุณกรอกเอง
        — ไม่ใช่การวินิจฉัยโรค
      </p>
      {factors.map((factor) => (
        <InsightFactorCard key={factor.id} factor={factor} />
      ))}
    </section>
  );
}
