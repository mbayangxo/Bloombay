"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { FOCAL, type ObjectId } from "./constants";

export function getInitialOffset(viewW: number, viewH: number) {
  const t = FOCAL.invitation;
  return { x: viewW * 0.5 - t.x, y: viewH * 0.5 - t.y };
}

export function useRoomPan() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [grabbing, setGrabbing] = useState(false);
  const [hint, setHint] = useState(true);
  const drag = useRef({ on: false, sx: 0, sy: 0, bx: 0, by: 0 });

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

  const focusObject = useCallback((id: ObjectId) => {
    const el = viewportRef.current;
    if (!el) return;
    const { width, height } = el.getBoundingClientRect();
    const t = FOCAL[id];
    setOffset({ x: width * 0.5 - t.x, y: height * 0.5 - t.y });
    setHint(false);
  }, []);

  const onDown = useCallback(
    (e: React.PointerEvent) => {
      if ((e.target as HTMLElement).closest("[data-room-object]")) return;
      drag.current = { on: true, sx: e.clientX, sy: e.clientY, bx: offset.x, by: offset.y };
      setGrabbing(true);
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    },
    [offset],
  );

  const onMove = useCallback((e: React.PointerEvent) => {
    if (!drag.current.on) return;
    setOffset({
      x: drag.current.bx + (e.clientX - drag.current.sx),
      y: drag.current.by + (e.clientY - drag.current.sy),
    });
    setHint(false);
  }, []);

  const onUp = useCallback((e: React.PointerEvent) => {
    drag.current.on = false;
    setGrabbing(false);
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      /* noop */
    }
  }, []);

  return { viewportRef, offset, grabbing, hint, focusObject, onDown, onMove, onUp };
}
