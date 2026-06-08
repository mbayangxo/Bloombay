"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { MemberShell } from "../../../components/member-shell";
import { ClubWorld } from "../../../components/club-world";
import { getClubProfile, isClubMember } from "@/lib/club-world-data";

export default function ClubWorldPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const club = getClubProfile(id);
  const [member, setMember] = useState(false);

  useEffect(() => {
    setMember(isClubMember(id));
  }, [id]);

  if (!club) {
    return (
      <MemberShell backHref="/member/clubs" backLabel="Clubs" compactHeader>
        <p>Club not found.</p>
      </MemberShell>
    );
  }

  return (
    <MemberShell hideHeader flush fullWidth>
      {!member ? (
        <div className="mp-section" style={{ padding: "2rem 1.25rem" }}>
          <p>Join from the club landing page to enter.</p>
          <Link href={`/member/clubs/${id}`} className="mp-btn mp-btn--hot mp-btn--block" style={{ marginTop: "1rem" }}>
            Go to club landing →
          </Link>
          <Link href={`/member/clubs/${id}/join`} className="mp-btn mp-btn--outline mp-btn--block" style={{ marginTop: "0.65rem" }}>
            Join club →
          </Link>
        </div>
      ) : (
        <ClubWorld club={club} />
      )}
    </MemberShell>
  );
}
