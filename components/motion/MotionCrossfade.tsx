"use client";

import type { ReactNode } from "react";
import { useMotionSafe } from "@/lib/motion/use-motion-safe";
import { cn } from "@/lib/utils";

export type MotionDirection = "forward" | "back" | "none";

interface MotionCrossfadeProps {
  motionKey: string | number;
  direction?: MotionDirection;
  className?: string;
  children: ReactNode;
}

export function MotionCrossfade({
  motionKey,
  direction = "none",
  className,
  children,
}: MotionCrossfadeProps) {
  const { animate } = useMotionSafe();

  return (
    <div
      key={motionKey}
      className={cn(
        animate && direction === "forward" && "kb-slide-forward",
        animate && direction === "back" && "kb-slide-back",
        animate && direction === "none" && "kb-crossfade",
        className
      )}
    >
      {children}
    </div>
  );
}
