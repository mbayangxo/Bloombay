"use client";

import { useState } from "react";
import Link from "next/link";
import { ClubOwnerShell } from "../components/club-owner-shell";
import { ClubOwnerPageTitle } from "../components/club-owner-page";
import { EventsCalendar } from "@/app/components/events/events-calendar";
import { getHostClubId } from "@/lib/club-host-store";
import { getClubProfile } from "@/lib/club-world-data";
import { listEventsForClub, monthKey } from "@/lib/bloombay-events-store";

export default function ClubOwnerCalendarPage() {
  const clubId = getHostClubId();
  const club = getClubProfile(clubId);
  const [month] = useState(monthKey());
  const events = listEventsForClub(clubId).filter((e) => e.startAt.startsWith(month));

  return (
    <ClubOwnerShell title="Calendar" backHref="/club-owner/dashboard">
      <ClubOwnerPageTitle
        eyebrow={club?.name}
        title="Club event calendar"
        sub="View by month — draft and live events. Plan months and years ahead."
      />
      <EventsCalendar events={listEventsForClub(clubId)} selectedId={null} onSelect={() => {}} />
      <p className="co-hint" style={{ marginTop: "0.75rem" }}>
        {events.length} events in {month}.{" "}
        <Link href="/club-owner/events-studio">Edit in events studio →</Link>
      </p>
      <Link href="/club-owner/planner-room" className="co-btn co-btn--primary" style={{ marginTop: "1rem" }}>
        Open planner room
      </Link>
    </ClubOwnerShell>
  );
}
