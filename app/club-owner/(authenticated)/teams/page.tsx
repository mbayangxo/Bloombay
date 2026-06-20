"use client";

import { useState } from "react";
import Link from "next/link";
import { ClubOwnerShell } from "../components/club-owner-shell";
import { ClubOwnerPageTitle } from "../components/club-owner-page";
import { getHostClubId } from "@/lib/club-host-store";
import { getClubProfile } from "@/lib/club-world-data";
import {
  assignMemberToTeam,
  listMembersWithRoles,
  listTeams,
  saveTeam,
} from "@/lib/club-operations-store";

export default function ClubOwnerTeamsPage() {
  const clubId = getHostClubId();
  const club = getClubProfile(clubId);
  const [teams, setTeams] = useState(() => listTeams(clubId));
  const members = listMembersWithRoles(clubId);
  const [newName, setNewName] = useState("");

  function refresh() {
    setTeams(listTeams(clubId));
  }

  function addTeam(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;
    saveTeam({
      clubId,
      name: newName.trim(),
      kind: "custom",
      permissions: ["planner"],
      memberIds: [],
    });
    setNewName("");
    refresh();
  }

  return (
    <ClubOwnerShell title="Teams" backHref="/club-owner/dashboard">
      <ClubOwnerPageTitle
        eyebrow={club?.name}
        title="Committee & teams"
        sub="Events, marketing, volunteer, and finance teams — assign members and team-only planner rooms."
      />
      <div className="co-stack">
        {teams.map((team) => (
          <article key={team.id} className="co-app-card">
            <strong>{team.name}</strong>
            <span className="co-hint"> · {team.kind} · {team.permissions.join(", ")}</span>
            {team.plannerRoomId ? (
              <p className="co-hint">
                <Link href={`/club-owner/planner/${team.plannerRoomId}`}>Team planner room →</Link>
              </p>
            ) : (
              <Link href="/club-owner/planner" className="co-link">
                Open planner rooms →
              </Link>
            )}
            <div style={{ marginTop: "0.5rem" }}>
              <p className="co-section__title">Members on team</p>
              <ul className="co-app-list">
                {team.memberIds.length === 0 ? (
                  <li className="co-hint">No one assigned yet.</li>
                ) : (
                  team.memberIds.map((id) => {
                    const m = members.find((x) => x.id === id);
                    return m ? <li key={id}>{m.name}</li> : null;
                  })
                )}
              </ul>
              <select
                className="co-input"
                defaultValue=""
                onChange={(e) => {
                  if (e.target.value) assignMemberToTeam(team.id, e.target.value);
                  refresh();
                  e.target.value = "";
                }}
              >
                <option value="">+ Assign member</option>
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
          </article>
        ))}
        <form onSubmit={addTeam} className="co-form">
          <label>
            New custom team
            <input className="co-input" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. Partnerships" />
          </label>
          <button type="submit" className="co-btn co-btn--primary">
            Create team
          </button>
        </form>
      </div>
    </ClubOwnerShell>
  );
}
