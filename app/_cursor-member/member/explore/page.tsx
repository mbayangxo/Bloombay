"use client";

import { MemberShell } from "../components/member-shell";
import { SpaceMood } from "@/app/components/member/space-mood";
import { TheCity } from "@/app/components/member/the-city";

export default function ExplorePage() {
  return (
    <MemberShell hideHeader flush fullWidth>
      <SpaceMood mood="explore" showIntro={false}>
        <TheCity />
      </SpaceMood>
    </MemberShell>
  );
}
