"use client";

import Link from "next/link";
import {
  HOMEPAGE_ASSETS,
  HOME_NEIGHBORHOODS,
  HOME_ONBOARDING_STEPS,
  HOME_VIBE_TAGS,
  POLAROID_PHOTO,
} from "@/lib/homepage-assets";
import {
  formatGatheringWhen,
  formatMemberCount,
  type HomeMockupData,
} from "@/app/hooks/use-home-mockup-data";
import { HomePolaroidPhoto } from "./home-polaroid-photo";
import { MockupFrame } from "./mockup-frame";

const SPOTLIGHT_PHOTO = { left: 8, top: 18, width: 84, height: 58 };

/** Desktop mockup — wide editorial scrapbook spread (not scaled mobile). */
export function HomeMockupDesktop({ data }: { data: HomeMockupData }) {
  const { userId, featured, spotlightClub, happenings, heroPhoto, connectPhoto } = data;

  return (
    <div className="bb-home-d" aria-label="BloomBay home — desktop">
      {/* Row 1: Hero spread */}
      <section className="bb-home-d__hero-row">
        <div className="bb-home-d__hero-copy">
          <MockupFrame src={HOMEPAGE_ASSETS.heroPaper} className="bb-home-d__hero-paper" rotate="-1.5deg">
            <p className="bb-home-d__hero-line">
              find your <em>girls.</em> <span className="bb-home-d__heart">♡</span>
            </p>
            <p className="bb-home-d__hero-line">
              find your <em>people.</em> <span className="bb-home-d__heart">♡</span>
            </p>
            <p className="bb-home-d__hero-sub">clubs for every side of you.</p>
          </MockupFrame>
        </div>

        <div className="bb-home-d__hero-photo">
          <span className="bb-home-d__belong-badge">you belong here</span>
          <MockupFrame
            src={HOMEPAGE_ASSETS.heroPolaroid}
            className="bb-home-d__hero-polaroid"
            rotate="2deg"
            underlay={<HomePolaroidPhoto defaultUrl={heroPhoto} userId={userId} />}
          >
            <p className="bb-home-d__polaroid-cap">
              your new favorite room <span className="bb-home-d__heart">♡</span>
            </p>
          </MockupFrame>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={HOMEPAGE_ASSETS.stickerStar} alt="" className="bb-home-d__star-deco" draggable={false} />
        </div>
      </section>

      {/* Row 2: Featured clubs grid */}
      <section className="bb-home-d__featured">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={HOMEPAGE_ASSETS.tapePink} alt="" className="bb-home-d__tape bb-home-d__tape--featured" draggable={false} />
        <div className="bb-home-d__featured-head">
          <MockupFrame src={HOMEPAGE_ASSETS.featuredLabel} className="bb-home-d__featured-label" rotate="-1deg">
            <span className="bb-home-d__featured-label-text">FEATURED CLUBS</span>
          </MockupFrame>
          <p className="bb-home-d__featured-whisper">tap to peek inside →</p>
          <Link href="/member/clubs" className="bb-home-d__see-all">
            SEE ALL CLUBS
          </Link>
        </div>

        <div className="bb-home-d__featured-grid">
          {featured.length === 0 ? (
            <div className="bb-home-d__empty-card">
              <p>No clubs yet — be the first to launch one.</p>
              <Link href="/member/clubs/create" aria-label="Create a club" className="bb-home-d__create-plus">
                +
              </Link>
            </div>
          ) : (
            featured.map((club, i) => {
              const frame = HOMEPAGE_ASSETS.polaroidFeatured[i % HOMEPAGE_ASSETS.polaroidFeatured.length];
              const cover = club.coverUrl ?? club.bannerUrl;
              return (
                <Link key={club.slug} href={`/member/clubs/${club.slug}`} className="bb-home-d__club-card-link">
                  <MockupFrame
                    src={frame}
                    className="bb-home-d__club-polaroid"
                    rotate={`${(i % 3) - 1}deg`}
                    photoUrl={cover}
                    photoAlt={club.name}
                  >
                    <span className="bb-home-d__member-badge">{formatMemberCount(club.memberCount)}</span>
                    <p className="bb-home-d__club-name">{club.name.toUpperCase()}</p>
                    <p className="bb-home-d__club-vibe">{club.tagline || club.vibe}</p>
                    <span className="bb-home-d__club-join">JOIN →</span>
                  </MockupFrame>
                </Link>
              );
            })
          )}
        </div>
      </section>

      {/* Row 3: Three-column desk spread */}
      <section className="bb-home-d__middle">
        <MockupFrame src={HOMEPAGE_ASSETS.happeningsPaper} className="bb-home-d__happenings" rotate="-1deg">
          <h2 className="bb-home-d__section-title">TODAY&apos;S HAPPENINGS</h2>
          <ul className="bb-home-d__happening-list">
            {happenings.length === 0 ? (
              <li className="bb-home-d__happening-row bb-home-d__happening-row--empty">
                <span>Nothing on the board yet — check Happenings.</span>
              </li>
            ) : (
              happenings.map((g) => (
                <li key={g.id}>
                  <Link
                    href={g.slug ? `/member/happenings/${g.slug}` : "/member/happenings"}
                    className="bb-home-d__happening-row"
                  >
                    <span className="bb-home-d__happening-dot" />
                    <span className="bb-home-d__happening-title">{g.title}</span>
                    <span className="bb-home-d__happening-meta">
                      {g.neighborhood ?? g.area ?? "NYC"} · {formatGatheringWhen(g.starts_at)}
                    </span>
                  </Link>
                </li>
              ))
            )}
          </ul>
          <Link href="/member/plans?tab=calendar" className="bb-home-d__section-link">
            SEE FULL CALENDAR →
          </Link>
        </MockupFrame>

        <MockupFrame
          src={HOMEPAGE_ASSETS.connectPolaroid}
          className="bb-home-d__connect"
          rotate="2deg"
          photoUrl={connectPhoto}
          photoAlt="Community moment"
        >
          <p className="bb-home-d__connect-cap">
            real connections. real life. <span className="bb-home-d__heart">♡</span>
          </p>
        </MockupFrame>

        <MockupFrame src={HOMEPAGE_ASSETS.newHerePaper} className="bb-home-d__new-here" rotate="1deg">
          <h2 className="bb-home-d__new-here-title">NEW HERE?</h2>
          <ol className="bb-home-d__onboard-list">
            {HOME_ONBOARDING_STEPS.map((s) => (
              <li key={s.n}>
                <Link href={s.href}>
                  <span className="bb-home-d__onboard-n">{s.n}</span>
                  {s.task}
                </Link>
              </li>
            ))}
          </ol>
          <Link href="/member/onboarding" className="bb-home-d__section-link bb-home-d__section-link--light">
            START YOUR JOURNEY →
          </Link>
        </MockupFrame>
      </section>

      {/* Row 4: Spotlight banner */}
      <section className="bb-home-d__spotlight">
        <MockupFrame
          src={HOMEPAGE_ASSETS.spotlightBoard}
          className="bb-home-d__spotlight-board"
          photoUrl={spotlightClub?.coverUrl ?? spotlightClub?.bannerUrl ?? null}
          photoHole={SPOTLIGHT_PHOTO}
        >
          <div className="bb-home-d__spotlight-copy">
            <p className="bb-home-d__spotlight-eyebrow">CLUB SPOTLIGHT</p>
            <p className="bb-home-d__spotlight-line">
              {spotlightClub
                ? `${spotlightClub.name} — ${spotlightClub.tagline}`
                : "Your next club story starts here"}
              <span className="bb-home-d__heart"> ♡</span>
            </p>
            {spotlightClub ? (
              <Link href={`/member/clubs/${spotlightClub.slug}`} className="bb-home-d__im-in">
                I&apos;M IN
              </Link>
            ) : (
              <Link href="/member/clubs/create" className="bb-home-d__im-in">
                CREATE CLUB
              </Link>
            )}
          </div>
          <div className="bb-home-d__members-going">
            <p>MEMBERS GOING</p>
            <div className="bb-home-d__avatar-row">
              {[0, 1, 2, 3].map((i) => (
                <span key={i} className="bb-home-d__avatar-dot" />
              ))}
              {spotlightClub && spotlightClub.memberCount > 4 ? (
                <span className="bb-home-d__avatar-more">+{spotlightClub.memberCount - 4}</span>
              ) : null}
            </div>
          </div>
        </MockupFrame>
      </section>

      {/* Row 5: Vibes + Near you side by side on wide desks */}
      <section className="bb-home-d__lower">
        <div className="bb-home-d__vibes">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={HOMEPAGE_ASSETS.flower} alt="" className="bb-home-d__flower-deco" draggable={false} />
          <MockupFrame src={HOMEPAGE_ASSETS.vibesStrip} className="bb-home-d__vibes-strip" rotate="-0.5deg">
            <p className="bb-home-d__vibes-title">EXPLORE CLUBS BY VIBE</p>
            <div className="bb-home-d__vibe-tags">
              {HOME_VIBE_TAGS.map((v) => (
                <Link key={v.label} href={v.href} className="bb-home-d__vibe-tag">
                  {v.label}
                </Link>
              ))}
              <Link href="/member/clubs/discover" className="bb-home-d__vibe-tag bb-home-d__vibe-tag--all">
                all vibes →
              </Link>
            </div>
          </MockupFrame>
        </div>

        <div className="bb-home-d__near">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={HOMEPAGE_ASSETS.nearYouTape} alt="" className="bb-home-d__tape bb-home-d__tape--near" draggable={false} />
          <div className="bb-home-d__near-head">
            <span>NEAR YOU</span>
            <span className="bb-home-d__near-pin">◎</span>
            <span>SOHO, NYC</span>
          </div>
          <div className="bb-home-d__near-grid">
            {HOME_NEIGHBORHOODS.map((n, i) => (
              <Link key={n.name} href={n.href} className="bb-home-d__near-card-link">
                <MockupFrame
                  src={HOMEPAGE_ASSETS.nearYouPolaroid}
                  className="bb-home-d__near-polaroid"
                  rotate={`${(i % 3) - 1}deg`}
                  photoHole={POLAROID_PHOTO}
                >
                  <p className="bb-home-d__near-name">{n.name}</p>
                  <p className="bb-home-d__near-sub">explore clubs</p>
                </MockupFrame>
              </Link>
            ))}
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={HOMEPAGE_ASSETS.stickerStar} alt="" className="bb-home-d__near-star" draggable={false} />
        </div>
      </section>
    </div>
  );
}
