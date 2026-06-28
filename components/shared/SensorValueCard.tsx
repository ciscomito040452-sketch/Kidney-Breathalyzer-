import type { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SensorValueCardProps {
  icon: ReactNode;
  label: string;
  value: number | string;
  unit?: string;
  statusLabel?: string;
  className?: string;
}

export function SensorValueCard({
  icon,
  label,
  value,
  unit,
  statusLabel,
  className,
}: SensorValueCardProps) {
  return (
    <Card className={className ?? "flex-1"}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)]">
          {icon}
          <span className="line-clamp-2">{label}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        <p className="text-3xl font-semibold tabular-nums tracking-tight">
          {value}
          {unit && (
            <span className="ml-1 text-base font-normal text-[var(--text-secondary)]">
              {unit}
            </span>
          )}
        </p>
        {statusLabel && (
          <p className="text-xs text-[var(--text-secondary)]">{statusLabel}</p>
        )}
      </CardContent>
    </Card>
  );
}
