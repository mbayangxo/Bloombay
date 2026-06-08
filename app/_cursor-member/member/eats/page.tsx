"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { listPartnerBrands } from "@/lib/partner-brand/store";
import type { PartnerBrandProfile } from "@/lib/partner-brand/types";
import { EATS_CARD_TEMPLATES, EATS_FILTER_CHIPS, templateAt, type EatsFilterChip } from "@/lib/member-ui-templates";
import { partnerMatchesEatsFilter } from "@/lib/eats-categories";
import { EatsTemplateCard } from "@/app/components/member/eats-template-card";
import { MemberShell } from "../components/member-shell";
import { HappeningsChrome } from "../components/happenings-chrome";

function EatsContent() {
  const [partners, setPartners] = useState<PartnerBrandProfile[]>([]);
  const [filter, setFilter] = useState<EatsFilterChip>("All");

  useEffect(() => {
    setPartners(listPartnerBrands(true));
  }, []);

  const filtered = useMemo(
    () => partners.filter((spot) => partnerMatchesEatsFilter(spot, filter)),
    [partners, filter]
  );

  return (
    <MemberShell compactHeader flush fullWidth>
      <div className="bb-physical-surface">
      <HappeningsChrome>
        <div className="mp-happenings-sub">
          <h2 className="mp-happenings-sub__title">Eats</h2>
          <p className="mp-happenings-sub__sub">
            Girl favorites — tap a partner for About us, menu, and their brand page.
          </p>
        </div>
        <nav className="mp-eats-filters" aria-label="Eats categories">
          {EATS_FILTER_CHIPS.map((chip) => (
            <button
              key={chip}
              type="button"
              className={`mp-eats-filter${filter === chip ? " mp-eats-filter--active" : ""}`}
              onClick={() => setFilter(chip)}
            >
              {chip}
            </button>
          ))}
        </nav>
        <div className="bb-ui-png-stack bb-ui-png-stack--eats mp-page-body" style={{ paddingTop: 0, paddingInline: "1rem" }}>
          {filtered.map((spot, i) => (
            <EatsTemplateCard
              key={spot.id}
              partner={spot}
              templateSrc={templateAt(EATS_CARD_TEMPLATES, i)}
              index={i}
            />
          ))}
        </div>
        <section className="mp-page-body" style={{ paddingTop: 0 }}>
          <Link href="/member/maps" className="mp-btn mp-btn--outline mp-btn--block" style={{ textAlign: "center" }}>
            + Add your favorite spot on Maps
          </Link>
        </section>
      </HappeningsChrome>
      </div>
    </MemberShell>
  );
}

export default function EatsPage() {
  return (
    <Suspense fallback={<div style={{ padding: "2rem" }}>Loading…</div>}>
      <EatsContent />
    </Suspense>
  );
}
