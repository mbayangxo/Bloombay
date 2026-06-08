"use client";

import Link from "next/link";
import {
  FEATURED_CLUB_SECTIONS,
  topClubsLeaderboard,
  sortByMetric,
  type RankedClub,
} from "@/lib/member-club-rankings";
import { ClubCoverCard } from "./club-cover-card";
import { trackClubPicked } from "@/lib/yande-member-state";

export function ClubsFeaturedSections({ showBoard = true }: { showBoard?: boolean }) {
  const leaderboard = topClubsLeaderboard(5);

  return (
    <div className="mp-clubs-featured">
      {showBoard ? (
        <section className="mp-clubs-leaderboard" aria-label="Best clubs on BloomBay">
          <h2 className="mp-clubs-leaderboard__title">BloomBay club board</h2>
          <p className="mp-clubs-leaderboard__sub">
            Ranked by gatherings, member energy, ratings, and stamp leaders
          </p>
          <ol className="mp-clubs-leaderboard__list">
            {leaderboard.map((row, i) => (
              <li key={row.club.id}>
                <Link
                  href={`/member/clubs/${row.club.id}`}
                  className="mp-clubs-leaderboard__row"
                  onClick={() => trackClubPicked(row.club.id)}
                >
                  <span className="mp-clubs-leaderboard__rank">{i + 1}</span>
                  <div className="mp-clubs-leaderboard__body">
                    <strong>{row.club.name}</strong>
                    <span>
                      {row.gatheringCount} gatherings · {row.stamps} stamps · top: {row.topStampHolder}
                    </span>
                  </div>
                  <span className="mp-clubs-leaderboard__score">{row.composite}</span>
                </Link>
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      {FEATURED_CLUB_SECTIONS.map((section) => {
        const rows = sortByMetric(section.metric).slice(0, 4);
        return (
          <section key={section.id} className="mp-clubs-featured-section">
            <h3 className="mp-clubs-featured-section__title">{section.title}</h3>
            <div className="mp-clubs-featured-scroll">
              {rows.map((row) => (
                <div key={row.club.id} className="mp-clubs-featured-scroll__item">
                  <ClubCoverCard club={row.club} wide />
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
