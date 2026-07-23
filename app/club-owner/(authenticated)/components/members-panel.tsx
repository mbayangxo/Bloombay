"use client";

import { useCallback, useEffect, useState } from "react";
import { logAudit } from "@/lib/club-owner-store";

type ApiMember = {
  user_id: string;
  name: string;
  neighborhood: string;
  avatar_url: string | null;
  joined_at: string | null;
  joined_label: string;
};

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
  const [allMembers, setAllMembers] = useState<ApiMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ApiMember | null>(null);
  const [removing, setRemoving] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/club-portal/members");
      if (res.ok) setAllMembers((await res.json()) as ApiMember[]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const ql = q.trim().toLowerCase();
  const members = ql
    ? allMembers.filter(
        (m) => m.name.toLowerCase().includes(ql) || m.neighborhood.toLowerCase().includes(ql)
      )
    : allMembers;

  async function removeMember(userId: string, name: string) {
    setRemoving(true);
    try {
      const res = await fetch("/api/club-portal/members", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId }),
      });
      if (res.ok) {
        logAudit(clubId, "Removed member", name);
        setSelected(null);
        await refresh();
      }
    } finally {
      setRemoving(false);
    }
  }

  return (
    <div className="co-members-layout">
      <div className="co-members-toolbar">
        <input
          className="co-input"
          placeholder="Search women…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      {loading ? (
        <p className="co-hint" style={{ marginTop: "1rem" }}>
          Loading members…
        </p>
      ) : members.length === 0 ? (
        <p className="co-hint" style={{ marginTop: "1rem" }}>
          No members yet — accepted applicants show up here.
        </p>
      ) : (
        <div className={`co-applications-layout${selected ? " co-applications-layout--open" : ""}`}>
          <ul className="co-application-list">
            {members.map((m) => (
              <li key={m.user_id}>
                <button
                  type="button"
                  className={`co-application-row${selected?.user_id === m.user_id ? " co-application-row--selected" : ""}`}
                  onClick={() => setSelected(m)}
                >
                  <span
                    className="co-application-row__photo"
                    style={
                      m.avatar_url
                        ? { backgroundImage: `url(${m.avatar_url})`, backgroundSize: "cover", backgroundPosition: "center" }
                        : { background: "linear-gradient(135deg,#ffe4ec,#ffb7ce)" }
                    }
                  >
                    {!m.avatar_url ? initials(m.name) : null}
                  </span>
                  <span className="co-application-row__body">
                    <span className="co-application-row__top">
                      <strong>{m.name}</strong>
                    </span>
                    <span className="co-application-row__meta">
                      {m.neighborhood ? `${m.neighborhood} · ` : ""}joined {m.joined_label}
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
                <div
                  className="co-application-detail__photo"
                  style={
                    selected.avatar_url
                      ? { backgroundImage: `url(${selected.avatar_url})`, backgroundSize: "cover", backgroundPosition: "center" }
                      : { background: "linear-gradient(135deg,#ffe4ec,#ffb7ce)" }
                  }
                >
                  {!selected.avatar_url ? <span>{initials(selected.name)}</span> : null}
                </div>
                <div>
                  <h2 className="co-application-detail__name">{selected.name}</h2>
                  <p className="co-application-detail__meta">{selected.neighborhood}</p>
                </div>
              </div>
              <p className="co-hint">Joined {selected.joined_label}</p>
              <div className="co-application-detail__actions">
                <button
                  type="button"
                  className="co-btn co-btn--primary"
                  style={{ background: "#121212" }}
                  disabled={removing}
                  onClick={() => removeMember(selected.user_id, selected.name)}
                >
                  {removing ? "Removing…" : "Remove from club"}
                </button>
              </div>
            </article>
          ) : (
            <div className="co-application-placeholder">
              <p>Select a member to remove her from the club.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
