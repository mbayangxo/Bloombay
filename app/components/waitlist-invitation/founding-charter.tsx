"use client";

import { WaxSeal } from "./bb-logo";
import {
  AcrylicPanel,
  BloomBayPin,
  PaperFoldEdge,
  RosetteBadge,
  SatinRibbon,
} from "./luxury-decor";

const BENEFITS = [
  "Early access",
  "Private gatherings",
  "Founding Mother badge",
  "Name preserved in BloomBay history",
] as const;

export function FoundingCharter({
  onJoin,
  onFounding,
}: {
  onJoin: () => void;
  onFounding: () => void;
}) {
  return (
    <section
      id="founding-mothers"
      className="charter-scene relative z-20 overflow-hidden px-4 py-32 md:px-8 md:py-40"
    >
      {/* Off-screen charter bleed */}
      <div className="charter-bleed charter-bleed--left" aria-hidden />
      <div className="charter-bleed charter-bleed--right" aria-hidden />

      <div className="relative mx-auto max-w-4xl">
        <SatinRibbon className="mx-auto mb-[-1.25rem] w-fit max-w-[90vw]">
          <p className="text-center text-[10px] uppercase tracking-[0.45em] text-ink/70">
            Reserved for the first one hundred
          </p>
        </SatinRibbon>

        <AcrylicPanel className="charter-acrylic relative mt-0 overflow-visible">
          <RosetteBadge className="absolute -left-8 -top-8 z-30 hidden md:block" label="BloomBay" />
          <RosetteBadge className="absolute -right-6 -top-6 z-30" label="NYC" />

          <div className="charter-paper charter-paper--luxury relative px-8 py-14 md:px-20 md:py-24">
            <PaperFoldEdge side="left" />
            <PaperFoldEdge side="right" />

            <div className="charter-rule mb-12" aria-hidden />
            <p className="text-center text-[10px] uppercase tracking-[0.55em] text-rose-gold">
              Historical Charter
            </p>

            <h2 className="charter-title mt-8 text-center font-display text-[clamp(1.6rem,4.5vw,2.85rem)] font-light leading-[1.05] tracking-[0.1em] text-ink stationery-emboss">
              THE FOUNDING MOTHERS
              <br />
              <span className="mt-2 block text-[0.85em] tracking-[0.14em]">OF BLOOMBAY</span>
            </h2>

            <div className="charter-rule mx-auto my-10 w-56" aria-hidden />

            <p className="text-center font-display text-2xl font-light italic leading-relaxed text-ink/85 md:text-3xl">
              The first women who help BloomBay bloom.
            </p>

            <ul className="mx-auto mt-16 max-w-lg space-y-0">
              {BENEFITS.map((benefit, i) => (
                <li key={benefit}>
                  <div className="charter-benefit group flex items-center gap-5 border-b border-blush/90 py-6 transition-all duration-500 hover:translate-x-2 hover:border-rose-gold/50">
                    <span className="font-display text-3xl font-light text-blush transition-colors group-hover:text-hot-pink">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="flex-1 font-display text-xl text-ink transition-colors group-hover:text-ink">
                      {benefit}
                    </span>
                    <WaxSeal size="sm" />
                  </div>
                </li>
              ))}
            </ul>

            <div className="relative mt-16 text-center">
              <p className="font-display text-[5rem] font-light leading-none text-hot-pink md:text-[6.5rem]">
                100
              </p>
              <p className="mt-4 text-[11px] uppercase tracking-[0.38em] text-ink/50">
                Limited to 100 women
              </p>
              <BloomBayPin className="absolute -right-4 top-1/2 hidden -translate-y-1/2 md:block" />
            </div>

            <div className="charter-rule mx-auto mt-16 mb-12 w-full max-w-md" aria-hidden />

            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={onJoin}
                className="luxury-cta luxury-cta--primary min-w-[220px]"
              >
                Join Waitlist
              </button>
              <button
                type="button"
                onClick={onFounding}
                className="luxury-cta min-w-[220px]"
              >
                Apply as Founding Mother
              </button>
            </div>
          </div>
        </AcrylicPanel>
      </div>
    </section>
  );
}
