"use client";

import { usePreferences } from "@/components/providers/PreferencesProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface WeeklyGoalCardProps {
  count: number;
  target: number;
}

export function WeeklyGoalCard({ count, target }: WeeklyGoalCardProps) {
  const { translate } = usePreferences();
  const met = count >= target;
  const displayCount = met ? target : count;
  const progressPercent = Math.min(100, (count / target) * 100);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-[var(--text-secondary)]">
          {translate("weeklyGoalTitle")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-2xl font-semibold tabular-nums">
          {displayCount}/{target}
          <span className="ml-1 text-base font-normal text-[var(--text-secondary)]">
            {translate("timesUnit")}
          </span>
        </p>
        {met && (
          <p className="text-xs text-accent-primary">{translate("goalMet")}</p>
        )}
        <Progress
          value={progressPercent}
          aria-label={translate("weeklyGoalTitle")}
        />
      </CardContent>
    </Card>
  );
}
