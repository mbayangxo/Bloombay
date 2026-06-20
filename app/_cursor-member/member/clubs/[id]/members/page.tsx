"use client";

import { use } from "react";
import Link from "next/link";
import { MemberShell } from "../../../components/member-shell";
import { getClubProfile } from "@/lib/club-world-data";
import { listMembersWithRoles } from "@/lib/club-operations-store";
import { BbEmptyState } from "@/app/components/member/bb-empty-state";

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function ClubMembersDirectoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const club = getClubProfile(id);
  const members = listMembersWithRoles(id);

  if (!club) {
    return (
      <MemberShell backHref="/member/clubs" backLabel="Clubs">
        <p>Club not found.</p>
      </MemberShell>
    );
  }

  return (
    <MemberShell backHref={`/member/clubs/${id}/world`} backLabel="Club">
      <div className="mp-page-head">
        <h1 className="mp-page-head__title">{club.name} · Members</h1>
        <p className="mp-page-head__sub">
          Directory with roles — owner, admin, moderator, member, and volunteer. Hosts manage approvals in the clubhouse portal.
        </p>
      </div>
      <div className="mp-page-body mp-member-dir">
        {members.length === 0 ? (
          <BbEmptyState
            title="Your community wall"
            body="Members appear here as they join — names, roles, and cities, no circles required."
            actionLabel="Invite from Happenings"
            actionHref="/member/happenings"
          />
        ) : null}
        {members.map((m) => (
          <div key={m.id} className="mp-member-dir__row">
            <span
              className="mp-bouquet-slot__avatar"
              style={{ background: m.photoGradient, width: 40, height: 40, borderRadius: "50%", display: "grid", placeItems: "center" }}
            >
              {initials(m.name)}
            </span>
            <div style={{ flex: 1 }}>
              <strong>{m.name}</strong>
              <p className="mp-list-row__meta">
                <span className={`co-role-pill co-role-pill--${m.role}`}>{m.role}</span> · {m.city}
              </p>
            </div>
            <span className="mp-list-row__meta">{m.lastActive ?? "—"}</span>
          </div>
        ))}
        <Link href={`/member/clubs/${id}`} className="mp-link" style={{ marginTop: "1rem" }}>
          ← Club landing
        </Link>
      </div>
    </MemberShell>
  );
}
