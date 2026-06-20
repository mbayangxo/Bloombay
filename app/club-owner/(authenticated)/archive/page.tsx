"use client";

import { useState } from "react";
import { ClubOwnerShell } from "../components/club-owner-shell";
import { ClubOwnerPageTitle } from "../components/club-owner-page";
import { getHostClubId } from "@/lib/club-host-store";
import { getClubProfile } from "@/lib/club-world-data";
import { archiveCompletedEvent, listEventArchive } from "@/lib/club-operations-store";

export default function ClubOwnerArchivePage() {
  const clubId = getHostClubId();
  const club = getClubProfile(clubId);
  const [records, setRecords] = useState(() => listEventArchive(clubId));

  return (
    <ClubOwnerShell title="Archive" backHref="/club-owner/dashboard">
      <ClubOwnerPageTitle
        eyebrow={club?.name}
        title="Event memory & archive"
        sub="Completed events — cover, attendance, analytics, notes, and lessons learned."
      />
      {records.map((r) => (
        <article key={r.id} className="co-app-card" style={{ marginBottom: "0.75rem" }}>
          <strong>{r.title}</strong>
          <p className="co-hint">
            {new Date(r.completedAt).toLocaleDateString()} · {r.attendance} attended
            {r.rating ? ` · ${r.rating}★` : ""}
          </p>
          {r.notes ? <p>{r.notes}</p> : null}
          {r.lessonsLearned ? (
            <blockquote className="co-hint" style={{ borderLeft: "3px solid var(--co-hot)", paddingLeft: "0.65rem" }}>
              Lessons: {r.lessonsLearned}
            </blockquote>
          ) : null}
        </article>
      ))}
      <button
        type="button"
        className="co-btn co-btn--ghost"
        onClick={() => {
          archiveCompletedEvent(clubId, {
            title: "Demo archived event",
            completedAt: new Date().toISOString(),
            attendance: 24,
            notes: "Prototype entry",
            lessonsLearned: "Start planning earlier.",
            photos: [],
          });
          setRecords(listEventArchive(clubId));
        }}
      >
        + Archive sample event
      </button>
    </ClubOwnerShell>
  );
}
