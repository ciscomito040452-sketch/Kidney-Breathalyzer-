"use client";

import { Flame } from "lucide-react";
import { usePreferences } from "@/components/providers/PreferencesProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StreakCardProps {
  currentStreak: number;
}

export function StreakCard({ currentStreak }: StreakCardProps) {
  const { translate } = usePreferences();

  return (
    <Card className="flex-1">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)]">
          <Flame className="h-4 w-4 text-accent-primary" strokeWidth={1.75} />
          {translate("streakStatTitle")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-semibold tabular-nums tracking-tight">
          {currentStreak}
          <span className="ml-1 text-base font-normal text-[var(--text-secondary)]">
            {translate("daysUnit")}
          </span>
        </p>
      </CardContent>
    </Card>
  );
}
