"use client";

import { useState } from "react";
import Link from "next/link";
import { ClubOwnerShell } from "../components/club-owner-shell";
import { ClubOwnerPageTitle } from "../components/club-owner-page";
import { getHostClubId } from "@/lib/club-host-store";
import { getClubProfile } from "@/lib/club-world-data";
import { listPlannerRooms, savePlannerRoom } from "@/lib/club-operations-store";

export default function ClubOwnerPlannerPage() {
  const clubId = getHostClubId();
  const club = getClubProfile(clubId);
  const [rooms, setRooms] = useState(() => listPlannerRooms(clubId));
  const [name, setName] = useState("");

  function refresh() {
    setRooms(listPlannerRooms(clubId));
  }

  function createRoom(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    savePlannerRoom({ clubId, name: name.trim(), tasks: [] });
    setName("");
    refresh();
  }

  return (
    <ClubOwnerShell title="Planner" backHref="/club-owner/dashboard">
      <ClubOwnerPageTitle
        eyebrow={club?.name}
        title="Planner rooms"
        sub="Turn ideas into tasks — assignee, due date, status, and notes per event."
      />
      <ul className="co-app-list">
        {rooms.map((room) => (
          <li key={room.id}>
            <Link href={`/club-owner/planner/${room.id}`} className="co-app-card" style={{ display: "block", textDecoration: "none", color: "inherit" }}>
              <strong>{room.name}</strong>
              {room.eventLabel ? <span className="co-hint"> · {room.eventLabel}</span> : null}
              <p className="co-hint">{room.tasks.length} tasks · {room.tasks.filter((t) => t.status === "done").length} done</p>
            </Link>
          </li>
        ))}
      </ul>
      <form onSubmit={createRoom} className="co-form" style={{ marginTop: "1rem" }}>
        <label>
          New planner room
          <input className="co-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Spring gala" />
        </label>
        <button type="submit" className="co-btn co-btn--primary">
          Create room
        </button>
      </form>
    </ClubOwnerShell>
  );
}
