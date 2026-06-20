"use client";

import { BloomBayCrest } from "./bloombay-crest";
import { getClubCrestConfig, getClubDesignation } from "@/lib/crest-system";

export type ClubIdentityProps = {
  clubId: string;
  name: string;
  size?: "sm" | "md";
  layout?: "row" | "stack";
  showDesignation?: boolean;
  flippable?: boolean;
  className?: string;
};

/** Club name + auto-generated crest (identity, not plain text). */
export function ClubIdentity({
  clubId,
  name,
  size = "sm",
  layout = "row",
  showDesignation = false,
  flippable = false,
  className = "",
}: ClubIdentityProps) {
  const config = getClubCrestConfig(clubId);

  return (
    <div className={`bb-club-identity bb-club-identity--${layout}${className ? ` ${className}` : ""}`}>
      <BloomBayCrest
        clubName={name}
        clubId={clubId}
        config={config}
        size={size}
        flippable={flippable}
      />
      <div className="bb-club-identity__text">
        <span className="bb-club-identity__name">{name}</span>
        {showDesignation ? (
          <span className="bb-club-identity__designation">{getClubDesignation(clubId)}</span>
        ) : null}
      </div>
    </div>
  );
}
