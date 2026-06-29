"use client";

import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import { formatRiskDelta } from "@/lib/i18n/labels";
import { usePreferences } from "@/components/providers/PreferencesProvider";
import { cn } from "@/lib/utils";

interface TrendDeltaBadgeProps {
  delta: number | null | undefined;
  className?: string;
}

export function TrendDeltaBadge({ delta, className }: TrendDeltaBadgeProps) {
  const { locale } = usePreferences();

  if (delta == null) return null;

  const isUp = delta > 3;
  const isDown = delta < -3;
  const Icon = isUp ? TrendingUp : isDown ? TrendingDown : Minus;

  return (
    <span
      className={cn(
        "kb-pop-in inline-flex items-center gap-1 rounded-full bg-surface-elevated px-2.5 py-1 text-xs font-medium text-[var(--text-secondary)] ring-1 ring-border-subtle",
        className
      )}
      style={{ animationDelay: "180ms" }}
    >
      <Icon className="h-3.5 w-3.5 shrink-0" strokeWidth={2} aria-hidden />
      {formatRiskDelta(locale, delta)}
    </span>
  );
}
