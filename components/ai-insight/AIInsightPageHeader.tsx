"use client";

import { SummaryPageHeader } from "@/components/health/SummaryPageHeader";

export function AIInsightPageHeader() {
  return (
    <SummaryPageHeader
      titleKey="insightTitle"
      subtitleKey="insightSubtitle"
      showGreeting={false}
    />
  );
}
