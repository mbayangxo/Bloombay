"use client";

import { useEffect, useState } from "react";

export function useParallax() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setMouse({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      });
    };
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return { mouse, scrollY };
}

export function layerTransform(
  mouse: { x: number; y: number },
  scrollY: number,
  depth: number,
) {
  const mx = mouse.x * depth * 12;
  const my = mouse.y * depth * 10;
  const sy = scrollY * depth * 0.08;
  return `translate3d(${mx}px, ${my - sy}px, 0)`;
}
