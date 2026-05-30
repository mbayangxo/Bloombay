"use client";

import { useState } from "react";
import {
  BLOOM_PROGRESS,
  CLUB_FLYERS,
  JOINED,
  REMAINING,
} from "./constants";

function ObjectShell({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <div
      id={id}
      data-object
      className={`bloom-lift ${className}`}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </div>
  );
}

export function EnvelopeRsvp({ onSent }: { onSent?: () => void }) {
  const [revealed, setRevealed] = useState(false);
  const [flipped, setFlipped] = useState(false);

  return (
    <ObjectShell
      id="rsvp"
      className="absolute left-[10%] top-[56%] z-[26] w-[280px]"
    >
      <div className="relative">
        <div className="relative h-[168px] w-[260px] bg-white bloom-frame bloom-float">
          <div
            className="absolute inset-x-0 top-0 h-[80px] bg-soft-pink/30"
            style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }}
            aria-hidden
          />
          <p className="absolute bottom-5 left-5 text-[10px] uppercase tracking-[0.24em] text-black/45">
            Your RSVP
          </p>
        </div>
        <div
          className={`absolute left-3 right-3 bg-white bloom-frame bloom-float transition-all duration-500 ${revealed ? "-top-28" : "top-3"}`}
        >
          <div className="px-5 py-5">
            {!flipped ? (
              <>
                <p className="font-display text-base text-black">
                  Will you bloom with us?
                </p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-black/45">
                  Reply enclosed
                </p>
                {!revealed ? (
                  <button
                    type="button"
                    onClick={() => setRevealed(true)}
                    className="mt-5 text-[10px] uppercase tracking-[0.2em] text-hot-pink"
                  >
                    Slide out reply →
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setFlipped(true)}
                    className="mt-5 text-[10px] uppercase tracking-[0.2em] text-black"
                  >
                    Complete →
                  </button>
                )}
              </>
            ) : (
              <>
                <label className="block text-[10px] uppercase tracking-[0.15em] text-black/45">
                  Name
                </label>
                <div className="mt-1 border-b border-black/15 py-2" />
                <label className="mt-3 block text-[10px] uppercase tracking-[0.15em] text-black/45">
                  Email
                </label>
                <div className="mt-1 border-b border-black/15 py-2" />
                <button
                  type="button"
                  onClick={() => {
                    onSent?.();
                    setFlipped(false);
                    setRevealed(false);
                  }}
                  className="mt-5 w-full bg-hot-pink py-2.5 text-[10px] font-medium uppercase tracking-[0.2em] text-white"
                >
                  Send RSVP
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </ObjectShell>
  );
}

/** Glanceable — supports the City panel, not a second hero */
export function AmbientBloomMeter() {
  const petals = 12;
  const filled = Math.round((BLOOM_PROGRESS / 100) * petals);

  return (
    <ObjectShell className="absolute left-[72%] top-[12%] z-[14] pointer-events-none opacity-95">
      <div className="flex w-[160px] flex-col items-center bg-white/90 px-5 py-6 bloom-frame">
        <p className="text-[9px] uppercase tracking-[0.26em] text-black/40">
          NYC Bloom
        </p>
        <div className="relative mt-3 h-20 w-20">
          {Array.from({ length: petals }).map((_, i) => (
            <span
              key={i}
              className={`absolute left-1/2 top-1/2 h-5 w-2 -ml-1 origin-bottom rounded-full ${i < filled ? (i === filled - 1 ? "bg-hot-pink" : "bg-soft-pink") : "bg-soft-pink/20"}`}
              style={{
                transform: `rotate(${i * (360 / petals)}deg) translateY(-28px)`,
              }}
              aria-hidden
            />
          ))}
        </div>
        <p className="font-display mt-2 text-xl text-black">
          {JOINED.toLocaleString()}
        </p>
        <p className="text-[9px] text-black/45">{REMAINING.toLocaleString()} to welcome</p>
      </div>
    </ObjectShell>
  );
}

/** Static society proof — not interactive */
export function AmbientRegistry() {
  const flyers = CLUB_FLYERS.slice(0, 3);
  return (
    <div
      className="pointer-events-none absolute left-[58%] top-[22%] z-[12] w-[320px] opacity-90"
      aria-hidden
    >
      <div className="bg-white/85 px-6 py-5 bloom-frame bloom-float">
        <p className="text-[9px] uppercase tracking-[0.3em] text-black/35">
          Society postings
        </p>
        <ul className="mt-4 space-y-3">
          {flyers.map((f) => (
            <li key={f.id} className="border-t border-black/6 pt-3 first:border-0 first:pt-0">
              <p className="font-display text-sm text-black">{f.title}</p>
              <p className="text-[9px] uppercase tracking-wider text-black/40">
                {f.line}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
