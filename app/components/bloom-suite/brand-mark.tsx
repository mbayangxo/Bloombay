/** BB Petal Mark — approximated from brand guidelines
 *  Left B: dark (#111111), Right B: pink (#ff0055)
 *  Each B: vertical spine + 3 petal-oval bumps with white negative space
 */
export function BBPetalMark({
  size = 48,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={Math.round(size * 0.625)}
      viewBox="0 0 80 50"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="BloomBay logo mark"
      role="img"
    >
      {/* ── Left B (dark) ── */}
      <rect x="2" y="3" width="6.5" height="44" rx="3" fill="#111111" />
      {/* top petal */}
      <ellipse cx="16" cy="11" rx="8" ry="8.5" fill="#111111" />
      <ellipse cx="16.5" cy="11" rx="4.5" ry="5" fill="white" />
      {/* mid petal */}
      <ellipse cx="17" cy="25" rx="9" ry="9" fill="#111111" />
      <ellipse cx="17.5" cy="25" rx="5.5" ry="5.5" fill="white" />
      {/* bottom petal */}
      <ellipse cx="16" cy="39" rx="8" ry="8.5" fill="#111111" />
      <ellipse cx="16.5" cy="39" rx="4.5" ry="5" fill="white" />

      {/* ── Right B (pink) ── */}
      <rect x="40" y="3" width="6.5" height="44" rx="3" fill="#ff0055" />
      {/* top petal */}
      <ellipse cx="54" cy="11" rx="8" ry="8.5" fill="#ff0055" />
      <ellipse cx="54.5" cy="11" rx="4.5" ry="5" fill="white" />
      {/* mid petal */}
      <ellipse cx="55" cy="25" rx="9" ry="9" fill="#ff0055" />
      <ellipse cx="55.5" cy="25" rx="5.5" ry="5.5" fill="white" />
      {/* bottom petal */}
      <ellipse cx="54" cy="39" rx="8" ry="8.5" fill="#ff0055" />
      <ellipse cx="54.5" cy="39" rx="4.5" ry="5" fill="white" />
    </svg>
  );
}

/** Inline brand lockup: petal mark + wordmark */
export function BloomLogo({
  light = false,
  size = 32,
}: {
  light?: boolean;
  size?: number;
}) {
  return (
    <div className={`bb-lockup ${light ? "bb-lockup--light" : ""}`}>
      <BBPetalMark size={size} />
      <div className="bb-lockup__text">
        <span className="bb-lockup__name" style={{ color: light ? "white" : undefined }}>
          <span>BLOOM</span>
          <span className="bb-lockup__bay">BAY</span>
        </span>
      </div>
    </div>
  );
}

/** Simple round brand mark (used in CTAs / stamps) */
export function BrandMark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`bb-stamp ${className}`}
      aria-hidden
    >
      <BBPetalMark size={20} />
    </span>
  );
}

/** Wax seal button decoration */
export function WaxSealButton({ className = "" }: { className?: string }) {
  return (
    <span className={`suite-wax-seal ${className}`}>
      <span className="suite-wax-seal__rim" aria-hidden />
      <span className="suite-wax-seal__inner">
        <BBPetalMark size={22} />
      </span>
    </span>
  );
}
