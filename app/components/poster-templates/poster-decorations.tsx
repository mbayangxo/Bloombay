/** Decorative SVG only — seals, borders, icons (never event photos). */

export function PosterBloomMark({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      aria-hidden
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="1.2" opacity="0.35" />
      <path
        d="M24 10c0 8-6 12-6 18a6 6 0 0 0 12 0c0-6-6-10-6-18Z"
        fill="currentColor"
        opacity="0.9"
      />
      <path d="M24 34v4M20 38h8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

export function PosterSeal({ className = "", label = "BLOOMBAY" }: { className?: string; label?: string }) {
  return (
    <svg className={className} viewBox="0 0 88 88" aria-hidden xmlns="http://www.w3.org/2000/svg">
      <circle cx="44" cy="44" r="40" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="44" cy="44" r="34" fill="none" stroke="currentColor" strokeWidth="0.6" opacity="0.5" />
      <path
        id="sealArc"
        d="M 12,44 A 32,32 0 1,1 76,44"
        fill="none"
      />
      <text
        fill="currentColor"
        fontSize="7"
        fontFamily="Georgia, serif"
        letterSpacing="2.5"
        fontWeight="600"
      >
        <textPath href="#sealArc" startOffset="50%" textAnchor="middle">
          {label}
        </textPath>
      </text>
      <path
        d="M44 28c-4 6-10 8-10 14a10 10 0 0 0 20 0c0-6-6-8-10-14Z"
        fill="currentColor"
        opacity="0.85"
      />
    </svg>
  );
}

export function PosterCornerFlourish({ className = "", flip }: { className?: string; flip?: boolean }) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      aria-hidden
      style={flip ? { transform: "scaleX(-1)" } : undefined}
    >
      <path
        d="M2 30 Q2 2 30 2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.45"
      />
      <path
        d="M6 26 Q6 8 26 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.6"
        opacity="0.3"
      />
      <circle cx="8" cy="8" r="2" fill="currentColor" opacity="0.25" />
    </svg>
  );
}

export function PosterRibbon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 28" aria-hidden>
      <path d="M0 14 L16 0 L104 0 L120 14 L104 28 L16 28 Z" fill="currentColor" opacity="0.92" />
      <path d="M8 14 L20 6 L100 6 L112 14 L100 22 L20 22 Z" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.35" />
    </svg>
  );
}

export function PosterTicketStub({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 56 120" aria-hidden>
      <rect x="4" y="4" width="48" height="112" rx="4" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 3" opacity="0.4" />
      <line x1="4" y1="60" x2="52" y2="60" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" opacity="0.35" />
      <text x="28" y="24" textAnchor="middle" fill="currentColor" fontSize="8" fontFamily="Georgia, serif" opacity="0.6">
        ADMIT
      </text>
      <text x="28" y="88" textAnchor="middle" fill="currentColor" fontSize="7" fontFamily="sans-serif" opacity="0.45" letterSpacing="1">
        HER
      </text>
    </svg>
  );
}

export function PosterFlower({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" aria-hidden>
      <circle cx="20" cy="20" r="3" fill="currentColor" opacity="0.7" />
      {[0, 72, 144, 216, 288].map((deg) => (
        <ellipse
          key={deg}
          cx="20"
          cy="12"
          rx="5"
          ry="9"
          fill="currentColor"
          opacity="0.35"
          transform={`rotate(${deg} 20 20)`}
        />
      ))}
    </svg>
  );
}
