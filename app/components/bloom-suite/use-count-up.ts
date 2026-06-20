"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

/** Count-up for dashboard metrics — luxury pace, no bounce */
export function useCountUp(target: number, durationMs = 1000, enabled = true) {
  const reduced = useReducedMotion();
  const [value, setValue] = useState(reduced ? target : 0);

  useEffect(() => {
    if (!enabled || reduced) {
      setValue(target);
      return;
    }

    let start: number | null = null;
    let frame = 0;

    const step = (ts: number) => {
      if (start === null) start = ts;
      const t = Math.min((ts - start) / durationMs, 1);
      const eased = 1 - (1 - t) ** 3;
      setValue(Math.round(target * eased));
      if (t < 1) frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [target, durationMs, enabled, reduced]);

  return value;
}
