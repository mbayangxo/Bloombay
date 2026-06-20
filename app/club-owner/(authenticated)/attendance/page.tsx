"use client";

import { ClubOwnerShell } from "../components/club-owner-shell";
import { ClubOwnerPageTitle } from "../components/club-owner-page";
import { getHostClubId } from "@/lib/club-host-store";
import { attendanceRateForClub, listNoShows } from "@/lib/club-owner-attendance";
import { listCheckIns, listGatherings } from "@/lib/club-owner-store";
import { getClubProfile } from "@/lib/club-world-data";

export default function ClubOwnerAttendancePage() {
  const clubId = getHostClubId();
  const club = getClubProfile(clubId);
  const events = listGatherings(clubId);
  const checkIns = listCheckIns(clubId);
  const noShows = listNoShows(clubId);
  const attendPct = attendanceRateForClub(clubId);

  return (
    <ClubOwnerShell title="Attendance" backHref="/club-owner/dashboard">
      <ClubOwnerPageTitle
        eyebrow={club?.name}
        title="Attendance"
        sub="QR check-in · who came · which event · no-shows."
      />
      <div className="co-health-strip" style={{ marginBottom: "1rem" }}>
        <div className="co-health-strip__score">
          <span>Attendance rate</span>
          <strong>{attendPct}%</strong>
        </div>
        <div className="co-health-strip__meta">
          <span>
            <strong>{checkIns.length}</strong> check-ins
          </span>
          <span>
            <strong>{noShows.length}</strong> no-shows (demo)
          </span>
        </div>
      </div>
      <h2 className="co-section__title">Check-ins</h2>
      <p className="co-hint">{checkIns.length} scanned at the door</p>
      <ul className="co-app-list">
        {checkIns.length === 0 ? (
          <li className="co-hint">No check-ins yet. Use Scan at your next gathering.</li>
        ) : (
          checkIns.map((c) => (
            <li key={c.id} className="co-app-card">
              <strong>{c.memberName}</strong>
              <p className="co-app-card__meta">
                {c.eventTitle} · {new Date(c.checkedInAt).toLocaleString()}
              </p>
            </li>
          ))
        )}
      </ul>
      <h2 className="co-section__title" style={{ marginTop: "1.5rem" }}>
        No-shows
      </h2>
      <ul className="co-app-list">
        {noShows.length === 0 ? (
          <li className="co-hint">No no-shows recorded.</li>
        ) : (
          noShows.map((n) => (
            <li key={n.id} className="co-app-card">
              <strong>{n.memberName}</strong>
              <p className="co-app-card__meta">
                {n.eventTitle} · {n.eventDate} · RSVP {n.rsvpStatus}
              </p>
            </li>
          ))
        )}
      </ul>

      <h2 className="co-section__title" style={{ marginTop: "1.5rem" }}>
        By event
      </h2>
      {events.map((ev) => (
        <p key={ev.id} className="co-hint">
          {ev.title}: {listCheckIns(clubId, ev.id).length} checked in
        </p>
      ))}
    </ClubOwnerShell>
  );
}
