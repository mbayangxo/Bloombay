"use client";

import { useState } from "react";
import { WORLD_HEIGHT, WORLD_WIDTH } from "./constants";
import { FoundingMothersInvitation } from "./founding-mothers-invitation";
import { NavSeals } from "./nav-seals";
import { useCanvasPan } from "./use-canvas-pan";
import {
  AmbientBloomMeter,
  AmbientRegistry,
  EnvelopeRsvp,
} from "./world-objects";

export function BloomWorld() {
  const {
    viewportRef,
    offset,
    grabbing,
    hintVisible,
    focusOn,
    onPointerDown,
    onPointerMove,
    onPointerUp,
  } = useCanvasPan();
  const [rsvpSent, setRsvpSent] = useState(false);
  const [foundingAccepted, setFoundingAccepted] = useState(false);

  return (
    <div className="relative h-full w-full overflow-hidden bg-ivory">
      <NavSeals onFocus={focusOn} />

      {hintVisible && (
        <p className="pointer-events-none absolute bottom-20 left-1/2 z-40 -translate-x-1/2 bg-white/95 px-5 py-2.5 text-[10px] uppercase tracking-[0.22em] text-black/55 bloom-float md:bottom-8">
          Open your Founding Mothers invitation
        </p>
      )}

      <div
        ref={viewportRef}
        className={`h-full w-full touch-none select-none ${grabbing ? "world-grabbing" : "world-grab"}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        <div
          className="absolute left-0 top-0 will-change-transform"
          style={{
            width: WORLD_WIDTH,
            height: WORLD_HEIGHT,
            transform: `translate(${offset.x}px, ${offset.y}px)`,
          }}
        >
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background: `
                radial-gradient(ellipse 70% 55% at 45% 40%, rgba(255, 214, 228, 0.4) 0%, transparent 60%),
                radial-gradient(ellipse 50% 40% at 80% 60%, rgba(255, 214, 228, 0.2) 0%, transparent 50%),
                linear-gradient(180deg, #fdf4ec 0%, #fcf6ef 100%)
              `,
            }}
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.28]"
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,0.025) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0,0,0,0.025) 1px, transparent 1px)`,
              backgroundSize: "56px 56px",
            }}
            aria-hidden
          />

          <FoundingMothersInvitation
            accepted={foundingAccepted || rsvpSent}
            onAccept={() => {
              setFoundingAccepted(true);
              focusOn("rsvp");
            }}
            onWaitlist={() => focusOn("rsvp")}
          />
          <EnvelopeRsvp onSent={() => setRsvpSent(true)} />
          <AmbientRegistry />
          <AmbientBloomMeter />

          <p
            className="pointer-events-none absolute right-[8%] top-[82%] font-display text-[10px] uppercase tracking-[0.45em] text-black/12"
            aria-hidden
          >
            BloomBay Society
          </p>
        </div>
      </div>
    </div>
  );
}
