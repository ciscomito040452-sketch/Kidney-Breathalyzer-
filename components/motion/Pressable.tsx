"use client";

import type { ComponentPropsWithoutRef, ElementType } from "react";
import { cn } from "@/lib/utils";

type PressableProps<T extends ElementType> = {
  as?: T;
  className?: string;
} & ComponentPropsWithoutRef<T>;

export function Pressable<T extends ElementType = "div">({
  as,
  className,
  ...props
}: PressableProps<T>) {
  const Comp = as ?? "div";

  return (
    <Comp className={cn("kb-pressable", className)} {...props} />
  );
}
