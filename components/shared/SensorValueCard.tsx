"use client";

import { useState, type ReactNode } from "react";
import { CircleHelp } from "lucide-react";
import { SensorEducationSheet } from "@/components/shared/SensorEducationSheet";
import { SensorLevelBar } from "@/components/shared/SensorLevelBar";
import { SensorStatusPill } from "@/components/shared/SensorStatusPill";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { InsightFactorStatus } from "@/lib/ai-insight/context-factors";
import type { EducationContext, EducationTopic } from "@/lib/sensors/sensor-education";
import type { SensorStatus } from "@/lib/sensors/status";
import { cn } from "@/lib/utils";

interface SensorValueCardProps {
  icon: ReactNode;
  label: string;
  value: number | string;
  unit?: string;
  status?: SensorStatus;
  barPercent?: number;
  thresholdPercent?: number;
  statusLabel?: string;
  insightStatus?: InsightFactorStatus;
  educationTopic?: EducationTopic;
  educationContext?: EducationContext;
  className?: string;
}

function insightPillClass(status: InsightFactorStatus): string {
  if (status === "good") {
    return "text-[var(--text-secondary)] ring-1 ring-border-subtle";
  }
  return "bg-accent-primary/12 text-accent-primary";
}

export function SensorValueCard({
  icon,
  label,
  value,
  unit,
  status,
  barPercent,
  thresholdPercent,
  statusLabel,
  insightStatus,
  educationTopic,
  educationContext,
  className,
}: SensorValueCardProps) {
  const [educationOpen, setEducationOpen] = useState(false);
  const elevated = status === "elevated";

  return (
    <>
      <Card
        className={cn(
          className ?? "flex-1",
          elevated && "ring-1 ring-accent-primary/20"
        )}
      >
        <CardHeader className="pb-2">
          <CardTitle className="flex items-start justify-between gap-1 text-sm font-medium text-[var(--text-secondary)]">
            <span className="flex min-w-0 items-center gap-2">
              {icon}
              <span className="line-clamp-2">{label}</span>
            </span>
            {educationTopic && educationTopic !== "all" && (
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
        <CardContent className="space-y-2">
          <p className="text-3xl font-semibold tabular-nums tracking-tight">
            {value}
            {unit && (
              <span className="ml-1 text-base font-normal text-[var(--text-secondary)]">
                {unit}
              </span>
            )}
          </p>
          {status != null && barPercent != null && (
            <SensorLevelBar
              percent={barPercent}
              thresholdPercent={thresholdPercent}
              status={status}
            />
          )}
          {status != null && <SensorStatusPill status={status} />}
          {status == null && statusLabel && (
            <span
              className={cn(
                "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
                insightStatus
                  ? insightPillClass(insightStatus)
                  : "text-[var(--text-secondary)]"
              )}
            >
              {statusLabel}
            </span>
          )}
        </CardContent>
      </Card>

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
