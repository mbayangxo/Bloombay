"use client";

export function RosetteBadge({
  className = "",
  label,
}: {
  className?: string;
  label?: string;
}) {
  return (
    <div
      className={`rosette-badge group inline-flex flex-col items-center ${className}`}
      title={label}
    >
      <span className="flex h-14 w-14 items-center justify-center rounded-full border border-rose-gold/40 bg-white/90 shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12">
        <svg viewBox="0 0 32 32" className="h-8 w-8 text-blush" aria-hidden fill="currentColor">
          <circle cx="16" cy="16" r="3" className="text-hot-pink" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((d) => (
            <ellipse key={d} cx="16" cy="8" rx="2.5" ry="6" opacity="0.65" transform={`rotate(${d} 16 16)`} />
          ))}
        </svg>
      </span>
      {label && (
        <span className="mt-2 text-[8px] uppercase tracking-[0.2em] text-ink/40 opacity-0 transition-opacity group-hover:opacity-100">
          {label}
        </span>
      )}
    </div>
  );
}

export function BloomBayPin({ className = "" }: { className?: string }) {
  return (
    <div
      className={`bloom-pin group cursor-default ${className}`}
      aria-hidden
    >
      <span className="absolute -top-8 left-1/2 h-10 w-0.5 -translate-x-1/2 bg-gradient-to-b from-rose-gold/60 to-hot-pink/80 transition-transform group-hover:scale-y-110" />
      <span className="relative flex h-11 w-11 items-center justify-center rounded-full bg-hot-pink text-white shadow-xl ring-2 ring-white/80 transition-all duration-500 group-hover:scale-110 group-hover:shadow-2xl">
        <span className="font-display text-xs font-medium tracking-widest">BB</span>
      </span>
    </div>
  );
}

export function SatinRibbon({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`satin-ribbon relative ${className}`}>
      <div className="satin-ribbon__sheen absolute inset-0" aria-hidden />
      <div className="relative px-8 py-3">{children}</div>
    </div>
  );
}

export function AcrylicPanel({
  children,
  className = "",
  hover = true,
}: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <div className={`acrylic ${hover ? "acrylic--hover" : ""} ${className}`}>
      {children}
    </div>
  );
}

export function GlassPetal({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <span
      className={`glass-petal ${className}`}
      style={style}
      aria-hidden
    />
  );
}

export function PaperFoldEdge({ side = "left" }: { side?: "left" | "right" }) {
  return (
    <div
      className={`paper-fold paper-fold--${side}`}
      aria-hidden
    />
  );
}
