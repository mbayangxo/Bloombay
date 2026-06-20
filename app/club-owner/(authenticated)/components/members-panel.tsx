"use client";

import { useState } from "react";
import {
  exportMembersCsv,
  logAudit,
  setMemberStatus,
} from "@/lib/club-owner-store";
import {
  getMemberAttendanceHistory,
  listMembersWithRoles,
  setMemberRole,
  type ClubMemberRole,
} from "@/lib/club-operations-store";
function initials(name: string) {
  return name
    .split(/\s+/)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function MembersPanel({ clubId }: { clubId: string }) {
  const [q, setQ] = useState("");
  const [showBlocked, setShowBlocked] = useState(false);
  const [members, setMembers] = useState(() => listMembersWithRoles(clubId));
  const [selected, setSelected] = useState<(typeof members)[0] | null>(null);

  function refresh() {
    let list = listMembersWithRoles(clubId);
    if (!showBlocked) list = list.filter((m) => m.status !== "blocked");
    if (q.trim()) {
      const ql = q.toLowerCase();
      list = list.filter(
        (m) => m.name.toLowerCase().includes(ql) || m.city.toLowerCase().includes(ql)
      );
    }
    setMembers(list);
  }

  function block(id: string) {
    setMemberStatus(id, "blocked");
    logAudit(clubId, "Blocked member", selected?.name);
    refresh();
    setSelected(null);
  }

  function remove(id: string) {
    setMemberStatus(id, "removed");
    logAudit(clubId, "Removed member", selected?.name);
    refresh();
    setSelected(null);
  }

  function restore(id: string) {
    setMemberStatus(id, "active");
    logAudit(clubId, "Restored member", selected?.name);
    refresh();
  }

  function downloadCsv() {
    const csv = exportMembersCsv(clubId);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${clubId}-members.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="co-members-layout">
      <div className="co-members-toolbar">
        <input
          className="co-input"
          placeholder="Search women…"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            const ql = e.target.value;
            let list = listMembersWithRoles(clubId);
            if (!showBlocked) list = list.filter((m) => m.status !== "blocked");
            if (ql.trim()) {
              const lq = ql.toLowerCase();
              list = list.filter(
                (m) => m.name.toLowerCase().includes(lq) || m.city.toLowerCase().includes(lq)
              );
            }
            setMembers(list);
          }}
        />
        <label className="co-toggle">
          <input
            type="checkbox"
            checked={showBlocked}
            onChange={(e) => {
              setShowBlocked(e.target.checked);
              refresh();
            }}
          />
          <span>Show blocked</span>
        </label>
        <button type="button" className="co-btn co-btn--ghost" onClick={downloadCsv}>
          Export CSV
        </button>
      </div>

      <div className={`co-applications-layout${selected ? " co-applications-layout--open" : ""}`}>
        <ul className="co-application-list">
          {members.map((m) => (
            <li key={m.id}>
              <button
                type="button"
                className={`co-application-row${selected?.id === m.id ? " co-application-row--selected" : ""}`}
                onClick={() => setSelected(m)}
              >
                <span className="co-application-row__photo" style={{ background: m.photoGradient }}>
                  {initials(m.name)}
                </span>
                <span className="co-application-row__body">
                  <span className="co-application-row__top">
                    <strong>{m.name}</strong>
                    <span className={`co-badge co-badge--${m.status === "active" ? "approved" : "denied"}`}>
                      {m.status}
                    </span>
                  </span>
                  <span className="co-application-row__meta">
                    <span className={`co-role-pill co-role-pill--${m.role}`}>{m.role}</span>
                    {" "}
                    {m.city} · joined {new Date(m.joinedAt).toLocaleDateString()}
                  </span>
                </span>
                <span className="co-application-row__chevron">→</span>
              </button>
            </li>
          ))}
        </ul>

        {selected ? (
          <article className="co-application-detail">
            <button type="button" className="co-application-detail__back" onClick={() => setSelected(null)}>
              ← Women
            </button>
            <div className="co-application-detail__hero">
              <div className="co-application-detail__photo" style={{ background: selected.photoGradient }}>
                <span>{initials(selected.name)}</span>
              </div>
              <div>
                <h2 className="co-application-detail__name">{selected.name}</h2>
                <p className="co-application-detail__meta">{selected.city}</p>
              </div>
            </div>
            <p className="co-hint">Last active: {selected.lastActive ?? "—"}</p>
            <label className="co-field" style={{ marginTop: "0.75rem" }}>
              Role
              <select
                className="co-input"
                value={selected.role}
                onChange={(e) => {
                  setMemberRole(selected.id, e.target.value as ClubMemberRole);
                  logAudit(clubId, `Set role ${e.target.value}`, selected.name);
                  refresh();
                  setSelected({ ...selected, role: e.target.value as ClubMemberRole });
                }}
              >
                {(["owner", "admin", "moderator", "member", "volunteer"] as const).map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </label>
            <div className="co-stack" style={{ marginTop: "0.75rem" }}>
              <p className="co-section__title">Attendance history</p>
              {getMemberAttendanceHistory(selected.id, clubId).length === 0 ? (
                <p className="co-hint">No check-ins yet — scan QR at your next gathering.</p>
              ) : (
                <ul className="co-app-list">
                  {getMemberAttendanceHistory(selected.id, clubId).map((c) => (
                    <li key={c.id} className="co-hint">
                      {c.eventTitle} · {new Date(c.checkedInAt).toLocaleString()}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {selected.status === "active" ? (
              <div className="co-application-detail__actions">
                <button type="button" className="co-btn co-btn--ghost" onClick={() => block(selected.id)}>
                  Block member
                </button>
                <button type="button" className="co-btn co-btn--primary" style={{ background: "#121212" }} onClick={() => remove(selected.id)}>
                  Remove from club
                </button>
              </div>
            ) : selected.status === "blocked" ? (
              <div className="co-application-detail__actions">
                <button type="button" className="co-btn co-btn--primary" onClick={() => restore(selected.id)}>
                  Unblock
                </button>
                <button type="button" className="co-btn co-btn--ghost" onClick={() => remove(selected.id)}>
                  Remove permanently
                </button>
              </div>
            ) : null}
          </article>
        ) : (
          <div className="co-application-placeholder">
            <p>Select a member to block or remove.</p>
          </div>
        )}
      </div>
    </div>
  );
}
