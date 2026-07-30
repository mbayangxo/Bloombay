"use client";

import { useEffect, useRef, useState } from "react";

export function TickerNumber({
  value,
  className,
  duration = 1400,
}: {
  value: number;
  className?: string;
  duration?: number;
}) {
  const [display, setDisplay] = useState(0);
  const target = useRef(value);
  const prevValue = useRef(0);
  const mounted = useRef(false);

  useEffect(() => {
    target.current = value;
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      setDisplay(value);
      prevValue.current = value;
      return;
    }

    const from = mounted.current
      ? prevValue.current
      : Math.max(0, value - Math.min(value, 18));
    mounted.current = true;
    const start = performance.now();
    let frame = 0;

    function tick(now: number) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(from + (value - from) * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
      else {
        setDisplay(value);
        prevValue.current = value;
      }
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
