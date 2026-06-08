"use client";

import { useState } from "react";
import { ClubOwnerShell } from "../components/club-owner-shell";
import { ClubOwnerPageTitle } from "../components/club-owner-page";
import { getHostClubId } from "@/lib/club-host-store";
import { getClubProfile } from "@/lib/club-world-data";
import { listVolunteerHours, listVolunteerShifts, signupVolunteer } from "@/lib/club-operations-store";

export default function ClubOwnerVolunteersPage() {
  const clubId = getHostClubId();
  const club = getClubProfile(clubId);
  const [shifts, setShifts] = useState(() => listVolunteerShifts(clubId));
  const hours = listVolunteerHours(clubId);

  return (
    <ClubOwnerShell title="Volunteers" backHref="/club-owner/dashboard">
      <ClubOwnerPageTitle
        eyebrow={club?.name}
        title="Volunteer management"
        sub="Signup forms, shift scheduling, check-in, hours tracking, and recognition history."
      />
      <section className="co-stack">
        <h2 className="co-section__title">Shifts</h2>
        {shifts.map((s) => (
          <article key={s.id} className="co-app-card">
            <strong>{s.eventTitle}</strong> — {s.role}
            <p className="co-hint">
              {new Date(s.startsAt).toLocaleString()} · {s.signedUp.length}/{s.slots} filled
            </p>
            <button
              type="button"
              className="co-btn co-btn--ghost"
              onClick={() => {
                signupVolunteer(s.id, "demo-vol", "Demo volunteer");
                setShifts(listVolunteerShifts(clubId));
              }}
            >
              Demo check-in
            </button>
          </article>
        ))}
      </section>
      <section className="co-stack" style={{ marginTop: "1.5rem" }}>
        <h2 className="co-section__title">Hours & recognition</h2>
        {hours.length === 0 ? (
          <p className="co-hint">No volunteer hours logged yet.</p>
        ) : (
          <ul className="co-app-list">
            {hours.map((h) => (
              <li key={h.id}>
                {h.memberName} · {h.hours}h · {new Date(h.checkedInAt).toLocaleDateString()}
              </li>
            ))}
          </ul>
        )}
      </section>
    </ClubOwnerShell>
  );
}
