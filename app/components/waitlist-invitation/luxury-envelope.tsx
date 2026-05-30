"use client";

import { PaperFoldEdge } from "./luxury-decor";
import { WaxSeal } from "./bb-logo";

function StationeryFrame({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`stationery paper-stack relative bg-white ${className}`}>
      <span className="corner-flourish corner-flourish--tl" />
      <span className="corner-flourish corner-flourish--tr" />
      <span className="corner-flourish corner-flourish--bl" />
      <span className="corner-flourish corner-flourish--br" />
      <PaperFoldEdge side="left" />
      <PaperFoldEdge side="right" />
      {children}
    </div>
  );
}

export function LuxuryEnvelope({
  open,
  sealBreaking,
  onOpenSeal,
  onOpenGentle,
  children,
}: {
  open: boolean;
  sealBreaking: boolean;
  onOpenSeal: () => void;
  onOpenGentle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`envelope envelope-luxury mx-auto w-full max-w-[680px] ${open ? "envelope--open" : "envelope--alive"}`}
    >
      <div className="relative mx-auto max-w-[620px]">
        {/* Blush liner peeking */}
        <div
          className="absolute inset-x-[6%] top-[52px] bottom-4 rounded-sm bg-blush/40 transition-opacity duration-700"
          style={{ opacity: open ? 0.3 : 0.65 }}
          aria-hidden
        />

        <div
          className="envelope-flap envelope-flap--luxury relative z-30 mx-auto h-[150px] w-[96%]"
          style={{
            clipPath: "polygon(0 0, 100% 0, 50% 100%)",
            marginBottom: "-3px",
          }}
          aria-hidden={open}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-blush via-blush/90 to-blush/70 satin-ribbon" />
          <div className="absolute inset-x-[20%] top-[40%] h-px bg-rose-gold/40" aria-hidden />
        </div>

        <StationeryFrame className="relative z-20 px-8 py-12 md:px-16 md:py-20">
          {!open ? (
            <div className="text-center">
              <p className="text-[10px] uppercase tracking-[0.5em] text-ink/45">
                BloomBay Society
              </p>
              <p className="mt-2 text-[10px] uppercase tracking-[0.38em] text-rose-gold">
                By invitation only
              </p>
              <div className="mx-auto my-10">
                <WaxSeal breaking={sealBreaking} onClick={onOpenSeal} />
              </div>
              <p className="text-[10px] uppercase tracking-[0.28em] text-hot-pink">
                Break the seal
              </p>
              <button
                type="button"
                onClick={onOpenGentle}
                className="mt-8 text-[10px] uppercase tracking-[0.2em] text-ink/35 transition-colors hover:text-hot-pink"
              >
                Open gently →
              </button>
            </div>
          ) : null}

          <div className={`envelope-letter ${open ? "block" : "hidden"}`}>{children}</div>
        </StationeryFrame>

        {/* Shadow stack */}
        <div className="paper-stack-shadow" aria-hidden />
      </div>
    </div>
  );
}
