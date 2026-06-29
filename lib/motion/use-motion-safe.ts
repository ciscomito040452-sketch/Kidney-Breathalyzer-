"use client";

import { useEffect, useState } from "react";
import { MOTION } from "@/lib/motion/tokens";

export interface MotionSafe {
  animate: boolean;
  durationMs: number;
  staggerMs: number;
}

export function useMotionSafe(): MotionSafe {
  const [animate, setAnimate] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setAnimate(!mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return {
    animate,
    durationMs: animate ? MOTION.durationNormal : 0,
    staggerMs: animate ? MOTION.staggerStep : 0,
  };
}
