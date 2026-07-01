"use client";

import type { ReactNode } from "react";
import { useMotionSafe } from "@/lib/motion/use-motion-safe";
import { cn } from "@/lib/utils";

interface MotionPushPageProps {
  children: ReactNode;
  className?: string;
}

export function MotionPushPage({ children, className }: MotionPushPageProps) {
  const { animate } = useMotionSafe();

  return (
    <div className={cn(animate && "kb-page-push", className)}>{children}</div>
  );
}
