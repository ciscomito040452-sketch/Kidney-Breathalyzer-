import { HistoryPageClient } from "@/components/history/HistoryPageClient";
import { getDemoMeasurements } from "@/lib/mock/demo-store";
import { getEffectiveRiskFactors } from "@/lib/profile/effective-risk-factors";

export default function HistoryPage() {
  const measurements = getDemoMeasurements(getEffectiveRiskFactors());

  return <HistoryPageClient initialMeasurements={measurements} />;
}
