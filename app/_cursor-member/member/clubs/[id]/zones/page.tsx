"use client";

import Link from "next/link";
import { use } from "react";
import { MemberShell } from "../../../components/member-shell";
import { CLUBS } from "../../club-data";

const ZONES = [
  { id: "wall", name: "The Wall", desc: "Announcements & hosts" },
  { id: "moments", name: "Moments", desc: "Photos, notes, voice" },
  { id: "happenings", name: "Happenings", desc: "Upcoming seats & gatherings" },
  { id: "members", name: "Members", desc: "Who's in this club" },
];

export default function ClubZonesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const club = CLUBS.find((c) => c.id === id);

  return (
    <MemberShell backHref={`/member/clubs/${id}`} backLabel={club?.name ?? "Club"}>
      <div className="mp-hero">
        <h1 className="mp-hero__title">Zones</h1>
        <p className="mp-hero__sub">{club?.name ?? "Club"} — pick a space.</p>
      </div>

      <section className="mp-section">
        {ZONES.map((z) => (
          <Link
            key={z.id}
            href={
              z.id === "happenings"
                ? "/member/happenings"
                : z.id === "moments"
                  ? `/member/clubs/${id}`
                  : `/member/clubs/${id}`
            }
            className="mp-card mp-card--soft"
            style={{ display: "block", padding: "1rem", marginBottom: "0.55rem", textDecoration: "none", color: "inherit" }}
          >
            <p className="mp-list-row__title">{z.name}</p>
            <p className="mp-list-row__meta">{z.desc}</p>
          </Link>
        ))}
      </section>
    </MemberShell>
  );
}
