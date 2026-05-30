"use client";

import type { FocalKey } from "./world-layout";

const NAV: { key: FocalKey; label: string; position: string }[] = [
  {
    key: "founding",
    label: "Invitation",
    position: "left-1/2 top-4 -translate-x-1/2",
  },
  { key: "rsvp", label: "RSVP", position: "left-4 bottom-4 md:left-6 md:bottom-6" },
  { key: "meter", label: "The City", position: "right-4 top-4 md:right-6 md:top-6" },
  { key: "board", label: "Society", position: "right-4 bottom-4 md:right-6 md:bottom-6" },
];

export function NavSeals({
  onFocus,
}: {
  onFocus: (key: FocalKey) => void;
}) {
  return (
    <nav
      className="pointer-events-none fixed inset-0 z-50"
      aria-label="Explore BloomBay"
    >
      {NAV.map(({ key, label, position }) => (
        <button
          key={key}
          type="button"
          onClick={() => onFocus(key)}
          className={`pointer-events-auto absolute ${position} group flex flex-col items-center gap-1`}
          aria-label={`Go to ${label}`}
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white bloom-float transition-transform group-hover:scale-105 group-active:animate-[seal-press_0.35s_ease] md:h-12 md:w-12">
            <RosetteIcon className="h-6 w-6 text-hot-pink" />
          </span>
          <span className="hidden max-w-[80px] text-center text-[9px] font-medium uppercase tracking-[0.12em] text-black/70 md:block">
            {label}
          </span>
        </button>
      ))}
    </nav>
  );
}

function RosetteIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
      <circle cx="12" cy="12" r="3" opacity="0.9" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
        <ellipse
          key={deg}
          cx="12"
          cy="5"
          rx="2.5"
          ry="5"
          opacity="0.55"
          transform={`rotate(${deg} 12 12)`}
        />
      ))}
    </svg>
  );
}
