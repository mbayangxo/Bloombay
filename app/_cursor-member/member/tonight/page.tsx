"use client";

import Link from "next/link";
import { MemberShell } from "../components/member-shell";
import { SpaceMood } from "@/app/components/member/space-mood";
import { EventPoster } from "@/app/components/bloom-artifacts";
import { MEMBER_UI_REFS } from "@/lib/member-ui-assets";
import { splitTitleHighlight } from "@/lib/bloom-artifact-types";
import { GATHERINGS } from "@/lib/member-portal-data";

const TONIGHT = [
  {
    title: "Sunset Walk",
    where: "Pier A",
    time: "7:00 PM",
    going: "12 women walking",
    gatheringId: GATHERINGS[0]?.id ?? "g1",
  },
  {
    title: "Rooftop Dinner",
    where: "SoHo",
    time: "8:00 PM",
    going: "8 at the table",
    gatheringId: GATHERINGS[0]?.id ?? "g1",
  },
  {
    title: "Pilates flow",
    where: "Chelsea",
    time: "Tomorrow · 9 AM",
    going: "5 seats left",
    gatheringId: GATHERINGS[1]?.id ?? "g2",
  },
];

export default function TonightPage() {
  return (
    <MemberShell backHref="/member/home" backLabel="Home" compactHeader flush fullWidth>
      <SpaceMood mood="tonight" showIntro={false}>
        <div className="mp-tonight-board">
          <div
            className="mp-tonight-board__bg"
            style={{ backgroundImage: `url(${MEMBER_UI_REFS.tonight})` }}
            aria-hidden
          />
          <div className="mp-tonight-board__content">
            <header className="mp-tonight-board__head">
              <p className="mp-hero__eyebrow">Tonight</p>
              <h1>32 women are out</h1>
              <p style={{ margin: "0.35rem 0 0", fontSize: "0.88rem", opacity: 0.85 }}>
                Not a list. A scene.
              </p>
            </header>

            <div className="bb-artifact-stack" style={{ padding: "0 0.5rem" }}>
              {TONIGHT.map((item) => {
                const { lead, highlight } = splitTitleHighlight(item.title);
                return (
                  <EventPoster
                    key={`${item.gatheringId}-${item.title}`}
                    compact
                    eyebrow={item.going}
                    title={lead}
                    titleHighlight={highlight}
                    meta={`${item.where} · ${item.time}`}
                    href={`/member/happenings/gatherings/${item.gatheringId}`}
                    coverStyle={{ background: "linear-gradient(160deg,#1a0514,#ff0055)" }}
                  />
                );
              })}
            </div>

            <p
              className="mp-torn-note"
              style={{ maxWidth: 280, margin: "1.5rem auto", textAlign: "center", transform: "rotate(-2deg)" }}
            >
              <Link href="/member/happenings?tab=invitations" className="mp-link">
                See all invitations →
              </Link>
            </p>
          </div>
        </div>
      </SpaceMood>
    </MemberShell>
  );
}
