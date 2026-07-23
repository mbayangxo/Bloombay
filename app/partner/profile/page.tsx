"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PartnerShell } from "../components/partner-shell";
import { partnerMemberHref } from "@/lib/partner-brand/paths";
import { SESSION_PARTNER_SLUG } from "@/lib/partner-brand/store";

interface Venue {
  name: string;
  type: string;
  neighborhood: string;
  city: string;
  address: string | null;
}

export default function PartnerProfilePage() {
  const [venue, setVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/partner-portal/my-venue")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.venue) setVenue(data.venue as Venue);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <PartnerShell title="Venue profile" sub="Basics — full brand identity lives in Brand.">
      <div className="pp-card">
        {loading ? (
          <p className="pp-dash__empty">Loading…</p>
        ) : venue ? (
          <>
            <h2>{venue.name}</h2>
            <p style={{ margin: "0 0 0.5rem", textTransform: "capitalize" }}>{venue.type}</p>
            <p style={{ margin: 0 }}>
              {venue.address ?? [venue.neighborhood, venue.city].filter(Boolean).join(", ")}
            </p>
          </>
        ) : (
          <p className="pp-dash__empty">No venue found for this account yet.</p>
        )}
      </div>
      <p style={{ fontSize: "0.82rem", color: "var(--pp-muted)", marginBottom: "1rem" }}>
        Customize colors, photos, About us slideshow, and menu in Brand identity.
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
        <Link href="/partner/brand" className="pp-btn pp-btn--primary">
          Edit brand identity →
        </Link>
        <Link
          href={partnerMemberHref(SESSION_PARTNER_SLUG)}
          className="pp-btn"
          target="_blank"
          rel="noopener noreferrer"
        >
          Preview member page →
        </Link>
      </div>
    </PartnerShell>
  );
}
