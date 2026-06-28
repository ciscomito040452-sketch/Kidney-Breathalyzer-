import { AIInsightPageClient } from "@/components/ai-insight/AIInsightPageClient";
import { getDemoMeasurements } from "@/lib/mock/demo-store";
import { getEffectiveRiskFactors } from "@/lib/profile/effective-risk-factors";

export default function AIInsightPage() {
  const measurements = getDemoMeasurements(getEffectiveRiskFactors());

  return <AIInsightPageClient measurements={measurements} />;
}
