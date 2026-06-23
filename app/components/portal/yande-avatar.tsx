/**
 * YandeAvatar — BloomBay's AI hostess as a minimalist graphic silhouette.
 * Black-and-white portrait: domed hair with centre part, almond eyes,
 * strong brows, drop earrings, full lips, wide black collar.
 * Matches the reference illustration exactly.
 */
export function YandeAvatar({
  size = 40,
  className,
  bg = "white",
}: {
  size?: number;
  className?: string;
  bg?: string;
}) {
  const INK  = "#111111";
  const W    = "white";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Yande"
      className={className}
    >
      {/* Background */}
      <rect width="100" height="100" fill={bg} rx="50"/>

      {/* ── HAIR DOME ── large black mass, top third */}
      <ellipse cx="50" cy="30" rx="31" ry="30" fill={INK}/>

      {/* ── FACE ── white oval overlapping bottom of hair dome */}
      <ellipse cx="50" cy="60" rx="21" ry="27" fill={W}/>

      {/* ── CENTRE PART ── thin white line splitting the dome */}
      <line x1="50" y1="2" x2="50" y2="35" stroke={W} strokeWidth="1.6" strokeLinecap="round"/>

      {/* ── SIDE HAIR PANELS ── narrow strips coming down from dome */}
      <path d="M29 50 Q27 59 28 68 Q30 75 33 77 L33 65 Q30 58 29 50Z" fill={INK}/>
      <path d="M71 50 Q73 59 72 68 Q70 75 67 77 L67 65 Q70 58 71 50Z" fill={INK}/>

      {/* ── EARS ── white bumps */}
      <ellipse cx="29" cy="58" rx="4" ry="5.5" fill={W}/>
      <ellipse cx="71" cy="58" rx="4" ry="5.5" fill={W}/>

      {/* ── EARRINGS ── double drop: small stud + larger oval below */}
      <circle cx="26" cy="60" r="2.2" fill={INK}/>
      <ellipse cx="26" cy="66" rx="2.2" ry="3" fill={INK}/>

      <circle cx="74" cy="60" r="2.2" fill={INK}/>
      <ellipse cx="74" cy="66" rx="2.2" ry="3" fill={INK}/>

      {/* ── EYEBROWS ── strong, defined dark arches */}
      <path d="M33 49 Q40 45.5 47 48" stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round"/>
      <path d="M53 48 Q60 45.5 67 49" stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round"/>

      {/* ── LEFT EYE ── angular almond shape */}
      <path d="M34 55.5 Q41 51 47 55.5 Q41 60 34 55.5Z" fill={INK}/>
      {/* White sclera + pupil */}
      <ellipse cx="40.5" cy="55.5" rx="3" ry="2.8" fill={W}/>
      <ellipse cx="40.5" cy="55.5" rx="1.8" ry="2" fill={INK}/>
      <circle cx="41.4" cy="54.6" r="0.7" fill={W}/>

      {/* ── RIGHT EYE ── angular almond shape */}
      <path d="M53 55.5 Q59 51 66 55.5 Q59 60 53 55.5Z" fill={INK}/>
      {/* White sclera + pupil */}
      <ellipse cx="59.5" cy="55.5" rx="3" ry="2.8" fill={W}/>
      <ellipse cx="59.5" cy="55.5" rx="1.8" ry="2" fill={INK}/>
      <circle cx="60.4" cy="54.6" r="0.7" fill={W}/>

      {/* ── NOSE ── barely visible, just two tiny marks */}
      <path d="M48 67 Q50 69 52 67" stroke={INK} strokeWidth="0.8" fill="none" strokeLinecap="round" opacity="0.35"/>

      {/* ── LIPS ── full, dark (dark lipstick silhouette) */}
      {/* Upper lip with Cupid's bow */}
      <path d="M38 73 Q44 69.5 50 71 Q56 69.5 62 73 Q57 80 50 81 Q43 80 38 73Z" fill={INK}/>
      {/* Cupid's bow highlight */}
      <path d="M38 73 Q44 71 50 71.8 Q56 71 62 73" stroke={W} strokeWidth="0.6" fill="none" opacity="0.25"/>

      {/* ── NECK ── white, narrow */}
      <rect x="44" y="87" width="12" height="8" rx="2" fill={W}/>

      {/* ── GARMENT ── wide black collar/shoulders spreading dramatically outward */}
      <path
        d="M0 100 L22 87 Q32 95 44 88 Q50 92 56 88 Q68 95 78 87 L100 100Z"
        fill={INK}
      />
    </svg>
  );
}
