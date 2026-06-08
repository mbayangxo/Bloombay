"use client";

import { getClubSignals } from "@/lib/club-signals";

export function ClubCredibility({ clubId, compact }: { clubId: string; compact?: boolean }) {
  const s = getClubSignals(clubId);

  if (compact) {
    return (
      <div className="mp-club-cred mp-club-cred--compact">
        <span>{s.seatsHosted} seats</span>
        <span>{s.attendanceRate}% show</span>
        <span>{s.returnRate}% return</span>
        {s.activeThisMonth ? <span className="mp-club-cred__live">Active</span> : null}
      </div>
    );
  }

  return (
    <div className="mp-club-cred">
      <div className="mp-club-cred__grid">
        <div>
          <strong>{s.seatsHosted}</strong>
          <span>Seats hosted</span>
        </div>
        <div>
          <strong>{s.attendanceRate}%</strong>
          <span>Attendance</span>
        </div>
        <div>
          <strong>{s.returnRate}%</strong>
          <span>Return rate</span>
        </div>
        <div>
          <strong>{s.hostResponsive}</strong>
          <span>Host response</span>
        </div>
      </div>
      {s.decayWarning ? <p className="mp-club-cred__warn">{s.decayWarning}</p> : null}
    </div>
  );
}
