"use client";

import Link from "next/link";
import { useState } from "react";
import { ClubIdentity } from "@/app/components/crest/club-identity";
import { BloomInvitation, WallNote } from "@/app/components/bloom-artifacts";
import { SpaceMood } from "@/app/components/member/space-mood";
import type { ClubProfile } from "@/lib/club-world-data";
import { clubMoodId, clubSceneLine } from "@/lib/bloom-space-moods";
import { listMembersWithRoles } from "@/lib/club-operations-store";
import { wallVariantFromTopic } from "@/lib/bloom-artifact-types";

import { getClubHouseRooms } from "@/lib/club-house-rooms";
import { BbEmptyState } from "@/app/components/member/bb-empty-state";

const TAB_IDS = ["wall", "zones", "moments", "happenings", "members", "chat", "planner"] as const;

export function ClubWorld({ club }: { club: ClubProfile }) {
  const [tab, setTab] = useState<(typeof TAB_IDS)[number]>("wall");
  const directory = listMembersWithRoles(club.id);
  const moodId = clubMoodId(club.id, club.category);
  const houseRooms = getClubHouseRooms(club.id);
  const roomLabel = (id: string) => houseRooms.find((r) => r.id === id)?.label ?? id;

  return (
    <SpaceMood mood={moodId} showIntro={false}>
      <div className="mp-world">
        <div className="mp-world-hero">
          <div className="mp-explore-hero__nav">
            <Link href={`/member/clubs/${club.id}`}>← Landing</Link>
            <span>{club.hereNow} inside now</span>
          </div>
          <ClubIdentity clubId={club.id} name={club.name} size="sm" layout="row" />
          <p className="bb-club-alive" style={{ margin: "0.5rem 0 0", background: "transparent", padding: 0 }}>
            <strong>{clubSceneLine(club.id, club.name, club.hereNow)}</strong>
          </p>
          <p style={{ margin: 0, fontSize: "0.85rem", opacity: 0.9, fontFamily: "var(--font-accent)", fontStyle: "italic" }}>
            {club.tagline}
          </p>
          <p className="mp-room-lobby__eyebrow" style={{ margin: "0.35rem 0 0", opacity: 0.85 }}>
            Club House · pick a room
          </p>
        </div>

        <nav className="mp-world-charms">
          {TAB_IDS.map((t) => (
            <button key={t} type="button" className={tab === t ? "is-active" : ""} onClick={() => setTab(t)}>
              {roomLabel(t)}
            </button>
          ))}
        </nav>

        <div className="mp-world-pulse">
          <span style={{ color: "var(--mood-accent, var(--bb-hot))", fontWeight: 700 }}>LIVE</span>
          <span>
            {club.hereNow} women here · {club.momentsToday} moments today
          </span>
          <Link href="/member/happenings" className="mp-link" style={{ marginLeft: "auto" }}>
            Seats in Happenings →
          </Link>
        </div>

        <div className="mp-world-scroll">
          <div>
            {tab === "wall" && (
              <>
                {club.pinnedNote ? (
                  <WallNote
                    topic="Pinned"
                    title={club.name}
                    body={club.pinnedNote}
                    footer="Host pin"
                    variant="pink"
                    tilt={-1}
                  />
                ) : null}
                <div className="bb-wall-grid" style={{ marginTop: "1rem", marginBottom: "1rem" }}>
                  {club.vibeBoard.map((v, i) => (
                    <WallNote
                      key={`${v.author}-${v.time}`}
                      topic="Still awake"
                      title={v.author}
                      body={v.text}
                      footer={v.time}
                      variant={wallVariantFromTopic(club.category)}
                      tilt={i % 2 === 0 ? 1.2 : -1}
                    />
                  ))}
                </div>
                <p className="bb-club-alive">
                  <strong>{directory.length}</strong> members in directory · no circles — just names on the wall.
                </p>
              </>
            )}

            {tab === "zones" && (
              <section className="mp-section">
                <h2 className="mp-section__title">Chapters</h2>
                <p style={{ fontSize: "0.82rem", color: "var(--bb-muted)", fontFamily: "var(--font-accent)", fontStyle: "italic" }}>
                  Same club. Different rooms.
                </p>
                <div className="mp-zone-grid" style={{ marginTop: "0.75rem" }}>
                  {club.zones.map((z) => (
                    <Link
                      key={z.id}
                      href={`/member/clubs/${club.id}/zones/${z.id}`}
                      className="mp-zone-card"
                      style={{ background: z.tone }}
                    >
                      <div className="mp-zone-card__inner">
                        <strong>{z.name}</strong>
                        <span style={{ fontSize: "0.72rem" }}>{z.members} members · {z.hereNow} here</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {tab === "moments" && (
              <section className="mp-section">
                {club.vibeBoard.length === 0 ? (
                  <BbEmptyState
                    title="No moments yet"
                    body="Be the first to leave something on the wall — a photo, a line, a soft brag from tonight."
                    actionLabel="Pin in The City"
                    actionHref="/member/explore#moments"
                  />
                ) : (
                  <div className="bb-polaroid-strip--vault">
                    {club.vibeBoard.map((v) => (
                      <WallNote
                        key={`m-${v.time}`}
                        topic="Moment"
                        title={v.author}
                        body={v.text}
                        footer={v.time}
                        variant="ivory"
                        tilt={-2}
                      />
                    ))}
                  </div>
                )}
              </section>
            )}

            {tab === "happenings" && (
              <section className="mp-section bb-artifact-stack">
                {club.upcomingEvents.length === 0 ? (
                  <BbEmptyState
                    title="No gatherings posted"
                    body="Hosts can drop the next seat from the clubhouse portal — or start one from Happenings."
                    actionLabel="Open Happenings"
                    actionHref="/member/happenings"
                  />
                ) : (
                  club.upcomingEvents.map((ev) => (
                    <BloomInvitation
                      key={ev.title}
                      eventName={ev.title}
                      meta={`${ev.date} · ${ev.location}`}
                      when={ev.date}
                      href="/member/happenings"
                    />
                  ))
                )}
                <Link href="/member/happenings/create" className="mp-btn mp-btn--outline mp-btn--block" style={{ marginTop: "0.75rem" }}>
                  Create happening
                </Link>
              </section>
            )}

            {tab === "members" && (
              <section className="mp-section">
                <Link href={`/member/clubs/${club.id}/members`} className="mp-btn mp-btn--hot mp-btn--sm" style={{ marginBottom: "0.75rem" }}>
                  Full directory →
                </Link>
                <div className="bb-artifact-stack">
                  {directory.map((m) => (
                    <WallNote
                      key={m.id}
                      topic={m.role}
                      title={m.name}
                      body="On the member wall — connect after you share a seat."
                      footer={club.name}
                      variant="ivory"
                    />
                  ))}
                </div>
              </section>
            )}

            {tab === "chat" && (
              <section className="mp-section">
                <WallNote
                  topic="Club line"
                  title="Friday?"
                  body="Maya: Who's in for Friday? 🍷 — the thread is still open."
                  footer="Club chat · host ping"
                  variant="pink"
                />
              </section>
            )}

            {tab === "planner" && (
              <section className="mp-section">
                <p style={{ fontSize: "0.88rem", fontFamily: "var(--font-accent)", fontStyle: "italic" }}>
                  Plan a gathering — who brings what, where, when.
                </p>
                <Link href={`/member/clubs/${club.id}/members`} className="mp-btn mp-btn--outline mp-btn--block" style={{ marginTop: "0.5rem" }}>
                  View members directory
                </Link>
              </section>
            )}
          </div>

          <aside className="mp-world-sidebar">
            {club.upcomingEvents.slice(0, 2).map((ev) => (
              <BloomInvitation
                key={`side-${ev.title}`}
                eventName={ev.title}
                meta={ev.date}
                when={ev.date}
                href="/member/happenings"
              />
            ))}
          </aside>
        </div>
      </div>
    </SpaceMood>
  );
}
