"use client";

import { useCallback, useMemo, useState } from "react";
import { formatDate } from "@/lib/admin-labels";
import {
  CAREER_ROLE_CATEGORIES,
  displayRoleCategory,
  filterCareerRows,
  type CareerApplicationRow,
  type CareerApplicationStatus,
  type CareerRoleCategory,
} from "@/lib/careers-admin";
import { CareersStatusSelect } from "../careers-status-select";
import { TickerNumber } from "./ticker-number";

export function CareersMissionPanel({ initialRows }: { initialRows: CareerApplicationRow[] }) {
  const [rows, setRows] = useState(initialRows);
  const [statusFilter, setStatusFilter] = useState<CareerApplicationStatus | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState<CareerRoleCategory | "all">("all");
  const [updating, setUpdating] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(
    initialRows.find((r) => r.status === "new")?.id ?? initialRows[0]?.id ?? null
  );

  const newCount = useMemo(
    () => rows.filter((r) => r.status === "new" || r.status === "reviewed").length,
    [rows]
  );

  const filtered = useMemo(
    () => filterCareerRows(rows, { status: statusFilter, category: categoryFilter }),
    [rows, statusFilter, categoryFilter]
  );

  const selected = filtered.find((r) => r.id === selectedId) ?? filtered[0] ?? null;

  const updateStatus = useCallback(async (id: string, status: CareerApplicationStatus) => {
    setUpdating(id);
    try {
      const res = await fetch(`/api/careers/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error ?? "Update failed");
      }
      const { row } = (await res.json()) as { row: CareerApplicationRow };
      setRows((prev) => prev.map((r) => (r.id === id ? row : r)));
    } finally {
      setUpdating(null);
    }
  }, []);

  return (
    <div className="fp-portal-page fp-careers-page">
      <header className="fp-portal-hero">
        <p className="fp-portal-hero__kicker">Careers</p>
        <h2 className="fp-portal-hero__title">People building BloomBay with us</h2>
        <p className="fp-portal-hero__sub">
          Applications from{" "}
          <a href="/careers" target="_blank" rel="noopener noreferrer">
            bloombay.app/careers
          </a>
          — review resumes, update status, and follow up.
        </p>
      </header>

      <div className="fp-careers-stats fp-surface-white">
        <div>
          <TickerNumber value={newCount} className="fp-careers-stats__num" />
          <span className="fp-careers-stats__label">in review queue</span>
        </div>
        <div>
          <TickerNumber value={rows.length} className="fp-careers-stats__num" />
          <span className="fp-careers-stats__label">total applications</span>
        </div>
      </div>

      <div className="fp-careers-toolbar">
        <label>
          Status
          <select
            className="bb-admin-filter-select"
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as CareerApplicationStatus | "all")
            }
          >
            <option value="all">All</option>
            {(["new", "reviewed", "contacted", "approved", "rejected"] as const).map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <label>
          Team
          <select
            className="bb-admin-filter-select"
            value={categoryFilter}
            onChange={(e) =>
              setCategoryFilter(e.target.value as CareerRoleCategory | "all")
            }
          >
            <option value="all">All</option>
            {CAREER_ROLE_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {displayRoleCategory(c)}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="fp-careers-layout">
        <ul className="fp-careers-list fp-surface-white" aria-label="Applications">
          {filtered.length === 0 ? (
            <li className="fp-careers-list__empty">No applications match these filters.</li>
          ) : (
            filtered.map((row) => (
              <li key={row.id}>
                <button
                  type="button"
                  className={`fp-careers-list__item${selected?.id === row.id ? " fp-careers-list__item--active" : ""}`}
                  onClick={() => setSelectedId(row.id)}
                >
                  <span className="fp-careers-list__name">{row.first_name}</span>
                  <span className="fp-careers-list__role">{row.role_title}</span>
                  <span className={`fp-careers-list__status fp-careers-list__status--${row.status}`}>
                    {row.status}
                  </span>
                </button>
              </li>
            ))
          )}
        </ul>

        {selected ? (
          <article className="fp-careers-detail fp-surface-barbie">
            <header className="fp-careers-detail__head">
              <div>
                <h3>{selected.first_name}</h3>
                <p className="fp-careers-detail__role">{selected.role_title}</p>
                <p className="fp-careers-detail__meta">
                  {displayRoleCategory(selected.role_category)}
                  {selected.city ? ` · ${selected.city}` : ""}
                </p>
              </div>
              <CareersStatusSelect
                value={selected.status}
                disabled={updating === selected.id || selected.id.startsWith("seed-")}
                onChange={(status) => updateStatus(selected.id, status)}
              />
            </header>

            <dl className="fp-careers-detail__fields">
              <div>
                <dt>Email</dt>
                <dd>
                  <a href={`mailto:${selected.email}`}>{selected.email}</a>
                </dd>
              </div>
              {selected.phone ? (
                <div>
                  <dt>Phone</dt>
                  <dd>
                    <a href={`tel:${selected.phone}`}>{selected.phone}</a>
                  </dd>
                </div>
              ) : null}
              <div>
                <dt>Applied</dt>
                <dd>{formatDate(selected.created_at)}</dd>
              </div>
              {selected.resume_url ? (
                <div>
                  <dt>Resume</dt>
                  <dd>
                    <a href={selected.resume_url} target="_blank" rel="noopener noreferrer">
                      Open resume / CV
                    </a>
                  </dd>
                </div>
              ) : null}
              {selected.linkedin_url ? (
                <div>
                  <dt>LinkedIn</dt>
                  <dd>
                    <a href={selected.linkedin_url} target="_blank" rel="noopener noreferrer">
                      Profile
                    </a>
                  </dd>
                </div>
              ) : null}
              {selected.portfolio_url ? (
                <div>
                  <dt>Portfolio</dt>
                  <dd>
                    <a href={selected.portfolio_url} target="_blank" rel="noopener noreferrer">
                      Work samples
                    </a>
                  </dd>
                </div>
              ) : null}
            </dl>

            {selected.cover_letter ? (
              <section className="fp-careers-detail__letter">
                <h4>Cover letter</h4>
                <p>{selected.cover_letter}</p>
              </section>
            ) : null}

            {selected.id.startsWith("seed-") ? (
              <p className="fp-careers-detail__demo">
                Demo row — run{" "}
                <code>supabase/migrations/005_careers_applications.sql</code> and apply at /careers
                for live data.
              </p>
            ) : null}
          </article>
        ) : null}
      </div>
    </div>
  );
}
