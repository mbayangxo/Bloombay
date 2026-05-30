export function WaxSeal({
  size = "lg",
  breaking,
  onClick,
}: {
  size?: "sm" | "lg";
  breaking?: boolean;
  onClick?: () => void;
}) {
  const dim = size === "sm" ? "h-12 w-12 text-xs" : "h-[4.5rem] w-[4.5rem] text-sm";
  const Tag = onClick ? "button" : "span";
  return (
    <Tag
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={`wax-seal inline-flex ${dim} flex-col items-center justify-center rounded-full bg-hot-pink text-white ring-2 ring-white/60 transition-transform hover:scale-[1.05] ${breaking ? "seal-breaking" : ""} ${onClick ? "wax-seal--pulse cursor-pointer" : ""}`}
      aria-label={onClick ? "Break wax seal" : undefined}
    >
      <span className="font-display font-medium tracking-[0.2em]">BB</span>
      {size === "lg" && (
        <span className="mt-0.5 text-[7px] uppercase tracking-[0.3em] opacity-90">
          BloomBay
        </span>
      )}
    </Tag>
  );
}

export function PressedFlower({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={`text-blush opacity-60 ${className}`}
      aria-hidden
      fill="currentColor"
    >
      <circle cx="20" cy="20" r="4" fill="#FF0055" opacity="0.35" />
      {[0, 72, 144, 216, 288].map((deg) => (
        <ellipse
          key={deg}
          cx="20"
          cy="10"
          rx="5"
          ry="9"
          transform={`rotate(${deg} 20 20)`}
        />
      ))}
    </svg>
  );
}
