import { useState, useEffect } from "react";

export function useCountUp(target: number, duration = 1200): number {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let animFrameId: number;
    let startTime: number | null = null;

    function step(timestamp: number) {
      if (startTime === null) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOut cubic: t = 1 - (1 - progress)^3
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));

      if (progress < 1) {
        animFrameId = requestAnimationFrame(step);
      }
    }

    animFrameId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(animFrameId);
    };
  }, [target, duration]);

  return count;
}
