"use client";

import { useState } from "react";
import { ClubOwnerShell } from "../components/club-owner-shell";
import { ClubOwnerPageTitle } from "../components/club-owner-page";
import { BloomObjectIcon } from "@/app/components/bloom/bloom-object-icon";
import { BloomBayCrest } from "@/app/components/crest/bloombay-crest";
import { crestSymbolAsset } from "@/lib/bloom-object-assets";
import { getHostClubId } from "@/lib/club-host-store";
import { logAudit } from "@/lib/club-owner-store";
import { getClubProfile } from "@/lib/club-world-data";
import {
  CREST_ACCENTS,
  CREST_SYMBOLS,
  getClubCrestConfig,
  getClubDesignation,
  saveClubCrestConfig,
  type CrestAccentId,
  type CrestSymbolId,
} from "@/lib/crest-system";

export default function ClubOwnerCrestPage() {
  const clubId = getHostClubId();
  const club = getClubProfile(clubId);
  const initial = getClubCrestConfig(clubId);
  const [symbolId, setSymbolId] = useState<CrestSymbolId>(initial.symbolId);
  const [accentId, setAccentId] = useState<CrestAccentId>(initial.accentId);
  const [saved, setSaved] = useState(false);

  function save(e: React.FormEvent) {
    e.preventDefault();
    saveClubCrestConfig(clubId, { symbolId, accentId });
    logAudit(clubId, "Updated club crest", `${symbolId} · ${accentId}`);
    setSaved(true);
  }

  return (
    <ClubOwnerShell title="Club crest" backHref="/club-owner/dashboard">
      <ClubOwnerPageTitle
        eyebrow={club?.name}
        title="Club identity"
        sub="Like a house crest or a flag — pick one symbol and one accent. BloomBay generates the shield. No drag-and-drop."
      />

      <p className="co-crest-lock-note">
        Every crest pairs your symbol with the BloomBay rose. Tap the preview to flip and see the BloomBay origin on
        the back. Designation on the crest comes from your club type ({getClubDesignation(clubId)}).
      </p>

      <p className="co-crest-examples">
        Examples: book + rose, airplane + rose, wine + rose, paintbrush + rose, crescent + rose — same template,
        different houses.
      </p>

      <div className="co-crest-preview">
        <BloomBayCrest
          clubName={club?.name ?? "Your club"}
          clubId={clubId}
          config={{ symbolId, accentId }}
          size="lg"
          flippable
        />
      </div>

      <form onSubmit={save} className="co-form co-crest-pickers">
        <fieldset className="co-fieldset">
          <legend>Symbol (choose one)</legend>
          <div className="co-crest-symbol-grid">
            {CREST_SYMBOLS.map((sym) => (
              <button
                key={sym.id}
                type="button"
                className={`co-crest-symbol-btn${symbolId === sym.id ? " co-crest-symbol-btn--on" : ""}`}
                onClick={() => {
                  setSymbolId(sym.id);
                  setSaved(false);
                }}
              >
                <BloomObjectIcon src={crestSymbolAsset(sym.id)} size={52} motion="pulse" />
                {sym.label}
                <span>{sym.example}</span>
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="co-fieldset">
          <legend>Accent color (choose one)</legend>
          <div className="co-crest-accent-grid">
            {CREST_ACCENTS.map((acc) => (
              <button
                key={acc.id}
                type="button"
                className={`co-crest-accent-btn${accentId === acc.id ? " co-crest-accent-btn--on" : ""}`}
                onClick={() => {
                  setAccentId(acc.id);
                  setSaved(false);
                }}
              >
                <span
                  className="co-crest-accent-swatch"
                  style={{ background: `linear-gradient(135deg, ${acc.band}, ${acc.hex})` }}
                />
                <span>{acc.label}</span>
              </button>
            ))}
          </div>
        </fieldset>

        <button type="submit" className="co-btn co-btn--primary">
          Save crest identity
        </button>
        {saved ? (
          <p className="co-success">
            Saved — members see &ldquo;{club?.name}&rdquo; with this crest, not plain text.
          </p>
        ) : null}
      </form>
    </ClubOwnerShell>
  );
}
