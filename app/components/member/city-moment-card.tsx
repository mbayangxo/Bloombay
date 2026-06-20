"use client";

import Link from "next/link";
import { tieHeadline, tieHref, tiePlaceLine } from "@/lib/city-moment-ties";
import type { CityMomentView } from "@/lib/city-moments-store";

export type CityMomentTileSize = "square" | "tall" | "wide";

const PLACEHOLDER_EMOJI: Record<CityMomentView["tie"]["kind"], string> = {
  cafe: "☕",
  place: "📍",
  feeling: "✨",
};

export function CityMomentCard({
  moment,
  size = "square",
}: {
  moment: CityMomentView;
  size?: CityMomentTileSize;
}) {
  const href = moment.href || tieHref(moment.tie);
  const hasPhoto = Boolean(moment.imageUrl);

  return (
    <Link
      href={href}
      className={[
        "bb-city-photo",
        `bb-city-photo--${size}`,
        hasPhoto ? "bb-city-photo--has-img" : "bb-city-photo--placeholder",
        `bb-city-photo--${moment.tie.kind}`,
      ].join(" ")}
    >
      <div className="bb-city-photo__frame">
        {hasPhoto ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className="bb-city-photo__img"
            src={moment.imageUrl}
            alt=""
          />
        ) : (
          <span className="bb-city-photo__watermark" aria-hidden>
            {PLACEHOLDER_EMOJI[moment.tie.kind]}
          </span>
        )}
        <div className="bb-city-photo__shade" aria-hidden />
        <span className={`bb-city-photo__tie bb-city-photo__tie--${moment.tie.kind}`}>
          {tieHeadline(moment.tie)}
        </span>
        <div className="bb-city-photo__copy">
          <p className="bb-city-photo__place">
            {tiePlaceLine(moment.tie, moment.place)}
          </p>
          <p className="bb-city-photo__caption">{moment.caption}</p>
          <p className="bb-city-photo__meta">
            {moment.author} · {moment.when}
          </p>
        </div>
      </div>
    </Link>
  );
}

/** Stagger tile sizes for a lived-in photogrid. */
export function cityMomentTileSize(index: number): CityMomentTileSize {
  if (index % 7 === 0) return "wide";
  if (index % 5 === 2 || index % 5 === 4) return "tall";
  return "square";
}
