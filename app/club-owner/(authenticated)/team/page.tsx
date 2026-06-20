"use client";

import { useState } from "react";
import { ClubOwnerShell } from "../components/club-owner-shell";
import { ClubOwnerPageTitle } from "../components/club-owner-page";
import { ModeratorsPanel } from "../components/moderators-panel";
import { getHostClubId } from "@/lib/club-host-store";
import { getClubProfile } from "@/lib/club-world-data";
import { addModerator, listModerators, removeModerator } from "@/lib/club-owner-data";

export default function ClubOwnerTeamPage() {
  const clubId = getHostClubId();
  const club = getClubProfile(clubId);
  const [cohostName, setCohostName] = useState("");
  const [mods, setMods] = useState(() => listModerators(clubId));

  function addCoHost(e: React.FormEvent) {
    e.preventDefault();
    if (!cohostName.trim()) return;
    addModerator(clubId, {
      name: cohostName.trim(),
      handle: "@cohost",
      role: "co_host",
      permissions: ["gatherings", "scan", "ping", "applications"],
    });
    setMods(listModerators(clubId));
    setCohostName("");
  }

  const coHosts = mods.filter((m) => m.role === "co_host" || m.role === "admin");

  return (
    <ClubOwnerShell title="Team" backHref="/club-owner/dashboard">
      <ClubOwnerPageTitle
        eyebrow={club?.name}
        title="Co-hosts & moderators"
        sub="Assign co-hosts and moderators for this club. Girl curators are assigned by BloomBay founders."
      />
      <section className="co-stack">
        <h2 className="co-section__title">Co-hosts</h2>
        <ul className="co-app-list">
          {coHosts.length === 0 ? (
            <li className="co-hint">No co-hosts yet.</li>
          ) : (
            coHosts.map((m) => (
              <li key={m.id} className="co-app-card">
                <strong>{m.name}</strong>
                <button
                  type="button"
                  className="co-btn co-btn--ghost"
                  onClick={() => {
                    removeModerator(m.id);
                    setMods(listModerators(clubId));
                  }}
                >
                  Remove
                </button>
              </li>
            ))
          )}
        </ul>
        <form onSubmit={addCoHost} className="co-form">
          <input
            className="co-input"
            placeholder="Co-host name"
            value={cohostName}
            onChange={(e) => setCohostName(e.target.value)}
          />
          <button type="submit" className="co-btn co-btn--outline">
            Assign co-host
          </button>
        </form>
      </section>
      <h2 className="co-section__title" style={{ marginTop: "1.5rem" }}>
        Moderators
      </h2>
      <ModeratorsPanel clubId={clubId} />
    </ClubOwnerShell>
  );
}
