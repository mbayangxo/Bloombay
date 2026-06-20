"use client";

import { BloomBayCrest } from "@/app/components/crest/bloombay-crest";
import type { CrestAccentId, CrestSymbolId } from "@/lib/crest-system";

export function ClubCrestPreview({
  mode,
  crestImageUrl,
  clubName,
  symbolId,
  accentId,
  size = "lg",
}: {
  mode: "upload" | "generate";
  crestImageUrl: string | null;
  clubName: string;
  symbolId?: CrestSymbolId;
  accentId?: CrestAccentId;
  size?: "sm" | "md" | "lg";
}) {
  const dim = size === "lg" ? 140 : size === "md" ? 88 : 64;

  if (mode === "upload" && crestImageUrl) {
    return (
      <div
        className="bb-club-crest-preview bb-club-crest-preview--upload"
        style={{ width: dim, height: dim }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={crestImageUrl} alt="" className="bb-club-crest-preview__img" />
      </div>
    );
  }

  if (mode === "generate" && symbolId && accentId) {
    return <BloomBayCrest clubName={clubName} config={{ symbolId, accentId }} size={size} />;
  }

  return (
    <div className="bb-club-crest-preview bb-club-crest-preview--empty" style={{ width: dim, height: dim }}>
      <span>Crest</span>
    </div>
  );
}
