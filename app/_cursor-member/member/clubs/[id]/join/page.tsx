"use client";

import { use } from "react";
import { MemberShell } from "../../../components/member-shell";
import { ClubApply } from "../../../components/club-apply";
import { useClubProfile } from "../../../hooks/use-club-profile";

export default function ClubJoinPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const club = useClubProfile(id);

  if (!club) {
    return (
      <MemberShell backHref="/member/clubs" backLabel="Clubs" compactHeader>
        <p>Club not found.</p>
      </MemberShell>
    );
  }

  return (
    <MemberShell backHref={`/member/clubs/${id}`} backLabel="Club" compactHeader>
      <ClubApply club={club} />
    </MemberShell>
  );
}
