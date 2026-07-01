"use client";

import type { ReactNode } from "react";
import { useMotionSafe } from "@/lib/motion/use-motion-safe";
import { cn } from "@/lib/utils";

interface MotionPageProps {
  children: ReactNode;
  className?: string;
}

export function MotionPage({ children, className }: MotionPageProps) {
  const { animate } = useMotionSafe();

  return (
    <div className={cn(animate && "kb-page-enter", className)}>{children}</div>
  );
}
