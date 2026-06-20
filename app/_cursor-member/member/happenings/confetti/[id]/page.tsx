"use client";

import { use } from "react";
import { MemberShell } from "../../../components/member-shell";
import { ConfettiInvitationView } from "@/app/components/member/confetti-invitation";
import { getConfettiById } from "@/lib/confetti-data";

export default function ConfettiDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const confetti = getConfettiById(id);

  if (!confetti) {
    return (
      <MemberShell backHref="/member/happenings?tab=invitations" backLabel="Invitations">
        <p style={{ padding: "2rem" }}>Confetti not found.</p>
      </MemberShell>
    );
  }

  return (
    <MemberShell
      backHref="/member/happenings?tab=invitations#confetti"
      backLabel="Invitations"
      compactHeader
      flush
      fullWidth
    >
      <ConfettiInvitationView confetti={confetti} />
    </MemberShell>
  );
}
