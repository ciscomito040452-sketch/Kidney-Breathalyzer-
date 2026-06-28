"use client";

import { TabPageHeader } from "@/components/shared/TabPageHeader";
import { usePreferences } from "@/components/providers/PreferencesProvider";

export function AIInsightPageHeader() {
  const { translate } = usePreferences();

  return (
    <TabPageHeader
      title={translate("insightTitle")}
      subtitle={translate("insightSubtitle")}
    />
  );
}
