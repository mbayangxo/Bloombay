/**
 * GiveFlowersIcon — a hand holding a bunch of flowers, used wherever
 * members can "give flowers" (posts, reviews, clubs, events, avenue).
 * Line-art style; color defaults to hot pink.
 */
export function GiveFlowersIcon({
  size = 24,
  color = "#FF1F7D",
  strokeWidth = 1.8,
}: {
  size?: number;
  color?: string;
  strokeWidth?: number;
}) {
  const sw = strokeWidth;

  return (
    <svg
      width={size}
      height={Math.round(size * 1.18)}
      viewBox="0 0 50 59"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Give flowers"
    >
      {/* ── STEMS ── three converging lines */}
      <path d="M18 44 L16 24" stroke={color} strokeWidth={sw} strokeLinecap="round"/>
      <path d="M25 44 L25 18" stroke={color} strokeWidth={sw} strokeLinecap="round"/>
      <path d="M32 44 L34 24" stroke={color} strokeWidth={sw} strokeLinecap="round"/>

      {/* ── FLOWER 1 (left) ── */}
      <circle cx="16" cy="21" r="2.5" stroke={color} strokeWidth={sw * 0.85} fill="none"/>
      {/* Petals */}
      <ellipse cx="16" cy="15.5" rx="2" ry="3.2" stroke={color} strokeWidth={sw * 0.75} fill="none" transform="rotate(0 16 21)"/>
      <ellipse cx="16" cy="15.5" rx="2" ry="3.2" stroke={color} strokeWidth={sw * 0.75} fill="none" transform="rotate(60 16 21)"/>
      <ellipse cx="16" cy="15.5" rx="2" ry="3.2" stroke={color} strokeWidth={sw * 0.75} fill="none" transform="rotate(120 16 21)"/>
      <ellipse cx="16" cy="15.5" rx="2" ry="3.2" stroke={color} strokeWidth={sw * 0.75} fill="none" transform="rotate(180 16 21)"/>
      <ellipse cx="16" cy="15.5" rx="2" ry="3.2" stroke={color} strokeWidth={sw * 0.75} fill="none" transform="rotate(240 16 21)"/>

      {/* ── FLOWER 2 (centre, tallest) ── */}
      <circle cx="25" cy="15" r="2.8" stroke={color} strokeWidth={sw * 0.85} fill="none"/>
      <ellipse cx="25" cy="9" rx="2.2" ry="3.6" stroke={color} strokeWidth={sw * 0.75} fill="none" transform="rotate(0 25 15)"/>
      <ellipse cx="25" cy="9" rx="2.2" ry="3.6" stroke={color} strokeWidth={sw * 0.75} fill="none" transform="rotate(60 25 15)"/>
      <ellipse cx="25" cy="9" rx="2.2" ry="3.6" stroke={color} strokeWidth={sw * 0.75} fill="none" transform="rotate(120 25 15)"/>
      <ellipse cx="25" cy="9" rx="2.2" ry="3.6" stroke={color} strokeWidth={sw * 0.75} fill="none" transform="rotate(180 25 15)"/>
      <ellipse cx="25" cy="9" rx="2.2" ry="3.6" stroke={color} strokeWidth={sw * 0.75} fill="none" transform="rotate(240 25 15)"/>

      {/* ── FLOWER 3 (right) ── */}
      <circle cx="34" cy="21" r="2.5" stroke={color} strokeWidth={sw * 0.85} fill="none"/>
      <ellipse cx="34" cy="15.5" rx="2" ry="3.2" stroke={color} strokeWidth={sw * 0.75} fill="none" transform="rotate(0 34 21)"/>
      <ellipse cx="34" cy="15.5" rx="2" ry="3.2" stroke={color} strokeWidth={sw * 0.75} fill="none" transform="rotate(60 34 21)"/>
      <ellipse cx="34" cy="15.5" rx="2" ry="3.2" stroke={color} strokeWidth={sw * 0.75} fill="none" transform="rotate(120 34 21)"/>
      <ellipse cx="34" cy="15.5" rx="2" ry="3.2" stroke={color} strokeWidth={sw * 0.75} fill="none" transform="rotate(180 34 21)"/>
      <ellipse cx="34" cy="15.5" rx="2" ry="3.2" stroke={color} strokeWidth={sw * 0.75} fill="none" transform="rotate(240 34 21)"/>

      {/* ── HAND GRIP ── fingers curled around stems, thumb visible left */}

      {/* Palm / fist body */}
      <path
        d="M14 43 Q13 47 14 51 Q15 54 20 56 Q25 57.5 30 56 Q35 54 36 51 Q37 47 36 43"
        stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none"
      />

      {/* Finger knuckle lines across the grip */}
      <path d="M16 44 Q25 42.5 34 44" stroke={color} strokeWidth={sw * 0.8} strokeLinecap="round" fill="none"/>
      <path d="M15 47.5 Q25 46 35 47.5" stroke={color} strokeWidth={sw * 0.7} strokeLinecap="round" fill="none" opacity="0.6"/>

      {/* Thumb on left side */}
      <path
        d="M14 43 Q10 42 10 45.5 Q10 49 14 49"
        stroke={color} strokeWidth={sw} strokeLinecap="round" fill="none"
      />
    </svg>
  );
}
