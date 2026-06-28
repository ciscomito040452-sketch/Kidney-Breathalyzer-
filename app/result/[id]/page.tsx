import { notFound } from "next/navigation";
import { ResultPageClient } from "@/components/result/ResultPageClient";
import { getServerLocale } from "@/lib/i18n/server-locale";
import { getDemoMeasurementById, getDemoMeasurements } from "@/lib/mock/demo-store";
import { getEffectiveRiskFactors } from "@/lib/profile/effective-risk-factors";
import { buildResultExplanation } from "@/lib/result/build-result-explanation";

interface ResultPageProps {
  params: { id: string };
}

export default function ResultPage({ params }: ResultPageProps) {
  const locale = getServerLocale();
  const riskFactors = getEffectiveRiskFactors();
  const measurements = getDemoMeasurements(riskFactors);
  const measurement = getDemoMeasurementById(params.id, riskFactors);

  if (!measurement) {
    notFound();
  }

  const explanation = buildResultExplanation({
    measurement,
    measurements,
    riskFactors,
    locale,
  });

  return (
    <ResultPageClient
      measurement={measurement}
      explanation={explanation}
      measurements={measurements}
    />
  );
}
