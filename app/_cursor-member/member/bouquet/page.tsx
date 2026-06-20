"use client";

import { useState } from "react";
import Link from "next/link";
import { BloomObjectIcon } from "@/app/components/bloom/bloom-object-icon";
import { MemberShell } from "../components/member-shell";
import { BLOOM_OBJECTS } from "@/lib/bloom-object-assets";
import {
  BOUQUET,
  BOUQUET_CANDIDATES,
  BOUQUET_MAX,
  type Bloomie,
} from "@/lib/member-social-data";
import { useArtifactMotion } from "@/lib/use-artifact-motion";

export default function BouquetPage() {
  const [slots, setSlots] = useState(BOUQUET);
  const bouquetMotion = useArtifactMotion();
  const filled = slots.filter(Boolean).length;

  function addToSlot(person: Bloomie) {
    const idx = slots.findIndex((s) => s === null);
    if (idx === -1) return;
    bouquetMotion.trigger("bouquet-grow");
    setSlots((prev) => {
      const next = [...prev];
      next[idx] = person;
      return next;
    });
  }

  return (
    <MemberShell backHref="/member/lounge" backLabel="Apartment">
      <div className="mp-hero">
        <BloomObjectIcon
          src={BLOOM_OBJECTS.bouquet}
          size={56}
          animate={false}
          className={`mp-hero-object ${bouquetMotion.className}`}
        />
        <h1 className="mp-hero__title">Your bouquet</h1>
        <p className="mp-hero__sub">
          Only {BOUQUET_MAX} women — your inner circle, closer than Bloomies.
        </p>
      </div>

      <div className="mp-tier-card mp-tier-card--bouquet">
        <p style={{ margin: 0, fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.85 }}>
          Inner circle
        </p>
        <p style={{ margin: "0.35rem 0 0", fontSize: "1.35rem", fontWeight: 700 }}>
          {filled} / {BOUQUET_MAX}
        </p>
      </div>

      <div className="mp-bouquet-grid">
        {slots.map((slot, i) =>
          slot ? (
            <div key={i} className="mp-bouquet-slot mp-bouquet-slot--filled">
              <span className="mp-bouquet-slot__avatar">{slot.initial}</span>
              <span>{slot.name.split(" ")[0]}</span>
            </div>
          ) : (
            <div key={i} className="mp-bouquet-slot">
              <span>+</span>
              <span>Open</span>
            </div>
          )
        )}
      </div>

      <section className="mp-section">
        <p className="mp-section__title">Add from Bloomies or manually</p>
        {BOUQUET_CANDIDATES.map((c) => (
          <div key={c.id} className="mp-list-row">
            <div style={{ flex: 1 }}>
              <p className="mp-list-row__title">{c.name}</p>
              <p className="mp-list-row__meta">Bloomie</p>
            </div>
            <button
              type="button"
              className="mp-btn mp-btn--hot"
              style={{ padding: "0.4rem 0.75rem", fontSize: "0.7rem" }}
              disabled={filled >= BOUQUET_MAX}
              onClick={() => addToSlot(c)}
            >
              Add
            </button>
          </div>
        ))}
        <Link href="/member/bloomies" className="mp-link" style={{ display: "inline-block", marginTop: "0.75rem" }}>
          Browse all Bloomies →
        </Link>
      </section>
    </MemberShell>
  );
}
