"use client";

import type { ReactNode } from "react";

export function ScatteredPetals() {
  const petals = [
    { t: "12%", l: "8%", s: 14, r: 25 },
    { t: "22%", l: "78%", s: 18, r: -15 },
    { t: "45%", l: "92%", s: 12, r: 40 },
    { t: "68%", l: "5%", s: 16, r: -30 },
    { t: "82%", l: "65%", s: 22, r: 12 },
    { t: "35%", l: "42%", s: 10, r: 55 },
    { t: "55%", l: "28%", s: 11, r: -8 },
    { t: "8%", l: "55%", s: 13, r: 18 },
  ];
  return (
    <div className="suite-petals pointer-events-none absolute inset-0 z-[5]" aria-hidden>
      {petals.map((p, i) => (
        <span
          key={i}
          className="suite-petal"
          style={{
            top: p.t,
            left: p.l,
            width: p.s,
            height: p.s * 1.2,
            transform: `rotate(${p.r}deg)`,
          }}
        />
      ))}
    </div>
  );
}

/** Rose petals on the invitation table — pure CSS */
export function LuxuryPetals() {
  const petals = [
    { t: "14%", l: "6%", s: 20, r: -28, o: 0.78, delay: "0s" },
    { t: "38%", l: "90%", s: 16, r: 42, o: 0.7, delay: "-2.2s" },
    { t: "72%", l: "12%", s: 18, r: 14, o: 0.68, delay: "-4.5s" },
  ];
  return (
    <div className="invite-petals pointer-events-none absolute inset-0 z-[3]" aria-hidden>
      {petals.map((p, i) => (
        <span
          key={i}
          className="invite-petal invite-petal--fall"
          style={{
            top: p.t,
            left: p.l,
            width: p.s,
            height: p.s * 1.15,
            ["--petal-r" as string]: `${p.r}deg`,
            opacity: p.o,
            animationDelay: p.delay,
          }}
        />
      ))}
    </div>
  );
}

export function DecorativePen() {
  return (
    <div className="suite-prop suite-prop--pen pointer-events-none" aria-hidden>
      <svg viewBox="0 0 120 24" className="h-6 w-28 text-hot-pink">
        <rect x="0" y="8" width="80" height="8" rx="2" fill="#FF0055" opacity="0.9" />
        <path d="M80 10 L110 12 L80 14 Z" fill="#C9A27A" />
        <circle cx="108" cy="12" r="3" fill="#C9A27A" />
      </svg>
    </div>
  );
}

export function DecorativeClips() {
  return (
    <div className="suite-prop suite-prop--clips pointer-events-none" aria-hidden>
      <span className="inline-block h-8 w-3 rounded-sm border-2 border-amber-600/60 bg-amber-100/80 rotate-12" />
      <span className="inline-block h-8 w-3 rounded-sm border-2 border-amber-600/60 bg-amber-100/80 -rotate-6" />
    </div>
  );
}

export function DecorativePeony() {
  return (
    <div className="suite-prop suite-prop--peony pointer-events-none" aria-hidden>
      <svg viewBox="0 0 80 80" className="h-20 w-20">
        {[0, 45, 90, 135, 180, 225, 270, 315].map((d) => (
          <ellipse
            key={d}
            cx="40"
            cy="28"
            rx="14"
            ry="22"
            fill="#FFB8D0"
            opacity="0.85"
            transform={`rotate(${d} 40 40)`}
          />
        ))}
        <circle cx="40" cy="40" r="8" fill="#FF8CB0" />
      </svg>
    </div>
  );
}

export function WaxSealButton({
  children,
  className = "",
}: {
  children?: ReactNode;
  className?: string;
}) {
  return (
    <span className={`suite-wax-seal ${className}`}>
      <span className="suite-wax-seal__rim" aria-hidden />
      <span className="suite-wax-seal__b">B</span>
      {children}
    </span>
  );
}

export function RosetteBadge() {
  return (
    <div className="suite-rosette" aria-hidden>
      <svg viewBox="0 0 64 64" className="h-full w-full">
        {[0, 45, 90, 135, 180, 225, 270, 315].map((d) => (
          <ellipse key={d} cx="32" cy="14" rx="8" ry="16" fill="#FF8CB0" transform={`rotate(${d} 32 32)`} />
        ))}
        <circle cx="32" cy="32" r="10" fill="#FF0055" />
        <text x="32" y="36" textAnchor="middle" fill="white" fontSize="12" fontFamily="serif">
          B
        </text>
      </svg>
    </div>
  );
}
