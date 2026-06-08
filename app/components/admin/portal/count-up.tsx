"use client";

import { useEffect, useRef, useState } from "react";

export function CountUp({
  value,
  duration = 1100,
  className,
}: {
  value: number;
  duration?: number;
  className?: string;
}) {
  const [display, setDisplay] = useState(0);
  const prevValue = useRef(0);
  const mounted = useRef(false);

  useEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      setDisplay(value);
      prevValue.current = value;
      return;
    }

    const from = mounted.current ? prevValue.current : Math.max(0, value - Math.min(value, 12));
    mounted.current = true;
    prevValue.current = value;

    const start = performance.now();
    let frame = 0;

    function tick(now: number) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(from + (value - from) * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
      else setDisplay(value);
    }

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, duration]);

  return (
    <span className={className} aria-label={value.toLocaleString()}>
      {display.toLocaleString()}
    </span>
  );
}
