"use client";

import { Sparkles } from "lucide-react";
import { usePreferences } from "@/components/providers/PreferencesProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AIExplanationProps {
  explanation: string;
}

export function AIExplanation({ explanation }: AIExplanationProps) {
  const { translate } = usePreferences();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Sparkles className="h-4 w-4 text-accent-primary" />
          {translate("aiSummaryTitle")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-relaxed">{explanation}</p>
      </CardContent>
    </Card>
  );
}
