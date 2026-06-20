"use client";

import { use } from "react";
import Link from "next/link";
import { MemberShell } from "../../components/member-shell";
import { ClubLanding } from "../../components/club-landing";
import { useClubProfile } from "../../hooks/use-club-profile";

export default function ClubExplorePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const club = useClubProfile(id);

  if (!club) {
    return (
      <MemberShell backHref="/member/clubs" backLabel="Clubs" compactHeader>
        <div className="mp-section">
          <p>Club not found.</p>
          <Link href="/member/clubs" className="mp-link">
            ← All clubs
          </Link>
        </div>
      </MemberShell>
    );
  }

  return (
    <MemberShell hideHeader flush fullWidth>
      <ClubLanding club={club} />
    </MemberShell>
  );
}
