"use client";

import { useEffect, useState } from "react";

export function TodaysBloom({ lines }: { lines: string[] }) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || lines.length <= 1) return;

    const id = window.setInterval(() => {
      setVisible(false);
      window.setTimeout(() => {
        setIndex((i) => (i + 1) % lines.length);
        setVisible(true);
      }, 320);
    }, 5200);

    return () => clearInterval(id);
  }, [lines.length]);

  return (
    <section className="fp-todays-bloom" aria-live="polite">
      <span className="fp-todays-bloom__icon" aria-hidden>
        ✦
      </span>
      <div>
        <p className="fp-todays-bloom__label">Today&apos;s bloom</p>
        <p className={`fp-todays-bloom__line${visible ? "" : " fp-todays-bloom__line--fade"}`}>
          {lines[index]}
        </p>
      </div>
    </section>
  );
}
