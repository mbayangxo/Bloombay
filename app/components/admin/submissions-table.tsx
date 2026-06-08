"use client";

import { useCallback, useMemo, useState } from "react";
import { INTERESTS } from "@/app/components/bloom-suite/constants";
import {
  displayType,
  filterRows,
  locationLabel,
  type SignupType,
  type WaitlistRow,
  type WaitlistStatus,
  WAITLIST_STATUSES,
} from "@/lib/waitlist-admin";
import { formatDate, formatInterestList } from "@/lib/admin-labels";
import { StatusSelect } from "./status-select";

function typeClass(type: SignupType): string {
  if (type === "club_host") return "bb-admin-type-pill bb-admin-type-pill--club";
  if (type === "partner") return "bb-admin-type-pill bb-admin-type-pill--partner";
  return "bb-admin-type-pill bb-admin-type-pill--member";
}

function detailColumn(row: WaitlistRow): string {
  if (row.signup_type === "club_host") {
    return row.club_name ?? "—";
  }
  if (row.signup_type === "partner") {
    return row.business_name ?? "—";
  }
  return row.neighborhood ?? "—";
}

function referralSource(row: WaitlistRow): string {
  if (row.founding_mother) return "Founding invite";
  if (row.extra_notes?.trim()) return row.extra_notes.trim();
  return "Waitlist";
}

function instagramOrSocial(row: WaitlistRow): string {
  return row.business_socials?.trim() || "—";
}

export function SubmissionsTable({
  initialRows,
  initialFilters,
  showActions = false,
}: {
  initialRows: WaitlistRow[];
  initialFilters?: {
    type?: string;
    status?: string;
    city?: string;
    interest?: string;
  };
  showActions?: boolean;
}) {
  const [rows, setRows] = useState(initialRows);
  const [type, setType] = useState(initialFilters?.type ?? "all");
  const [status, setStatus] = useState(initialFilters?.status ?? "all");
  const [city, setCity] = useState(initialFilters?.city ?? "all");
  const [interest, setInterest] = useState(initialFilters?.interest ?? "all");
  const [updating, setUpdating] = useState<string | null>(null);

  const cities = useMemo(() => {
    const set = new Set<string>();
    for (const r of rows) {
      if (r.city) set.add(r.city);
    }
    return [...set].sort();
  }, [rows]);

  const filtered = useMemo(
    () =>
      filterRows(rows, {
        type: type as SignupType | "all",
        status: status as WaitlistStatus | "all",
        city: city === "all" ? undefined : city,
        interest: interest === "all" ? undefined : interest,
      }),
    [rows, type, status, city, interest]
  );

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

  return (
    <>
      <div className="bb-admin-filters" role="search">
        <select value={type} onChange={(e) => setType(e.target.value)} aria-label="Type">
          <option value="all">All types</option>
          <option value="member">Member</option>
          <option value="club_host">Club</option>
          <option value="partner">Partner</option>
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Status">
          <option value="all">All statuses</option>
          {WAITLIST_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select value={city} onChange={(e) => setCity(e.target.value)} aria-label="City">
          <option value="all">All cities</option>
          {cities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select value={interest} onChange={(e) => setInterest(e.target.value)} aria-label="Interest">
          <option value="all">All interests</option>
          {INTERESTS.map((i) => (
            <option key={i.id} value={i.id}>
              {i.label}
            </option>
          ))}
        </select>
        <span style={{ alignSelf: "center", fontSize: "0.85rem", color: "var(--bb-muted)" }}>
          {filtered.length} shown
        </span>
      </div>

      <div className="bb-admin-table-wrap">
        <table className="bb-admin-table">
          <thead>
            <tr>
              <th>Photo</th>
              <th>Type</th>
              <th>Name</th>
              <th>City</th>
              <th>Neighborhood</th>
              <th>Instagram</th>
              <th>Email</th>
              <th>Referral</th>
              <th>Interest</th>
              <th>Status</th>
              <th>Applied</th>
              {showActions ? <th>Actions</th> : null}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={showActions ? 12 : 11} className="bb-admin-empty">
                  No submissions match these filters.
                </td>
              </tr>
            ) : (
              filtered.map((row) => (
                <tr key={row.id}>
                  <td>
                    <span className="fp-inbox-avatar" aria-hidden>
                      {(row.first_name ?? "?").charAt(0).toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <span className={typeClass(row.signup_type)}>{displayType(row.signup_type)}</span>
                  </td>
                  <td>
                    <strong>{row.first_name ?? "—"}</strong>
                    <br />
                    <small style={{ color: "var(--bb-muted)" }}>{detailColumn(row)}</small>
                  </td>
                  <td>{locationLabel(row)}</td>
                  <td>{row.neighborhood ?? "—"}</td>
                  <td>{instagramOrSocial(row)}</td>
                  <td>
                    {row.email ? (
                      <a href={`mailto:${row.email}`} style={{ color: "var(--bb-hot-deep)" }}>
                        {row.email}
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td>{referralSource(row)}</td>
                  <td>
                    {row.signup_type === "member"
                      ? formatInterestList(row.interests)
                      : row.signup_type === "club_host"
                        ? row.club_platform ?? "—"
                        : row.business_type ?? "—"}
                  </td>
                  <td>
                    <StatusSelect
                      value={row.status}
                      disabled={updating === row.id}
                      onChange={(s) => updateStatus(row.id, s)}
                    />
                  </td>
                  <td>{formatDate(row.created_at)}</td>
                  {showActions ? (
                    <td>
                      <div className="fp-row-actions">
                        <button
                          type="button"
                          className="fp-btn fp-btn--approve"
                          disabled={updating === row.id}
                          onClick={() => updateStatus(row.id, "approved")}
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          className="fp-btn fp-btn--ghost"
                          disabled={updating === row.id}
                          onClick={() => updateStatus(row.id, "rejected")}
                        >
                          Reject
                        </button>
                        <button
                          type="button"
                          className="fp-btn fp-btn--ghost"
                          disabled={updating === row.id}
                          onClick={() => updateStatus(row.id, "reviewed")}
                        >
                          Review
                        </button>
                      </div>
                    </td>
                  ) : null}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
