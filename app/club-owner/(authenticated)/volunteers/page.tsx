"use client";

import { useState } from "react";
import { ClubOwnerShell } from "../components/club-owner-shell";
import { ClubOwnerPageTitle } from "../components/club-owner-page";
import { getHostClubId } from "@/lib/club-host-store";
import { getClubProfile } from "@/lib/club-world-data";
import { listMembersWithRoles, listVolunteerHours, listVolunteerShifts, signupVolunteer } from "@/lib/club-operations-store";

export default function ClubOwnerVolunteersPage() {
  const clubId = getHostClubId();
  const club = getClubProfile(clubId);
  const [shifts, setShifts] = useState(() => listVolunteerShifts(clubId));
  const hours = listVolunteerHours(clubId);
  const members = listMembersWithRoles(clubId);

  return (
    <ClubOwnerShell title="Volunteers" backHref="/club-owner/dashboard">
      <ClubOwnerPageTitle
        eyebrow={club?.name}
        title="Volunteer management"
        sub="Signup forms, shift scheduling, check-in, hours tracking, and recognition history."
      />
      <p className="co-hint" style={{ background: "rgba(255,31,125,0.06)", border: "1px solid rgba(255,31,125,0.15)", borderRadius: 10, padding: "0.6rem 0.75rem", marginBottom: "1rem" }}>
        <strong>Prototype —</strong> shifts and check-ins save only on this device, not to your real members.
      </p>
      <section className="co-stack">
        <h2 className="co-section__title">Shifts</h2>
        {shifts.map((s) => (
          <article key={s.id} className="co-app-card">
            <strong>{s.eventTitle}</strong> — {s.role}
            <p className="co-hint">
              {new Date(s.startsAt).toLocaleString()} · {s.signedUp.length}/{s.slots} filled
            </p>
            <select
              className="co-input"
              defaultValue=""
              disabled={s.signedUp.length >= s.slots}
              onChange={(e) => {
                if (!e.target.value) return;
                const m = members.find((x) => x.id === e.target.value);
                if (m) signupVolunteer(s.id, m.id, m.name);
                setShifts(listVolunteerShifts(clubId));
                e.target.value = "";
              }}
            >
              <option value="">+ Check in a member</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
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
