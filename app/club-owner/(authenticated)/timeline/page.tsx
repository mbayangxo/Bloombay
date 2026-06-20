"use client";

import { ClubOwnerShell } from "../components/club-owner-shell";
import { ClubOwnerPageTitle } from "../components/club-owner-page";
import { getHostClubId } from "@/lib/club-host-store";
import { getClubProfile } from "@/lib/club-world-data";
import { getEventTimelineForDate, listEventTemplates } from "@/lib/club-operations-store";
import { listGatherings } from "@/lib/club-owner-store";

export default function ClubOwnerTimelinePage() {
  const clubId = getHostClubId();
  const club = getClubProfile(clubId);
  const next = listGatherings(clubId)[0];
  const eventDate = new Date(Date.now() + 86400000 * 60).toISOString();
  const milestones = getEventTimelineForDate(eventDate);
  const template = listEventTemplates(clubId)[0];

  return (
    <ClubOwnerShell title="Timeline" backHref="/club-owner/dashboard">
      <ClubOwnerPageTitle
        eyebrow={club?.name}
        title="Event timeline view"
        sub="90 days — reserve venue · 60 — recruit volunteers · 30 — publish · 7 — reminders."
      />
      <p className="co-hint">Next event: {next?.title ?? "Upcoming gathering"}</p>
      <div className="co-timeline">
        {milestones.map((m) => (
          <div key={m.daysBefore} className={`co-timeline__item${m.status === "due" ? " co-timeline__item--due" : ""}`}>
            <strong>{m.daysBefore} days before</strong>
            <p>{m.label}</p>
            <p className="co-hint">Due {new Date(m.dueAt).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
      {template ? (
        <p className="co-hint" style={{ marginTop: "1rem" }}>
          Template &quot;{template.name}&quot; uses the same milestone pattern — duplicate from Event templates.
        </p>
      ) : null}
    </ClubOwnerShell>
  );
}
