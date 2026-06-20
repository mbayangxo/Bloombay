"use client";

import { useState } from "react";
import {
  addModerator,
  listModerators,
  removeModerator,
  type ClubModerator,
} from "@/lib/club-owner-data";

const PERM_OPTIONS: ClubModerator["permissions"] = [
  "applications",
  "zones",
  "gatherings",
  "scan",
  "ping",
];

export function ModeratorsPanel({ clubId }: { clubId: string }) {
  const [mods, setMods] = useState(() => listModerators(clubId));
  const [name, setName] = useState("");
  const [handle, setHandle] = useState("");
  const [perms, setPerms] = useState<ClubModerator["permissions"]>(["applications", "scan"]);

  function togglePerm(p: ClubModerator["permissions"][number]) {
    setPerms((prev) => (prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]));
  }

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    addModerator(clubId, { name: name.trim(), handle: handle.trim() || "@member", permissions: perms });
    setMods(listModerators(clubId));
    setName("");
    setHandle("");
  }

  return (
    <div className="co-stack">
      <ul className="co-app-list">
        {mods.map((m) => (
          <li key={m.id} className="co-app-card">
            <div className="co-app-card__head">
              <strong>
                {m.name} · {m.role}
              </strong>
              <button type="button" className="co-btn co-btn--ghost" style={{ padding: "0.35rem 0.65rem", fontSize: "0.65rem" }} onClick={() => { removeModerator(m.id); setMods(listModerators(clubId)); }}>
                Remove
              </button>
            </div>
            <p className="co-app-card__meta">{m.handle}</p>
            <p className="co-app-card__meta">Can: {m.permissions.join(", ")}</p>
          </li>
        ))}
      </ul>

      <form onSubmit={handleAdd} className="co-form">
        <p className="co-form__club">Invite moderator</p>
        <input className="co-input" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input className="co-input" placeholder="@handle" value={handle} onChange={(e) => setHandle(e.target.value)} />
        <fieldset className="co-fieldset">
          <legend>Permissions</legend>
          {PERM_OPTIONS.map((p) => (
            <label key={p} className="co-toggle">
              <input type="checkbox" checked={perms.includes(p)} onChange={() => togglePerm(p)} />
              <span>{p}</span>
            </label>
          ))}
        </fieldset>
        <button type="submit" className="co-btn co-btn--primary">
          Add moderator
        </button>
      </form>
    </div>
  );
}
