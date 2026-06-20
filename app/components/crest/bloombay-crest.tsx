"use client";

import Image from "next/image";
import { useState } from "react";
import {
  BLOOM_OBJECTS,
  CREST_ROSE_MOTIF,
  crestSymbolAsset,
} from "@/lib/bloom-object-assets";
import {
  getAccentMeta,
  getClubDesignation,
  getSymbolMeta,
  type ClubCrestConfig,
} from "@/lib/crest-system";

export type BloomBayCrestProps = {
  clubName: string;
  config: ClubCrestConfig;
  clubId?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  /** Tap / flip to see BloomBay origin on the back */
  flippable?: boolean;
};

const CREST_DIMS = { sm: 88, md: 140, lg: 200 } as const;

export function BloomBayCrest({
  clubName,
  config,
  clubId,
  size = "md",
  className = "",
  flippable = false,
}: BloomBayCrestProps) {
  const [flipped, setFlipped] = useState(false);
  const accent = getAccentMeta(config.accentId);
  const symbol = getSymbolMeta(config.symbolId);
  const designation = clubId ? getClubDesignation(clubId) : "";
  const displayName =
    clubName.length > 22 ? `${clubName.slice(0, 20)}…` : clubName;
  const dim = CREST_DIMS[size];
  const symbolSize = Math.round(dim * 0.38);
  const roseSize = Math.round(dim * 0.22);
  const inkText = config.accentId === "ivory" ? "var(--bb-ink)" : "#ffffff";

  const front = (
    <div
      className="bb-crest__face bb-crest__face--front"
      style={{
        ["--crest-accent" as string]: accent.hex,
        ["--crest-band" as string]: accent.band,
        ["--crest-ink" as string]: inkText,
      }}
    >
      <div
        className="bb-crest__accent-wash"
        style={{ background: `linear-gradient(165deg, ${accent.band} 0%, ${accent.hex} 100%)` }}
        aria-hidden
      />
      <Image
        src={BLOOM_OBJECTS.crest}
        alt=""
        width={dim}
        height={Math.round(dim * 1.22)}
        unoptimized
        className="bb-crest__shield-img"
        aria-hidden
      />
      <div className="bb-crest__symbol-slot">
        <Image
          src={crestSymbolAsset(config.symbolId)}
          alt=""
          width={symbolSize}
          height={symbolSize}
          unoptimized
          className="bb-crest__symbol-img"
          aria-hidden
        />
      </div>
      <div className="bb-crest__rose-slot">
        <Image
          src={CREST_ROSE_MOTIF}
          alt=""
          width={roseSize}
          height={roseSize}
          unoptimized
          className="bb-crest__rose-img bb-object-wrap bb-object--grow"
          aria-hidden
        />
      </div>
      <div className="bb-crest__overlay">
        {designation ? (
          <span className="bb-crest__overlay-designation">{designation}</span>
        ) : null}
        <span className="bb-crest__overlay-club">{displayName}</span>
      </div>
    </div>
  );

  const back = (
    <div className="bb-crest__face bb-crest__face--back">
      <Image
        src="/logosbloombay/Vector.svg"
        alt=""
        width={Math.round(dim * 0.45)}
        height={Math.round(dim * 0.45)}
        unoptimized
        className="bb-crest__origin-logo"
        aria-hidden
      />
      <p className="bb-crest__origin-title">BloomBay</p>
      <p className="bb-crest__origin-sub">Origin crest · {symbol.label} house</p>
      <p className="bb-crest__origin-accent">{accent.label} accent</p>
    </div>
  );

  const cube = (
    <div className="bb-crest__cube" style={{ width: dim, height: Math.round(dim * 1.22) }}>
      {front}
      {back}
    </div>
  );

  return (
    <figure
      className={`bb-crest bb-crest--${size} bb-crest--generated${flippable ? " bb-crest--flippable" : ""}${flipped ? " bb-crest--flipped" : ""}${className ? ` ${className}` : ""}`}
      aria-label={`${clubName} crest, ${symbol.label} with ${accent.label} accent`}
    >
      {flippable ? (
        <button
          type="button"
          className="bb-crest__flip-hit"
          onClick={() => setFlipped((f) => !f)}
          aria-label={flipped ? "Show club crest front" : "Show BloomBay crest origin"}
        >
          {cube}
        </button>
      ) : (
        <div className="bb-crest__flip-hit bb-crest__flip-hit--static">{cube}</div>
      )}
      <figcaption className="bb-crest__caption">
        <span className="bb-crest__caption-cat">
          {symbol.label} · {accent.label}
        </span>
      </figcaption>
    </figure>
  );
}
