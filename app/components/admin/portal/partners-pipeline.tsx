"use client";

import { useCallback, useMemo, useState } from "react";
import { formatDate } from "@/lib/admin-labels";
import {
  locationLabel,
  type WaitlistRow,
  type WaitlistStatus,
} from "@/lib/waitlist-admin";
import { PARTNER_APPLICATIONS, PARTNER_PIPELINE } from "@/lib/portal-dashboard-data";
import { StatusSelect } from "../status-select";
import { TickerNumber } from "./ticker-number";
import { BloomScore } from "./bloom-score";

type SeedPartner = (typeof PARTNER_APPLICATIONS)[number];
type PartnerFilter = "all" | "Cafés" | "Venues" | "Brands";

const FILTERS: PartnerFilter[] = ["all", "Cafés", "Venues", "Brands"];

function matchesFilter(p: SeedPartner, filter: PartnerFilter) {
  if (filter === "all") return true;
  if (filter === "Cafés") return p.type === "Cafés" || p.type === "Restaurants";
  return p.type === filter;
}

function PartnerTile({
  partner,
  selected,
  onSelect,
}: {
  partner: SeedPartner;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      className={`fp-partner-tile${selected ? " fp-partner-tile--active" : ""}`}
      onClick={onSelect}
    >
      <div className={`fp-partner-tile__img fp-partner-tile__img--${partner.photoType}`} />
      <span className="fp-partner-tile__type">{partner.type}</span>
      <strong>{partner.businessName}</strong>
      <span className="fp-partner-tile__hood">{partner.neighborhood}</span>
    </button>
  );
}

function PartnerDetail({ partner }: { partner: SeedPartner }) {
  return (
    <article className="fp-partner-detail fp-surface-white">
      <div className={`fp-partner-detail__hero fp-partner-detail__hero--${partner.photoType}`} />
      <div className="fp-partner-detail__body">
        <h3>{partner.businessName}</h3>
        <p className="fp-partner-detail__type">{partner.type}</p>
        <p>
          {partner.neighborhood} · {partner.location} · Capacity {partner.capacity}
        </p>
        <div className="fp-partner-detail__scores">
          <div>
            <span>Partnership</span>
            <BloomScore score={partner.partnershipScore} size="sm" />
          </div>
          <div>
            <span>Audience match</span>
            <strong>{partner.audienceMatch}%</strong>
          </div>
          <div>
            <span>Women interested</span>
            <strong>{partner.womenInterested.toLocaleString()}</strong>
          </div>
          <div>
            <span>Google</span>
            <strong>{partner.googleRating} ★</strong>
          </div>
        </div>
        <ul className="fp-partner-detail__meta">
          <li>{partner.website}</li>
          <li>{partner.instagram}</li>
          <li>{partner.googleMapsListed ? "On Google Maps" : "Not on Google Maps"}</li>
          <li>Applied {partner.date}</li>
        </ul>
        <div className="fp-partner-detail__actions">
          <button type="button" className="fp-portal-btn fp-portal-btn--pink">
            Approve
          </button>
          <button type="button" className="fp-portal-btn">
            Decline
          </button>
          <button type="button" className="fp-portal-btn">
            Contact
          </button>
        </div>
      </div>
    </article>
  );
}

export function PartnersPipeline({ initialRows }: { initialRows: WaitlistRow[] }) {
  const [rows, setRows] = useState(initialRows);
  const [updating, setUpdating] = useState<string | null>(null);
  const [filter, setFilter] = useState<PartnerFilter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(PARTNER_APPLICATIONS[0]?.id ?? null);

  const pending = useMemo(() => rows.filter((r) => r.status === "new"), [rows]);
  const approved = useMemo(() => rows.filter((r) => r.status === "approved"), [rows]);
  const rejected = useMemo(() => rows.filter((r) => r.status === "rejected"), [rows]);
  const contacted = useMemo(() => rows.filter((r) => r.status === "contacted"), [rows]);

  const updateStatus = useCallback(async (id: string, next: WaitlistStatus) => {
    setUpdating(id);
    try {
      const res = await fetch(`/api/admin/submissions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      if (!res.ok) throw new Error("Update failed");
      const { row } = (await res.json()) as { row: WaitlistRow };
      setRows((prev) => prev.map((r) => (r.id === id ? row : r)));
    } finally {
      setUpdating(null);
    }
  }, []);

  const showSeed = rows.length === 0;

  const pipeline = [
    { label: "Pending", count: showSeed ? PARTNER_PIPELINE.counts.pending : pending.length },
    { label: "Approved", count: showSeed ? PARTNER_PIPELINE.counts.approved : approved.length },
    { label: "Rejected", count: showSeed ? PARTNER_PIPELINE.counts.rejected : rejected.length },
    { label: "Contacted", count: contacted.length },
  ];

  const filteredPartners = useMemo(
    () => PARTNER_APPLICATIONS.filter((p) => matchesFilter(p, filter)),
    [filter]
  );

  const selected = filteredPartners.find((p) => p.id === selectedId) ?? filteredPartners[0];

  return (
    <div className="fp-portal-page fp-partners-page">
      <header className="fp-portal-hero fp-portal-hero--compact">
        <h2 className="fp-portal-hero__title">Partners</h2>
      </header>

      <div className="fp-partner-pipeline fp-partner-pipeline--large">
        {pipeline.map((p) => (
          <div key={p.label} className="fp-partner-pipeline__item">
            <TickerNumber value={p.count} className="fp-partner-pipeline__num" />
            <span>{p.label}</span>
          </div>
        ))}
      </div>

      <div className="fp-partner-filters">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            className={`fp-portal-tab${filter === f ? " fp-portal-tab--active" : ""}`}
            onClick={() => {
              setFilter(f);
              setSelectedId(null);
            }}
          >
            {f === "all" ? "All" : f}
          </button>
        ))}
      </div>

      {showSeed ? (
        <>
          <div className="fp-partner-gallery">
            {filteredPartners.map((p) => (
              <PartnerTile
                key={p.id}
                partner={p}
                selected={selected?.id === p.id}
                onSelect={() => setSelectedId(p.id)}
              />
            ))}
          </div>
          {selected ? <PartnerDetail partner={selected} /> : null}
        </>
      ) : (
        <div className="fp-partner-live-list">
          {rows.map((row) => (
            <article key={row.id} className="fp-surface-white fp-partner-live-row">
              <strong>{row.business_name ?? row.first_name}</strong>
              <span>{locationLabel(row)}</span>
              <StatusSelect
                value={row.status}
                disabled={updating === row.id}
                onChange={(s) => updateStatus(row.id, s)}
              />
              <span>{formatDate(row.created_at)}</span>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
