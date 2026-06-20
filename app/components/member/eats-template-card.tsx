"use client";

import { useEffect, useState } from "react";
import { partnerMemberHref } from "@/lib/partner-brand/paths";
import type { PartnerBrandProfile } from "@/lib/partner-brand/types";
import { seedSaveCount } from "@/lib/eats-categories";
import { PhysicalObject } from "./physical-object";

const SAVE_KEY_PREFIX = "bb_eats_save_";

function readSaveCount(slug: string): number {
  if (typeof window === "undefined") return seedSaveCount(slug);
  try {
    const raw = localStorage.getItem(`${SAVE_KEY_PREFIX}${slug}`);
    if (raw) return Math.max(0, parseInt(raw, 10) || 0);
  } catch {
    /* ignore */
  }
  return seedSaveCount(slug);
}

function writeSaveCount(slug: string, count: number) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(`${SAVE_KEY_PREFIX}${slug}`, String(count));
  } catch {
    /* ignore */
  }
}

export function EatsTemplateCard({
  partner,
  templateSrc,
  index,
}: {
  partner: PartnerBrandProfile;
  templateSrc: string;
  index: number;
}) {
  const [saved, setSaved] = useState(false);
  const [saveCount, setSaveCount] = useState(() => seedSaveCount(partner.slug));

  useEffect(() => {
    setSaveCount(readSaveCount(partner.slug));
    try {
      setSaved(localStorage.getItem(`${SAVE_KEY_PREFIX}${partner.slug}_heart`) === "1");
    } catch {
      /* ignore */
    }
  }, [partner.slug]);

  function toggleHeart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const next = !saved;
    setSaved(next);
    const nextCount = Math.max(0, saveCount + (next ? 1 : -1));
    setSaveCount(nextCount);
    writeSaveCount(partner.slug, nextCount);
    try {
      if (next) localStorage.setItem(`${SAVE_KEY_PREFIX}${partner.slug}_heart`, "1");
      else localStorage.removeItem(`${SAVE_KEY_PREFIX}${partner.slug}_heart`);
    } catch {
      /* ignore */
    }
  }

  return (
    <PhysicalObject
      src={templateSrc}
      alt={`${partner.name} — girl favorite`}
      href={partnerMemberHref(partner.slug)}
      tilt={(index % 3) - 1}
      className="bb-ui-png--eats-card"
    >
      {partner.heroImageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={partner.heroImageUrl}
          alt=""
          className="bb-ui-png__eats-photo"
          style={{ "--bb-eats-photo-rotate": `${(index % 3) - 1}deg` } as React.CSSProperties}
        />
      ) : null}
      <div className="bb-ui-png__eats-info">
        <h3 className="bb-ui-png__title">{partner.name}</h3>
        <p className="bb-ui-png__meta">{partner.neighborhood}</p>
      </div>
      <button
        type="button"
        className={`bb-ui-png__heart${saved ? " bb-ui-png__heart--on" : ""}`}
        aria-label={saved ? "Unsave" : "Save"}
        onClick={toggleHeart}
      >
        <span aria-hidden>{saved ? "♥" : "♡"}</span>
        <span className="bb-ui-png__save-count">{saveCount}</span>
      </button>
    </PhysicalObject>
  );
}
