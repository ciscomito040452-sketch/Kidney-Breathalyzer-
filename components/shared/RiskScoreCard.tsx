import { Activity } from "lucide-react";
import { RiskIndicator } from "@/components/shared/RiskIndicator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatRiskDeltaThai } from "@/lib/measurements/risk-delta";
import { formatRiskScoreDisplay } from "@/lib/sensor-labels";
import type { RiskLevel } from "@/types/measurement";

interface RiskScoreCardProps {
  riskLevel: RiskLevel;
  riskScore: number;
  riskDelta?: number | null;
}

export function RiskScoreCard({
  riskLevel,
  riskScore,
  riskDelta,
}: RiskScoreCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)]">
          <Activity
            className="h-4 w-4 text-accent-primary"
            strokeWidth={1.75}
          />
          คะแนนความเสี่ยง
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-3xl font-semibold tabular-nums tracking-tight">
          {formatRiskScoreDisplay(riskScore)}
        </p>
        <RiskIndicator level={riskLevel} />
        {riskDelta != null && (
          <p className="text-xs text-[var(--text-secondary)]">
            {formatRiskDeltaThai(riskDelta)}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
