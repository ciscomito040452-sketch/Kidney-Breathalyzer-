"use client";

import { Sparkles } from "lucide-react";
import { StaggerSection } from "@/components/shared/StaggerSection";
import { usePreferences } from "@/components/providers/PreferencesProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { parseExplanationBullets } from "@/lib/result/parse-explanation-bullets";

interface AIExplanationProps {
  explanation: string;
}

export function AIExplanation({ explanation }: AIExplanationProps) {
  const { translate } = usePreferences();
  const bullets = parseExplanationBullets(explanation);

  return (
    <Card className="kb-fade-up">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Sparkles className="h-4 w-4 text-accent-primary" />
          {translate("aiSummaryTitle")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <StaggerSection className="space-y-3" stagger>
          {bullets.map((bullet) => (
            <div
              key={bullet}
              className="flex gap-2.5 text-sm leading-relaxed text-[var(--text-primary)]"
            >
              <span
                className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-primary"
                aria-hidden
              />
              <span>{bullet}</span>
            </div>
          ))}
        </StaggerSection>
      </CardContent>
    </Card>
  );
}
