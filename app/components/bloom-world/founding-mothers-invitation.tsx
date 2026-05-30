"use client";

import { useState } from "react";
import { GOAL, JOINED, REMAINING } from "./constants";

function FoundingSeal({
  breaking,
  onBreak,
}: {
  breaking: boolean;
  onBreak: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onBreak}
      disabled={breaking}
      className={`group relative mx-auto flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full bg-soft-pink ring-2 ring-black/10 transition-transform hover:scale-105 disabled:pointer-events-none ${breaking ? "seal-breaking" : ""}`}
      aria-label="Break the seal to open your invitation"
    >
      <span className="font-display text-base font-medium tracking-[0.2em] text-black">
        BB
      </span>
      <span className="absolute -inset-1 rounded-full border border-hot-pink/30 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden />
    </button>
  );
}

function RosetteCorner({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={`h-8 w-8 text-soft-pink ${className}`}
      aria-hidden
      fill="currentColor"
    >
      <circle cx="16" cy="16" r="2.5" className="text-hot-pink" />
      {[0, 60, 120, 180, 240, 300].map((deg) => (
        <ellipse
          key={deg}
          cx="16"
          cy="7"
          rx="2"
          ry="6"
          opacity="0.7"
          transform={`rotate(${deg} 16 16)`}
        />
      ))}
    </svg>
  );
}

