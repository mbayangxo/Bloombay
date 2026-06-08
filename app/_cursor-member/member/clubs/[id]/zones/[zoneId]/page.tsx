"use client";

import Link from "next/link";
import { use } from "react";
import { MemberShell } from "../../../../components/member-shell";
import { getClubProfile } from "@/lib/club-world-data";

export default function ClubZonePage({
  params,
}: {
  params: Promise<{ id: string; zoneId: string }>;
}) {
  const { id, zoneId } = use(params);
  const club = getClubProfile(id);
  const zone = club?.zones.find((z) => z.id === zoneId);

  if (!club || !zone) {
    return (
      <MemberShell backHref={`/member/clubs/${id}/world`} backLabel="Club" compactHeader>
        <p>Zone not found.</p>
      </MemberShell>
    );
  }

  return (
    <MemberShell backHref={`/member/clubs/${id}/world`} backLabel={club.name} hideHeader flush fullWidth>
      <div className="mp-zone-landing" style={{ background: zone.tone }}>
        <div className="mp-zone-landing__nav">
          <Link href={`/member/clubs/${id}/world`}>← {club.name}</Link>
          <span>{zone.hereNow} here</span>
        </div>
        <h1>{zone.name}</h1>
        <p>{zone.tagline}</p>
        <p className="mp-zone-landing__meta">{zone.members.toLocaleString()} members in this zone</p>
      </div>

      <div className="mp-zone-landing__feed">
        <div className="mp-pinned-note">Host note: Welcome — introduce yourself in chat.</div>
        <div className="mp-moment-masonry">
          <article className="mp-moment-card" style={{ background: "#ffe4ec" }}>
            <strong>Weekly thread</strong>
            <p>What are you building this week?</p>
          </article>
          <article className="mp-moment-card">
            <strong>Jade</strong>
            <p>Coffee at 3? Dimes is calling.</p>
          </article>
          <article className="mp-moment-card" style={{ minHeight: 100 }}>
            <strong>Plans board</strong>
            <p>Friday cowork · RSVP in happenings</p>
          </article>
        </div>
        <Link href={`/member/clubs/${id}/world`} className="mp-btn mp-btn--outline mp-btn--block" style={{ marginTop: "1rem" }}>
          Back to club world
        </Link>
      </div>
    </MemberShell>
  );
}
