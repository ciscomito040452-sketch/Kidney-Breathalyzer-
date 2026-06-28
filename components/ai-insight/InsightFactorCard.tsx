import type {
  InsightFactor,
  InsightFactorStatus,
} from "@/lib/ai-insight/context-factors";
import { cn } from "@/lib/utils";

const statusClasses: Record<InsightFactorStatus, string> = {
  good: "bg-risk-low/10 text-risk-low",
  moderate: "bg-risk-moderate/10 text-risk-moderate",
  low: "bg-risk-moderate/10 text-risk-moderate",
};

interface InsightFactorCardProps {
  factor: InsightFactor;
}

export function InsightFactorCard({ factor }: InsightFactorCardProps) {
  const Icon = factor.icon;

  return (
    <div className="flex items-center gap-3 rounded-xl border border-border-subtle bg-surface p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-primary/10">
        <Icon className="h-5 w-5 text-accent-primary" strokeWidth={1.75} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{factor.label}</p>
        <p className="text-xs text-[var(--text-secondary)]">{factor.value}</p>
      </div>
      <span
        className={cn(
          "shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium",
          statusClasses[factor.status]
        )}
      >
        {factor.statusLabel}
      </span>
    </div>
  );
}
