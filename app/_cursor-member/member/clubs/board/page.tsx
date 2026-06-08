"use client";

import Link from "next/link";
import { MemberShell } from "../../components/member-shell";
import { ClubsLeaderboard } from "../../components/clubs-leaderboard";

export default function ClubBoardPage() {
  return (
    <MemberShell backHref="/member/clubs" backLabel="Clubs" compactHeader>
      <div className="mp-page-body">
        <ClubsLeaderboard />
        <p style={{ marginTop: "1.5rem" }}>
          <Link href="/member/clubs" className="mp-link">
            ← Back to club events
          </Link>
        </p>
      </div>
    </MemberShell>
  );
}
