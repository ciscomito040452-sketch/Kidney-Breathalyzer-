"use client";

import { CheckCircle2 } from "lucide-react";
import { usePreferences } from "@/components/providers/PreferencesProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface HealthTipsProps {
  tips: readonly string[];
}

export function HealthTips({ tips }: HealthTipsProps) {
  const { translate } = usePreferences();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          {translate("healthTipsTitle")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {tips.map((tip) => (
            <li key={tip} className="flex items-start gap-2 text-sm">
              <CheckCircle2
                className="mt-0.5 h-4 w-4 shrink-0 text-accent-primary"
                strokeWidth={2}
              />
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
