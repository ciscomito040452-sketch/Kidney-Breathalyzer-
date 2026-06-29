"use client";

import { Children, isValidElement, type ReactNode } from "react";
import { useMotionSafe } from "@/lib/motion/use-motion-safe";
import { cn } from "@/lib/utils";

interface StaggerSectionProps {
  children: ReactNode;
  className?: string;
  stagger?: boolean;
}

export function StaggerSection({
  children,
  className,
  stagger = true,
}: StaggerSectionProps) {
  const { animate, staggerMs } = useMotionSafe();

  if (!stagger || !animate) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className={className}>
      {Children.map(children, (child, index) => {
        if (!isValidElement(child)) return child;
        return (
          <div
            key={child.key ?? index}
            className="kb-fade-up"
            style={{ animationDelay: `${index * staggerMs}ms` }}
          >
            {child}
          </div>
        );
      })}
    </div>
  );
}
