"use client";

import { useState } from "react";
import { Activity, CircleHelp } from "lucide-react";
import { RiskMeter } from "@/components/shared/RiskMeter";
import { SensorEducationSheet } from "@/components/shared/SensorEducationSheet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RISK_LABELS } from "@/lib/constants";
import { formatRiskDeltaThai } from "@/lib/measurements/risk-delta";
import { formatRiskScoreDisplay } from "@/lib/sensor-labels";
import type { EducationContext } from "@/lib/sensors/sensor-education";
import type { RiskLevel } from "@/types/measurement";

interface RiskScoreCardProps {
  riskLevel: RiskLevel;
  riskScore: number;
  riskDelta?: number | null;
  showEducation?: boolean;
  educationContext?: EducationContext;
}

export function RiskScoreCard({
  riskLevel,
  riskScore,
  riskDelta,
  showEducation = true,
  educationContext = {},
}: RiskScoreCardProps) {
  const [educationOpen, setEducationOpen] = useState(false);

  const context: EducationContext = {
    ...educationContext,
    riskScore,
    riskLevelLabel: RISK_LABELS[riskLevel],
  };

  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between gap-2 text-sm font-medium text-[var(--text-secondary)]">
            <span className="flex items-center gap-2">
              <Activity
                className="h-4 w-4 text-accent-primary"
                strokeWidth={1.75}
              />
              คะแนนความเสี่ยง
            </span>
            {showEducation && (
              <button
                type="button"
                onClick={() => setEducationOpen(true)}
                className="shrink-0 rounded-full p-0.5 text-[var(--text-secondary)] hover:bg-surface hover:text-accent-primary"
                aria-label="อธิบายข้อมูลนี้"
              >
                <CircleHelp className="h-4 w-4" strokeWidth={1.75} />
              </button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-3xl font-semibold tabular-nums tracking-tight">
            {formatRiskScoreDisplay(riskScore)}
          </p>
          <RiskMeter riskScore={riskScore} riskLevel={riskLevel} />
          {riskDelta != null && (
            <p className="text-xs text-[var(--text-secondary)]">
              {formatRiskDeltaThai(riskDelta)}
            </p>
          )}
        </CardContent>
      </Card>

      {showEducation && (
        <SensorEducationSheet
          open={educationOpen}
          onOpenChange={setEducationOpen}
          topic="risk_score"
          context={context}
        />
      )}
    </>
  );
}
