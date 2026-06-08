"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { PortalClub } from "@/lib/clubs/types";
import {
  HOMEPAGE_ASSETS,
  HOME_NEIGHBORHOODS,
  HOME_ONBOARDING_STEPS,
  HOME_VIBE_TAGS,
  POLAROID_PHOTO,
} from "@/lib/homepage-assets";
import { HomePolaroidPhoto } from "./home-polaroid-photo";
import { MockupFrame } from "./mockup-frame";

const SPOTLIGHT_PHOTO = { left: 8, top: 18, width: 84, height: 58 };

type Gathering = {
  id: string;
  title: string;
  slug?: string;
  starts_at?: string;
  area?: string;
  neighborhood?: string;
};

function formatGatheringWhen(iso?: string) {
  if (!iso) return "Soon";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "Soon";
  const time = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  const day = d.toLocaleDateString("en-US", { weekday: "short" });
  return `${day} · ${time}`;
}

function formatMemberCount(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}K`;
  return n > 0 ? String(n) : "—";
}

export function HomeMockupBoard({ userId }: { firstName?: string; userId?: string | null }) {
  const [clubs, setClubs] = useState<PortalClub[]>([]);
  const [gatherings, setGatherings] = useState<Gathering[]>([]);
  const [heroPhoto, setHeroPhoto] = useState<string | null>(null);
  const [connectPhoto, setConnectPhoto] = useState<string | null>(null);

  useEffect(() => {
    void fetch("/api/clubs")
      .then((r) => (r.ok ? r.json() : { clubs: [] }))
      .then((j) => setClubs(j.clubs ?? []))
      .catch(() => undefined);

    void fetch("/api/member/gatherings")
      .then((r) => (r.ok ? r.json() : { gatherings: [] }))
      .then((j) => setGatherings(j.gatherings ?? []))
      .catch(() => undefined);

    void fetch("/api/home/glance")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!data) return;
        const photos = [
          data.avatarUrl,
          ...(data.profilePhotos ?? []).map((p: { image_url?: string }) => p.image_url),
          ...(data.memories ?? []).map((m: { image_url?: string }) => m.image_url),
        ].filter(Boolean) as string[];
        if (photos[0]) setHeroPhoto(photos[0]);
        if (photos[1]) setConnectPhoto(photos[1]);
        else if (photos[0]) setConnectPhoto(photos[0]);
      })
      .catch(() => undefined);
  }, []);

  const featured = clubs.slice(0, 5);
  const spotlightClub = clubs.find((c) => c.slug.includes("museum") || c.slug.includes("culture")) ?? clubs[0];
  const happenings = gatherings.slice(0, 5);

  return (
    <div className="bb-home-mockup" aria-label="BloomBay home">
      {/* ── Hero ── */}
      <section className="bb-home-mockup__hero">
        <MockupFrame src={HOMEPAGE_ASSETS.heroPaper} className="bb-home-mockup__hero-paper" rotate="-2deg">
          <p className="bb-home-mockup__hero-line">
            find your <em>girls.</em> <span className="bb-home-mockup__heart">♡</span>
          </p>
          <p className="bb-home-mockup__hero-line">
            find your <em>people.</em> <span className="bb-home-mockup__heart">♡</span>
          </p>
          <p className="bb-home-mockup__hero-sub">clubs for every side of you.</p>
        </MockupFrame>

        <div className="bb-home-mockup__hero-polaroid-wrap">
          <span className="bb-home-mockup__belong-badge">you belong here</span>
          <MockupFrame
            src={HOMEPAGE_ASSETS.heroPolaroid}
            className="bb-home-mockup__hero-polaroid"
            rotate="3deg"
            underlay={<HomePolaroidPhoto defaultUrl={heroPhoto} userId={userId} />}
          >
            <p className="bb-home-mockup__polaroid-cap">
              your new favorite room <span className="bb-home-mockup__heart">♡</span>
            </p>
          </MockupFrame>
        </div>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={HOMEPAGE_ASSETS.stickerStar}
          alt=""
          className="bb-home-mockup__star-deco"
          draggable={false}
        />
      </section>

      {/* ── Featured clubs ── */}
      <section className="bb-home-mockup__featured">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={HOMEPAGE_ASSETS.tapePink} alt="" className="bb-home-mockup__tape bb-home-mockup__tape--featured" draggable={false} />
        <div className="bb-home-mockup__featured-head">
          <MockupFrame src={HOMEPAGE_ASSETS.featuredLabel} className="bb-home-mockup__featured-label" rotate="-1deg">
            <span className="bb-home-mockup__featured-label-text">FEATURED CLUBS</span>
          </MockupFrame>
          <p className="bb-home-mockup__featured-whisper">tap to peek inside →</p>
          <Link href="/member/clubs" className="bb-home-mockup__see-all">
            SEE ALL CLUBS
          </Link>
        </div>

        <div className="bb-home-mockup__featured-scroll">
          {featured.length === 0 ? (
            <div className="bb-home-mockup__empty-card">
              <p>No clubs yet — be the first to launch one.</p>
              <Link href="/member/clubs/create">Create a club →</Link>
            </div>
          ) : (
            featured.map((club, i) => {
              const frame = HOMEPAGE_ASSETS.polaroidFeatured[i % HOMEPAGE_ASSETS.polaroidFeatured.length];
              const cover = club.coverUrl ?? club.bannerUrl;
              return (
                <Link
                  key={club.slug}
                  href={`/member/clubs/${club.slug}`}
                  className="bb-home-mockup__club-card-link"
                >
                  <MockupFrame
                    src={frame}
                    className="bb-home-mockup__club-polaroid"
                    rotate={`${(i % 3) - 1}deg`}
                    photoUrl={cover}
                    photoAlt={club.name}
                  >
                    <span className="bb-home-mockup__member-badge">{formatMemberCount(club.memberCount)}</span>
                    <p className="bb-home-mockup__club-name">{club.name.toUpperCase()}</p>
                    <p className="bb-home-mockup__club-vibe">{club.tagline || club.vibe}</p>
                    <span className="bb-home-mockup__club-join">JOIN →</span>
                  </MockupFrame>
                </Link>
              );
            })
          )}
        </div>
      </section>

      {/* ── Middle row: happenings · connect · new here ── */}
      <section className="bb-home-mockup__middle">
        <MockupFrame src={HOMEPAGE_ASSETS.happeningsPaper} className="bb-home-mockup__happenings" rotate="-1deg">
          <h2 className="bb-home-mockup__section-title">TODAY&apos;S HAPPENINGS</h2>
          <ul className="bb-home-mockup__happening-list">
            {happenings.length === 0 ? (
              <li className="bb-home-mockup__happening-row bb-home-mockup__happening-row--empty">
                <span>Nothing on the board yet — check Happenings.</span>
              </li>
            ) : (
              happenings.map((g) => (
                <li key={g.id}>
                  <Link href={g.slug ? `/member/happenings/${g.slug}` : "/member/happenings"} className="bb-home-mockup__happening-row">
                    <span className="bb-home-mockup__happening-dot" />
                    <span className="bb-home-mockup__happening-title">{g.title}</span>
                    <span className="bb-home-mockup__happening-meta">
                      {g.neighborhood ?? g.area ?? "NYC"} · {formatGatheringWhen(g.starts_at)}
                    </span>
                  </Link>
                </li>
              ))
            )}
          </ul>
          <Link href="/member/plans?tab=calendar" className="bb-home-mockup__section-link">
            SEE FULL CALENDAR →
          </Link>
        </MockupFrame>

        <MockupFrame
          src={HOMEPAGE_ASSETS.connectPolaroid}
          className="bb-home-mockup__connect"
          rotate="2deg"
          photoUrl={connectPhoto}
          photoAlt="Community moment"
        >
          <p className="bb-home-mockup__connect-cap">
            real connections. real life. <span className="bb-home-mockup__heart">♡</span>
          </p>
        </MockupFrame>

        <MockupFrame src={HOMEPAGE_ASSETS.newHerePaper} className="bb-home-mockup__new-here" rotate="1deg">
          <h2 className="bb-home-mockup__new-here-title">NEW HERE?</h2>
          <ol className="bb-home-mockup__onboard-list">
            {HOME_ONBOARDING_STEPS.map((s) => (
              <li key={s.n}>
                <Link href={s.href}>
                  <span className="bb-home-mockup__onboard-n">{s.n}</span>
                  {s.task}
                </Link>
              </li>
            ))}
          </ol>
          <Link href="/member/onboarding" className="bb-home-mockup__section-link bb-home-mockup__section-link--light">
            START YOUR JOURNEY →
          </Link>
        </MockupFrame>
      </section>

      {/* ── Club spotlight ── */}
      <section className="bb-home-mockup__spotlight">
        <MockupFrame
          src={HOMEPAGE_ASSETS.spotlightBoard}
          className="bb-home-mockup__spotlight-board"
          photoUrl={spotlightClub?.coverUrl ?? spotlightClub?.bannerUrl ?? null}
          photoHole={SPOTLIGHT_PHOTO}
        >
          <div className="bb-home-mockup__spotlight-copy">
            <p className="bb-home-mockup__spotlight-eyebrow">CLUB SPOTLIGHT</p>
            <p className="bb-home-mockup__spotlight-line">
              {spotlightClub
                ? `${spotlightClub.name} — ${spotlightClub.tagline}`
                : "Your next club story starts here"}
              <span className="bb-home-mockup__heart"> ♡</span>
            </p>
            {spotlightClub ? (
              <Link href={`/member/clubs/${spotlightClub.slug}`} className="bb-home-mockup__im-in">
                I&apos;M IN
              </Link>
            ) : (
              <Link href="/member/clubs/create" className="bb-home-mockup__im-in">
                CREATE CLUB
              </Link>
            )}
          </div>
          <div className="bb-home-mockup__members-going">
            <p>MEMBERS GOING</p>
            <div className="bb-home-mockup__avatar-row">
              {[0, 1, 2, 3].map((i) => (
                <span key={i} className="bb-home-mockup__avatar-dot" />
              ))}
              {spotlightClub && spotlightClub.memberCount > 4 ? (
                <span className="bb-home-mockup__avatar-more">+{spotlightClub.memberCount - 4}</span>
              ) : null}
            </div>
          </div>
        </MockupFrame>
      </section>

      {/* ── Explore by vibe ── */}
      <section className="bb-home-mockup__vibes">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={HOMEPAGE_ASSETS.flower} alt="" className="bb-home-mockup__flower-deco" draggable={false} />
        <MockupFrame src={HOMEPAGE_ASSETS.vibesStrip} className="bb-home-mockup__vibes-strip" rotate="-0.5deg">
          <p className="bb-home-mockup__vibes-title">EXPLORE CLUBS BY VIBE</p>
          <div className="bb-home-mockup__vibe-tags">
            {HOME_VIBE_TAGS.map((v) => (
              <Link key={v.label} href={v.href} className="bb-home-mockup__vibe-tag">
                {v.label}
              </Link>
            ))}
            <Link href="/member/clubs/discover" className="bb-home-mockup__vibe-tag bb-home-mockup__vibe-tag--all">
              all vibes →
            </Link>
          </div>
        </MockupFrame>
      </section>

      {/* ── Near you ── */}
      <section className="bb-home-mockup__near">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={HOMEPAGE_ASSETS.nearYouTape} alt="" className="bb-home-mockup__tape bb-home-mockup__tape--near" draggable={false} />
        <div className="bb-home-mockup__near-head">
          <span>NEAR YOU</span>
          <span className="bb-home-mockup__near-pin">◎</span>
          <span>SOHO, NYC</span>
        </div>
        <div className="bb-home-mockup__near-scroll">
          {HOME_NEIGHBORHOODS.map((n, i) => (
            <Link key={n.name} href={n.href} className="bb-home-mockup__near-card-link">
              <MockupFrame
                src={HOMEPAGE_ASSETS.nearYouPolaroid}
                className="bb-home-mockup__near-polaroid"
                rotate={`${(i % 3) - 1}deg`}
                photoHole={POLAROID_PHOTO}
              >
                <p className="bb-home-mockup__near-name">{n.name}</p>
                <p className="bb-home-mockup__near-sub">explore clubs</p>
              </MockupFrame>
            </Link>
          ))}
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={HOMEPAGE_ASSETS.stickerStar} alt="" className="bb-home-mockup__near-star" draggable={false} />
      </section>
    </div>
  );
}
