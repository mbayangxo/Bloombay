"use client";

import { MemberShell } from "../../components/member-shell";
import { ClubsDiscoverPage } from "@/app/components/member/clubs-discover-page";

export default function ClubDiscoverRoute() {
  return (
    <MemberShell compactHeader flush fullWidth>
      <ClubsDiscoverPage />
    </MemberShell>
  );
}
