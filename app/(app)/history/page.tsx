import { HistoryPageClient } from "@/components/history/HistoryPageClient";
import { getDemoMeasurements } from "@/lib/mock/demo-store";

export default function HistoryPage() {
  const measurements = getDemoMeasurements();

  return <HistoryPageClient initialMeasurements={measurements} />;
}
