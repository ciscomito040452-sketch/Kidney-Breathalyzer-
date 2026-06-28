"use client";

import { scorePercent } from "@/lib/risk-engine/risk-zones";
import type { RiskLevel } from "@/types/measurement";
import { cn } from "@/lib/utils";

const ringStroke: Record<RiskLevel, string> = {
  low: "stroke-[var(--risk-meter-mid)]",
  moderate: "stroke-risk-moderate",
  high: "stroke-[var(--risk-meter-end)]",
};

interface RiskScoreRingProps {
  riskScore: number;
  riskLevel: RiskLevel;
  size?: number;
  className?: string;
}

export function RiskScoreRing({
  riskScore,
  riskLevel,
  size = 44,
  className,
}: RiskScoreRingProps) {
  const pct = scorePercent(riskScore);
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (pct / 100) * circumference;
  const center = size / 2;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={cn("shrink-0 -rotate-90", className)}
      aria-hidden
    >
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        className="stroke-border-subtle/80"
        strokeWidth={strokeWidth}
      />
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        className={cn(ringStroke[riskLevel], "transition-[stroke-dashoffset]")}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={dashOffset}
      />
    </svg>
  );
}
