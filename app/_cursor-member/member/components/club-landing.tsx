"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ClubIdentity } from "@/app/components/crest/club-identity";
import { BloomBayCrest } from "@/app/components/crest/bloombay-crest";
import { getClubCrestConfig } from "@/lib/crest-system";
import type { ClubProfile } from "@/lib/club-world-data";
import { isClubMember } from "@/lib/club-world-data";
import { ClubCredibility } from "@/app/components/member/club-credibility";
import { isClubDiscoverable } from "@/lib/club-signals";
import { BloomObjectIcon } from "@/app/components/bloom/bloom-object-icon";
import { BLOOM_OBJECTS } from "@/lib/bloom-object-assets";
import { getClubMamaKit, getClubRules } from "@/lib/club-mama-kit";

export function ClubLanding({ club }: { club: ClubProfile }) {
  const [member, setMember] = useState(false);
  const rulesDoc = getClubRules(club.id);
  const mamaKit = getClubMamaKit(club.id);
  const bloomOnLanding = mamaKit.bloomObjectKeys
    .map((key) => (key in BLOOM_OBJECTS ? { key, src: BLOOM_OBJECTS[key as keyof typeof BLOOM_OBJECTS] } : null))
    .filter(Boolean) as { key: string; src: string }[];
  const fullLanding = club.join.useLandingPage !== false;
  const heroImage = club.landingHeroImage ?? club.photos[0]?.imageUrl;
  const crestConfig = getClubCrestConfig(club.id);
  const joinHref = member ? `/member/clubs/${club.id}/world` : `/member/clubs/${club.id}/join`;

  useEffect(() => {
    setMember(isClubMember(club.id));
  }, [club.id]);

  return (
    <div className="mp-club-landing mp-club-landing--v2">
      <section className="mp-club-landing-hero">
        {heroImage ? (
          <Image src={heroImage} alt="" fill priority className="mp-club-landing-hero__img" sizes="100vw" />
        ) : (
          <div className="mp-club-landing-hero__gradient" style={{ background: club.gradient }} />
        )}
        <div className="mp-club-landing-hero__shade" />
        <div className="mp-club-landing-hero__content">
          <Link href="/member/clubs" className="mp-club-landing-hero__back">
            ← Clubs
          </Link>
          <span className="mp-club-landing-hero__cat">{club.category}</span>
          <div className="mp-club-landing-hero__identity">
            <ClubIdentity clubId={club.id} name={club.name} size="sm" layout="row" />
          </div>
          <p className="mp-club-landing-hero__tag">{club.tagline}</p>
          <p className="mp-club-landing-hero__city">{club.city}</p>
        </div>
      </section>

      <div className="mp-club-landing-crest">
        <BloomBayCrest
          clubName={club.name}
          clubId={club.id}
          config={crestConfig}
          size="md"
          flippable
        />
        <div className="mp-club-landing-crest__copy">
          <strong>House crest</strong>
          <p>
            Auto-generated from host symbol + accent. Tap to flip and see BloomBay origin. Members collect this when
            they join.
          </p>
        </div>
      </div>

      <ClubCredibility clubId={club.id} />

      {!isClubDiscoverable(club.id) ? (
        <p className="mp-club-cred__warn" style={{ margin: "0 1.25rem" }}>
          This club is resting in discovery — no gathering in 45+ days. Hosts can revive it from the club owner portal.
        </p>
      ) : null}

      <div className="mp-club-meta-bar">
        <div className="mp-club-health-mini" title="Club health">
          <span className="mp-club-health-mini__label">Health</span>
          <strong>{club.healthScore}%</strong>
          <span className="mp-club-health-mini__hint">{club.healthLabel}</span>
        </div>
        {club.leaderboards.map((lb) => (
          <div key={lb.label} className="mp-club-board-pill">
            <span className="mp-club-board-pill__label">{lb.label}</span>
            <strong>#{lb.rank}</strong>
            {lb.hint ? <span className="mp-club-board-pill__hint">{lb.hint}</span> : null}
          </div>
        ))}
      </div>

      <div className="mp-club-stats-row">
        <span>
          <strong>{club.members.toLocaleString()}</strong> members
        </span>
        <span>
          <strong>{club.hereNow}</strong> here now
        </span>
        <span>
          <strong>{club.momentsToday}</strong> moments today
        </span>
      </div>

      {club.welcomeMessage ? (
        <blockquote className="mp-club-welcome-note">{club.welcomeMessage}</blockquote>
      ) : null}

      <section className="mp-club-landing__section">
        <p className="mp-section__title">About</p>
        <p className="mp-club-landing__desc">{club.description}</p>
      </section>

      {fullLanding ? (
        <>
          <section className="mp-club-landing__section">
            <p className="mp-section__title">Life inside the club</p>
            <div className="mp-club-photo-masonry">
              {club.photos.map((ph) => (
                <figure key={ph.id} className="mp-club-photo-card">
                  {ph.imageUrl ? (
                    <Image src={ph.imageUrl} alt={ph.caption} width={400} height={300} className="mp-club-photo-card__img" />
                  ) : (
                    <div className="mp-club-photo-card__fill" style={{ background: ph.gradient }} />
                  )}
                  <figcaption>{ph.caption}</figcaption>
                </figure>
              ))}
            </div>
          </section>

          <section className="mp-club-landing__section">
            <p className="mp-section__title">Zones</p>
            <div className="mp-club-zones-preview">
              {club.zones.map((z) => (
                <span key={z.id} className="mp-pill">
                  {z.name}
                </span>
              ))}
            </div>
          </section>

          <section className="mp-club-landing__section">
            <p className="mp-section__title">Upcoming</p>
            {club.upcomingEvents.slice(0, 3).map((ev) => (
              <p key={ev.title} className="mp-club-landing__event-line">
                <strong>{ev.title}</strong> · {ev.date} · {ev.location}
              </p>
            ))}
          </section>
        </>
      ) : null}

      {bloomOnLanding.length ? (
        <section className="mp-club-landing__section mp-club-landing-bloom">
          <p className="mp-section__title">BloomBay objects</p>
          <div className="mp-club-landing-bloom__row">
            {bloomOnLanding.map(({ key, src }) => (
              <span key={key} className="mp-club-landing-bloom__item" title={key}>
                <BloomObjectIcon src={src} size={44} />
              </span>
            ))}
          </div>
        </section>
      ) : null}

      {rulesDoc.text.trim() ? (
        <section className="mp-club-landing__section">
          <p className="mp-section__title">House rules</p>
          <pre className="mp-club-landing__rules">{rulesDoc.text}</pre>
          {rulesDoc.requireAccept ? (
            <p className="mp-club-landing__rules-note">You will accept these rules when you join.</p>
          ) : null}
        </section>
      ) : null}

      <section className="mp-club-landing__section">
        <p className="mp-section__title">How joining works</p>
        <ul className="mp-club-landing__join-list">
          {club.join.mode === "open" && <li>Open — tap Join on this page</li>}
          {club.join.mode === "request" && <li>Request — host reviews your application</li>}
          {club.join.pricing === "free" && <li>Free to join</li>}
          {club.join.pricing !== "free" && <li>{club.join.priceLabel ?? "Paid club"}</li>}
        </ul>
      </section>

      <div className="mp-club-landing__cta">
        <Link href={joinHref} className="mp-btn mp-btn--hot mp-btn--block">
          {member ? "Enter the club →" : "Join club →"}
        </Link>
      </div>
    </div>
  );
}
