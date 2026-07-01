"use client";

import { Line, LineChart, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";

interface SparklineMiniProps {
  data: { value: number }[];
  stroke?: string;
  className?: string;
  width?: number;
  height?: number;
}

export function SparklineMini({
  data,
  stroke = "var(--accent-primary)",
  className,
  width = 72,
  height = 48,
}: SparklineMiniProps) {
  if (data.length < 2) return null;

  return (
    <div
      className={cn("shrink-0", className)}
      style={{ width, height }}
      aria-hidden
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Line
            type="monotone"
            dataKey="value"
            stroke={stroke}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