export function FoundingMothersInvitation({
  accepted,
  onAccept,
  onWaitlist,
}: {
  accepted?: boolean;
  onAccept?: () => void;
  onWaitlist?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [breaking, setBreaking] = useState(false);

  const handleBreakSeal = () => {
    if (open) return;
    setBreaking(true);
    window.setTimeout(() => {
      setOpen(true);
      setBreaking(false);
    }, 650);
  };

  return (
    <div
      data-object
      id="founding-invitation"
      className="bloom-lift absolute left-[22%] top-[18%] z-[28] w-[min(640px,52vw)]"
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className={`founding-invite-closed relative ${open ? "founding-invite-open" : ""}`}
      >
        <div
          className={`founding-invite-body relative overflow-hidden bg-white bloom-frame bloom-float ${open ? "px-0 py-0" : "px-10 py-12 md:px-14 md:py-16"}`}
        >
          <RosetteCorner className="absolute left-4 top-4 opacity-80" />
          <RosetteCorner className="absolute right-4 top-4 scale-x-[-1] opacity-80" />

          {!open ? (
            <div className="relative z-10 w-full text-center">
              <p className="text-[9px] uppercase tracking-[0.5em] text-black/40">
                BloomBay Society · New York Chapter
              </p>
              <div className="mx-auto my-8 flex w-full max-w-xs items-center gap-4">
                <span className="h-px flex-1 bg-soft-pink" aria-hidden />
                <span className="font-display text-[10px] uppercase tracking-[0.35em] text-hot-pink">
                  MMXXVI
                </span>
                <span className="h-px flex-1 bg-soft-pink" aria-hidden />
              </div>
              <h1 className="font-display text-[clamp(2.75rem,6vw,4.5rem)] font-light leading-[0.95] tracking-tight text-black">
                Founding
                <br />
                <span className="italic">Mothers</span>
              </h1>
              <p className="mx-auto mt-6 max-w-sm font-display text-xl font-light italic leading-snug text-black/85">
                The social world women have been missing.
              </p>
              <p className="mt-10 text-[10px] uppercase tracking-[0.28em] text-black/45">
                Society · Movement · City
              </p>
              <div className="mt-10">
                <FoundingSeal breaking={breaking} onBreak={handleBreakSeal} />
              </div>
              <p className="mt-6 text-[10px] uppercase tracking-[0.22em] text-hot-pink">
                Break the seal
              </p>
              <p className="mt-8 font-display text-6xl font-light text-soft-pink">
                100
              </p>
              <p className="mt-1 text-[9px] uppercase tracking-[0.3em] text-black/35">
                seats at the founding table
              </p>
            </div>
          ) : (
            <div className="relative">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="absolute right-4 top-4 z-20 text-[10px] uppercase tracking-[0.18em] text-black/40 hover:text-black"
              >
                Close
              </button>

              <div className="grid md:grid-cols-3">
                {/* Society */}
                <section className="border-b border-black/8 bg-ivory px-6 py-10 md:border-b-0 md:border-r md:py-12">
                  <p className="text-[9px] uppercase tracking-[0.32em] text-black/40">
                    I · The Society
                  </p>
                  <h2 className="font-display mt-4 text-2xl font-light text-black">
                    Enter BloomBay
                  </h2>
                  <p className="mt-4 text-sm font-light leading-relaxed text-black/65">
                    A membership society of clubs, gatherings, celebrations,
                    and friendships that feel like belonging — not networking.
                  </p>
                  <p className="mt-6 font-display text-sm italic text-black/50">
                    Where you bloom.
                  </p>
                </section>

                {/* Movement */}
                <section className="relative border-b border-black/8 bg-white px-6 py-10 md:border-b-0 md:border-r md:py-12">
                  <div
                    className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-hot-pink to-transparent opacity-60"
                    aria-hidden
                  />
                  <p className="text-[9px] uppercase tracking-[0.32em] text-hot-pink">
                    II · The Movement
                  </p>
                  <h2 className="font-display mt-4 text-[1.75rem] font-light leading-tight text-black">
                    Founding Mothers
                  </h2>
                  <p className="mt-4 text-sm font-light leading-relaxed text-black/65">
                    One hundred women will open BloomBay in New York — not by
                    applying to an exclusive club, but by accepting a call to
                    build the social world we&apos;ve all wanted.
                  </p>
                  <p className="mt-6 text-sm font-light text-black/55">
                    You are not on the outside. You are being invited in.
                  </p>
                  <div className="mt-8 flex justify-center">
                    <span className="font-display text-5xl font-light text-soft-pink">
                      100
                    </span>
                  </div>
                </section>

                {/* City */}
                <section className="bg-soft-pink/20 px-6 py-10 md:py-12">
                  <p className="text-[9px] uppercase tracking-[0.32em] text-black/40">
                    III · The City
                  </p>
                  <h2 className="font-display mt-4 text-2xl font-light text-black">
                    New York
                  </h2>
                  <p className="mt-4 text-sm font-light leading-relaxed text-black/65">
                    The city is already blooming. Join a living social world
                    forming in every neighborhood — tables filling, clubs
                    starting, friendships taking root.
                  </p>
                  <div className="mt-8 border-t border-black/10 pt-6">
                    <p className="font-display text-3xl font-light text-black">
                      {JOINED.toLocaleString()}
                    </p>
                    <p className="text-[10px] uppercase tracking-[0.18em] text-black/50">
                      women already in
                    </p>
                    <p className="mt-3 text-xs font-light text-black/55">
                      {REMAINING.toLocaleString()} until {GOAL.toLocaleString()}{" "}
                      — the city-wide welcome
                    </p>
                  </div>
                </section>
              </div>

              <div className="border-t border-black/10 bg-ivory px-6 py-8 md:px-10">
                <p className="text-center font-display text-lg font-light italic text-black">
                  We saved you a place at the table.
                </p>
                <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={onAccept}
                    className="w-full bg-hot-pink px-8 py-3.5 text-[10px] font-medium uppercase tracking-[0.22em] text-white sm:w-auto"
                  >
                    Accept as Founding Mother
                  </button>
                  <button
                    type="button"
                    onClick={onWaitlist}
                    className="w-full border border-black/20 bg-white px-8 py-3.5 text-[10px] font-medium uppercase tracking-[0.22em] text-black sm:w-auto"
                  >
                    Join the waitlist
                  </button>
                </div>
                {accepted && (
                  <p className="mt-6 text-center font-display text-xs uppercase tracking-[0.3em] text-hot-pink">
                    Founding Mother · Attending
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {!open && (
          <div
            className="pointer-events-none absolute -bottom-3 left-1/2 h-6 w-[90%] -translate-x-1/2 bg-black/[0.03] blur-md"
            aria-hidden
          />
        )}
      </div>
    </div>
  );
}
