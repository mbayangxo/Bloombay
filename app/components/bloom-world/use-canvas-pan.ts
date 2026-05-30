"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { FOCAL, type FocalKey, getInitialOffset } from "./world-layout";

export function useCanvasPan() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [grabbing, setGrabbing] = useState(false);
  const [hintVisible, setHintVisible] = useState(true);
  const dragRef = useRef({ active: false, startX: 0, startY: 0, baseX: 0, baseY: 0 });

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const { width, height } = el.getBoundingClientRect();
      setOffset(getInitialOffset(width, height));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const panBy = useCallback((dx: number, dy: number) => {
    setOffset((o) => ({ x: o.x + dx, y: o.y + dy }));
    setHintVisible(false);
  }, []);

  const focusOn = useCallback((key: FocalKey) => {
    const el = viewportRef.current;
    if (!el) return;
    const { width, height } = el.getBoundingClientRect();
    const target = FOCAL[key];
    const zoom = target.zoom ?? 1;
    setOffset({
      x: width * 0.5 - target.x * zoom,
      y: height * 0.5 - target.y * zoom,
    });
    setHintVisible(false);
  }, []);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if ((e.target as HTMLElement).closest("[data-object]")) return;
      dragRef.current = {
        active: true,
        startX: e.clientX,
        startY: e.clientY,
        baseX: offset.x,
        baseY: offset.y,
      };
      setGrabbing(true);
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    },
    [offset.x, offset.y],
  );

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragRef.current.active) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    setOffset({
      x: dragRef.current.baseX + dx,
      y: dragRef.current.baseY + dy,
    });
    setHintVisible(false);
  }, []);

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    dragRef.current.active = false;
    setGrabbing(false);
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      /* already released */
    }
  }, []);

  return {
    viewportRef,
    offset,
    grabbing,
    hintVisible,
    panBy,
    focusOn,
    onPointerDown,
    onPointerMove,
    onPointerUp,
  };
}
