/**
 * YandeAvatar — BloomBay's hostess AI as an inline SVG icon.
 * Center-part hair, almond eyes, double drop earrings, V-neckline.
 * Brand colors: #FF1F7D (hot pink), #E8007A (deep pink), #1A0A2E (plum/black).
 * Scalable from 24px (notification) to 64px (intro screen).
 */
export function YandeAvatar({
  size = 40,
  className,
}: {
  size?: number;
  className?: string;
}) {
  const PINK = "#FF1F7D";
  const DEEP_PINK = "#E8007A";
  const PLUM = "#1A0A2E";

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
      {/* Background circle — plum black */}
      <circle cx="50" cy="50" r="50" fill={PLUM} />

      {/* V-neckline garment — hot pink */}
      <path d="M26 100 L35 80 Q50 90 65 80 L74 100Z" fill={PINK} />
      {/* V-neck cut */}
      <path d="M43 81 Q50 89 57 81 L50 95Z" fill={PLUM} />

      {/* Neck */}
      <rect x="44" y="72" width="12" height="10" rx="4" fill="#FFC8A0" />

      {/* Face — warm skin */}
      <ellipse cx="50" cy="54" rx="18" ry="20" fill="#F5C4A0" />

      {/* Center-part hair — hot pink accented black */}
      {/* Top of head / hair mass */}
      <path
        d="M32 54 C32 36 35 26 50 24 C65 26 68 36 68 54
           C68 46 66 38 64 34 L62 28 Q50 22 38 28 L36 34
           C34 38 32 46 32 54Z"
        fill={PLUM}
      />
      {/* Left side hair panel */}
      <path
        d="M32 50 C31 56 30 64 32 71 C34 76 38 79 40 79
           L40 68 C37 63 34 58 32 50Z"
        fill={PLUM}
      />
      {/* Right side hair panel */}
      <path
        d="M68 50 C69 56 70 64 68 71 C66 76 62 79 60 79
           L60 68 C63 63 66 58 68 50Z"
        fill={PLUM}
      />
      {/* Center part — pink highlight line */}
      <line x1="50" y1="22" x2="50" y2="34" stroke={DEEP_PINK} strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />

      {/* Left eye — almond, dark */}
      <path d="M38 52 Q42 48.5 46 52 Q42 55.5 38 52Z" fill={PLUM} />
      <ellipse cx="42" cy="52" rx="1.4" ry="1.6" fill="#060210" />
      <circle cx="43" cy="51" r="0.6" fill="white" opacity="0.8" />
      {/* Left lash */}
      <path d="M38 52 C37 50 37.5 48 39 48" stroke={PLUM} strokeWidth="0.8" fill="none" />

      {/* Right eye — almond, dark */}
      <path d="M54 52 Q58 48.5 62 52 Q58 55.5 54 52Z" fill={PLUM} />
      <ellipse cx="58" cy="52" rx="1.4" ry="1.6" fill="#060210" />
      <circle cx="59" cy="51" r="0.6" fill="white" opacity="0.8" />
      {/* Right lash */}
      <path d="M62 52 C63 50 62.5 48 61 48" stroke={PLUM} strokeWidth="0.8" fill="none" />

      {/* Eyebrows — dark arches */}
      <path d="M37 48 Q42 45.5 46 47.5" stroke={PLUM} strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M54 47.5 Q58 45.5 63 48" stroke={PLUM} strokeWidth="1.5" strokeLinecap="round" fill="none" />

      {/* Nose — minimal */}
      <path d="M48.5 57 Q50 59.5 51.5 57" stroke="#C8966A" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.7" />

      {/* Lips — hot pink */}
      <path d="M43.5 63 Q46.5 61 50 62 Q53.5 61 56.5 63 Q53.5 66.5 50 67 Q46.5 66.5 43.5 63Z" fill={PINK} />
      <path d="M43.5 63 Q50 65 56.5 63" stroke={DEEP_PINK} strokeWidth="0.7" fill="none" opacity="0.6" />

      {/* Left double drop earrings — pink */}
      <circle cx="31.5" cy="60" r="2" fill={DEEP_PINK} />
      <line x1="31.5" y1="62" x2="31.5" y2="65.5" stroke={DEEP_PINK} strokeWidth="1.2" />
      <ellipse cx="31.5" cy="67.5" rx="1.5" ry="2.2" fill={PINK} />

      {/* Right double drop earrings — pink */}
      <circle cx="68.5" cy="60" r="2" fill={DEEP_PINK} />
      <line x1="68.5" y1="62" x2="68.5" y2="65.5" stroke={DEEP_PINK} strokeWidth="1.2" />
      <ellipse cx="68.5" cy="67.5" rx="1.5" ry="2.2" fill={PINK} />

      {/* Signature ✦ star — hot pink, top right */}
      <path
        d="M84 13 L85.4 17.6 L90 19 L85.4 20.4 L84 25 L82.6 20.4 L78 19 L82.6 17.6Z"
        fill={PINK}
      />
    </svg>
  );
}
