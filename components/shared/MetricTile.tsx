"use client";

import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import { SensorEducationSheet } from "@/components/shared/SensorEducationSheet";
import { SensorStatusPill } from "@/components/shared/SensorStatusPill";
import { usePreferences } from "@/components/providers/PreferencesProvider";
import type { EducationContext, EducationTopic } from "@/lib/sensors/sensor-education";
import type { SensorStatus } from "@/lib/sensors/status";
import type { TrendDirection } from "@/lib/ai-insight/analyze-measurements";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface MetricTileProps {
  icon: LucideIcon;
  label: string;
  value: number | string;
  unit?: string;
  status?: SensorStatus;
  trend?: TrendDirection;
  educationTopic?: EducationTopic;
  educationContext?: EducationContext;
  animationDelay?: number;
  className?: string;
}

export function MetricTile({
  icon: Icon,
  label,
  value,
  unit,
  status,
  trend,
  educationTopic,
  educationContext,
  animationDelay = 0,
  className,
}: MetricTileProps) {
  const { translate } = usePreferences();
  const [educationOpen, setEducationOpen] = useState(false);

  const TrendIcon =
    trend === "rising"
      ? TrendingUp
      : trend === "falling"
        ? TrendingDown
        : trend === "stable"
          ? Minus
          : null;

  const content = (
    <>
      <div className="flex items-center justify-between gap-2">
        <Icon className="h-4 w-4 shrink-0 text-accent-primary" strokeWidth={1.75} />
        {TrendIcon && (
          <TrendIcon
            className="h-3.5 w-3.5 text-[var(--text-secondary)]"
            strokeWidth={2}
            aria-hidden
          />
        )}
      </div>
      <p className="mt-2 text-2xl font-semibold tabular-nums tracking-tight">
        {value}
        {unit && (
          <span className="ml-0.5 text-sm font-normal text-[var(--text-secondary)]">
            {unit}
          </span>
        )}
      </p>
      <p className="mt-0.5 line-clamp-2 text-xs text-[var(--text-secondary)]">
        {label}
      </p>
      {status != null && (
        <div className="mt-2">
          <SensorStatusPill status={status} />
        </div>
      )}
    </>
  );

  const tileClass = cn(
    "kb-fade-up flex flex-1 flex-col rounded-2xl border border-[var(--surface-card-border)] bg-surface p-3 text-left shadow-card app-card",
    educationTopic && "transition-colors active:bg-surface-elevated",
    className
  );

  return (
    <>
      {educationTopic ? (
        <button
          type="button"
          className={tileClass}
          style={{ animationDelay: `${animationDelay}ms` }}
          onClick={() => setEducationOpen(true)}
          aria-label={`${label} — ${translate("explainDataAria")}`}
        >
          {content}
        </button>
      ) : (
        <div
          className={tileClass}
          style={{ animationDelay: `${animationDelay}ms` }}
        >
          {content}
        </div>
      )}

      {educationTopic && educationTopic !== "all" && (
        <SensorEducationSheet
          open={educationOpen}
          onOpenChange={setEducationOpen}
          topic={educationTopic}
          context={educationContext}
        />
      )}
    </>
  );
}
