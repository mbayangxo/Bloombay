"use client";

import Link from "next/link";
import type { CityAtmosphere } from "@/lib/city-atmosphere";

export function CityTonightCard({ atmosphere }: { atmosphere: CityAtmosphere }) {
  return (
    <Link href="/member/tonight" className="bb-city-tonight">
      <div className="bb-city-tonight__glow" aria-hidden />
      <p className="bb-city-tonight__eyebrow">Tonight in {atmosphere.neighborhood}</p>
      <h2 className="bb-city-tonight__hood">{atmosphere.neighborhood}</h2>
      <p className="bb-city-tonight__city">
        {atmosphere.city} · {atmosphere.boroughLabel}
      </p>
      <div className="bb-city-tonight__weather">
        <span className="bb-city-tonight__temp">{atmosphere.tempF}°</span>
        <span className="bb-city-tonight__sky">{atmosphere.sky}</span>
      </div>
      <p className="bb-city-tonight__pulse">{atmosphere.neighborhoodPulse}</p>
      <span className="bb-city-tonight__enter">Walk into tonight →</span>
    </Link>
  );
}
