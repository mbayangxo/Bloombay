"use client";

import Link from "next/link";
import { topClubsLeaderboard } from "@/lib/member-club-rankings";
import { trackClubPicked } from "@/lib/yande-member-state";

export function ClubsLeaderboard() {
  const leaderboard = topClubsLeaderboard(10);

  return (
    <section className="mp-clubs-leaderboard" aria-label="BloomBay club board">
      <h1 className="mp-clubs-leaderboard__title">BloomBay club board</h1>
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
  );
}
