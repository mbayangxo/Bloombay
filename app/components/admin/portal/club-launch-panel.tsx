import Link from "next/link";
import type { StaffBase } from "@/lib/mc-paths";
import { mcPath } from "@/lib/mc-paths";
import {
  CLUB_LAUNCH_STATUS_LABEL,
  DEMO_CLUB_LAUNCHES,
  computeClubLaunchStatus,
} from "@/lib/club-launch";

export function ClubLaunchPanel({ staffBase = "/admin" }: { staffBase?: StaffBase }) {
  return (
    <section className="fp-card fp-club-launch">
      <h3 className="fp-card__title">Club launch pipeline</h3>
      <p className="fp-sub">Growing → ready → launching → open. Clubs feel alive.</p>
      <ul className="fp-club-launch-list">
        {DEMO_CLUB_LAUNCHES.map((club) => {
          const status = computeClubLaunchStatus(club);
          return (
            <li key={club.id} className={`fp-club-launch-item fp-club-launch-item--${status}`}>
              <div>
                <strong>{club.name}</strong>
                <span className="fp-sub">
                  {club.city} · {club.womenInterested}/{club.womenGoal} women
                  {!club.hasHost ? " · needs host" : ""}
                  {!club.hasVenue ? " · needs venue" : ""}
                </span>
              </div>
              <span className={`fp-launch-badge fp-launch-badge--${status}`}>
                {CLUB_LAUNCH_STATUS_LABEL[status]}
              </span>
            </li>
          );
        })}
      </ul>
      <Link href={mcPath("/admin/clubs", staffBase)} className="fp-link">
        Monitor all clubs →
      </Link>
    </section>
  );
}
