"use client";

import { useEffect, useState } from "react";

export function SuiteAtmosphere() {
  return (
    <>
      <div className="atmosphere-glow" aria-hidden />
      <div className="atmosphere-shimmer" aria-hidden />
    </>
  );
}

export function HeroFloat({
  children,
}: {
  children: React.ReactNode;
}) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 8;
      const y = (e.clientY / window.innerHeight - 0.5) * 6;
      setTilt({ x, y });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div
      className="hero-float"
      style={{
        transform: `translate3d(${tilt.x}px, ${tilt.y}px, 0)`,
      }}
    >
      {children}
    </div>
  );
}
