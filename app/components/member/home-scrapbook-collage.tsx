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
import { ScrapbookLayer } from "./scrapbook-layer";

const SPOTLIGHT_PHOTO = { left: 8, top: 18, width: 84, height: 58 };

function CollagePhoto({
  photoUrl,
  photoHole = POLAROID_PHOTO,
  userId,
  defaultUrl,
}: {
  photoUrl?: string | null;
  photoHole?: { left: number; top: number; width: number; height: number };
  userId?: string | null;
  defaultUrl?: string | null;
}) {
  if (photoUrl) {
    return (
      <div
        className="bb-home-collage__photo"
        style={{
          left: `${photoHole.left}%`,
          top: `${photoHole.top}%`,
          width: `${photoHole.width}%`,
          height: `${photoHole.height}%`,
          backgroundImage: `url(${photoUrl})`,
        }}
        role="img"
      />
    );
  }
  return <HomePolaroidPhoto defaultUrl={defaultUrl ?? null} userId={userId} />;
}

/** Single overlapping scrapbook canvas — not stacked dashboard sections. */
export function HomeScrapbookCollage({ data }: { data: HomeMockupData }) {
  const { userId, featured, spotlightClub, happenings, heroPhoto, connectPhoto } = data;

  return (
    <>
      <section className="bb-home-collage bb-home-collage--mobile" aria-label="BloomBay home collage">
        <ScrapbookLayer
          src={HOMEPAGE_ASSETS.tapePink}
          className="bb-home-collage__tape bb-home-collage__tape--featured"
          rotate="8deg"
          zIndex={12}
        />

        <ScrapbookLayer
          src={HOMEPAGE_ASSETS.heroPaper}
          className="bb-home-collage__hero-paper"
          rotate="-2deg"
          zIndex={2}
        >
          <p className="bb-home-collage__hero-line bb-home-collage__hero-line--1">
            find your <em>girls.</em> <span className="bb-home-collage__heart">♡</span>
          </p>
          <p className="bb-home-collage__hero-line bb-home-collage__hero-line--2">
            find your <em>people.</em> <span className="bb-home-collage__heart">♡</span>
          </p>
          <p className="bb-home-collage__hero-sub">clubs for every side of you.</p>
        </ScrapbookLayer>

        <ScrapbookLayer
          src={HOMEPAGE_ASSETS.heroPolaroid}
          className="bb-home-collage__hero-polaroid"
          rotate="3deg"
          zIndex={4}
          underlay={<CollagePhoto userId={userId} defaultUrl={heroPhoto} />}
        >
          <span className="bb-home-collage__belong">you belong here</span>
          <p className="bb-home-collage__polaroid-cap">
            your new favorite room <span className="bb-home-collage__heart">♡</span>
          </p>
        </ScrapbookLayer>

        <ScrapbookLayer
          src={HOMEPAGE_ASSETS.stickerStar}
          className="bb-home-collage__star"
          rotate="-12deg"
          zIndex={11}
        />

        <ScrapbookLayer
          src={HOMEPAGE_ASSETS.featuredLabel}
          className="bb-home-collage__featured-label"
          rotate="-1deg"
          zIndex={5}
        >
          <span className="bb-home-collage__featured-label-text">FEATURED CLUBS</span>
          <p className="bb-home-collage__featured-whisper">tap to peek inside →</p>
          <Link href="/member/clubs" className="bb-home-collage__see-all">
            SEE ALL CLUBS
          </Link>
        </ScrapbookLayer>

        {featured.length === 0 ? (
          <div className="bb-home-collage__empty" style={{ zIndex: 6 }}>
            <p>No clubs yet</p>
            <Link href="/member/clubs/create" className="bb-home-collage__plus" aria-label="Create a club">
              +
            </Link>
          </div>
        ) : (
          featured.slice(0, 3).map((club, i) => {
            const frame = HOMEPAGE_ASSETS.polaroidFeatured[i % HOMEPAGE_ASSETS.polaroidFeatured.length];
            const cover = club.coverUrl ?? club.bannerUrl;
            return (
              <Link
                key={club.slug}
                href={`/member/clubs/${club.slug}`}
                className={`bb-home-collage__club bb-home-collage__club--${i + 1}`}
                style={{ zIndex: 6 + i }}
              >
                <ScrapbookLayer
                  src={frame}
                  className="bb-home-collage__club-frame"
                  rotate={`${(i % 3) - 1}deg`}
                >
                  {cover ? <CollagePhoto photoUrl={cover} photoHole={POLAROID_PHOTO} /> : null}
                  <span className="bb-home-collage__member-badge">{formatMemberCount(club.memberCount)}</span>
                  <p className="bb-home-collage__club-name">{club.name.toUpperCase()}</p>
                  <p className="bb-home-collage__club-vibe">{club.tagline || club.vibe}</p>
                  <span className="bb-home-collage__club-join">JOIN →</span>
                </ScrapbookLayer>
              </Link>
            );
          })
        )}

        <ScrapbookLayer
          src={HOMEPAGE_ASSETS.happeningsPaper}
          className="bb-home-collage__happenings"
          rotate="-1deg"
          zIndex={7}
        >
          <h2 className="bb-home-collage__section-title">TODAY&apos;S HAPPENINGS</h2>
          <ul className="bb-home-collage__happening-list">
            {happenings.length === 0 ? (
              <li className="bb-home-collage__happening-empty">Nothing on the board yet</li>
            ) : (
              happenings.slice(0, 4).map((g) => (
                <li key={g.id}>
                  <Link
                    href={g.slug ? `/member/happenings/${g.slug}` : "/member/happenings"}
                    className="bb-home-collage__happening-row"
                  >
                    <span className="bb-home-collage__happening-dot" />
                    <span>{g.title}</span>
                    <span className="bb-home-collage__happening-meta">
                      {formatGatheringWhen(g.starts_at)}
                    </span>
                  </Link>
                </li>
              ))
            )}
          </ul>
          <Link href="/member/plans?tab=calendar" className="bb-home-collage__section-link">
            SEE FULL CALENDAR →
          </Link>
        </ScrapbookLayer>

        <ScrapbookLayer
          src={HOMEPAGE_ASSETS.connectPolaroid}
          className="bb-home-collage__connect"
          rotate="2deg"
          zIndex={8}
          underlay={<CollagePhoto photoUrl={connectPhoto} />}
        >
          <p className="bb-home-collage__connect-cap">
            real connections. real life. <span className="bb-home-collage__heart">♡</span>
          </p>
        </ScrapbookLayer>

        <ScrapbookLayer
          src={HOMEPAGE_ASSETS.newHerePaper}
          className="bb-home-collage__new-here"
          rotate="1deg"
          zIndex={9}
        >
          <h2 className="bb-home-collage__new-here-title">NEW HERE?</h2>
          <ol className="bb-home-collage__onboard-list">
            {HOME_ONBOARDING_STEPS.map((s) => (
              <li key={s.n}>
                <Link href={s.href}>
                  <span className="bb-home-collage__onboard-n">{s.n}</span>
                  {s.task}
                </Link>
              </li>
            ))}
          </ol>
        </ScrapbookLayer>

        <ScrapbookLayer
          src={HOMEPAGE_ASSETS.spotlightBoard}
          className="bb-home-collage__spotlight"
          rotate="-0.5deg"
          zIndex={10}
          underlay={
            spotlightClub?.coverUrl || spotlightClub?.bannerUrl ? (
              <CollagePhoto
                photoUrl={spotlightClub.coverUrl ?? spotlightClub.bannerUrl}
                photoHole={SPOTLIGHT_PHOTO}
              />
            ) : null
          }
        >
          <p className="bb-home-collage__spotlight-eyebrow">CLUB SPOTLIGHT</p>
          <p className="bb-home-collage__spotlight-line">
            {spotlightClub
              ? `${spotlightClub.name} — ${spotlightClub.tagline}`
              : "Your next club story starts here"}
          </p>
          <Link
            href={spotlightClub ? `/member/clubs/${spotlightClub.slug}` : "/member/clubs/create"}
            className="bb-home-collage__im-in"
          >
            {spotlightClub ? "I'M IN" : "CREATE CLUB"}
          </Link>
        </ScrapbookLayer>

        <ScrapbookLayer
          src={HOMEPAGE_ASSETS.flower}
          className="bb-home-collage__flower"
          rotate="-6deg"
          zIndex={13}
        />

        <ScrapbookLayer
          src={HOMEPAGE_ASSETS.vibesStrip}
          className="bb-home-collage__vibes"
          rotate="-0.5deg"
          zIndex={11}
        >
          <p className="bb-home-collage__vibes-title">EXPLORE CLUBS BY VIBE</p>
          <div className="bb-home-collage__vibe-tags">
            {HOME_VIBE_TAGS.slice(0, 6).map((v) => (
              <Link key={v.label} href={v.href} className="bb-home-collage__vibe-tag">
                {v.label}
              </Link>
            ))}
          </div>
        </ScrapbookLayer>

        <ScrapbookLayer
          src={HOMEPAGE_ASSETS.nearYouTape}
          className="bb-home-collage__tape bb-home-collage__tape--near"
          rotate="-5deg"
          zIndex={12}
        />

        <div className="bb-home-collage__near-head" style={{ zIndex: 11 }}>
          <span>NEAR YOU</span>
          <span>◎ SOHO, NYC</span>
        </div>

        {HOME_NEIGHBORHOODS.slice(0, 3).map((n, i) => (
          <Link
            key={n.name}
            href={n.href}
            className={`bb-home-collage__near bb-home-collage__near--${i + 1}`}
            style={{ zIndex: 10 + i }}
          >
            <ScrapbookLayer
              src={HOMEPAGE_ASSETS.nearYouPolaroid}
              className="bb-home-collage__near-frame"
              rotate={`${(i % 3) - 1}deg`}
            >
              <p className="bb-home-collage__near-name">{n.name}</p>
              <p className="bb-home-collage__near-sub">explore clubs</p>
            </ScrapbookLayer>
          </Link>
        ))}
      </section>

      <section className="bb-home-collage bb-home-collage--desktop" aria-label="BloomBay home collage — desktop">
        {/* Desktop: same objects, wider spread — positions in CSS */}
        <ScrapbookLayer src={HOMEPAGE_ASSETS.heroPaper} className="bb-home-collage__d-hero-paper" rotate="-1.5deg" zIndex={2}>
          <p className="bb-home-collage__hero-line bb-home-collage__hero-line--1">
            find your <em>girls.</em> <span className="bb-home-collage__heart">♡</span>
          </p>
          <p className="bb-home-collage__hero-line bb-home-collage__hero-line--2">
            find your <em>people.</em> <span className="bb-home-collage__heart">♡</span>
          </p>
          <p className="bb-home-collage__hero-sub">clubs for every side of you.</p>
        </ScrapbookLayer>

        <ScrapbookLayer
          src={HOMEPAGE_ASSETS.heroPolaroid}
          className="bb-home-collage__d-hero-polaroid"
          rotate="2deg"
          zIndex={4}
          underlay={<CollagePhoto userId={userId} defaultUrl={heroPhoto} />}
        >
          <span className="bb-home-collage__belong">you belong here</span>
          <p className="bb-home-collage__polaroid-cap">
            your new favorite room <span className="bb-home-collage__heart">♡</span>
          </p>
        </ScrapbookLayer>

        <ScrapbookLayer src={HOMEPAGE_ASSETS.featuredLabel} className="bb-home-collage__d-featured-label" rotate="-1deg" zIndex={5}>
          <span className="bb-home-collage__featured-label-text">FEATURED CLUBS</span>
          <Link href="/member/clubs" className="bb-home-collage__see-all">
            SEE ALL CLUBS →
          </Link>
        </ScrapbookLayer>

        {featured.slice(0, 4).map((club, i) => {
          const frame = HOMEPAGE_ASSETS.polaroidFeatured[i % HOMEPAGE_ASSETS.polaroidFeatured.length];
          const cover = club.coverUrl ?? club.bannerUrl;
          return (
            <Link
              key={club.slug}
              href={`/member/clubs/${club.slug}`}
              className={`bb-home-collage__d-club bb-home-collage__d-club--${i + 1}`}
              style={{ zIndex: 6 + i }}
            >
              <ScrapbookLayer src={frame} rotate={`${(i % 3) - 1}deg`}>
                {cover ? <CollagePhoto photoUrl={cover} /> : null}
                <p className="bb-home-collage__club-name">{club.name.toUpperCase()}</p>
                <span className="bb-home-collage__club-join">JOIN →</span>
              </ScrapbookLayer>
            </Link>
          );
        })}

        <ScrapbookLayer src={HOMEPAGE_ASSETS.happeningsPaper} className="bb-home-collage__d-happenings" rotate="-1deg" zIndex={8}>
          <h2 className="bb-home-collage__section-title">TODAY&apos;S HAPPENINGS</h2>
          <ul className="bb-home-collage__happening-list">
            {happenings.slice(0, 5).map((g) => (
              <li key={g.id}>
                <Link href={g.slug ? `/member/happenings/${g.slug}` : "/member/happenings"}>
                  {g.title}
                </Link>
              </li>
            ))}
          </ul>
        </ScrapbookLayer>

        <ScrapbookLayer
          src={HOMEPAGE_ASSETS.spotlightBoard}
          className="bb-home-collage__d-spotlight"
          rotate="-0.5deg"
          zIndex={9}
          underlay={
            spotlightClub?.coverUrl || spotlightClub?.bannerUrl ? (
              <CollagePhoto photoUrl={spotlightClub.coverUrl ?? spotlightClub.bannerUrl} photoHole={SPOTLIGHT_PHOTO} />
            ) : null
          }
        >
          <p className="bb-home-collage__spotlight-eyebrow">CLUB SPOTLIGHT</p>
          <p className="bb-home-collage__spotlight-line">{spotlightClub?.name ?? "Your club"}</p>
        </ScrapbookLayer>

        <ScrapbookLayer src={HOMEPAGE_ASSETS.vibesStrip} className="bb-home-collage__d-vibes" rotate="-0.5deg" zIndex={10}>
          <p className="bb-home-collage__vibes-title">EXPLORE BY VIBE</p>
          <div className="bb-home-collage__vibe-tags">
            {HOME_VIBE_TAGS.map((v) => (
              <Link key={v.label} href={v.href} className="bb-home-collage__vibe-tag">
                {v.label}
              </Link>
            ))}
          </div>
        </ScrapbookLayer>

        <ScrapbookLayer src={HOMEPAGE_ASSETS.flower} className="bb-home-collage__d-flower" rotate="-8deg" zIndex={12} />
        <ScrapbookLayer src={HOMEPAGE_ASSETS.stickerStar} className="bb-home-collage__d-star" rotate="10deg" zIndex={11} />
      </section>
    </>
  );
}
