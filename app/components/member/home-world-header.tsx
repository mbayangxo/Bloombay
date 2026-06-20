"use client";

import Link from "next/link";
import { YandeConciergeStrip } from "@/app/components/member/yande-concierge-strip";
import { BloomObjectIcon } from "@/app/components/bloom/bloom-object-icon";
import { HOME_PLACE_GRID } from "@/lib/home-place-grid";
import type { CityAtmosphere } from "@/lib/city-atmosphere";

export function HomeWorldHeader({
  greeting,
  name,
  atmosphere,
}: {
  greeting: string;
  name: string;
  atmosphere: CityAtmosphere;
}) {
  const displayName = name.trim() || "there";

  return (
    <header className="bb-home-top">
      <div className="bb-home-top__hero">
        <div className="bb-home-top__intro">
          <p className="bb-home-top__greeting-line">{greeting}</p>
          <h1 className="bb-home-top__name">{displayName}</h1>
        </div>
        <div className="bb-home-top__weather">
          <span className="bb-home-top__temp">{atmosphere.tempF}°</span>
          <span className="bb-home-top__sky">{atmosphere.sky}</span>
          <p className="bb-home-top__pulse">{atmosphere.neighborhoodPulse}</p>
        </div>
        <div className="bb-home-top__yande">
          <YandeConciergeStrip variant="text" />
        </div>
      </div>

      <nav className="bb-home-places" aria-label="Enter a place">
        {HOME_PLACE_GRID.map((place, i) => (
          <Link key={place.id} href={place.href} className="bb-home-place">
            <BloomObjectIcon
              src={place.object}
              size={40}
              animate={i < 2}
              className="bb-home-place__object"
            />
            <span className="bb-home-place__label">{place.label}</span>
          </Link>
        ))}
      </nav>
    </header>
  );
}
