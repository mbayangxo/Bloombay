"use client";

import { layerTransform } from "./use-parallax";
import {
  AcrylicPanel,
  BloomBayPin,
  GlassPetal,
  RosetteBadge,
  SatinRibbon,
} from "./luxury-decor";

export function AmbientWorld({
  mouse,
  scrollY,
}: {
  mouse: { x: number; y: number };
  scrollY: number;
}) {
  return (
    <div className="pointer-events-none fixed inset-0 z-[1] overflow-hidden" aria-hidden>
      {/* Off-screen acrylic shard — left */}
      <div
        className="absolute -left-[18%] top-[18%] w-[280px] transition-transform duration-700"
        style={{ transform: layerTransform(mouse, scrollY, 0.35) }}
      >
        <AcrylicPanel hover={false} className="rotate-[-14deg] px-8 py-10 opacity-70">
          <p className="font-display text-2xl text-ink/30">BloomBay</p>
          <p className="mt-2 text-[9px] uppercase tracking-[0.4em] text-ink/25">
            Society
          </p>
        </AcrylicPanel>
      </div>

      {/* Off-screen pin — right */}
      <div
        className="absolute -right-[4%] top-[32%]"
        style={{ transform: layerTransform(mouse, scrollY, 0.5) }}
      >
        <BloomBayPin />
      </div>

      {/* Rosette — top right bleeding off */}
      <div
        className="absolute -right-6 top-[8%]"
        style={{ transform: layerTransform(mouse, scrollY, 0.25) }}
      >
        <RosetteBadge label="NYC" />
      </div>

      {/* Ribbon strip — diagonal off bottom left */}
      <div
        className="absolute -left-[12%] bottom-[22%] w-[340px] rotate-[-8deg]"
        style={{ transform: `${layerTransform(mouse, scrollY, 0.2)} rotate(-8deg)` }}
      >
        <SatinRibbon>
          <p className="text-center font-display text-sm italic text-ink/50">
            Where you bloom
          </p>
        </SatinRibbon>
      </div>

      {/* Glass petals scattered */}
      <GlassPetal
        className="absolute left-[12%] top-[45%] h-10 w-8"
        style={{ transform: layerTransform(mouse, scrollY, 0.6) }}
      />
      <GlassPetal
        className="absolute right-[15%] top-[62%] h-14 w-10 opacity-80"
        style={{ transform: layerTransform(mouse, scrollY, 0.45) }}
      />
      <GlassPetal
        className="absolute left-[78%] top-[12%] h-8 w-6 opacity-60"
        style={{ transform: layerTransform(mouse, scrollY, 0.55) }}
      />

      {/* Bottom off-screen rosette */}
      <div
        className="absolute bottom-[-40px] left-[42%]"
        style={{ transform: layerTransform(mouse, scrollY, 0.15) }}
      >
        <RosetteBadge />
      </div>
    </div>
  );
}
