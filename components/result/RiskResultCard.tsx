import { RiskBadge } from "@/components/shared/RiskBadge";
import { SensorChipRow } from "@/components/shared/SensorChipRow";
import { riskHeroCardClasses } from "@/lib/risk-engine/risk-level";
import { formatRiskScoreDisplay } from "@/lib/sensor-labels";
import { cn } from "@/lib/utils";
import type { RiskLevel } from "@/types/measurement";

interface RiskResultCardProps {
  riskLevel: RiskLevel;
  riskScore: number;
  mq135: number;
  mq3: number;
}

export function RiskResultCard({
  riskLevel,
  riskScore,
  mq135,
  mq3,
}: RiskResultCardProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border p-6 shadow-card",
        riskHeroCardClasses(riskLevel)
      )}
    >
      <RiskBadge level={riskLevel} />
      <p className="mt-4 text-[32px] font-semibold tabular-nums tracking-tight">
        {formatRiskScoreDisplay(riskScore)}
      </p>
      <p className="mt-0.5 text-sm text-[var(--text-secondary)]">
        คะแนนความเสี่ยง
      </p>
      <div className="mt-5 border-t border-border-subtle/60 pt-4">
        <SensorChipRow mq135={mq135} mq3={mq3} compact />
      </div>
    </div>
  );
}
