"use client";

import { MemberShell } from "../components/member-shell";
import { ClubsBrowse } from "../components/clubs-browse";

export default function MemberClubsPage() {
  return (
    <MemberShell compactHeader flush fullWidth>
      <ClubsBrowse />
    </MemberShell>
  );
}
