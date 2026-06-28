import { AppLogo } from "@/components/shared/AppLogo";
import { RiskBadge } from "@/components/shared/RiskBadge";
import { SensorChipRow } from "@/components/shared/SensorChipRow";
import { formatRiskDeltaThai } from "@/lib/measurements/risk-delta";
import {
  riskHeroCardClasses,
  riskHeroGlowClasses,
} from "@/lib/risk-engine/risk-level";
import { formatRiskScoreDisplay } from "@/lib/sensor-labels";
import { cn } from "@/lib/utils";
import type { RiskLevel } from "@/types/measurement";

interface RiskHeroCardProps {
  riskLevel: RiskLevel;
  riskScore: number;
  mq135: number;
  mq3: number;
  riskDelta?: number | null;
}

export function RiskHeroCard({
  riskLevel,
  riskScore,
  mq135,
  mq3,
  riskDelta,
}: RiskHeroCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border p-6 shadow-card",
        riskHeroCardClasses(riskLevel)
      )}
    >
      <div className="relative z-10">
        <div className="flex items-start gap-3">
          <AppLogo size={48} className="h-12 w-12 shrink-0 shadow-none" />
          <div className="min-w-0 flex-1">
            <RiskBadge level={riskLevel} />
            <p className="mt-3 text-[32px] font-semibold leading-tight tabular-nums tracking-tight">
              {formatRiskScoreDisplay(riskScore)}
            </p>
            <p className="mt-0.5 text-sm text-[var(--text-secondary)]">
              คะแนนความเสี่ยงล่าสุด
            </p>
            {riskDelta != null && (
              <p className="mt-1 text-xs text-[var(--text-secondary)]">
                {formatRiskDeltaThai(riskDelta)}
              </p>
            )}
          </div>
        </div>

        <div className="mt-5 border-t border-border-subtle/60 pt-4">
          <SensorChipRow mq135={mq135} mq3={mq3} compact />
        </div>
      </div>

      <div
        className={cn(
          "pointer-events-none absolute -right-6 -top-6 h-32 w-32 rounded-full bg-gradient-to-br blur-2xl",
          riskHeroGlowClasses(riskLevel)
        )}
        aria-hidden
      />
    </div>
  );
}
