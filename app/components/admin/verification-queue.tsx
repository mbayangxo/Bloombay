"use client";

import { useCallback, useMemo, useState } from "react";
import { formatDate, formatInterestList } from "@/lib/admin-labels";
import {
  displayType,
  filterRows,
  locationLabel,
  type WaitlistRow,
  type WaitlistStatus,
} from "@/lib/waitlist-admin";
import { VERIFICATION_STATS } from "@/lib/portal-dashboard-data";
import { TickerNumber } from "./portal/ticker-number";

type Tab = "pending" | "approved" | "rejected";

function referralLabel(row: WaitlistRow): string {
  if (row.founding_mother) return "Founding invite";
  if (row.extra_notes?.trim()) return row.extra_notes.trim();
  return "Waitlist application";
}

function parseSocials(row: WaitlistRow) {
  const raw = row.business_socials?.trim() || "";
  return {
    instagram: raw.includes("@") ? raw : raw || "—",
    tiktok: raw.toLowerCase().includes("tiktok") ? raw : "—",
  };
}

export function VerificationQueue({ initialRows }: { initialRows: WaitlistRow[] }) {
  const [rows, setRows] = useState(initialRows);
  const [updating, setUpdating] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("pending");
  const [index, setIndex] = useState(0);

  const members = useMemo(() => filterRows(rows, { type: "member" }), [rows]);

  const pending = useMemo(
    () =>
      members.filter((r) =>
        ["new", "reviewed", "contacted"].includes(r.status)
      ),
    [members]
  );

  const approved = useMemo(
    () => members.filter((r) => r.status === "approved"),
    [members]
  );

  const rejected = useMemo(
    () => members.filter((r) => r.status === "rejected"),
    [members]
  );

  const queue =
    tab === "pending" ? pending : tab === "approved" ? approved : rejected;

  const row = queue[index];

  const updateStatus = useCallback(async (id: string, status: WaitlistStatus) => {
    setUpdating(id);
    try {
      const res = await fetch(`/api/admin/submissions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Update failed");
      const { row: updated } = (await res.json()) as { row: WaitlistRow };
      setRows((prev) => prev.map((r) => (r.id === id ? updated : r)));
      setIndex((i) => Math.max(0, i - (tab === "pending" ? 1 : 0)));
    } finally {
      setUpdating(null);
    }
  }, [tab]);

  return (
    <div className="fp-portal-page fp-verify-page">
      <header className="fp-portal-hero">
        <p className="fp-portal-hero__kicker">Verification</p>
        <h2 className="fp-portal-hero__title">One woman at a time</h2>
        <div className="fp-verify-hero-stats">
          <span>
            <TickerNumber value={VERIFICATION_STATS.waitingToday} className="fp-display-num fp-display-num--sm" />{" "}
            today
          </span>
          <span>
            <TickerNumber value={VERIFICATION_STATS.waitingWeek} className="fp-display-num fp-display-num--sm" />{" "}
            this week
          </span>
          <span>{VERIFICATION_STATS.avgReviewHours}h avg review</span>
        </div>
      </header>

      <div className="fp-portal-tabs">
        {(
          [
            { id: "pending" as const, label: "Pending", count: pending.length },
            { id: "approved" as const, label: "Approved", count: approved.length },
            { id: "rejected" as const, label: "Rejected", count: rejected.length },
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            type="button"
            className={`fp-portal-tab${tab === t.id ? " fp-portal-tab--active" : ""}`}
            onClick={() => {
              setTab(t.id);
              setIndex(0);
            }}
          >
            {t.label} ({t.count})
          </button>
        ))}
      </div>

      {queue.length === 0 ? (
        <p className="fp-portal-empty">No women in this queue.</p>
      ) : row ? (
        <>
          <div className="fp-verify-nav">
            <button
              type="button"
              className="fp-portal-btn"
              disabled={index === 0}
              onClick={() => setIndex((i) => i - 1)}
            >
              ← Previous
            </button>
            <span className="fp-portal-muted">
              {index + 1} of {queue.length}
            </span>
            <button
              type="button"
              className="fp-portal-btn"
              disabled={index >= queue.length - 1}
              onClick={() => setIndex((i) => i + 1)}
            >
              Next →
            </button>
          </div>

          <article className="fp-verify-spotlight">
            <div className="fp-verify-spotlight__photos">
              <div className="fp-verify-spotlight__photo">
                <span>Profile</span>
                <div className="fp-verify-spotlight__img" aria-hidden>
                  {(row.first_name ?? "?").charAt(0).toUpperCase()}
                </div>
              </div>
              <div className="fp-verify-spotlight__photo">
                <span>Selfie</span>
                <div className="fp-verify-spotlight__img fp-verify-spotlight__img--selfie" aria-hidden>
                  ✦
                </div>
              </div>
            </div>

            <div className="fp-verify-spotlight__body">
              <h3>{row.first_name ?? "—"}</h3>
              <p className="fp-verify-spotlight__loc">{locationLabel(row)}</p>
              <p className="fp-portal-muted">
                {displayType(row.signup_type)} · {formatDate(row.created_at)}
              </p>

              <dl className="fp-verify-spotlight__grid">
                <div>
                  <dt>Instagram</dt>
                  <dd>{parseSocials(row).instagram}</dd>
                </div>
                <div>
                  <dt>TikTok</dt>
                  <dd>{parseSocials(row).tiktok}</dd>
                </div>
                <div>
                  <dt>Referral</dt>
                  <dd>{referralLabel(row)}</dd>
                </div>
                <div>
                  <dt>Club interests</dt>
                  <dd>{formatInterestList(row.interests)}</dd>
                </div>
                <div>
                  <dt>Email</dt>
                  <dd>{row.email ?? "—"}</dd>
                </div>
              </dl>
            </div>

            <div className="fp-verify-spotlight__actions">
              <button
                type="button"
                className="fp-portal-btn fp-portal-btn--pink"
                disabled={updating === row.id}
                onClick={() => updateStatus(row.id, "approved")}
              >
                Approve
              </button>
              <button
                type="button"
                className="fp-portal-btn"
                disabled={updating === row.id}
                onClick={() => updateStatus(row.id, "rejected")}
              >
                Reject
              </button>
              <button
                type="button"
                className="fp-portal-btn"
                disabled={updating === row.id}
                onClick={() => updateStatus(row.id, "contacted")}
              >
                Request new selfie
              </button>
            </div>
          </article>
        </>
      ) : null}
    </div>
  );
}
