"use client";

import { CalendarCheck } from "lucide-react";
import { usePreferences } from "@/components/providers/PreferencesProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const gamificationCardClass =
  "app-card--pinned border-[var(--border-pinned)] bg-surface-elevated shadow-none";

interface Challenge14CardProps {
  challengeDays: boolean[];
}

export function Challenge14Card({ challengeDays }: Challenge14CardProps) {
  const { translate } = usePreferences();
  const completedCount = challengeDays.filter(Boolean).length;

  return (
    <Card className={cn("flex-1", gamificationCardClass)}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)]">
          <CalendarCheck
            className="h-4 w-4 text-accent-primary"
            strokeWidth={1.75}
          />
          {translate("challenge14Title")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-semibold tabular-nums tracking-tight">
          {completedCount}
          <span className="ml-1 text-base font-normal text-[var(--text-secondary)]">
            /{challengeDays.length} {translate("daysUnit")}
          </span>
        </p>
      </CardContent>
    </Card>
  );
}
