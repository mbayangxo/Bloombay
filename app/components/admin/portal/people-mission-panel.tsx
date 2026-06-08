"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { McLink } from "../mc-link";
import { DEMO_HOSTS, HOST_LEVEL_META, overallHostScore } from "@/lib/host-progression";
import { listFounderTeam, type FounderTeamMember } from "@/lib/founder-team-store";

const DEMO_CURATOR: FounderTeamMember = {
  id: "demo-amanda",
  name: "Amanda R.",
  email: "amanda@example.com",
  role: "girl_curator",
  city: "Williamsburg",
  clubLabel: "Book club · museum girls · dinner series",
  paymentMethod: "venmo",
  paymentHandle: "@amanda-curator",
  assignedAt: new Date().toISOString(),
};

export function PeopleMissionPanel() {
  const [curators, setCurators] = useState<FounderTeamMember[]>([]);
  const [moderators, setModerators] = useState<FounderTeamMember[]>([]);

  useEffect(() => {
    const team = listFounderTeam();
    setCurators(team.filter((t) => t.role === "girl_curator"));
    setModerators(team.filter((t) => t.role === "moderator"));
  }, []);

  const showCurator = curators[0] ?? DEMO_CURATOR;

  return (
    <div className="fp-people-mission">
      <section className="fp-card">
        <div className="fp-card__head-row">
          <h3 className="fp-card__title">Hosts · progression</h3>
          <McLink href="/admin/team" className="fp-link">
            Assign curators & mods →
          </McLink>
        </div>
        <p className="fp-sub">New host → host → senior host → curator. Find future city leaders.</p>
        <ul className="fp-host-lb">
          {DEMO_HOSTS.map((h) => (
            <li key={h.id} className="fp-host-lb__row">
              <div>
                <strong>
                  {h.name} · {HOST_LEVEL_META[h.level].label}
                </strong>
                <span className="fp-sub">
                  {h.city} · trust {h.trustScore} · attend {h.attendanceScore} · community {h.communityScore} · overall{" "}
                  {overallHostScore(h)}
                </span>
                <span className="fp-mini-tags">{h.badges.join(" · ")}</span>
              </div>
              <span className="fp-sub">{h.eventsCurated} events</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="fp-card">
        <h3 className="fp-card__title">Curator · culture & events</h3>
        <p className="fp-sub">Moderation, gatherings, recruit women, welcome members. MVP: assign + pay preference only.</p>
        <div className="fp-curator-card">
          <strong>{showCurator.name}</strong>
          <p className="fp-sub">{showCurator.city} · {showCurator.clubLabel}</p>
          <p className="fp-sub">
            Events: book club, museum girls · Status: active · Pay: {showCurator.paymentMethod}{" "}
            {showCurator.paymentHandle}
          </p>
        </div>
      </section>

      {moderators.length > 0 ? (
        <section className="fp-card">
          <h3 className="fp-card__title">Moderators</h3>
          <ul className="fp-mini-tags">
            {moderators.map((m) => (
              <li key={m.id}>
                {m.name} · {m.city}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
