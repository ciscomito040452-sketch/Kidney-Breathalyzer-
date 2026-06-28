"use client";

import type { InsightFactor, InsightFactorStatus } from "@/lib/ai-insight/context-factors";
import { InsightIconBadge } from "@/components/ai-insight/insight-ui";
import { cn } from "@/lib/utils";

const statusPillClass: Record<InsightFactorStatus, string> = {
  good: "text-[var(--text-secondary)] ring-1 ring-border-subtle",
  moderate: "bg-accent-primary/12 text-accent-primary",
  low: "bg-accent-primary/12 text-accent-primary",
};

const iconToneById: Record<
  string,
  "accent" | "good" | "attention" | "neutral"
> = {
  "measurement-frequency": "accent",
  "risk-factors": "accent",
};

interface InsightWideFactorCardProps {
  factor: InsightFactor;
}

export function InsightWideFactorCard({ factor }: InsightWideFactorCardProps) {
  const Icon = factor.icon;

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--surface-card-border)] bg-surface shadow-card app-card">
      <div className="flex items-center gap-3.5 px-4 py-4">
        <InsightIconBadge
          icon={Icon}
          tone={iconToneById[factor.id] ?? "accent"}
          size="sm"
        />
        <div className="min-w-0 flex-1">
          <p className="text-sm text-[var(--text-secondary)]">{factor.label}</p>
          {factor.listItems && factor.listItems.length > 0 ? (
            <ul className="mt-2 space-y-2" aria-label={factor.label}>
              {factor.listItems.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-sm leading-snug text-[var(--text-primary)]"
                >
                  <span
                    className="mt-[0.45rem] h-1.5 w-1.5 shrink-0 rounded-full bg-accent-primary"
                    aria-hidden
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <>
              <p className="mt-0.5 text-xl font-semibold tabular-nums tracking-tight text-[var(--text-primary)]">
                {factor.value}
              </p>
              {factor.detail && (
                <p className="mt-1 text-sm text-[var(--text-secondary)]">
                  {factor.detail}
                </p>
              )}
            </>
          )}
        </div>
        {factor.statusLabel && (
          <span
            className={cn(
              "shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium",
              statusPillClass[factor.status]
            )}
          >
            {factor.statusLabel}
          </span>
        )}
      </div>
    </div>
  );
}
